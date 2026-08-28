use reqwest::Client;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ZtError {
    #[error("HTTP transport failure: {0}")]
    HttpError(#[from] reqwest::Error),
    #[error("API rejected request with status: {0}")]
    ApiError(String),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AccessRequest {
    pub user_id: String,
    pub token: String,
    pub device_id: String,
    pub resource: String,
    pub ip_address: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AccessEvaluationResult {
    pub allowed: bool,
    pub overall_risk_score: u8,
    pub reason: String,
    pub session_id: String,
    pub is_cached: bool,
}

#[derive(Clone)]
pub struct ZeroTrustClient {
    client: Client,
    base_url: String,
    api_key: String,
}

impl ZeroTrustClient {
    /// Inisialisasi klien SDK baru mengarah ke ZentyCore Control Plane
    pub fn new(base_url: &str, api_key: &str) -> Self {
        Self {
            client: Client::new(),
            base_url: base_url.trim_end_matches('/').to_string(),
            api_key: api_key.to_string(),
        }
    }

    /// Evaluasi hak akses secara real-time (Request -> Verify -> Authorize -> Monitor -> Reassess)
    pub async fn evaluate_access(&self, req: &AccessRequest) -> Result<AccessEvaluationResult, ZtError> {
        let endpoint = format!("{}/api/v1/policy/evaluate", self.base_url);

        let res = self.client
            .post(&endpoint)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(req)
            .send()
            .await?;

        if res.status().is_success() {
            let result: AccessEvaluationResult = res.json().await?;
            Ok(result)
        } else {
            let status = res.status();
            let body = res.text().await.unwrap_or_default();
            Err(ZtError::ApiError(format!("Status {}: {}", status, body)))
        }
    }

    /// Middleware quick check helper (Returns true if allowed, false if blocked)
    pub async fn verify_request(
        &self,
        user_id: &str,
        token: &str,
        device_id: &str,
        resource: &str,
        ip_address: &str,
    ) -> bool {
        let req = AccessRequest {
            user_id: user_id.to_string(),
            token: token.to_string(),
            device_id: device_id.to_string(),
            resource: resource.to_string(),
            ip_address: ip_address.to_string(),
        };

        match self.evaluate_access(&req).await {
            Ok(decision) => decision.allowed,
            Err(_) => false, // Fail-closed Zero Trust default
        }
    }
}
