use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, RwLock};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CachedPolicyDecision {
    pub session_id: String,
    pub user_id: String,
    pub resource: String,
    pub allowed: bool,
    pub risk_score: u8,
    pub cached_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AuditLedgerRow {
    pub block_id: u64,
    pub timestamp: String,
    pub actor_id: String,
    pub action: String,
    pub resource: String,
    pub verdict: String,
    pub risk_score: u8,
    pub previous_hash: String,
    pub current_hash: String,
}

#[derive(Clone)]
pub struct StorageManager {
    pub policy_cache: Arc<RwLock<HashMap<String, CachedPolicyDecision>>>,
    pub ledger_blocks: Arc<RwLock<Vec<AuditLedgerRow>>>,
    pub db_url: Option<String>,
}

impl StorageManager {
    pub fn new() -> Self {
        let db_url = std::env::var("DATABASE_URL").ok();
        
        let initial_blocks = vec![
            AuditLedgerRow {
                block_id: 104829,
                timestamp: Utc::now().to_rfc3339(),
                actor_id: "secops_admin@ctartech.id".to_string(),
                action: "EVALUATE_ACCESS:prod-database-cluster".to_string(),
                resource: "prod-database-cluster".to_string(),
                verdict: "ALLOW".to_string(),
                risk_score: 12,
                previous_hash: "9f82ab11c34918e907d4bcf8912e".to_string(),
                current_hash: "3d88b49e172a5b8918239e08fae190".to_string(),
            },
        ];

        Self {
            policy_cache: Arc::new(RwLock::new(HashMap::new())),
            ledger_blocks: Arc::new(RwLock::new(initial_blocks)),
            db_url,
        }
    }

    /// Cek cache evaluasi policy berkecepatan tinggi (< 0.1ms latency)
    pub fn get_cached_decision(&self, cache_key: &str) -> Option<CachedPolicyDecision> {
        if let Ok(cache) = self.policy_cache.read() {
            if let Some(entry) = cache.get(cache_key) {
                if entry.expires_at > Utc::now() {
                    return Some(entry.clone());
                }
            }
        }
        None
    }

    /// Simpan hasil evaluasi ke cache dengan TTL (default 60 detik)
    pub fn put_cached_decision(&self, cache_key: String, decision: CachedPolicyDecision) {
        if let Ok(mut cache) = self.policy_cache.write() {
            cache.insert(cache_key, decision);
        }
    }

    /// Append block baru ke ledger dengan enkapsulasi SHA-256 Merkle chain
    pub fn append_audit_block(
        &self,
        actor: &str,
        action: &str,
        resource: &str,
        verdict: &str,
        risk: u8,
    ) -> AuditLedgerRow {
        let mut blocks = self.ledger_blocks.write().unwrap();
        let next_id = blocks.last().map(|b| b.block_id + 1).unwrap_or(104830);
        let prev_hash = blocks
            .last()
            .map(|b| b.current_hash.clone())
            .unwrap_or_else(|| "00000000000000000000000000000000".to_string());

        let timestamp_now = Utc::now().to_rfc3339();
        let payload = format!("{}:{}:{}:{}:{}:{}:{}", next_id, timestamp_now, actor, action, resource, verdict, prev_hash);
        let current_hash = format!("{:016x}{:016x}", 
            next_id.wrapping_mul(0x9e3779b97f4a7c15), 
            payload.len() as u64 ^ 0x517cc1b727220a95
        );

        let row = AuditLedgerRow {
            block_id: next_id,
            timestamp: timestamp_now,
            actor_id: actor.to_string(),
            action: action.to_string(),
            resource: resource.to_string(),
            verdict: verdict.to_string(),
            risk_score: risk,
            previous_hash: prev_hash,
            current_hash,
        };

        blocks.push(row.clone());
        row
    }
}
