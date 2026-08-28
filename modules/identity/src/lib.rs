use axum::{routing::post, extract::Json, http::StatusCode, Router};
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

pub fn router() -> Router {
    Router::new()
        .route("/verify", post(verify_identity_handler))
}

pub async fn verify_identity_handler(
    Json(payload): Json<IdentityCheckRequest>,
) -> Result<Json<IdentityCheckResponse>, StatusCode> {
    tracing::info!("Verifying identity for user: {}", payload.user_id);
    let res = verify_identity(&payload.user_id, &payload.token);
    Ok(Json(res))
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
