'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { Network, ShieldAlert, CheckCircle, Flame, ArrowRight } from 'lucide-react';

export default function NetworkModulePage() {
  const [srcIp, setSrcIp] = useState('10.0.1.25');
  const [destSegment, setDestSegment] = useState('Prod_PCI_Database_Cluster (10.0.50.0/24)');
  const [protocol, setProtocol] = useState('TCP/5432 (PostgreSQL)');
  const [isQuarantined, setIsQuarantined] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestPacket = () => {
    setTesting(true);
    setTimeout(() => {
      const isBlocked = isQuarantined || srcIp.startsWith('192.168.99.') || srcIp.startsWith('185.220.');
      setResult({
        allowed: !isBlocked,
        source: srcIp,
        destination: destSegment,
        protocol: protocol,
        action: !isBlocked ? 'PERMIT_mTLS_ENCAPSULATED' : 'DROP_WITH_RESET',
        policy_hit: !isBlocked ? 'RULE_ZTNA_FINANCE_DB_ALLOW' : 'RULE_EMERGENCY_ISOLATION_DROP',
        latency_ms: '0.42ms (Rust eBPF/WireGuard)',
      });
      setTesting(false);
    }, 400);
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">
                PILLAR 3
              </span>
              <h1 className="text-2xl font-bold">Network Security & Microsegmentation</h1>
            </div>
            <p className="text-sm text-slate-400">
              ZTNA perimeter-less tunnels, mTLS virtual microsegmentation, and dynamic firewall rules
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-indigo-400 font-semibold">
            <Network className="w-4 h-4" />
            ZTNA WireGuard Mesh Active
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard label="Virtual Microsegments" value="48" subtext="Isolasi Lateral Movement" colorClass="text-indigo-400" />
          <MetricCard label="Active ZTNA Tunnels" value="1,820" subtext="mTLS Ephemeral Sessions" colorClass="text-cyan-400" />
          <MetricCard label="Firewall Rules Evaluated" value="2.4M/s" subtext="Rust eBPF Core Speed" colorClass="text-emerald-400" />
          <MetricCard label="Lateral Probes Blocked" value="14" subtext="Zero Unauthorized East-West" colorClass="text-purple-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
              <Network className="w-4 h-4 text-indigo-400" />
              Microsegmentation Packet & Flow Tester
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Source Client IP / Subnet</label>
                <input
                  type="text"
                  value={srcIp}
                  onChange={(e) => setSrcIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Destination Workload Segment</label>
                <select
                  value={destSegment}
                  onChange={(e) => setDestSegment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Prod_PCI_Database_Cluster (10.0.50.0/24)">Prod_PCI_Database_Cluster (10.0.50.0/24) - High Security</option>
                  <option value="Internal_API_Gateway (10.0.10.0/24)">Internal_API_Gateway (10.0.10.0/24)</option>
                  <option value="DMZ_Public_Web (172.16.1.0/24)">DMZ_Public_Web (172.16.1.0/24)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Protocol & Destination Port</label>
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="TCP/5432 (PostgreSQL)">TCP/5432 (PostgreSQL mTLS)</option>
                  <option value="TCP/443 (HTTPS REST)">TCP/443 (HTTPS REST API)</option>
                  <option value="TCP/22 (SSH Management)">TCP/22 (SSH Admin - JIT Only)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isQuarantined}
                    onChange={(e) => setIsQuarantined(e.target.checked)}
                    className="rounded border-slate-700 text-rose-500 focus:ring-0"
                  />
                  <span className={isQuarantined ? 'text-rose-400 font-bold' : ''}>
                    Simulate Host in Quarantine (SOAR Isolate)
                  </span>
                </label>
              </div>

              <button
                onClick={handleTestPacket}
                disabled={testing}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                <Flame className="w-4 h-4" />
                {testing ? 'Evaluating Microsegment Policy...' : 'Inject Test Packet & Evaluate Flow'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
                <Flame className="w-4 h-4 text-amber-400" />
                Network Flow & Policy Action
              </h3>

              {result ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                    result.allowed
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}>
                    {result.allowed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold">{result.allowed ? 'PACKET PERMITTED (ZTNA TUNNEL ESTABLISHED)' : 'PACKET DROPPED — POLICY VIOLATION'}</div>
                      <div className="text-[11px] opacity-90">{result.action} • {result.latency_ms}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>{result.source}</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                      <span className="truncate max-w-[200px]">{result.destination}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                      <span>Matched Rule:</span>
                      <span className="text-cyan-400">{result.policy_hit}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                  <Network className="w-6 h-6 mb-2 opacity-40 text-indigo-400" />
                  Pilih segmentasi tujuan dan jalankan simulasi paket aliran jaringan.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Endpoint: <code className="text-cyan-400 font-mono">POST /api/v1/network/evaluate-flow</code></span>
              <span className="text-slate-400">Zero Lateral Movement</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
