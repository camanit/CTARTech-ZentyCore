# 🛡️ CTARTech ZentyCore — Unified Zero Trust Control Platform

<div align="center">

[![Rust Version](https://img.shields.io/badge/Rust-2021%20Edition-orange.svg?style=for-the-badge&logo=rust)](https://www.rust-lang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)
[![Zero Trust: NIST SP 800-207](https://img.shields.io/badge/Compliance-NIST%20SP%20800--207-emerald.svg?style=for-the-badge)](https://csrc.nist.gov/publications/detail/sp/800-207/final)

**"Never Trust, Always Verify"** — *The Unified 8-in-1 Zero Trust Control Plane, AI Threat Intelligence Engine & Cryptographic SOC Platform.*

[Live Overview](#-features--8-zero-trust-pillars) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Multi-Language SDKs](#-multi-language-sdks) • [Roadmap](roadmap.md)

</div>

---

## 🌟 Overview

**CTARTech ZentyCore** is an enterprise-grade, high-performance Zero Trust Security Control Plane engineered in **Rust** with a modern **Next.js 14 SOC Dashboard**. It integrates the 8 fundamental pillars of Zero Trust Architecture into a single unified control plane with sub-millisecond policy caching, real-time WebSocket telemetry, and autonomous SOAR response.

---

## 🧩 8 Zero Trust Pillars in 1 Platform

| Pillar | Focus Area | Capabilities |
| :--- | :--- | :--- |
| **1. Identity & Access** | IAM / MFA / SSO | Ed25519 Token verification, FIDO2/TOTP enforcement, Zero-Knowledge Claims, Dynamic RBAC/ABAC |
| **2. Device Posture** | EDR & Endpoint Health | CrowdStrike / Defender telemetry, TPM 2.0 BitLocker/LUKS attestation, Root/Jailbreak detection |
| **3. Network Security** | ZTNA & Microsegmentation | Virtual mTLS microsegmentation, eBPF packet inspection, emergency subnet quarantine |
| **4. App & Workload** | WAF & Workload Defense | AST Payload Inspector (OWASP Top 10 SQLi/XSS/LFI defense), continuous vulnerability auditing |
| **5. Data Protection** | DLP & Privacy Compliance | Instant PII classification under **UU No. 27/2022 (UU PDP)**, GDPR Art. 9, PCI-DSS with KMS AES-256-GCM |
| **6. Visibility & SOC** | Cryptographic Ledger | Tamper-proof append-only SHA-256 Merkle chain audit ledger with real-time WebSocket streaming |
| **7. SOAR Response** | Autonomous Containment | Zero-second automated playbook dispatching (Ransomware isolate, token revocation killswitch) |
| **8. Governance Matrix** | Multi-Regulatory Audit | Continuous compliance scoring for **NIST SP 800-207**, **EU GDPR**, **OJK POJK 11 / BSSN**, **SOC 2**, **MAS TRM** |

### 🤖 Special AI & Superadmin Modules
- **AI UEBA Engine**: Adaptive behavioral anomaly detector (0–100 Risk Score) monitoring off-hours access, request velocity, and proxy/TOR exit nodes.
- **Superadmin & Licensing**: BLAKE3 salted API key vault, Airgap cryptographic offline signed keys (`.lic`), and integrated billing.
- **PEP Reverse Proxy**: Inline Policy Enforcement Point (`/proxy/*path`) with mTLS header injection and instant 403 breach drop.

---

## 🚀 Quick Start

### Option 1: One-Click Docker Compose (Recommended)

Run the complete stack (Rust Engine `:8080`, Next.js Dashboard `:3000`, PostgreSQL 16 `:5432`, and Redis 7 `:6379`):

```bash
# Clone the repository
git clone https://github.com/camanit/CTARTech-ZentyCore.git
cd CTARTech-ZentyCore

# Start all services
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option 2: Local Development

#### 1. Backend (Rust Axum Gateway)
```bash
cargo run --bin core_engine
# Listening on http://localhost:8080
# WebSockets: ws://localhost:8080/ws/soc-stream
```

#### 2. Frontend (Next.js Dashboard)
```bash
cd dashboard-web
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📦 Multi-Language SDKs & Middleware

Protect your backend APIs in 3 lines of code:

### 🦀 Rust SDK
```rust
use zt_sdk::{ZeroTrustClient, AccessRequest};

let client = ZeroTrustClient::new("http://localhost:8080", "zt_live_api_key");
let is_allowed = client.verify_request("user@corp.id", token, device_id, "api:db", ip).await;
```

### 🟩 Node.js / Express Middleware
```typescript
import { ZeroTrustClient } from '@ctartech/zentycore-middleware';

const zt = new ZeroTrustClient({ controlPlaneUrl: 'http://localhost:8080', apiKey: 'zt_live_key' });
app.use('/api/customers', zt.expressMiddleware({ resourceName: 'api:customers' }));
```

### 🐍 Python / FastAPI Middleware
```python
from fastapi import FastAPI
from zentycore import ZeroTrustClient

app = FastAPI()
zt = ZeroTrustClient(base_url="http://localhost:8080", api_key="zt_live_key")
zt.fastapi_middleware(app, resource_prefix="prod-finance-api")
```

### 🐹 Go / Gin Middleware
```go
import "github.com/ctartech/zentycore/sdks/go-sdk"

client := zentycore.NewClient("http://localhost:8080", "zt_live_key")
router.Use(client.StandardHTTPMiddleware("api:finance", handler))
```

---

## 🗺️ Roadmap & Specifications

- Detailed architectural specifications: [zentycore_detail_spec.md](zentycore_detail_spec.md)
- Complete version roadmap & action items: [roadmap.md](roadmap.md)
- SQL database migrations: [migrations/0001_initial_schema.sql](migrations/0001_initial_schema.sql)

---

## ☕ Support, Donation & Community Sponsorship

Dukung pengembangan dan riset keamanan siber open-source **CTARTech ZentyCore**:

- 🏦 **Allo Bank (No. Rekening)**: `0812 6000 6666`
- 💬 **WhatsApp Community & Support**: `+62 812-6000-6666` (0812 6000 6666)

---

## 📄 License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE).

*CTARTech ZentyCore © 2026 — Powered by Rust | Secured by Design | Built for the World*
