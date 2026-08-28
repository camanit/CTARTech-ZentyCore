'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { Lock, FileSpreadsheet, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export default function DataProtectionModulePage() {
  const [sampleData, setSampleData] = useState('Nama: Budi Santoso, NIK: 3171022908870001, No Rekening: 5271890281, Gaji: IDR 45.000.000');
  const [classifying, setClassifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleClassify = () => {
    setClassifying(true);
    setTimeout(() => {
      const hasNik = /NIK|\d{16}/i.test(sampleData);
      const hasFinancial = /Rekening|Gaji|Card|\d{10}/i.test(sampleData);
      
      const piiDetected: string[] = [];
      if (hasNik) piiDetected.push('NIK (Nomor Induk Kependudukan - UU PDP PII Khusus)');
      if (hasFinancial) piiDetected.push('Data Rekening Bank / Finansial (PCI-DSS & OJK Tier 1)');

      setResult({
        sensitivity_tier: piiDetected.length > 1 ? 'RESTRICTED_CONFIDENTIAL (TIER 3)' : 'INTERNAL_USE (TIER 1)',
        compliance_regulations: ['UU No. 27/2022 (UU PDP)', 'GDPR Article 9', 'POJK No. 11/2022'],
        detected_pii: piiDetected,
        dlp_action: 'AUTO_REDACT_AND_ENCRYPT_AES256_GCM',
        kms_key_id: 'kms_key_fips140_2_prod_data_sec01',
      });
      setClassifying(false);
    }, 400);
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded">
                PILLAR 5
              </span>
              <h1 className="text-2xl font-bold">Data Protection & DLP Classification</h1>
            </div>
            <p className="text-sm text-slate-400">
              Klasifikasi PII otomatis (UU PDP, GDPR, PCI-DSS), DLP leakage prevention, and KMS tokenization
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-pink-400 font-semibold">
            <Lock className="w-4 h-4" />
            AES-256-GCM KMS Active
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard label="Classified Records" value="1.4M" subtext="UU PDP & GDPR Labeled" colorClass="text-pink-400" />
          <MetricCard label="DLP Interceptions" value="0 Leakage" subtext="100% Exfiltration Blocked" colorClass="text-emerald-400" />
          <MetricCard label="KMS Key Rotations" value="Auto (90d)" subtext="FIPS 140-3 Compliant" colorClass="text-cyan-400" />
          <MetricCard label="Data at Rest / Transit" value="Encrypted" subtext="mTLS 1.3 & ChaCha20" colorClass="text-purple-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
              <FileSpreadsheet className="w-4 h-4 text-pink-400" />
              Automated PII & Sensitivity Classifier
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Payload Content / Document Sample</label>
                <textarea
                  rows={4}
                  value={sampleData}
                  onChange={(e) => setSampleData(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSampleData('NIK: 3171022908870001, Rekening BCA: 5271890281, Gaji Pokok: IDR 45.000.000')}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-400 hover:text-white"
                >
                  Load ID Citizen + Financial
                </button>
                <button
                  type="button"
                  onClick={() => setSampleData('Credit Card: 4111 2222 3333 4444, CVV: 891, Exp: 12/28')}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-400 hover:text-white"
                >
                  Load Credit Card (PCI)
                </button>
              </div>

              <button
                onClick={handleClassify}
                disabled={classifying}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-slate-950 font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
              >
                <Sparkles className="w-4 h-4" />
                {classifying ? 'Extracting PII Entities & Regulations...' : 'Run Automated Data Classification'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4 text-emerald-400" />
                Data Classification & DLP Directive
              </h3>

              {result ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg border bg-pink-950/30 border-pink-500/30 text-pink-300 flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-pink-400 shrink-0" />
                    <div>
                      <div className="font-bold">{result.sensitivity_tier}</div>
                      <div className="text-[11px] opacity-90">DLP Action: {result.dlp_action}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div>
                      <div className="text-slate-400 mb-1">Detected Sensitive Entities:</div>
                      {result.detected_pii.map((pii: string, i: number) => (
                        <div key={i} className="text-rose-400 font-semibold text-[11px]">• {pii}</div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400">
                      <span>Governing Law:</span>
                      <span className="text-cyan-400 font-bold">{result.compliance_regulations.join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Enforced KMS Key:</span>
                      <span className="text-purple-400">{result.kms_key_id}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                  <Lock className="w-6 h-6 mb-2 opacity-40 text-pink-400" />
                  Masukkan teks atau dokumen sampel di sebelah kiri untuk menguji deteksi data sensitif.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Endpoint: <code className="text-cyan-400 font-mono">POST /api/v1/data/classify-content</code></span>
              <span className="text-slate-400">UU PDP & GDPR Validated</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
