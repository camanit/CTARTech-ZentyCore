'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { Laptop, ShieldCheck, AlertOctagon, CheckCircle2, RefreshCw } from 'lucide-react';

export default function DeviceModulePage() {
  const [deviceId, setDeviceId] = useState('endpoint_win11_dev01');
  const [osType, setOsType] = useState('Windows 11 Enterprise (23H2)');
  const [edrStatus, setEdrStatus] = useState('CrowdStrike / Defender Active');
  const [diskEncrypted, setDiskEncrypted] = useState(true);
  const [jailbroken, setJailbroken] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAuditDevice = () => {
    setAuditing(true);
    setTimeout(() => {
      const isCompliant = diskEncrypted && !jailbroken && edrStatus !== 'Disabled';
      setResult({
        compliant: isCompliant,
        device_id: deviceId,
        health_score: isCompliant ? 96 : 35,
        tpm_version: 'TPM 2.0 Hardware Attested',
        firewall_active: true,
        edr_telemetry: edrStatus,
        issues: [
          ...(!diskEncrypted ? ['Full Disk Encryption (BitLocker/LUKS) is OFF'] : []),
          ...(jailbroken ? ['Root / Jailbreak tampering signature detected'] : []),
          ...(edrStatus === 'Disabled' ? ['EDR Agent offline or missing'] : []),
        ],
        quarantine_action: isCompliant ? 'NONE' : 'ISOLATE_TO_RESTRICTED_VLAN',
      });
      setAuditing(false);
    }, 400);
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                PILLAR 2
              </span>
              <h1 className="text-2xl font-bold">Device Compliance & Endpoint Health</h1>
            </div>
            <p className="text-sm text-slate-400">
              Validasi postur keamanan perangkat (EDR, BitLocker, OS Patch, Root Detection) sebelum koneksi
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-blue-400 font-semibold">
            <Laptop className="w-4 h-4" />
            1,248 Endpoints Monitored
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard label="Compliant Endpoints" value="98.4%" subtext="1,228 dari 1,248 Perangkat" colorClass="text-emerald-400" />
          <MetricCard label="Disk Encryption (TPM)" value="100%" subtext="BitLocker / FileVault / LUKS" colorClass="text-cyan-400" />
          <MetricCard label="EDR Active Agents" value="1,248" subtext="Real-time XDR Telemetry" colorClass="text-blue-400" />
          <MetricCard label="Quarantined Endpoints" value="2" subtext="Isolasi Otomatis SOAR" colorClass="text-rose-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
              <Laptop className="w-4 h-4 text-blue-400" />
              Device Posture Inspector
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Device Hardware ID</label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">OS & Firmware Baseline</label>
                <select
                  value={osType}
                  onChange={(e) => setOsType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Windows 11 Enterprise (23H2)">Windows 11 Enterprise 23H2 (Secured Core)</option>
                  <option value="macOS Sonoma (14.5)">macOS Sonoma 14.5 (Apple Silicon MDM)</option>
                  <option value="Ubuntu 24.04 LTS">Ubuntu 24.04 LTS (LUKS Encrypted)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Endpoint Detection & Response (EDR)</label>
                <select
                  value={edrStatus}
                  onChange={(e) => setEdrStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="CrowdStrike / Defender Active">CrowdStrike Falcon / Defender for Endpoint (Healthy)</option>
                  <option value="Disabled">EDR Service Stopped / Tampered</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={diskEncrypted}
                    onChange={(e) => setDiskEncrypted(e.target.checked)}
                    className="rounded border-slate-700 text-blue-500 focus:ring-0"
                  />
                  <span>Disk Encryption ON</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={jailbroken}
                    onChange={(e) => setJailbroken(e.target.checked)}
                    className="rounded border-slate-700 text-rose-500 focus:ring-0"
                  />
                  <span className={jailbroken ? 'text-rose-400 font-bold' : ''}>Root / Jailbroken</span>
                </label>
              </div>

              <button
                onClick={handleAuditDevice}
                disabled={auditing}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <RefreshCw className={`w-4 h-4 ${auditing ? 'animate-spin' : ''}`} />
                {auditing ? 'Running Hardware & EDR Health Audit...' : 'Audit Device Posture'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Compliance Attestation Report
              </h3>

              {result ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                    result.compliant
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}>
                    {result.compliant ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold">{result.compliant ? 'DEVICE COMPLIANT (HEALTHY)' : 'NON-COMPLIANT — ACCESS BLOCKED'}</div>
                      <div className="text-[11px] opacity-90">Score: {result.health_score}/100 • Action: {result.quarantine_action}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Hardware Attestation:</span>
                      <span className="text-slate-200">{result.tpm_version}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>EDR Agent:</span>
                      <span className={edrStatus !== 'Disabled' ? "text-emerald-400" : "text-rose-400"}>{result.edr_telemetry}</span>
                    </div>
                    {result.issues.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800 text-rose-400">
                        <div className="font-bold mb-1">Detected Compliance Violations:</div>
                        {result.issues.map((iss: string, i: number) => (
                          <div key={i} className="text-[11px]">• {iss}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                  <Laptop className="w-6 h-6 mb-2 opacity-40 text-blue-400" />
                  Konfigurasikan parameter perangkat dan klik tombol audit untuk evaluasi postur.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Endpoint: <code className="text-cyan-400 font-mono">POST /api/v1/device/audit-posture</code></span>
              <span className="text-slate-400">Continuous Health Check</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
