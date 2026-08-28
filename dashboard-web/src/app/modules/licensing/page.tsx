'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { KeyRound, CreditCard, Sparkles, Receipt, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';
import { generateOfflineLicense } from '@/lib/api';

export default function LicensingModulePage() {
  const [tenantName, setTenantName] = useState('PT Bank Central Enterprise Tbk');
  const [tier, setTier] = useState('Enterprise');
  const [mode, setMode] = useState('AirGap');
  const [generating, setGenerating] = useState(false);
  const [licenseResult, setLicenseResult] = useState<any>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleIssueLicense = async () => {
    setGenerating(true);
    try {
      const res = await generateOfflineLicense(tenantName, tier);
      setLicenseResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (licenseResult?.license_key) {
      navigator.clipboard.writeText(licenseResult.license_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                SUPERADMIN
              </span>
              <h1 className="text-2xl font-bold">Licensing, Key Vault & Multi-Tenant Billing</h1>
            </div>
            <p className="text-sm text-slate-400">
              Penerbitan lisensi kriptografis BLAKE3, Airgap offline keys, quota meter, dan billing terintegrasi
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-400 font-semibold">
            <KeyRound className="w-4 h-4" />
            Airgap Key Vault Ready
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard label="Active Commercial Tenants" value="38" subtext="Enterprise & Government" colorClass="text-amber-400" />
          <MetricCard label="Issued API Licenses" value="142" subtext="BLAKE3 Salted Hashes" colorClass="text-cyan-400" />
          <MetricCard label="Monthly Billable MRR" value="IDR 485M" subtext="Automatic Provisioning" colorClass="text-emerald-400" />
          <MetricCard label="Airgap Nodes Active" value="16 Sites" subtext="Offline Government Vaults" colorClass="text-purple-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Key Generator */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
              <KeyRound className="w-4 h-4 text-amber-400" />
              License Key & Airgap File Generator
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tenant / Organization Legal Name</label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Entitlement Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Enterprise">💎 Enterprise Production (Unlimited API Calls + Full AI)</option>
                  <option value="Professional">🥇 Professional Tier (500,000 calls / month)</option>
                  <option value="Starter">🥈 Starter Tier (50,000 calls / month)</option>
                  <option value="Government">🏛️ Government / Military Sovereign Custom Edition</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">License Delivery Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="AirGap">🔒 Air-Gapped Offline Cryptographic Signed File (.lic)</option>
                  <option value="Cloud">☁️ Cloud SaaS Connected Key (BLAKE3 Hashed)</option>
                </select>
              </div>

              <button
                onClick={handleIssueLicense}
                disabled={generating}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? 'Signing Ed25519 & Generating Hash...' : 'Issue Cryptographically Signed License'}
              </button>

              {licenseResult && (
                <div className="mt-4 p-3.5 bg-slate-950 rounded-lg border border-amber-500/30 font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Plaintext License Key (Shown Once):</span>
                    <button
                      onClick={handleCopy}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-400 font-bold break-all">
                    {licenseResult.license_key}
                  </div>
                  <div className="text-[10px] text-slate-500 break-all">
                    BLAKE3 Stored Hash: {licenseResult.license_hash}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Billing & Invoicing Panel */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Integrated Payment & Automated Faktur Pajak
              </h3>

              <div className="text-xs text-slate-400 mb-4">
                Pilih gateway pembayaran otomatis untuk aktivasi instan kuota lisensi multi-tenant:
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-center">
                  <div className="text-cyan-400 font-bold text-xs mb-1">🇮🇩 Midtrans / Xendit</div>
                  <div className="text-[10px] text-slate-500">QRIS, Virtual Account, e-Faktur PPN 11%</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
                  <div className="text-slate-200 font-bold text-xs mb-1">🌏 Stripe Global</div>
                  <div className="text-[10px] text-slate-500">USD/EUR/SGD, Credit Card & Apple Pay</div>
                </div>
              </div>

              <button
                onClick={() => setInvoiceOpen(!invoiceOpen)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-lg transition-all text-xs flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4 text-emerald-400" />
                {invoiceOpen ? 'Hide Invoice Details' : 'Generate Mock Faktur Pajak (PPN 11%)'}
              </button>

              {invoiceOpen && (
                <div className="mt-4 p-3.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Invoice Ref:</span>
                    <span className="text-cyan-400 font-bold">INV-ZT-2026-88910</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Bill To:</span>
                    <span className="text-slate-200">{tenantName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="text-slate-200">IDR 15.000.000</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>PPN 11% (UU HPP):</span>
                    <span className="text-slate-200">IDR 1.650.000</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold">
                    <span className="text-white">Total Amount:</span>
                    <span className="text-emerald-400">IDR 16.650.000</span>
                  </div>
                  <div className="pt-2 text-emerald-400 flex items-center gap-1.5 text-[11px] font-sans font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>STATUS: PAID & PROVISIONED AUTOMATICALLY</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Endpoint: <code className="text-cyan-400 font-mono">POST /api/v1/license/validate-key</code></span>
              <span className="text-slate-400">BLAKE3 Cryptographic</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
