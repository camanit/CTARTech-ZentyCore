use chrono::{Duration, Utc};
use ed25519_dalek::{SigningKey, Signer};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::path::Path;

#[derive(Serialize, Deserialize, Debug)]
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

fn main() {
    println!("============================================================");
    println!("👑 CTARTech ZentyCore - Sovereign License Generator (Desktop)");
    println!("   Cryptographic Ed25519 Signer & Master Airgap Authority   ");
    println!("============================================================");

    let args: Vec<String> = env::args().collect();
    let tenant_name = if args.len() > 1 {
        args[1].clone()
    } else {
        "PT Bank Mandiri (Persero) Tbk".to_string()
    };

    let tier = if args.len() > 2 {
        args[2].clone()
    } else {
        "Enterprise Airgap Sovereign".to_string()
    };

    let days_valid: i64 = if args.len() > 3 {
        args[3].parse().unwrap_or(365)
    } else {
        365
    };

    let out_file = if args.len() > 4 {
        args[4].clone()
    } else {
        format!("license_{}.lic", tenant_name.to_lowercase().replace(' ', "_").replace(['(', ')'], ""))
    };

    println!("\n[1/4] Initializing Master Ed25519 Signing Key Pair...");
    let master_key_path = "master_authority.key";
    let signing_key = if Path::new(master_key_path).exists() {
        println!("  -> Loading existing master private key from: {}", master_key_path);
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
        println!("  -> Generating fresh secure Master Ed25519 Key Pair...");
        let mut csprng = OsRng;
        let key = SigningKey::generate(&mut csprng);
        fs::write(master_key_path, key.to_bytes()).expect("Failed to save master key");
        println!("  -> Master Private Key saved safely (excluded from Git) to: {}", master_key_path);
        key
    };

    let verifying_key = signing_key.verifying_key();
    let pubkey_hex = hex::encode(verifying_key.as_bytes());
    println!("  -> Master Public Key (Embeddable in Client Verifier): {}", pubkey_hex);

    println!("\n[2/4] Assembling Cryptographic License Entitlements...");
    let issued_at = Utc::now();
    let expires_at = issued_at + Duration::days(days_valid);
    let tenant_slug = tenant_name.to_lowercase().replace(' ', "_").replace(['(', ')'], "");
    let raw_seed = format!("{}:{}:{}", tenant_slug, tier, issued_at.timestamp());
    let hash = blake3::hash(raw_seed.as_bytes()).to_hex().to_string();

    let raw_payload_to_sign = format!(
        "ISSUER:CTARTech_ZentyCore|TENANT:{}|TIER:{}|EXPIRES:{}|BLAKE3:{}",
        tenant_name, tier, expires_at.to_rfc3339(), hash
    );

    println!("\n[3/4] Signing Payload with Ed25519 Cryptographic Curve...");
    let signature = signing_key.sign(raw_payload_to_sign.as_bytes());
    let sig_hex = hex::encode(signature.to_bytes());

    let payload = SovereignLicensePayload {
        issuer: "CTARTech ZentyCore Sovereign Authority".to_string(),
        tenant_name: tenant_name.clone(),
        tenant_id: format!("tenant_{}_{}", tenant_slug, issued_at.timestamp()),
        tier: tier.clone(),
        max_endpoints: 100_000,
        active_modules: vec![
            "AI_UEBA_ANOMALY".to_string(),
            "WAF_AST_BARRIER".to_string(),
            "SOAR_CONTAINMENT".to_string(),
            "UU_PDP_DLP".to_string(),
            "MERKLE_AUDIT_CHAIN".to_string(),
            "OFFLINE_AIRGAP_ENGINE".to_string(),
        ],
        issued_at: issued_at.to_rfc3339(),
        expires_at: expires_at.to_rfc3339(),
        blake3_hash: hash,
        signature_ed25519: sig_hex,
    };

    let json_string = serde_json::to_string_pretty(&payload).unwrap();

    println!("\n[4/4] Writing Signed License Certificate to Disk: {}", out_file);
    fs::write(&out_file, &json_string).expect("Failed to write output license file");

    println!("\n============================================================");
    println!("✅ LISENSI RESMI BERHASIL DITERBITKAN DENGAN TANDA TANGAN DIGITAL!");
    println!("------------------------------------------------------------");
    println!("🏛️  Klien          : {}", tenant_name);
    println!("💎  Tier Lisensi   : {}", tier);
    println!("📅  Masa Berlaku   : {} Hari (Hingga {})", days_valid, expires_at.format("%Y-%m-%d"));
    println!("📁  File Sertifikat: {}", out_file);
    println!("🔑  Plaintext Key  : zt_live_{}_{}", tenant_slug, issued_at.timestamp());
    println!("============================================================\n");
}
