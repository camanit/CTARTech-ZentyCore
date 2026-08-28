use axum::{routing::post, extract::Json, http::StatusCode, Router};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AuditLogEntry {
    pub timestamp: String,
    pub actor_id: String,
    pub action: String,
    pub resource: String,
    pub result: String,
    pub previous_hash: String,
    pub current_hash: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct IngestLogRequest {
    pub actor_id: String,
    pub action: String,
    pub resource: String,
    pub result: String,
    pub previous_hash: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct IngestLogResponse {
    pub success: bool,
    pub log_entry: AuditLogEntry,
}

pub fn router() -> Router {
    Router::new()
        .route("/ingest", post(ingest_log_handler))
}

pub async fn ingest_log_handler(
    Json(payload): Json<IngestLogRequest>,
) -> Result<Json<IngestLogResponse>, StatusCode> {
    let entry = create_immutable_log(&payload);
    tracing::info!("Appended immutable audit block: {}", entry.current_hash);
    Ok(Json(IngestLogResponse {
        success: true,
        log_entry: entry,
    }))
}

pub fn create_immutable_log(req: &IngestLogRequest) -> AuditLogEntry {
    let timestamp = Utc::now().to_rfc3339();
    let prev_hash = req.previous_hash.clone().unwrap_or_else(|| "0000000000000000000000000000000000000000000000000000000000000000".to_string());

    let payload_to_hash = format!("{}:{}:{}:{}:{}:{}", timestamp, req.actor_id, req.action, req.resource, req.result, prev_hash);
    let mut hasher = Sha256::new();
    hasher.update(payload_to_hash.as_bytes());
    let current_hash = format!("{:x}", hasher.finalize());

    AuditLogEntry {
        timestamp,
        actor_id: req.actor_id.clone(),
        action: req.action.clone(),
        resource: req.resource.clone(),
        result: req.result.clone(),
        previous_hash: prev_hash,
        current_hash,
    }
}
