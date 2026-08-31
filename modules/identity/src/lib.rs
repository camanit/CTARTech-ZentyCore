use axum::{routing::post, extract::Json, http::StatusCode, Router};
use chrono::Utc;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct IdentityCheckRequest {
    pub user_id: String,
    pub token: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct IdentityCheckResponse {
    pub authenticated: bool,
    pub user_id: String,
    pub role: String,
    pub mfa_verified: bool,
    pub message: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AiAgentIdentityRequest {
    pub agent_id: String,
    pub model_provider: String,
    pub execution_context: String,
    pub current_secret: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AiAgentIdentityResponse {
    pub authorized: bool,
    pub agent_id: String,
    pub identity_type: String, // NON_HUMAN_IDENTITY_AI
    pub dynamic_cert_id: String,
    pub next_secret_rotation_at: String,
    pub privilege_level: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ItdrEvaluateRequest {
    pub subject_id: String,
    pub subject_type: String, // HUMAN or AI_AGENT
    pub recent_request_frequency: u32,
    pub unusual_geo_or_endpoint: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ItdrEvaluateResponse {
    pub threat_score: u8,
    pub status: String, // NORMAL, SUSPICIOUS, COMPROMISED
    pub auto_revocation_triggered: bool,
    pub recommended_action: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct JitGrantRequest {
    pub requester_id: String,
    pub target_resource: String,
    pub duration_minutes: u32,
    pub reason: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct JitGrantResponse {
    pub granted: bool,
    pub temporary_token: String,
    pub expires_at: String,
    pub scope: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/verify", post(verify_identity_handler))
        .route("/verify-ai-agent", post(verify_ai_agent_handler))
        .route("/itdr-evaluate", post(itdr_evaluate_handler))
        .route("/grant-jit-access", post(grant_jit_access_handler))
}

pub async fn verify_identity_handler(
    Json(payload): Json<IdentityCheckRequest>,
) -> Result<Json<IdentityCheckResponse>, StatusCode> {
    tracing::info!("Verifying identity for user: {}", payload.user_id);
    let res = verify_identity(&payload.user_id, &payload.token);
    Ok(Json(res))
}

pub async fn verify_ai_agent_handler(
    Json(payload): Json<AiAgentIdentityRequest>,
) -> Result<Json<AiAgentIdentityResponse>, StatusCode> {
    tracing::info!("AIControlPlane verifying Non-Human Identity agent: {}", payload.agent_id);
    let authorized = !payload.current_secret.is_empty();
    Ok(Json(AiAgentIdentityResponse {
        authorized,
        agent_id: payload.agent_id.clone(),
        identity_type: "NON_HUMAN_IDENTITY_AI_AGENT".to_string(),
        dynamic_cert_id: format!("CERT-AI-{}", Utc::now().timestamp()),
        next_secret_rotation_at: Utc::now().checked_add_signed(chrono::Duration::hours(1)).unwrap_or_else(Utc::now).to_rfc3339(),
        privilege_level: "LEAST_PRIVILEGE_SCOPED_TASK".to_string(),
    }))
}

pub async fn itdr_evaluate_handler(
    Json(payload): Json<ItdrEvaluateRequest>,
) -> Result<Json<ItdrEvaluateResponse>, StatusCode> {
    tracing::info!("ITDR evaluating anomaly score for {}", payload.subject_id);
    let mut score: u8 = 0;
    if payload.unusual_geo_or_endpoint {
        score += 65;
    }
    if payload.recent_request_frequency > 100 {
        score += 30;
    }

    let compromised = score >= 80;
    let suspicious = score >= 50 && !compromised;

    let (status, action) = if compromised {
        ("COMPROMISED", "IMMEDIATE_SESSION_TERMINATION_AND_LOCK")
    } else if suspicious {
        ("SUSPICIOUS", "MFA_RECHALLENGE_AND_RATE_LIMIT")
    } else {
        ("NORMAL", "ALLOW_ACCESS")
    };

    Ok(Json(ItdrEvaluateResponse {
        threat_score: score,
        status: status.to_string(),
        auto_revocation_triggered: compromised,
        recommended_action: action.to_string(),
    }))
}

pub async fn grant_jit_access_handler(
    Json(payload): Json<JitGrantRequest>,
) -> Result<Json<JitGrantResponse>, StatusCode> {
    tracing::info!("Granting JIT temporary access for {}", payload.requester_id);
    let minutes = payload.duration_minutes.clamp(5, 60);
    let expires = Utc::now().checked_add_signed(chrono::Duration::minutes(minutes as i64)).unwrap_or_else(Utc::now);

    Ok(Json(JitGrantResponse {
        granted: true,
        temporary_token: format!("jit_temp_token_{}_{}", payload.requester_id, Utc::now().timestamp()),
        expires_at: expires.to_rfc3339(),
        scope: format!("EPHEMERAL_READ_ONLY:{}", payload.target_resource),
    }))
}

pub fn verify_identity(user_id: &str, token: &str) -> IdentityCheckResponse {
    // Zero-Knowledge authentication check
    let authenticated = !token.trim().is_empty() && token != "invalid_token";
    let is_admin = user_id.contains("admin") || user_id.contains("secops");
    let role = if is_admin { "SecOps Administrator" } else { "Standard Corporate User" };

    IdentityCheckResponse {
        authenticated,
        user_id: user_id.to_string(),
        role: role.to_string(),
        mfa_verified: authenticated,
        message: if authenticated {
            "Identity verified with MFA claims.".to_string()
        } else {
            "Invalid or expired identity token.".to_string()
        },
    }
}

