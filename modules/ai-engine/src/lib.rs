use axum::{routing::post, extract::Json, http::StatusCode, Router};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct UebaTelemetry {
    pub user_id: String,
    pub ip_address: String,
    pub geo_city: String,
    pub login_hour: u8,
    pub request_rate_per_min: u32,
    pub sensitive_resource_accessed: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AiRiskEvaluation {
    pub risk_score: u8, // 0 - 100
    pub risk_tier: String, // LOW (0-30), MEDIUM (31-60), HIGH (61-80), CRITICAL (81-100)
    pub detected_anomalies: Vec<String>,
    pub recommended_action: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/evaluate-risk", post(evaluate_risk_handler))
}

pub async fn evaluate_risk_handler(
    Json(payload): Json<UebaTelemetry>,
) -> Result<Json<AiRiskEvaluation>, StatusCode> {
    let eval = calculate_ai_risk_score(&payload);
    tracing::info!("AI UEBA calculated risk score {} ({}) for user {}", eval.risk_score, eval.risk_tier, payload.user_id);
    Ok(Json(eval))
}

pub fn calculate_ai_risk_score(telemetry: &UebaTelemetry) -> AiRiskEvaluation {
    let mut score: u8 = 10; // Baseline normal trust
    let mut anomalies = Vec::new();

    // 1. Off-hours access (00:00 - 04:00)
    if telemetry.login_hour <= 4 {
        score = score.saturating_add(20);
        anomalies.push("Off-hours access pattern detected".to_string());
    }

    // 2. High request velocity
    if telemetry.request_rate_per_min > 120 {
        score = score.saturating_add(35);
        anomalies.push("High velocity automated request rate".to_string());
    }

    // 3. Sensitive resource touch
    if telemetry.sensitive_resource_accessed {
        score = score.saturating_add(15);
    }

    // 4. IP reputation check
    if telemetry.ip_address.starts_with("192.168.99.") || telemetry.ip_address.starts_with("185.220.") {
        score = score.saturating_add(45);
        anomalies.push("Known high-risk TOR/Proxy exit node".to_string());
    }

    let clamped_score = score.min(100);

    let (tier, action) = match clamped_score {
        0..=30 => ("LOW", "Allow access silently (Zero Trust baseline)"),
        31..=60 => ("MEDIUM", "Challenge with Step-Up MFA"),
        61..=80 => ("HIGH", "Alert SOC & restrict sensitive database queries"),
        _ => ("CRITICAL", "Instant session kill & trigger SOAR automated isolation"),
    };

    AiRiskEvaluation {
        risk_score: clamped_score,
        risk_tier: tier.to_string(),
        detected_anomalies: anomalies,
        recommended_action: action.to_string(),
    }
}
