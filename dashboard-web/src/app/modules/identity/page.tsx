'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { UserCheck, Shield, Key, CheckCircle, AlertTriangle } from 'lucide-react';

export default function IdentityModulePage() {
  const [userId, setUserId] = useState('secops_admin@ctartech.id');
  const [tokenType, setTokenType] = useState('valid_jwt_claim_secops_token');
  const [mfaStatus, setMfaStatus] = useState('Enforced_TOTP_FIDO2');
  const [rbacRole, setRbacRole] = useState('SecOps_Admin');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerifyIdentity = () => {
    setTesting(true);
    setTimeout(() => {
      const isValid = tokenType.includes('valid');
      setResult({
        verified: isValid,
        subject: userId,
        role: rbacRole,
        mfa_verified: mfaStatus !== 'Disabled',
        risk_level: isValid ? 'LOW' : 'CRITICAL',
        token_claims: {
          iss: 'https://auth.ctartech.id/oauth2/v1',
          aud: 'zentycore-control-plane',
          exp: Math.floor(Date.now() / 1000) + 3600,
          scope: ['identity:read', 'policy:evaluate', 'soar:trigger'],
        },
        message: isValid
          ? 'Identity token cryptographically verified. Zero-Knowledge Claims valid.'
          : 'Invalid or forged token signature! Access rejected immediately.',
      });
      setTesting(false);
    }, 400);
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded">
                PILLAR 1
              </span>
              <h1 className="text-2xl font-bold">Identity & Access Management (IAM)</h1>
            </div>
            <p className="text-sm text-slate-400">
              Autentikasi terpusat, Zero-Knowledge Claims, MFA Hardware & Dynamic RBAC/ABAC
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            IAM Provider Online
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard label="MFA Enforced Users" value="100%" subtext="Hardware & TOTP Tokens" colorClass="text-emerald-400" />
          <MetricCard label="Active SSO Claims" value="3,842" subtext="OIDC / SAML 2.0 Valid" colorClass="text-blue-400" />
          <MetricCard label="Privileged Roles (PAM)" value="12" subtext="SecOps & Superadmins" colorClass="text-purple-400" />
          <MetricCard label="Anomalous Logins (24h)" value="0" subtext="Zero Suspicious Brute-Force" colorClass="text-cyan-400" />
        </div>

        {/* Interactive Verification Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
              <Key className="w-4 h-4 text-cyan-400" />
              Live IAM & MFA Token Verifier
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">User Identifier (Email / UPN)</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Token Status</label>
                  <select
                    value={tokenType}
                    onChange={(e) => setTokenType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="valid_jwt_claim_secops_token">Valid Signed JWT (Ed25519 - Human User)</option>
                    <option value="valid_ai_agent_jit_token">Valid AI-Agent Non-Human Identity (JIT Scoped)</option>
                    <option value="expired_token_timestamp">Expired JWT Token</option>
                    <option value="itdr_anomaly_session_hijack">ITDR Session Anomaly / Hijacked Token</option>
                    <option value="forged_signature_token">Forged Signature / Tampered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">MFA / Machine Attestation Level</label>
                  <select
                    value={mfaStatus}
                    onChange={(e) => setMfaStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Enforced_TOTP_FIDO2">FIDO2 / WebAuthn Hardware Key</option>
                    <option value="AI_AGENT_ROTATING_CERT">AIControlPlane Auto-Rotating Secret</option>
                    <option value="Authenticator_App">App TOTP Authenticator</option>
                    <option value="Disabled">Disabled (Unsafe)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">RBAC / Non-Human Role Claim</label>
                <select
                  value={rbacRole}
                  onChange={(e) => setRbacRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="SecOps_Admin">SecOps_Admin (Full Control)</option>
                  <option value="AI_Autonomous_Worker">AI_Autonomous_Worker (JIT Least-Privilege Scoped)</option>
                  <option value="Database_Operator">Database_Operator (Restricted SQL)</option>
                  <option value="General_Employee">General_Employee (Read-Only Portal)</option>
                </select>
              </div>


              <button
                onClick={handleVerifyIdentity}
                disabled={testing}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <UserCheck className="w-4 h-4" />
                {testing ? 'Verifying Cryptographic Claims...' : 'Test Identity Verification'}
              </button>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-emerald-400" />
                Identity Validation & Claims Output
              </h3>

              {result ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                    result.verified
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}>
                    {result.verified ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold">{result.verified ? 'IDENTITY CLAIMS VALID' : 'REJECTED — TOKEN UNTRUSTED'}</div>
                      <div className="text-[11px] opacity-90">{result.message}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Subject (sub):</span>
                      <span className="text-slate-200">{result.subject}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Granted Role:</span>
                      <span className="text-cyan-400 font-semibold">{result.role}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>MFA Attestation:</span>
                      <span className={result.mfa_verified ? "text-emerald-400" : "text-amber-400"}>
                        {result.mfa_verified ? "FIDO2 Verified" : "MFA Missing"}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Assigned Scopes:</span>
                      <span className="text-purple-400">{result.token_claims.scope.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                  <Key className="w-6 h-6 mb-2 opacity-40 text-cyan-400" />
                  Pilih parameter di sebelah kiri dan klik tombol verifikasi untuk menguji token.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Endpoint: <code className="text-cyan-400 font-mono">POST /api/v1/identity/verify</code></span>
              <span className="text-slate-400">Zero-Knowledge JWT</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
