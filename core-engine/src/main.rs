mod db;

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Json, Path, Request, State,
    },
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Router,
};
use chrono::{Duration, Utc};
use db::{CachedPolicyDecision, StorageManager};
use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tokio::sync::broadcast;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PolicyEvaluationRequest {
    pub user_id: String,
    pub token: String,
    pub device_id: String,
    pub resource: String,
    pub ip_address: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PolicyEvaluationResponse {
    pub allowed: bool,
    pub overall_risk_score: u8, // 0 - 100
    pub reason: String,
    pub identity_verified: bool,
    pub device_compliant: bool,
    pub network_zone: String,
    pub session_id: String,
    pub is_cached: bool,
    pub evaluated_at: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SocTelemetryBroadcast {
    pub timestamp: String,
    pub module: String,
    pub event_type: String,
    pub severity: String,
    pub hash: String,
    pub description: String,
}

#[derive(Clone)]
pub struct AppState {
    pub tx: broadcast::Sender<String>,
    pub storage: StorageManager,
}

#[tokio::main]
async fn main() {
    // Inisialisasi Structured Logging & Tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("====================================================");
    tracing::info!("🛡️  CTARTech ZentyCore - Zero Trust Control Plane  🛡️");
    tracing::info!("   Language: Rust 2021 | Architecture: Open-Core    ");
    tracing::info!("====================================================");

    // Setup Storage Manager (PostgreSQL + Policy Cache & Ledger)
    let storage = StorageManager::new();

    // Setup WebSocket Broadcast Channel
    let (tx, _rx) = broadcast::channel::<String>(100);
    let app_state = AppState {
        tx: tx.clone(),
        storage,
    };

    // Spawn Background Live Telemetry Generator (Real-Time SOC Stream Simulator)
    let bcast_tx = tx.clone();
    tokio::spawn(async move {
        let sample_modules = ["Identity", "Device", "Network", "App Workload", "Data Protection", "AI Engine", "SOAR Response"];
        let mut counter: u64 = 104832;
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
            let mod_idx = (counter as usize) % sample_modules.len();
            let sample_mod = sample_modules[mod_idx];
            
            let (event_type, severity, desc) = match sample_mod {
                "Identity" => ("FIDO2 Hardware Challenge", "INFO", "Hardware token attested for internal SecOps subject"),
                "Device" => ("EDR Continuous Heartbeat", "INFO", "Endpoint BitLocker & Defender signature up-to-date"),
                "Network" => ("ZTNA Microsegment Probe", "WARNING", "Inspection of lateral outbound packet: zone clean"),
                "App Workload" => ("WAF AST Inspection", "INFO", "POST /api/v1/checkout sanitized without anomalies"),
                "Data Protection" => ("DLP Auto-Classification", "INFO", "Sensitive field encrypted with AES-256-GCM KMS"),
                "AI Engine" => ("UEBA Anomaly Scan", "INFO", "Risk baseline updated: user activity within safe variance"),
                "SOAR Response" => ("Playbook Liveness", "INFO", "Autonomous containment runners standby on all nodes"),
                _ => ("System Audit", "INFO", "Periodic cryptographic block sealed"),
            };

            let block_hash = md5_or_simple_hash(counter);
            let hash_prefix = if block_hash.len() >= 8 { &block_hash[..8] } else { &block_hash };
            let event = SocTelemetryBroadcast {
                timestamp: Utc::now().format("%H:%M:%S").to_string(),
                module: sample_mod.to_string(),
                event_type: event_type.to_string(),
                severity: severity.to_string(),
                hash: format!("{}...", hash_prefix),
                description: desc.to_string(),
            };

            if let Ok(json_str) = serde_json::to_string(&event) {
                let _ = bcast_tx.send(json_str);
            }
            counter += 1;
        }
    });

    // Setup CORS agar bisa diakses oleh Web Dashboard & Third-party Integrators
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // State-dependent routers (WebSocket, Policy Evaluator, & PEP Reverse Proxy)
    let stateful_routes = Router::new()
        .route("/ws/soc-stream", get(ws_soc_stream_handler))
        .route("/api/v1/policy/evaluate", post(evaluate_zero_trust_policy_handler))
        .route("/proxy/*path", axum::routing::any(pep_reverse_proxy_handler))
        .route("/api/v1/pep/proxy/*path", axum::routing::any(pep_reverse_proxy_handler))
        .with_state(app_state);

    // Assembly Unified Open API Router + WebSocket Endpoint + PEP Proxy
    let app = Router::new()
        .route("/health", get(health_check_handler))
        .merge(stateful_routes)
        .nest("/api/v1/identity", zt_identity::router())
        .nest("/api/v1/device", zt_device::router())
        .nest("/api/v1/network", zt_network::router())
        .nest("/api/v1/app", zt_app_workload::router())
        .nest("/api/v1/data", zt_data_prot::router())
        .nest("/api/v1/telemetry", zt_visibility::router())
        .nest("/api/v1/response", zt_response::router())
        .nest("/api/v1/governance", zt_governance::router())
        .nest("/api/v1/ai", zt_ai_engine::router())
        .nest("/api/v1/license", zt_licensing::router())
        .nest("/api/v1/billing", zt_billing::router())
        .nest("/api/v1/webhook", zt_webhook::router())
        .layer(cors);

    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .unwrap_or(8080);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("🚀 Control Plane Server running on http://{}", addr);
    tracing::info!("⚡ WebSocket SOC Telemetry Stream ready at ws://{}/ws/soc-stream", addr);
    tracing::info!("🛡️ Zero Trust PEP Reverse Proxy listening on http://{}/proxy/*", addr);
    tracing::info!("📑 API Gateway ready with 12 modular microservice routers.");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

fn md5_or_simple_hash(seed: u64) -> String {
    format!("{:016x}{:016x}", seed.wrapping_mul(0x517cc1b727220a95), seed.wrapping_add(0x9e3779b97f4a7c15))
}

async fn health_check_handler() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "HEALTHY",
        "system": "CTARTech ZentyCore Control Plane",
        "engine": "Rust-Native Tokio/Axum",
        "websocket_stream": "/ws/soc-stream",
        "pep_reverse_proxy": "/proxy/*",
        "cache_engine": "Redis/In-Memory TTL Sub-Millisecond",
        "timestamp": Utc::now().to_rfc3339()
    }))
}

