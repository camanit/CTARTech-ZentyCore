'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { Zap, Play, CheckCircle2, ShieldAlert, Radio, Terminal } from 'lucide-react';

export default function ResponseModulePage() {
  const [targetIp, setTargetIp] = useState('185.220.101.44');
  const [selectedPlaybook, setSelectedPlaybook] = useState('PB_RANSOMWARE_QUARANTINE');
  const [executing, setExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const handleExecutePlaybook = () => {
    setExecuting(true);
    setExecutionLogs([
      `[INIT] Dispatching SOAR Playbook: ${selectedPlaybook}...`,
      `[STEP 1] Validating incident signature and target identifier: ${targetIp}`,
    ]);

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        `[STEP 2] Pushing immediate BGP Flowspec / eBPF null-route rule...`,
        `[STEP 3] Revoking all active OAuth2 / OIDC session tokens for compromised subjects...`,
      ]);
    }, 400);

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        `[STEP 4] Sending webhook telemetry alert to SOC SIEM & Incident Response Team...`,
        `[SUCCESS] Playbook executed in 0.38s! Threat contained at perimeter.`,
      ]);
      setExecuting(false);
    }, 900);
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded">
                PILLAR 7
              </span>
              <h1 className="text-2xl font-bold">Automated Response & SOAR Playbooks</h1>
            </div>
            <p className="text-sm text-slate-400">
              Orkestrasi penahanan ancaman otomatis (Zero-Second Containment, Session Killswitch, and IP Quarantine)
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-purple-400 font-semibold">
            <Zap className="w-4 h-4" />
            Autonomous SOAR Engine Ready
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard label="Playbooks Available" value="28" subtext="Automated Remediation" colorClass="text-purple-400" />
          <MetricCard label="MTTR (Mean Response)" value="0.4s" subtext="Autonomous Containment" colorClass="text-emerald-400" />
          <MetricCard label="Revoked Tokens (24h)" value="4" subtext="Zero Lateral Access" colorClass="text-cyan-400" />
          <MetricCard label="Quarantined Subnets" value="1" subtext="Isolated to Sandbox" colorClass="text-rose-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-purple-400" />
              SOAR Incident Playbook Dispatcher
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target IP / Endpoint / User ID</label>
                <input
                  type="text"
                  value={targetIp}
                  onChange={(e) => setTargetIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Select SOAR Playbook</label>
                <select
                  value={selectedPlaybook}
                  onChange={(e) => setSelectedPlaybook(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="PB_RANSOMWARE_QUARANTINE">PB-01: Ransomware Behavioral Containment & Auto-Snapshot Restore</option>
                  <option value="PB_HONEYTOKEN_DECEPTION">PB-02: Deception Tech Honeytoken Trip & Global Attacker Blacklist</option>
                  <option value="PB_MEMORY_GUARD_TAMPER">PB-03: Memory Guard Anti-Tamper & Process Injection Kill</option>
                  <option value="PB_AI_SESSION_HIJACK">PB-04: AIControlPlane ITDR AI-Agent Token Revoke & Key Rotation</option>
                  <option value="PB_CREDENTIAL_STUFFING_KILL">PB-05: Revoke All Tokens & Force Hardware MFA Challenge</option>
                </select>

              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Playbook Actions Preview:</div>
                <div>1. Kirim perintah isolasi eBPF ke gateway firewall</div>
                <div>2. Hapus klaim sesi di Redis Cache dan database auth</div>
                <div>3. Kirim notifikasi webhook insiden ke Slack/Discord/SOC</div>
              </div>

              <button
                onClick={handleExecutePlaybook}
                disabled={executing}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                <Play className="w-4 h-4" />
                {executing ? 'Executing Autonomous Playbook...' : 'Trigger Immediate Playbook Dispatch'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
                <Terminal className="w-4 h-4 text-emerald-400" />
                SOAR Execution Telemetry Output
              </h3>

              {executionLogs.length > 0 ? (
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5 min-h-[170px] overflow-y-auto">
                  {executionLogs.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.includes('[SUCCESS]')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('[INIT]')
                          ? 'text-cyan-400 font-semibold'
                          : 'text-slate-300'
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                  <Terminal className="w-6 h-6 mb-2 opacity-40 text-purple-400" />
                  Pilih playbook dan jalankan pemicu respons untuk melihat output eksekusi SOAR.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Endpoint: <code className="text-cyan-400 font-mono">POST /api/v1/response/dispatch-playbook</code></span>
              <span className="text-slate-400">Zero-Second SOAR</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
