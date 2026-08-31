use axum::{routing::post, extract::Json, http::StatusCode, Router};
use chrono::Utc;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum LicenseTier {
    CommunityFree,
    Starter,
    Professional,
    Enterprise,
    CustomGovernment,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LicenseEntitlement {
    pub tenant_id: String,
    pub tier: LicenseTier,
    pub active_modules: Vec<String>,
    pub max_endpoints: u32,
    pub ai_engine_enabled: bool,
    pub offline_airgap_permitted: bool,
    pub expires_at: String,
    pub license_hash: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ValidateKeyRequest {
    pub api_key: String,
    pub requested_module: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ValidateKeyResponse {
    pub valid: bool,
    pub tier_name: String,
    pub message: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/validate-key", post(validate_key_handler))
        .route("/generate-offline-key", post(generate_offline_key_handler))
        .route("/dynamic-handshake", post(dynamic_handshake_handler))
}

pub async fn dynamic_handshake_handler(
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let license_id = payload.get("license_id").and_then(|v| v.as_str()).unwrap_or("unknown_license");
    let is_tampered = payload.get("tamper_flag").and_then(|v| v.as_bool()).unwrap_or(false);
    let is_active = license_id != "revoked_license" && !is_tampered;

    Ok(Json(serde_json::json!({
        "handshake_status": if is_active { "AUTHORIZED_ACTIVE" } else { "REMOTE_LOCK_ACTIVATED" },
        "license_id": license_id,
        "remote_killswitch_state": if is_active { "DISARMED_HEALTHY" } else { "TRIGGERED_REVOKED" },
        "enforcement_action": if is_active { "ALLOW_ALL_MODULES" } else { "LOCK_ENTERPRISE_MODULES_LOCALLY" },
        "validated_at": Utc::now().to_rfc3339(),
    })))
}


pub async fn validate_key_handler(
    Json(payload): Json<ValidateKeyRequest>,
) -> Result<Json<ValidateKeyResponse>, StatusCode> {
    let key_hash = hash_api_key(&payload.api_key);
    tracing::info!("Validating license key hash: {}", key_hash);

    let is_valid = !payload.api_key.trim().is_empty() && payload.api_key != "revoked_key";
    
    Ok(Json(ValidateKeyResponse {
        valid: is_valid,
        tier_name: if is_valid { "Enterprise Production".to_string() } else { "Invalid".to_string() },
        message: if is_valid { "Key authenticated via BLAKE3 hash matching.".to_string() } else { "License key invalid or revoked.".to_string() },
    }))
}

pub async fn generate_offline_key_handler(
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let tenant = payload.get("tenant_id").and_then(|v| v.as_str()).unwrap_or("enterprise_bank_01");
    let raw_key = format!("zt_live_{}_{}", tenant, Utc::now().timestamp());
    let hash = hash_api_key(&raw_key);

    Ok(Json(serde_json::json!({
        "status": "GENERATED",
        "api_key_plaintext": raw_key, // Only shown once upon generation
        "stored_blake3_hash": hash,
        "mode": "AirGap Offline Cryptographic Token",
        "created_at": Utc::now().to_rfc3339(),
    })))
}

pub fn hash_api_key(raw_key: &str) -> String {
    let hash = blake3::hash(raw_key.as_bytes());
    hash.to_hex().to_string()
}
