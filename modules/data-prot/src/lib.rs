use axum::{routing::post, extract::Json, http::StatusCode, Router};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DataClassifyRequest {
    pub data_sample: String,
    pub source_table: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DataClassifyResponse {
    pub classification: String, // Public, Internal, Confidential, Restricted
    pub contains_pii: bool,
    pub encryption_required: bool,
    pub policy_action: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/classify", post(classify_data_handler))
}

pub async fn classify_data_handler(
    Json(payload): Json<DataClassifyRequest>,
) -> Result<Json<DataClassifyResponse>, StatusCode> {
    tracing::info!("Classifying data for table: {}", payload.source_table);
    let res = classify_data(&payload);
    Ok(Json(res))
}

pub fn classify_data(req: &DataClassifyRequest) -> DataClassifyResponse {
    let lower = req.data_sample.to_lowercase();
    let has_email = lower.contains("@") && lower.contains(".");
    let has_nik_or_ssn = req.data_sample.chars().filter(|c| c.is_ascii_digit()).count() >= 16;
    let has_credit_card = has_nik_or_ssn && (lower.starts_with("4") || lower.starts_with("5"));

    if has_credit_card {
        return DataClassifyResponse {
            classification: "RESTRICTED - PCI-DSS".to_string(),
            contains_pii: true,
            encryption_required: true,
            policy_action: "ENCRYPT_AT_REST_AND_MASK_IN_LOGS".to_string(),
        };
    }

    if has_nik_or_ssn || has_email {
        return DataClassifyResponse {
            classification: "CONFIDENTIAL - PII (UU PDP / GDPR)".to_string(),
            contains_pii: true,
            encryption_required: true,
            policy_action: "ENCRYPT_AND_RESTRICT_ACCESS".to_string(),
        };
    }

    DataClassifyResponse {
        classification: "INTERNAL_BUSINESS".to_string(),
        contains_pii: false,
        encryption_required: false,
        policy_action: "STANDARD_ACCESS_CONTROL".to_string(),
    }
}
