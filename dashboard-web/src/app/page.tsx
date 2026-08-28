'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import LogStream from '@/components/LogStream';
import { evaluateAccess } from '@/lib/api';

export default function DashboardOverview() {
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  const handleTestAccess = async () => {
    setEvaluating(true);
    try {
      const res = await evaluateAccess({
        user_id: "secops_admin@ctartech.id",
        token: "valid_jwt_claim_secops_token",
        device_id: "endpoint_win11_dev01",
        resource: "prod-database-cluster",
        ip_address: "10.0.1.25"
      });
      setEvalResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Security Operations Center</h1>
            <p className="text-sm text-slate-400">Pusat Kendali & Pemantauan Zero Trust Terpadu</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">System Operational</span>
          </div>
        </header>

        {/* Kartu Metrik Utama */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Global Risk Score"
            value="14%"
            subtext="Status: Aman / Terkendali"
            colorClass="text-emerald-400"
          />
          <MetricCard
            label="Active Sessions"
            value="1,248"
            subtext="Tervalidasi IAM & Device"
            colorClass="text-blue-400"
          />
          <MetricCard
            label="Blocked Threats"
            value="23"
            subtext="Dalam 24 jam terakhir"
            colorClass="text-amber-400"
          />
          <MetricCard
            label="Compliance Score"
            value="99%"
            subtext="NIST, GDPR, OJK, SOC2"
            colorClass="text-purple-400"
          />
        </div>

        {/* Live Evaluator Action */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Live Zero Trust Policy Test</h3>
            <p className="text-xs text-slate-400">Simulasikan permintaan akses ke Unified Rust Backend Gateway (:8080)</p>
          </div>
          <button
            onClick={handleTestAccess}
            disabled={evaluating}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-sm"
          >
            {evaluating ? "Evaluating..." : "Run Policy Evaluation"}
          </button>
        </div>

        {evalResult && (
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-5 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-cyan-400">Policy Evaluation Result:</span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${evalResult.allowed ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                {evalResult.allowed ? "ACCESS GRANTED" : "ACCESS DENIED"}
              </span>
            </div>
            <p className="text-xs text-slate-300">{evalResult.reason}</p>
          </div>
        )}

        {/* Panel Log / Aktivitas Sistem */}
        <LogStream />
      </main>
    </div>
  );
}
