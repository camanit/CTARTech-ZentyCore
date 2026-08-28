use axum::{routing::post, extract::Json, http::StatusCode, Router};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DeviceCheckRequest {
    pub device_id: String,
    pub os_version: String,
    pub antivirus_active: bool,
    pub disk_encrypted: bool,
    pub edr_agent_connected: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DeviceCheckResponse {
    pub compliant: bool,
    pub device_id: String,
    pub risk_level: String,
    pub posture_score: u8, // 0 - 100
    pub message: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/check-compliance", post(check_compliance_handler))
}

pub async fn check_compliance_handler(
    Json(payload): Json<DeviceCheckRequest>,
) -> Result<Json<DeviceCheckResponse>, StatusCode> {
    tracing::info!("Analyzing posture for device: {}", payload.device_id);
    let res = check_device_posture(&payload);
    Ok(Json(res))
}

pub fn check_device_posture(req: &DeviceCheckRequest) -> DeviceCheckResponse {
    let mut posture_score: u8 = 100;
    let mut flags = Vec::new();

    if !req.antivirus_active {
        posture_score = posture_score.saturating_sub(30);
        flags.push("Antivirus inactive");
    }
    if !req.disk_encrypted {
        posture_score = posture_score.saturating_sub(35);
        flags.push("Disk not encrypted");
    }
    if !req.edr_agent_connected {
        posture_score = posture_score.saturating_sub(25);
        flags.push("EDR disconnected");
    }

    let (compliant, risk_level) = if posture_score >= 80 {
        (true, "LOW")
    } else if posture_score >= 50 {
        (true, "MEDIUM")
    } else {
        (false, "HIGH")
    };

    let message = if compliant {
        format!("Device posture verified. Score: {}/100.", posture_score)
    } else {
        format!("Device non-compliant. Issues: {}. Score: {}/100.", flags.join(", "), posture_score)
    };

    DeviceCheckResponse {
        compliant,
        device_id: req.device_id.clone(),
        risk_level: risk_level.to_string(),
        posture_score,
        message,
    }
}
