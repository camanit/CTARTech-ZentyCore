use axum::{routing::post, extract::Json, http::StatusCode, Router};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WafInspectRequest {
    pub endpoint: String,
    pub http_method: String,
    pub raw_payload: String,
    pub user_agent: String,
    pub client_ip: Option<String>,
    pub request_rate_per_sec: Option<u32>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WafInspectResponse {
    pub clean: bool,
    pub threat_category: String,
    pub risk_score: u8,
    pub action_taken: String,
    pub rate_limit_status: String,
    pub ddos_mitigation: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RateLimitCheckRequest {
    pub client_ip: String,
    pub endpoint: String,
    pub current_requests: u32,
    pub burst_capacity: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RateLimitCheckResponse {
    pub allowed: bool,
    pub current_usage_percent: u8,
    pub reset_in_seconds: u32,
    pub action: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/inspect-payload", post(inspect_payload_handler))
        .route("/rate-limit", post(rate_limit_handler))
}

pub async fn inspect_payload_handler(
    Json(payload): Json<WafInspectRequest>,
) -> Result<Json<WafInspectResponse>, StatusCode> {
    tracing::info!("Inspecting app workload payload for endpoint: {}", payload.endpoint);
    let res = inspect_payload(&payload);
    Ok(Json(res))
}

pub async fn rate_limit_handler(
    Json(payload): Json<RateLimitCheckRequest>,
) -> Result<Json<RateLimitCheckResponse>, StatusCode> {
    let allowed = payload.current_requests <= payload.burst_capacity;
    let current_usage_percent = if payload.burst_capacity > 0 {
        ((payload.current_requests as f32 / payload.burst_capacity as f32) * 100.0).min(100.0) as u8
    } else {
        100
    };

    Ok(Json(RateLimitCheckResponse {
        allowed,
        current_usage_percent,
        reset_in_seconds: if allowed { 1 } else { 60 },
        action: if allowed { "PASSED".to_string() } else { "THROTTLED_HTTP_429".to_string() },
    }))
}

pub fn inspect_payload(req: &WafInspectRequest) -> WafInspectResponse {
    let lower_payload = req.raw_payload.to_lowercase();
    let rps = req.request_rate_per_sec.unwrap_or(1);

    // Anti-DDoS anomaly filter
    if rps > 500 {
        return WafInspectResponse {
            clean: false,
            threat_category: "L7 DDoS Volumetric Anomaly".to_string(),
            risk_score: 99,
            action_taken: "BLOCK_AND_SCRUB_TRAFFIC".to_string(),
            rate_limit_status: "EXCEEDED_BURST_CAP".to_string(),
            ddos_mitigation: "TRAFFIC_SCRUBBED_BYPASS_EDGE".to_string(),
        };
    }

    // Fast heuristic inspection for common injection patterns
    if lower_payload.contains("' or '1'='1") || lower_payload.contains("union select") || lower_payload.contains("drop table") {
        return WafInspectResponse {
            clean: false,
            threat_category: "SQL Injection (SQLi)".to_string(),
            risk_score: 95,
            action_taken: "BLOCK_IMMEDIATE".to_string(),
            rate_limit_status: "NORMAL".to_string(),
            ddos_mitigation: "INLINE_WAF_DROPPED".to_string(),
        };
    }

    if lower_payload.contains("<script>") || lower_payload.contains("javascript:") || lower_payload.contains("onload=") {
        return WafInspectResponse {
            clean: false,
            threat_category: "Cross-Site Scripting (XSS)".to_string(),
            risk_score: 85,
            action_taken: "BLOCK_AND_SANITIZE".to_string(),
            rate_limit_status: "NORMAL".to_string(),
            ddos_mitigation: "INLINE_WAF_SANITIZED".to_string(),
        };
    }

    if lower_payload.contains("/etc/passwd") || lower_payload.contains("cmd.exe") || lower_payload.contains("/bin/sh") {
        return WafInspectResponse {
            clean: false,
            threat_category: "Command Execution / Path Traversal".to_string(),
            risk_score: 98,
            action_taken: "BLOCK_AND_ISOLATE".to_string(),
            rate_limit_status: "NORMAL".to_string(),
            ddos_mitigation: "INLINE_WAF_BLOCKED".to_string(),
        };
    }

    if lower_payload.contains("tenant_id=") && (lower_payload.contains("admin") || lower_payload.contains("../")) {
        return WafInspectResponse {
            clean: false,
            threat_category: "Broken Object Level Authorization (BOLA)".to_string(),
            risk_score: 90,
            action_taken: "BLOCK_ACCESS_FORBIDDEN".to_string(),
            rate_limit_status: "NORMAL".to_string(),
            ddos_mitigation: "AUTHZ_GATE_REJECTED".to_string(),
        };
    }

    WafInspectResponse {
        clean: true,
        threat_category: "None (Clean)".to_string(),
        risk_score: 0,
        action_taken: "ALLOW".to_string(),
        rate_limit_status: "PASSED".to_string(),
        ddos_mitigation: "TRAFFIC_CLEAN".to_string(),
    }
}

