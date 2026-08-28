use axum::{
    extract::Json,
    response::Html,
    routing::{get, post},
    Router,
};
use chrono::{Duration, Utc};
use ed25519_dalek::{Signer, SigningKey};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::net::SocketAddr;
use std::path::Path;
use tower_http::cors::CorsLayer;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SovereignLicensePayload {
    pub issuer: String,
    pub tenant_name: String,
    pub tenant_id: String,
    pub tier: String,
    pub max_endpoints: u32,
    pub active_modules: Vec<String>,
    pub issued_at: String,
    pub expires_at: String,
    pub blake3_hash: String,
    pub signature_ed25519: String,
}

#[derive(Deserialize, Debug)]
pub struct GenerateLicenseRequest {
    pub tenant_name: String,
    pub tier: String,
    pub days_valid: i64,
    pub max_endpoints: u32,
    pub modules: Vec<String>,
}

#[derive(Serialize, Debug)]
pub struct GenerateLicenseResponse {
    pub success: bool,
    pub license: SovereignLicensePayload,
    pub raw_json: String,
    pub plain_key: String,
    pub saved_filepath: String,
}

fn get_or_create_master_key() -> SigningKey {
    let master_key_path = "master_authority.key";
    if Path::new(master_key_path).exists() {
        let key_bytes = fs::read(master_key_path).expect("Failed to read master_authority.key");
        if key_bytes.len() == 32 {
            let mut arr = [0u8; 32];
            arr.copy_from_slice(&key_bytes);
            SigningKey::from_bytes(&arr)
        } else {
            let mut csprng = OsRng;
            SigningKey::generate(&mut csprng)
        }
    } else {
        let mut csprng = OsRng;
        let key = SigningKey::generate(&mut csprng);
        fs::write(master_key_path, key.to_bytes()).expect("Failed to save master key");
        key
    }
}

pub fn sign_license(req: GenerateLicenseRequest) -> (SovereignLicensePayload, String, String, String) {
    let signing_key = get_or_create_master_key();
    let issued_at = Utc::now();
    let expires_at = issued_at + Duration::days(req.days_valid);
    let tenant_slug = req.tenant_name.to_lowercase().replace(' ', "_").replace(['(', ')', '.'], "");
    let raw_seed = format!("{}:{}:{}", tenant_slug, req.tier, issued_at.timestamp());
    let hash = blake3::hash(raw_seed.as_bytes()).to_hex().to_string();

    let raw_payload_to_sign = format!(
        "ISSUER:CTARTech_ZentyCore|TENANT:{}|TIER:{}|EXPIRES:{}|BLAKE3:{}",
        req.tenant_name, req.tier, expires_at.to_rfc3339(), hash
    );

    let signature = signing_key.sign(raw_payload_to_sign.as_bytes());
    let sig_hex = hex::encode(signature.to_bytes());

    let payload = SovereignLicensePayload {
        issuer: "CTARTech ZentyCore Sovereign Authority".to_string(),
        tenant_name: req.tenant_name.clone(),
        tenant_id: format!("tenant_{}_{}", tenant_slug, issued_at.timestamp()),
        tier: req.tier.clone(),
        max_endpoints: req.max_endpoints,
        active_modules: if req.modules.is_empty() {
            vec![
                "AI_UEBA_ANOMALY".to_string(),
                "WAF_AST_BARRIER".to_string(),
                "SOAR_CONTAINMENT".to_string(),
                "UU_PDP_DLP".to_string(),
                "MERKLE_AUDIT_CHAIN".to_string(),
                "OFFLINE_AIRGAP_ENGINE".to_string(),
            ]
        } else {
            req.modules
        },
        issued_at: issued_at.to_rfc3339(),
        expires_at: expires_at.to_rfc3339(),
        blake3_hash: hash,
        signature_ed25519: sig_hex,
    };

    let raw_json = serde_json::to_string_pretty(&payload).unwrap();
    let plain_key = format!("zt_live_{}_{}", tenant_slug, issued_at.timestamp());
    let out_dir = "issued_licenses";
    let _ = fs::create_dir_all(out_dir);
    let out_file = format!("{}/license_{}_{}.lic", out_dir, tenant_slug, issued_at.format("%Y%m%d"));
    let _ = fs::write(&out_file, &raw_json);

    (payload, raw_json, plain_key, out_file)
}

