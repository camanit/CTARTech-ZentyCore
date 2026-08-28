-- ============================================================================
-- CTARTech ZentyCore — PostgreSQL Production Schema (v1.0)
-- Zero Trust Control Plane: Tenants, Licenses, Keys, Devices, Policies & Ledger
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants (Multi-Tenant Organizations)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    contact_email VARCHAR(255) NOT NULL,
    organization_type VARCHAR(50) DEFAULT 'Commercial_Enterprise', -- Enterprise, Government, SME, Community
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, PENDING_VERIFICATION
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Licenses & Entitlements
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL DEFAULT 'Enterprise', -- CommunityFree, Starter, Professional, Enterprise, CustomGovernment
    max_endpoints INTEGER NOT NULL DEFAULT 1000,
    ai_engine_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    offline_airgap_permitted BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    license_hash VARCHAR(128) NOT NULL UNIQUE, -- BLAKE3 / SHA-256 Hash
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. API Keys (BLAKE3 Hashed & Salted)
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    key_prefix VARCHAR(16) NOT NULL, -- e.g. "zt_live_" (for quick indexing)
    key_hash VARCHAR(128) NOT NULL UNIQUE, -- BLAKE3 Hash of the raw secret
    name VARCHAR(100) NOT NULL DEFAULT 'Default API Key',
    allowed_modules JSONB NOT NULL DEFAULT '["identity", "device", "network", "app", "data", "telemetry", "response", "governance", "ai"]',
    rate_limit_per_min INTEGER NOT NULL DEFAULT 1000,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);

-- 4. Device Posture Registry
CREATE TABLE IF NOT EXISTS device_postures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(128) NOT NULL UNIQUE,
    os_name VARCHAR(100) NOT NULL,
    os_version VARCHAR(100) NOT NULL,
    tpm_attested BOOLEAN NOT NULL DEFAULT TRUE,
    disk_encrypted BOOLEAN NOT NULL DEFAULT TRUE,
    edr_status VARCHAR(100) NOT NULL DEFAULT 'ACTIVE',
    last_health_score SMALLINT NOT NULL DEFAULT 100, -- 0 to 100
    is_quarantined BOOLEAN NOT NULL DEFAULT FALSE,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_device_id ON device_postures(device_id);

-- 5. Zero Trust Policies (Dynamic Policy Matrix)
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject_role VARCHAR(100) NOT NULL, -- e.g. "SecOps_Admin", "Employee", "*"
    target_resource VARCHAR(255) NOT NULL, -- e.g. "prod-database-cluster", "api:*"
    action VARCHAR(20) NOT NULL DEFAULT 'ALLOW', -- ALLOW, DENY, STEP_UP_MFA, QUARANTINE
    max_risk_score SMALLINT NOT NULL DEFAULT 60, -- Max tolerable AI risk score before deny
    priority INTEGER NOT NULL DEFAULT 100, -- Lower number = higher priority
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_policies_lookup ON policies(target_resource, is_active, priority);

-- 6. Cryptographic Immutable Audit Ledger
CREATE TABLE IF NOT EXISTS audit_ledger (
    block_id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    verdict VARCHAR(20) NOT NULL, -- ALLOW, DENY, EXECUTED
    risk_score SMALLINT NOT NULL DEFAULT 0,
    previous_hash VARCHAR(128) NOT NULL,
    current_hash VARCHAR(128) NOT NULL UNIQUE
);
CREATE INDEX IF NOT EXISTS idx_audit_block ON audit_ledger(block_id DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_ledger(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_hash ON audit_ledger(current_hash);

-- Seed Initial Data for Demonstration
INSERT INTO tenants (name, slug, contact_email, organization_type, status)
VALUES ('PT Bank Central Enterprise Tbk', 'bank-central-enterprise', 'secops@bankenterprise.id', 'Commercial_Enterprise', 'ACTIVE')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO policies (name, description, subject_role, target_resource, action, max_risk_score, priority)
VALUES 
('Allow SecOps Database Access', 'Privileged access to production database cluster with MFA', 'SecOps_Admin', 'prod-database-cluster', 'ALLOW', 70, 10),
('Block External Untrusted Subnets', 'Default deny for unauthenticated remote ranges', '*', 'internal:*', 'DENY', 30, 999)
ON CONFLICT DO NOTHING;