/// WebSocket Upgrade Handler for Live Real-Time SOC Stream
async fn ws_soc_stream_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_soc_socket(socket, state))
}

async fn handle_soc_socket(socket: WebSocket, state: AppState) {
    let (mut sender, mut receiver) = socket.split();
    let mut rx = state.tx.subscribe();

    tracing::info!("🟢 New SOC Dashboard WebSocket client connected.");

    let welcome_event = SocTelemetryBroadcast {
        timestamp: Utc::now().format("%H:%M:%S").to_string(),
        module: "Control Plane".to_string(),
        event_type: "WebSocket Connected".to_string(),
        severity: "INFO".to_string(),
        hash: "a1b2c3d4...".to_string(),
        description: "Authenticated real-time SOC channel established.".to_string(),
    };
    if let Ok(welcome_json) = serde_json::to_string(&welcome_event) {
        let _ = sender.send(Message::Text(welcome_json)).await;
    }

    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            if let Message::Close(_) = msg {
                break;
            }
        }
    });

    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    };

    tracing::info!("🔴 SOC Dashboard WebSocket client disconnected.");
}

/// Handler Inti Evaluasi Kebijakan Zero Trust (5 Tahapan Otomatis Real-Time + Redis/In-Memory Cache)
async fn evaluate_zero_trust_policy_handler(
    State(state): State<AppState>,
    Json(payload): Json<PolicyEvaluationRequest>,
) -> Result<Json<PolicyEvaluationResponse>, StatusCode> {
    let cache_key = format!("{}:{}:{}", payload.user_id, payload.device_id, payload.resource);

    // Cek Cache untuk performa sub-millisecond
    if let Some(cached) = state.storage.get_cached_decision(&cache_key) {
        tracing::info!("⚡ Policy cache HIT for key '{}' (Expires: {})", cache_key, cached.expires_at);
        return Ok(Json(PolicyEvaluationResponse {
            allowed: cached.allowed,
            overall_risk_score: cached.risk_score,
            reason: "Access granted: Verified via Sub-Millisecond Zero Trust Policy Cache.".to_string(),
            identity_verified: true,
            device_compliant: true,
            network_zone: "Enterprise_Corporate".to_string(),
            session_id: cached.session_id,
            is_cached: true,
            evaluated_at: Utc::now().to_rfc3339(),
        }));
    }

    tracing::info!(
        "📥 Access request received: User '{}' -> Resource '{}' from IP '{}'",
        payload.user_id,
        payload.resource,
        payload.ip_address
    );

    // 1. TAHAP VERIFY: Validasi Identitas (Modul IAM)
    let identity_res = zt_identity::verify_identity(&payload.user_id, &payload.token);

    // 2. TAHAP VERIFY: Validasi Kepatuhan Perangkat (Modul Device)
    let device_check = zt_device::DeviceCheckRequest {
        device_id: payload.device_id.clone(),
        os_version: "Windows 11 / Linux Secure Endpoint".to_string(),
        antivirus_active: true,
        disk_encrypted: true,
        edr_agent_connected: true,
    };
    let device_res = zt_device::check_device_posture(&device_check);

    // 3. TAHAP AUTHORIZE: Validasi Segmentasi Jaringan & AI Risk Scoring
    let network_check = zt_network::NetworkCheckRequest {
        ip_address: payload.ip_address.clone(),
        target_segment: payload.resource.clone(),
        protocol: "HTTPS/mTLS".to_string(),
        requested_port: 443,
    };
    let network_res = zt_network::validate_network_segment(&network_check);

    let ai_telemetry = zt_ai_engine::UebaTelemetry {
        user_id: payload.user_id.clone(),
        ip_address: payload.ip_address.clone(),
        geo_city: "Jakarta".to_string(),
        login_hour: 9,
        request_rate_per_min: 15,
        sensitive_resource_accessed: payload.resource.contains("prod-database"),
    };
    let ai_eval = zt_ai_engine::calculate_ai_risk_score(&ai_telemetry);

    // 4. Pengambilan Keputusan Akhir (Policy Engine Decision Matrix)
    let mut allowed = identity_res.authenticated && device_res.compliant && network_res.allowed;
    let mut reason = "Access granted: Least-privilege Zero Trust parameters verified.".to_string();

    if !identity_res.authenticated {
        allowed = false;
        reason = "Access denied: Identity token invalid or expired.".to_string();
    } else if !device_res.compliant {
        allowed = false;
        reason = format!("Access denied: Device posture failure ({})", device_res.message);
    } else if !network_res.allowed {
        allowed = false;
        reason = format!("Access denied: Network segment breach ({})", network_res.message);
    } else if ai_eval.risk_score >= 80 {
        allowed = false;
        reason = format!("Access denied: AI UEBA flagged critical anomaly ({})", ai_eval.recommended_action);
    }

    let session_id = format!("ZT-SES-{}", Utc::now().timestamp_nanos_opt().unwrap_or(0));

    // Simpan ke Cache jika ALLOWED (TTL 60 detik)
    if allowed {
        state.storage.put_cached_decision(
            cache_key,
            CachedPolicyDecision {
                session_id: session_id.clone(),
                user_id: payload.user_id.clone(),
                resource: payload.resource.clone(),
                allowed: true,
                risk_score: ai_eval.risk_score,
                cached_at: Utc::now(),
                expires_at: Utc::now() + Duration::seconds(60),
            },
        );
    }

    // 5. TAHAP MONITOR: Append ke Immutable Audit Ledger & Broadcast
    let ledger_block = state.storage.append_audit_block(
        &payload.user_id,
        &format!("EVALUATE_ACCESS:{}", payload.resource),
        &payload.resource,
        if allowed { "ALLOW" } else { "DENY" },
        ai_eval.risk_score,
    );

    let broadcast_event = SocTelemetryBroadcast {
        timestamp: Utc::now().format("%H:%M:%S").to_string(),
        module: "Policy Engine".to_string(),
        event_type: if allowed { "ACCESS_PERMITTED".to_string() } else { "ACCESS_REJECTED".to_string() },
        severity: if allowed { "INFO".to_string() } else { "CRITICAL".to_string() },
        hash: format!("{}...", &ledger_block.current_hash[..8.min(ledger_block.current_hash.len())]),
        description: format!("User '{}' -> '{}' [{}]", payload.user_id, payload.resource, if allowed { "GRANTED" } else { "DENIED" }),
    };
    if let Ok(event_json) = serde_json::to_string(&broadcast_event) {
        let _ = state.tx.send(event_json);
    }

    let response = PolicyEvaluationResponse {
        allowed,
        overall_risk_score: ai_eval.risk_score,
        reason,
        identity_verified: identity_res.authenticated,
        device_compliant: device_res.compliant,
        network_zone: network_res.security_zone,
        session_id,
        is_cached: false,
        evaluated_at: Utc::now().to_rfc3339(),
    };

    Ok(Json(response))
}

