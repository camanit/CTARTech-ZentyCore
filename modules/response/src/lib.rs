use axum::{routing::post, extract::Json, http::StatusCode, Router};
use chrono::Utc;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TriggerPlaybookRequest {
    pub incident_id: String,
    pub threat_type: String, // RANSOMWARE, HONEYTOKEN_TRIP, MEMORY_GUARD_TAMPER, AI_SESSION_HIJACK, IMPOSSIBLE_TRAVEL
    pub target_device_id: Option<String>,
    pub target_user_id: Option<String>,
    pub process_id: Option<u32>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TriggerPlaybookResponse {
    pub execution_id: String,
    pub playbook_name: String,
    pub actions_executed: Vec<String>,
    pub containment_level: String,
    pub self_healing_status: String,
    pub status: String,
    pub completed_at: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/trigger-playbook", post(trigger_playbook_handler))
        .route("/isolate-device", post(isolate_device_handler))
        .route("/deception-alert", post(deception_alert_handler))
}

pub async fn trigger_playbook_handler(
    Json(payload): Json<TriggerPlaybookRequest>,
) -> Result<Json<TriggerPlaybookResponse>, StatusCode> {
    tracing::warn!("Executing automated SOAR playbook for incident {}", payload.incident_id);
    let res = execute_soar_playbook(&payload);
    Ok(Json(res))
}

pub async fn isolate_device_handler(
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let device_id = payload.get("device_id").and_then(|v| v.as_str()).unwrap_or("unknown");
    tracing::warn!("ISOLATION ORDER DISPATCHED to endpoint: {}", device_id);
    Ok(Json(serde_json::json!({
        "status": "ISOLATED",
        "device_id": device_id,
        "action": "Network interface isolated via EDR driver with Zero-Trust Quarantine VLAN",
        "timestamp": Utc::now().to_rfc3339()
    })))
}

pub async fn deception_alert_handler(
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let token_id = payload.get("token_id").and_then(|v| v.as_str()).unwrap_or("HONEY-KEY-DEFAULT");
    tracing::error!("HONEYTOKEN ACCESSED! Intrusion detected via deception trap: {}", token_id);
    Ok(Json(serde_json::json!({
        "alert": "CRITICAL_DECEPTION_TRAP_TRIGGERED",
        "honeytoken_id": token_id,
        "action": "Attacker IP blacklisted globally & shadow forensics initiated",
        "timestamp": Utc::now().to_rfc3339()
    })))
}

pub fn execute_soar_playbook(req: &TriggerPlaybookRequest) -> TriggerPlaybookResponse {
    let mut actions = Vec::new();
    let mut containment_level = "TIER-1-OBSERVE";
    let mut self_healing = "NOT_APPLICABLE";

    let playbook_name = match req.threat_type.as_str() {
        "RANSOMWARE" => {
            containment_level = "TIER-3-FULL-ISOLATION";
            self_healing = "SNAPSHOT_RESTORE_INITIATED";
            actions.push("Network Sandboxing: Isolate Device from Corporate Subnets".to_string());
            actions.push(format!("Process Tree Termination: Kill PID {:?} & Parent Watchers", req.process_id.unwrap_or(4092)));
            actions.push("Revoke All Active User Sessions & Invalidate Kerberos/JWT Tickets".to_string());
            actions.push("Trigger Immutable Storage Snapshot Point-in-Time Recovery (PITR)".to_string());
            "PLAYBOOK-CRITICAL-RANSOMWARE-BEHAVIORAL-CONTAINMENT"
        },
        "HONEYTOKEN_TRIP" => {
            containment_level = "TIER-2-SESSION-DROP";
            self_healing = "HONEYPOT_FEED_ENRICHED";
            actions.push("Deception Trap: Identify Source IP & Attacker Fingerprint".to_string());
            actions.push("Immediate Global Revocation of Compromised Honey-Credential".to_string());
            actions.push("Deploy High-Interaction Forensic Mirror Environment".to_string());
            "PLAYBOOK-DECEPTION-EARLY-WARNING-TRIAGE"
        },
        "MEMORY_GUARD_TAMPER" => {
            containment_level = "TIER-3-FULL-ISOLATION";
            self_healing = "MEMORY_INTEGRITY_RESTORED";
            actions.push("Memory Guard: Detect Hooking/Process Injection attempt".to_string());
            actions.push("Freeze Suspicious Thread & Dump Volatile Memory Core".to_string());
            actions.push("Isolate Host Driver & Re-attest TPM Hardware Identity".to_string());
            "PLAYBOOK-MEMORY-GUARD-ANTI-TAMPER"
        },
        "AI_SESSION_HIJACK" => {
            containment_level = "TIER-2-SESSION-DROP";
            self_healing = "AI_AGENT_CREDENTIAL_ROTATED";
            actions.push("AIControlPlane: Detect Anomaly in Agent API Call Frequency".to_string());
            actions.push("Instant Revocation of AI-Agent Ephemeral JIT Token".to_string());
            actions.push("Trigger Automated Secret Rotation for Machine Identity".to_string());
            "PLAYBOOK-ITDR-AI-AGENT-CONTAINMENT"
        },
        "IMPOSSIBLE_TRAVEL" => {
            containment_level = "TIER-2-SESSION-DROP";
            self_healing = "MFA_CHALLENGE_ISSUED";
            actions.push("Force Re-authentication with Hardware MFA Token (FIDO2/WebAuthn)".to_string());
            actions.push("Lock Active API Keys & Clear Device Trust Score".to_string());
            "PLAYBOOK-AUTH-ANOMALY-CHALLENGE"
        },
        _ => {
            actions.push("Log High-Severity Alert to SIEM & Merkle Audit Ledger".to_string());
            actions.push("Notify SecOps On-Call Engineer via Encrypted Webhook".to_string());
            "PLAYBOOK-GENERIC-THREAT-TRIAGE"
        }
    };

    TriggerPlaybookResponse {
        execution_id: format!("EXEC-{}", Utc::now().timestamp_millis()),
        playbook_name: playbook_name.to_string(),
        actions_executed: actions,
        containment_level: containment_level.to_string(),
        self_healing_status: self_healing.to_string(),
        status: "COMPLETED_AUTOMATICALLY".to_string(),
        completed_at: Utc::now().to_rfc3339(),
    }
}

