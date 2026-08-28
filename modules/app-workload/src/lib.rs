use axum::{routing::post, extract::Json, http::StatusCode, Router};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WafInspectRequest {
    pub endpoint: String,
    pub http_method: String,
    pub raw_payload: String,
    pub user_agent: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WafInspectResponse {
    pub clean: bool,
    pub threat_category: String,
    pub risk_score: u8,
    pub action_taken: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/inspect-payload", post(inspect_payload_handler))
}

pub async fn inspect_payload_handler(
    Json(payload): Json<WafInspectRequest>,
) -> Result<Json<WafInspectResponse>, StatusCode> {
    tracing::info!("Inspecting app workload payload for endpoint: {}", payload.endpoint);
    let res = inspect_payload(&payload);
    Ok(Json(res))
}

pub fn inspect_payload(req: &WafInspectRequest) -> WafInspectResponse {
    let lower_payload = req.raw_payload.to_lowercase();

    // Fast heuristic inspection for common injection patterns
    if lower_payload.contains("' or '1'='1") || lower_payload.contains("union select") || lower_payload.contains("drop table") {
        return WafInspectResponse {
            clean: false,
            threat_category: "SQL Injection (SQLi)".to_string(),
            risk_score: 95,
            action_taken: "BLOCK_IMMEDIATE".to_string(),
        };
    }

    if lower_payload.contains("<script>") || lower_payload.contains("javascript:") || lower_payload.contains("onload=") {
        return WafInspectResponse {
            clean: false,
            threat_category: "Cross-Site Scripting (XSS)".to_string(),
            risk_score: 85,
            action_taken: "BLOCK_AND_SANITIZE".to_string(),
        };
    }

    if lower_payload.contains("/etc/passwd") || lower_payload.contains("cmd.exe") || lower_payload.contains("/bin/sh") {
        return WafInspectResponse {
            clean: false,
            threat_category: "Command Execution / Path Traversal".to_string(),
            risk_score: 98,
            action_taken: "BLOCK_AND_ISOLATE".to_string(),
        };
    }

    WafInspectResponse {
        clean: true,
        threat_category: "None (Clean)".to_string(),
        risk_score: 0,
        action_taken: "ALLOW".to_string(),
    }
}
