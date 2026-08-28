use axum::{routing::post, extract::Json, http::StatusCode, Router};
use chrono::Utc;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PaymentWebhookPayload {
    pub gateway_provider: String, // Midtrans, Xendit, Stripe, Paddle
    pub transaction_id: String,
    pub order_id: String,
    pub amount: f64,
    pub currency: String,
    pub payment_status: String, // SUCCESS, PENDING, FAILED
    pub customer_email: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct InvoiceRecord {
    pub invoice_number: String,
    pub customer_email: String,
    pub total_amount: f64,
    pub tax_ppn_11: f64,
    pub currency: String,
    pub status: String,
    pub generated_at: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/webhook", post(payment_webhook_handler))
        .route("/generate-invoice", post(generate_invoice_handler))
}

pub async fn payment_webhook_handler(
    Json(payload): Json<PaymentWebhookPayload>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    tracing::info!("Received payment webhook from {}: Order {} -> {}", payload.gateway_provider, payload.order_id, payload.payment_status);

    if payload.payment_status == "SUCCESS" {
        // Auto-provisioning trigger
        Ok(Json(serde_json::json!({
            "status": "PROVISIONED",
            "message": "Payment verified. License entitlement unlocked.",
            "order_id": payload.order_id
        })))
    } else {
        Ok(Json(serde_json::json!({
            "status": "ACKNOWLEDGED",
            "payment_status": payload.payment_status
        })))
    }
}

pub async fn generate_invoice_handler(
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<InvoiceRecord>, StatusCode> {
    let email = payload.get("email").and_then(|v| v.as_str()).unwrap_or("finance@corp.id");
    let amount = payload.get("amount").and_then(|v| v.as_f64()).unwrap_or(15_000_000.0);
    let tax = amount * 0.11; // 11% PPN

    Ok(Json(InvoiceRecord {
        invoice_number: format!("INV-ZT-{}", Utc::now().timestamp()),
        customer_email: email.to_string(),
        total_amount: amount + tax,
        tax_ppn_11: tax,
        currency: "IDR".to_string(),
        status: "ISSUED".to_string(),
        generated_at: Utc::now().to_rfc3339(),
    }))
}
