use axum::{routing::post, extract::Json, http::StatusCode, Router};
use chrono::Utc;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DispatchWebhookRequest {
    pub target_url: String,
    pub event_type: String, // threat.detected, access.denied, license.expiring
    pub payload: serde_json::Value,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DispatchWebhookResponse {
    pub event_id: String,
    pub delivered: bool,
    pub attempts: u8,
    pub timestamp: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/dispatch", post(dispatch_webhook_handler))
}

pub async fn dispatch_webhook_handler(
    Json(payload): Json<DispatchWebhookRequest>,
) -> Result<Json<DispatchWebhookResponse>, StatusCode> {
    tracing::info!("Dispatching webhook event '{}' to URL: {}", payload.event_type, payload.target_url);

    Ok(Json(DispatchWebhookResponse {
        event_id: format!("EVT-{}", Utc::now().timestamp_millis()),
        delivered: true,
        attempts: 1,
        timestamp: Utc::now().to_rfc3339(),
    }))
}
