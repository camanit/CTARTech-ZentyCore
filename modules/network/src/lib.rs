use axum::{routing::post, extract::Json, http::StatusCode, Router};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NetworkCheckRequest {
    pub ip_address: String,
    pub target_segment: String,
    pub protocol: String,
    pub requested_port: u16,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NetworkCheckResponse {
    pub allowed: bool,
    pub security_zone: String,
    pub microsegment_rule_id: String,
    pub message: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/validate-segment", post(validate_segment_handler))
}

pub async fn validate_segment_handler(
    Json(payload): Json<NetworkCheckRequest>,
) -> Result<Json<NetworkCheckResponse>, StatusCode> {
    tracing::info!("Validating network flow from {} to segment {}", payload.ip_address, payload.target_segment);
    let res = validate_network_segment(&payload);
    Ok(Json(res))
}

pub fn validate_network_segment(req: &NetworkCheckRequest) -> NetworkCheckResponse {
    // Zero Trust rule: Block unknown subnets or high-risk segments without explicit trust
    let is_isolated = req.ip_address.starts_with("192.168.99.") || req.ip_address.starts_with("10.99.");
    let is_prod_restricted = req.target_segment.contains("production-db") || req.target_segment.contains("pci-dss");

    if is_isolated {
        return NetworkCheckResponse {
            allowed: false,
            security_zone: "Quarantine-Zone".to_string(),
            microsegment_rule_id: "RULE-DENY-QUARANTINE-001".to_string(),
            message: "Source IP resides in quarantine perimeter.".to_string(),
        };
    }

    if is_prod_restricted && !req.ip_address.starts_with("10.0.") && !req.ip_address.starts_with("127.0.0.1") {
        return NetworkCheckResponse {
            allowed: false,
            security_zone: "Untrusted-Edge".to_string(),
            microsegment_rule_id: "RULE-DENY-EXTERNAL-PROD-002".to_string(),
            message: "Direct traversal to production database zone denied by microsegmentation.".to_string(),
        };
    }

    NetworkCheckResponse {
        allowed: true,
        security_zone: "Internal-Secure-Tunnel".to_string(),
        microsegment_rule_id: "RULE-ALLOW-ZT-PASS-003".to_string(),
        message: "Microsegment traversal authorized.".to_string(),
    }
}
