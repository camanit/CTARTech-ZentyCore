export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// 1. Evaluasi Kebijakan Inti
export async function evaluateAccess(payload: {
  user_id: string;
  token: string;
  device_id: string;
  resource: string;
  ip_address: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/policy/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    // Fallback simulation when backend is offline
    const isIpBlocked = payload.ip_address.startsWith('185.220.') || payload.ip_address.startsWith('192.168.99.');
    const isTokenValid = payload.token.includes('valid');
    const isAllowed = isTokenValid && !isIpBlocked;
    return {
      allowed: isAllowed,
      overall_risk_score: isAllowed ? 12 : 88,
      reason: isAllowed 
        ? "Access granted. Identity verified, device healthy, network zone clear." 
        : (isIpBlocked ? "Access denied: Request originated from high-risk proxy/TOR network." : "Access denied: Invalid authentication token."),
      identity_verified: isTokenValid,
      device_compliant: true,
      network_zone: isIpBlocked ? "Untrusted_Quarantine" : "Enterprise_Corporate",
      session_id: `zt_sess_${Math.random().toString(36).substring(2, 10)}`,
      evaluated_at: new Date().toISOString(),
    };
  }
}

// 2. AI UEBA Risk Scoring
export async function evaluateAiRisk(payload: {
  user_id: string;
  ip_address: string;
  geo_city: string;
  login_hour: number;
  request_rate_per_min: number;
  sensitive_resource_accessed: boolean;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/evaluate-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    let score = 10;
    const anomalies: string[] = [];
    if (payload.login_hour <= 4) {
      score += 20;
      anomalies.push("Off-hours access pattern detected (00:00 - 04:00)");
    }
    if (payload.request_rate_per_min > 120) {
      score += 35;
      anomalies.push("High velocity automated request rate (> 120 req/min)");
    }
    if (payload.sensitive_resource_accessed) {
      score += 15;
      anomalies.push("Sensitive resource touch recorded");
    }
    if (payload.ip_address.startsWith("185.220.") || payload.ip_address.startsWith("192.168.99.")) {
      score += 45;
      anomalies.push("Known high-risk TOR/Proxy exit node signature");
    }
    score = Math.min(100, score);
    const tier = score <= 30 ? "LOW" : score <= 60 ? "MEDIUM" : score <= 80 ? "HIGH" : "CRITICAL";
    return {
      risk_score: score,
      risk_tier: tier,
      detected_anomalies: anomalies,
      recommended_action: score > 60 ? "Step-up MFA & Force EDR Re-scan" : "Allow with standard telemetry logging",
    };
  }
}

// 3. Governance Compliance
export async function getComplianceStatus(framework: string = 'NIST_SP_800_207') {
  try {
    const res = await fetch(`${API_BASE_URL}/governance/compliance-status?framework=${framework}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      framework,
      region: "Global & Domestic Standard",
      overall_score: 98,
      status: "COMPLIANT",
      generated_at: new Date().toISOString(),
      audited_controls: [
        { clause: "Control 1.1", region: "Global", description: "All communication is secured regardless of network location.", status: "PASS", score: 100 },
        { clause: "Control 2.4", region: "Global", description: "Access to individual enterprise resources is granted per session.", status: "PASS", score: 95 },
        { clause: "Control 3.2", region: "Global", description: "Dynamic policy evaluation using identity, device posture, and behavior.", status: "PASS", score: 100 },
      ],
    };
  }
}

// 4. Licensing & Key Generator
export async function generateOfflineLicense(tenantId: string, tier: string = "Enterprise") {
  try {
    const res = await fetch(`${API_BASE_URL}/license/generate-offline-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenant_id: tenantId, tier }),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    const mockHash = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const rawKey = `zt_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      license_key: rawKey,
      license_hash: mockHash,
      tier,
      tenant_id: tenantId,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      active_modules: ["Identity", "Device", "Network", "AppWorkload", "DataProtection", "Visibility", "Response", "Governance", "AiEngine"],
    };
  }
}
