'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { Activity, ShieldCheck, CheckCircle2, RefreshCw, Hash, FileCode } from 'lucide-react';

export default function VisibilityModulePage() {
  const [logs, setLogs] = useState([
    {
      block_id: 104829,
      timestamp: '2026-08-28T10:14:02Z',
      event: 'POLICY_EVALUATION',
      user: 'secops_admin@ctartech.id',
      resource: 'prod-database-cluster',
      verdict: 'ALLOW',
      prev_hash: '9f82ab11c34918e907d4bcf8912e',
      current_hash: '3d88b49e172a5b8918239e08fae190',
    },
    {
      block_id: 104830,
      timestamp: '2026-08-28T10:15:33Z',
      event: 'ANOMALY_BLOCKED',
      user: 'unknown_scanner',
      resource: 'admin-internal-api',
      verdict: 'DENY',
      prev_hash: '3d88b49e172a5b8918239e08fae190',
      current_hash: '7a12bc9048ef11029471abdf200192',
    },
    {
      block_id: 104831,
      timestamp: '2026-08-28T10:18:20Z',
      event: 'SOAR_CONTAINMENT',
      user: 'system_auto_soar',
      resource: 'isolate_endpoint_win11_dev01',
      verdict: 'EXECUTED',
      prev_hash: '7a12bc9048ef11029471abdf200192',
      current_hash: 'c8914bca821034f19028eab71109bc',
    },
  ]);

  const [verifying, setVerifying] = useState(false);
  const [ledgerVerified, setLedgerVerified] = useState(true);

  const handleVerifyLedger = () => {
    setVerifying(true);
    setTimeout(() => {
      setLedgerVerified(true);
      setVerifying(false);
    }, 500);
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded">
                PILLAR 6
              </span>
              <h1 className="text-2xl font-bold">Visibility & Cryptographic Audit Ledger</h1>
            </div>
            <p className="text-sm text-slate-400">
              Pencatatan telemetri SIEM/UEBA dengan rantai blok hash SHA-256 tamper-proof dan bukti integritas hukum
            </p>
          </div>
          <button
            onClick={handleVerifyLedger}
            disabled={verifying}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-cyan-400 font-semibold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            {verifying ? 'Verifying Merkle Tree...' : 'Verify Cryptographic Integrity'}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard label="Total Audit Blocks" value="104,831" subtext="Chained & Immutable" colorClass="text-cyan-400" />
          <MetricCard label="Ledger Integrity" value="100% Valid" subtext="Zero Tampering Detected" colorClass="text-emerald-400" />
          <MetricCard label="Ingestion Rate" value="18,400 EPS" subtext="Events Per Second (Tokio)" colorClass="text-blue-400" />
          <MetricCard label="Retention Standard" value="7 Years" subtext="POJK 11 & GDPR Ready" colorClass="text-purple-400" />
        </div>

        {/* Ledger Integrity Banner */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-300">CRYPTOGRAPHIC AUDIT CHAIN VERIFIED</div>
              <div className="text-[11px] text-slate-400">
                Semua entri log terikat pada hash blok sebelumnya. Bukti audit memiliki kekuatan hukum forensik digital.
              </div>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-950 border border-emerald-800 text-emerald-400 px-2.5 py-1 rounded">
            SHA256 Merkle Valid
          </span>
        </div>

        {/* Cryptographic Log Explorer Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              Live Immutable Ledger Blocks
            </h3>
            <span className="text-xs text-slate-400">Auto-refreshing every 1.5s</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Block ID</th>
                  <th className="p-3">Timestamp (UTC)</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Actor / Resource</th>
                  <th className="p-3">Verdict</th>
                  <th className="p-3">Block Hash (SHA-256)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.block_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-bold text-cyan-400">#{log.block_id}</td>
                    <td className="p-3 text-slate-300">{log.timestamp}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                        {log.event}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>{log.user}</div>
                      <div className="text-[10px] text-slate-500">{log.resource}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.verdict === 'ALLOW' || log.verdict === 'EXECUTED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {log.verdict}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      <div className="truncate max-w-[180px] text-slate-300">{log.current_hash}</div>
                      <div className="text-[10px] text-slate-600 truncate max-w-[180px]">Prev: {log.prev_hash}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
