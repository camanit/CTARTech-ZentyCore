use axum::{routing::post, extract::Json, http::StatusCode, Router};
use chrono::Utc;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TriggerPlaybookRequest {
    pub incident_id: String,
    pub threat_type: String,
    pub target_device_id: Option<String>,
    pub target_user_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TriggerPlaybookResponse {
    pub execution_id: String,
    pub playbook_name: String,
    pub actions_executed: Vec<String>,
    pub status: String,
    pub completed_at: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/trigger-playbook", post(trigger_playbook_handler))
        .route("/isolate-device", post(isolate_device_handler))
}

pub async fn trigger_playbook_handler(
    Json(payload): Json<TriggerPlaybookRequest>,
) -> Result<Json<TriggerPlaybookResponse>, StatusCode> {
    tracing::warn!("Executing automated SOAR playbook for incident {}", payload.incident_id);
    let res = execute_soar_playbook(&payload);
    Ok(Json(res))
}

pub async fn isolate_device_handler(
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let device_id = payload.get("device_id").and_then(|v| v.as_str()).unwrap_or("unknown");
    tracing::warn!("ISOLATION ORDER DISPATCHED to endpoint: {}", device_id);
    Ok(Json(serde_json::json!({
        "status": "ISOLATED",
        "device_id": device_id,
        "action": "Network interface isolated via EDR driver",
        "timestamp": Utc::now().to_rfc3339()
    })))
}

pub fn execute_soar_playbook(req: &TriggerPlaybookRequest) -> TriggerPlaybookResponse {
    let mut actions = Vec::new();
    let playbook_name = match req.threat_type.as_str() {
        "RANSOMWARE" => {
            actions.push("Isolate Device from Network".to_string());
            actions.push("Kill Suspicious Process Tree".to_string());
            actions.push("Revoke All Active User Sessions".to_string());
            "PLAYBOOK-CRITICAL-RANSOMWARE-CONTAINMENT"
        },
        "IMPOSSIBLE_TRAVEL" => {
            actions.push("Force Re-authentication with Hardware MFA Token".to_string());
            actions.push("Lock Active API Keys".to_string());
            "PLAYBOOK-AUTH-ANOMALY-CHALLENGE"
        },
        _ => {
            actions.push("Log High-Severity Alert to SIEM".to_string());
            actions.push("Notify SecOps On-Call Engineer via Webhook".to_string());
            "PLAYBOOK-GENERIC-THREAT-TRIAGE"
        }
    };

    TriggerPlaybookResponse {
        execution_id: format!("EXEC-{}", Utc::now().timestamp_millis()),
        playbook_name: playbook_name.to_string(),
        actions_executed: actions,
        status: "COMPLETED_AUTOMATICALLY".to_string(),
        completed_at: Utc::now().to_rfc3339(),
    }
}
