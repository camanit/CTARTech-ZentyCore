'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { Cpu, Sparkles, Brain, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { evaluateAiRisk } from '@/lib/api';

export default function AiModulePage() {
  const [userId, setUserId] = useState('user_dev_091@ctartech.id');
  const [ipAddress, setIpAddress] = useState('185.220.101.5');
  const [geoCity, setGeoCity] = useState('Frankfurt (Exit Node)');
  const [loginHour, setLoginHour] = useState(2); // 02:00 AM (off-hours)
  const [requestRate, setRequestRate] = useState(180); // 180 req/min (high velocity)
  const [sensitiveTouch, setSensitiveTouch] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculateRisk = async () => {
    setCalculating(true);
    try {
      const res = await evaluateAiRisk({
        user_id: userId,
        ip_address: ipAddress,
        geo_city: geoCity,
        login_hour: loginHour,
        request_rate_per_min: requestRate,
        sensitive_resource_accessed: sensitiveTouch,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded">
                AI ENGINE
              </span>
              <h1 className="text-2xl font-bold">AI Threat Intelligence & UEBA Risk Scorer</h1>
            </div>
            <p className="text-sm text-slate-400">
              Analisis perilaku adaptif real-time (0–100 Risk Score) berbasis heuristik dan Machine Learning
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-cyan-400 font-semibold">
            <Brain className="w-4 h-4" />
            AI Model Engine Active
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard label="Known Threat Patterns" value="45,219" subtext="Real-time IOC Feed" colorClass="text-cyan-400" />
          <MetricCard label="CVE Data Bank" value="180,432" subtext="Auto-Vulnerability Match" colorClass="text-blue-400" />
          <MetricCard label="Anomaly Detection MTTA" value="0.08s" subtext="Sub-second Inference" colorClass="text-purple-400" />
          <MetricCard label="Autonomous Decision" value="Active" subtext="Adaptive Policy Engine" colorClass="text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Live Behavioral Signal Simulator (UEBA)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">User Subject ID</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">IP Address</label>
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Geo Location</label>
                  <input
                    type="text"
                    value={geoCity}
                    onChange={(e) => setGeoCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Login Hour: <span className="text-cyan-400 font-mono">{String(loginHour).padStart(2, '0')}:00</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={23}
                    value={loginHour}
                    onChange={(e) => setLoginHour(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Req Rate: <span className="text-cyan-400 font-mono">{requestRate} /min</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    value={requestRate}
                    onChange={(e) => setRequestRate(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={sensitiveTouch}
                    onChange={(e) => setSensitiveTouch(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Touch Restricted / Critical Vault Resource</span>
                </label>
              </div>

              <button
                onClick={handleCalculateRisk}
                disabled={calculating}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Sparkles className="w-4 h-4" />
                {calculating ? 'Running Neural & UEBA Scorer...' : 'Calculate AI Risk & Detect Anomalies'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4 text-purple-400" />
                AI Risk Assessment Verdict
              </h3>

              {result ? (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl border bg-slate-950 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Dynamic AI Risk Score</div>
                      <div className={`text-3xl font-extrabold ${
                        result.risk_score <= 30 ? 'text-emerald-400' : result.risk_score <= 60 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {result.risk_score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                      result.risk_tier === 'LOW' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      result.risk_tier === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {result.risk_tier} RISK
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-sans text-[11px] font-bold">Detected Behavioral Anomalies:</div>
                    {result.detected_anomalies.length > 0 ? (
                      result.detected_anomalies.map((anom: string, i: number) => (
                        <div key={i} className="text-rose-400 text-[11px] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{anom}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-emerald-400 text-[11px] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>No abnormal behavioral patterns found. Activity matches standard baseline.</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 text-slate-400">
                      <span className="font-sans font-bold">Recommended Zero Trust Action: </span>
                      <span className="text-cyan-400">{result.recommended_action}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                  <Brain className="w-6 h-6 mb-2 opacity-40 text-cyan-400" />
                  Sesuaikan parameter sinyal perilaku dan klik tombol kalkulasi untuk evaluasi AI.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Endpoint: <code className="text-cyan-400 font-mono">POST /api/v1/ai/evaluate-risk</code></span>
              <span className="text-slate-400">Continuous Risk Profiling</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