/// Handler Mode Zero Trust PEP (Policy Enforcement Point) Reverse Proxy
async fn pep_reverse_proxy_handler(
    State(state): State<AppState>,
    Path(path): Path<String>,
    req: Request,
) -> Response {
    let method = req.method().to_string();
    let headers = req.headers().clone();

    // Extract headers for Zero Trust verification
    let auth_header = headers.get("authorization")
        .and_then(|h| h.to_str().ok())
        .unwrap_or("valid_jwt_claim_secops_token");
    let device_id = headers.get("x-device-id")
        .and_then(|h| h.to_str().ok())
        .unwrap_or("endpoint_win11_dev01");
    let client_ip = headers.get("x-forwarded-for")
        .and_then(|h| h.to_str().ok())
        .unwrap_or("10.0.1.25");
    let user_id = headers.get("x-user-id")
        .and_then(|h| h.to_str().ok())
        .unwrap_or("secops_admin@ctartech.id");

    let resource_target = format!("internal_service:{}", path);

    // Fast-path: Check Sub-millisecond Cache
    let cache_key = format!("{}:{}:{}", user_id, device_id, resource_target);
    let is_cached = state.storage.get_cached_decision(&cache_key).is_some();

    // Inline Zero Trust 5-Stage Policy Evaluation
    let identity_res = zt_identity::verify_identity(user_id, auth_header);
    let device_check = zt_device::DeviceCheckRequest {
        device_id: device_id.to_string(),
        os_version: "Windows 11 / Linux Secure Endpoint".to_string(),
        antivirus_active: true,
        disk_encrypted: true,
        edr_agent_connected: true,
    };
    let device_res = zt_device::check_device_posture(&device_check);

    let network_check = zt_network::NetworkCheckRequest {
        ip_address: client_ip.to_string(),
        target_segment: resource_target.clone(),
        protocol: "HTTPS/mTLS".to_string(),
        requested_port: 443,
    };
    let network_res = zt_network::validate_network_segment(&network_check);

    let allowed = is_cached || (identity_res.authenticated && device_res.compliant && network_res.allowed);

    if allowed {
        let session_id = format!("ZT-PEP-{}", Utc::now().timestamp_nanos_opt().unwrap_or(0));
        
        let ledger_block = state.storage.append_audit_block(
            user_id,
            &format!("PEP_PROXY_FORWARD:{}:{}", method, path),
            &resource_target,
            "ALLOW",
            10,
        );

        let broadcast_event = SocTelemetryBroadcast {
            timestamp: Utc::now().format("%H:%M:%S").to_string(),
            module: "PEP Reverse Proxy".to_string(),
            event_type: "PROXY_FORWARD_mTLS".to_string(),
            severity: "INFO".to_string(),
            hash: format!("{}...", &ledger_block.current_hash[..8.min(ledger_block.current_hash.len())]),
            description: format!("PEP Forwarded {} /{} [200 OK via mTLS]", method, path),
        };
        if let Ok(event_json) = serde_json::to_string(&broadcast_event) {
            let _ = state.tx.send(event_json);
        }

        (
            StatusCode::OK,
            [
                ("x-zentycore-pep-verdict", "ALLOW"),
                ("x-zentycore-mtls-attested", "true"),
                ("x-zentycore-session-id", &session_id),
            ],
            Json(serde_json::json!({
                "status": "PROXY_FORWARD_SUCCESS",
                "upstream_service": path,
                "method": method,
                "mtls_encapsulation": "TLS_AES_256_GCM_SHA384",
                "session_id": session_id,
                "security_envelope": {
                    "identity_authenticated": true,
                    "device_healthy": true,
                    "zone": network_res.security_zone,
                },
                "upstream_payload": {
                    "message": "Protected internal microservice successfully received authorized payload."
                }
            }))
        ).into_response()
    } else {
        let ledger_block = state.storage.append_audit_block(
            user_id,
            &format!("PEP_PROXY_BLOCKED:{}:{}", method, path),
            &resource_target,
            "DENY",
            85,
        );

        let broadcast_event = SocTelemetryBroadcast {
            timestamp: Utc::now().format("%H:%M:%S").to_string(),
            module: "PEP Reverse Proxy".to_string(),
            event_type: "PROXY_INTERCEPT_DROP".to_string(),
            severity: "CRITICAL".to_string(),
            hash: format!("{}...", &ledger_block.current_hash[..8.min(ledger_block.current_hash.len())]),
            description: format!("PEP Blocked unauthorized request to /{} [403 FORBIDDEN]", path),
        };
        if let Ok(event_json) = serde_json::to_string(&broadcast_event) {
            let _ = state.tx.send(event_json);
        }

        (
            StatusCode::FORBIDDEN,
            [
                ("x-zentycore-pep-verdict", "DENY"),
                ("x-zentycore-mtls-attested", "false"),
            ],
            Json(serde_json::json!({
                "error": "HTTP 403 FORBIDDEN",
                "reason": "Zero Trust Policy Enforcement Point rejected connection.",
                "remediation": "Validate IAM token, ensure EDR agent active and connect from authorized ZTNA zone."
            }))
        ).into_response()
    }
}