const HTML_GUI: &str = r#"<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CTARTech ZentyCore — Sovereign License Authority (Desktop)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #030712; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="text-slate-100 min-h-screen p-6 md:p-10 flex flex-col items-center justify-center relative overflow-x-hidden">
  <div class="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
  <div class="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

  <div class="w-full max-w-4xl z-10 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
          👑
        </div>
        <div>
          <h1 class="text-xl font-extrabold text-white">CTARTech ZentyCore <span class="text-amber-400">License Authority</span></h1>
          <p class="text-xs text-slate-400">Desktop Master Generator & Ed25519 Airgap Signer (Developer HQ)</p>
        </div>
      </div>
      <div class="text-right">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-mono font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Master Key Active
        </span>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <!-- Form Panel -->
      <div class="md:col-span-6 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>🛠️ Konfigurasi Sertifikat Klien</span>
        </h2>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Nama Organisasi / Bank Klien</label>
          <input type="text" id="tenant_name" value="PT Bank Central Asia Tbk" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono" placeholder="PT Bank Mandiri Tbk">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Tier Lisensi</label>
            <select id="tier" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-500">
              <option value="Enterprise Airgap Sovereign">🏛️ Enterprise Airgap</option>
              <option value="Enterprise Production">💎 Enterprise Cloud</option>
              <option value="Professional Tier">🥇 Professional Tier</option>
              <option value="Starter Tier">🥈 Starter Tier</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Masa Berlaku (Hari)</label>
            <input type="number" id="days_valid" value="365" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Maksimal Endpoints / Nodes</label>
          <input type="number" id="max_endpoints" value="100000" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-2">Modul Diizinkan</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <label class="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer">
              <input type="checkbox" checked value="AI_UEBA_ANOMALY" class="rounded text-amber-500"> <span>🧠 AI UEBA (0-100)</span>
            </label>
            <label class="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer">
              <input type="checkbox" checked value="WAF_AST_BARRIER" class="rounded text-amber-500"> <span>🛡️ WAF AST Barrier</span>
            </label>
            <label class="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer">
              <input type="checkbox" checked value="SOAR_CONTAINMENT" class="rounded text-amber-500"> <span>⚡ SOAR Playbooks</span>
            </label>
            <label class="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer">
              <input type="checkbox" checked value="UU_PDP_DLP" class="rounded text-amber-500"> <span>🔒 UU PDP & GDPR DLP</span>
            </label>
          </div>
        </div>

        <button onclick="generateLicense()" id="btnGen" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all">
          <span>⚡ Tanda Tangani & Terbitkan File (.lic)</span>
        </button>
      </div>

      <!-- Result Panel -->
      <div class="md:col-span-6 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
        <div>
          <div class="flex justify-between items-center mb-3">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-300">📄 Berkas Lisensi Bertanda Tangan</h2>
            <button onclick="downloadLic()" id="btnDownload" class="hidden px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-500/30 transition-all">
              💾 Download .lic
            </button>
          </div>

          <div id="outputContainer" class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-[11px] font-mono text-slate-400 h-64 overflow-y-auto leading-relaxed">
            Menunggu penandatanganan sertifikat kriptografi...
          </div>
        </div>

        <div id="summaryCard" class="hidden p-3 bg-slate-950 border border-amber-500/30 rounded-xl text-xs space-y-1 font-mono">
          <div class="text-amber-400 font-bold">✅ Tersimpan di PC: <span id="savedPath" class="text-white"></span></div>
          <div class="text-slate-400 text-[10px]">Ed25519 Signature Verified Sovereign Authority</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentRawJson = '';
    let currentTenant = '';

    async function generateLicense() {
      const btn = document.getElementById('btnGen');
      btn.innerText = 'Menandatangani Kriptografi Ed25519...';
      btn.disabled = true;

      const tenant_name = document.getElementById('tenant_name').value;
      const tier = document.getElementById('tier').value;
      const days_valid = parseInt(document.getElementById('days_valid').value) || 365;
      const max_endpoints = parseInt(document.getElementById('max_endpoints').value) || 100000;

      const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
      const modules = Array.from(checkboxes).map(cb => cb.value);

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenant_name, tier, days_valid, max_endpoints, modules })
        });
        const data = await res.json();
        
        currentRawJson = data.raw_json;
        currentTenant = tenant_name;

        document.getElementById('outputContainer').innerHTML = `<pre class="text-emerald-400 text-[10px]">${data.raw_json}</pre>`;
        document.getElementById('btnDownload').classList.remove('hidden');
        document.getElementById('summaryCard').classList.remove('hidden');
        document.getElementById('savedPath').innerText = data.saved_filepath;
      } catch (err) {
        alert('Gagal menghasilkan lisensi: ' + err);
      } finally {
        btn.innerText = '⚡ Tanda Tangani & Terbitkan File (.lic)';
        btn.disabled = false;
      }
    }

    function downloadLic() {
      if (!currentRawJson) return;
      const blob = new Blob([currentRawJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `license_${currentTenant.toLowerCase().replace(/[^a-z0-9]/g, '_')}.lic`;
      a.click();
    }
  </script>
</body>
</html>
"#;

async fn root_handler() -> Html<&'static str> {
    Html(HTML_GUI)
}

async fn generate_api_handler(
    Json(req): Json<GenerateLicenseRequest>,
) -> Json<GenerateLicenseResponse> {
    let (payload, raw_json, plain_key, saved_filepath) = sign_license(req);

    Json(GenerateLicenseResponse {
        success: true,
        license: payload,
        raw_json,
        plain_key,
        saved_filepath,
    })
}

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    // If CLI arguments provided (more than 1), run in CLI mode
    if args.len() > 1 && args[1] != "--gui" {
        let tenant_name = args[1].clone();
        let tier = if args.len() > 2 { args[2].clone() } else { "Enterprise Airgap Sovereign".to_string() };
        let days_valid: i64 = if args.len() > 3 { args[3].parse().unwrap_or(365) } else { 365 };

        let req = GenerateLicenseRequest {
            tenant_name,
            tier,
            days_valid,
            max_endpoints: 100_000,
            modules: vec![],
        };

        let (_payload, _raw_json, plain_key, out_file) = sign_license(req);
        println!("\n✅ CLI LISENSI DITERBITKAN: {}", out_file);
        println!("🔑 Plain Key: {}\n", plain_key);
        return;
    }

    // Otherwise, launch Desktop GUI Server on http://127.0.0.1:9090
    println!("============================================================");
    println!("👑 CTARTech ZentyCore - Sovereign License Authority GUI");
    println!("   Membuka Antarmuka Grafis Desktop Developer di Browser...");
    println!("============================================================");

    let app = Router::new()
        .route("/", get(root_handler))
        .route("/api/generate", post(generate_api_handler))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([127, 0, 0, 1], 9090));
    println!("  -> Desktop GUI Server berjalan di: http://{}", addr);

    // Auto-open browser
    tokio::spawn(async move {
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
        let _ = opener::open("http://127.0.0.1:9090");
    });

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("  -> Silakan gunakan antarmuka grafis di browser Anda!");
    println!("  -> Tekan Ctrl+C untuk keluar.\n");
    axum::serve(listener, app).await.unwrap();
}
