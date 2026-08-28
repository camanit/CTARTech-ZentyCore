'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { 
  KeyRound, 
  CreditCard, 
  Sparkles, 
  Receipt, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Users, 
  Search, 
  Building2, 
  RefreshCw, 
  AlertTriangle, 
  Power, 
  ShieldAlert 
} from 'lucide-react';
import { generateOfflineLicense } from '@/lib/api';

interface TenantRecord {
  id: string;
  name: string;
  adminEmail: string;
  tier: 'Enterprise' | 'Professional' | 'Starter' | 'Government';
  mode: 'Cloud' | 'AirGap';
  apiCallsUsed: number;
  apiCallsMax: number | string;
  status: 'ACTIVE' | 'SUSPENDED' | 'QUOTA_EXCEEDED' | 'AIRGAP_VERIFIED';
  keyHash: string;
  lastActive: string;
}

export default function LicensingModulePage() {
  const [tenantName, setTenantName] = useState('PT Bank Central Enterprise Tbk');
  const [tier, setTier] = useState('Enterprise');
  const [mode, setMode] = useState('AirGap');
  const [generating, setGenerating] = useState(false);
  const [licenseResult, setLicenseResult] = useState<any>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Multi-Tenant User Directory State
  const [tenants, setTenants] = useState<TenantRecord[]>([
    {
      id: 't-001',
      name: 'PT Bank Central Enterprise Tbk',
      adminEmail: 'budi.santoso@bce.co.id',
      tier: 'Enterprise',
      mode: 'Cloud',
      apiCallsUsed: 342810,
      apiCallsMax: 'Unlimited',
      status: 'ACTIVE',
      keyHash: 'b3_9f1a7c2e4d8b6...',
      lastActive: '2 menit lalu',
    },
    {
      id: 't-002',
      name: 'PT Fintech Nusantara Global',
      adminEmail: 'security@fintech-nusantara.id',
      tier: 'Professional',
      mode: 'Cloud',
      apiCallsUsed: 189400,
      apiCallsMax: 500000,
      status: 'ACTIVE',
      keyHash: 'b3_e2a0f8c19d4b...',
      lastActive: '5 menit lalu',
    },
    {
      id: 't-003',
      name: 'Kementerian Pertahanan Siber RI',
      adminEmail: 'airgap_admin@kemhan.go.id',
      tier: 'Government',
      mode: 'AirGap',
      apiCallsUsed: 89120,
      apiCallsMax: 'AirGap Offline',
      status: 'AIRGAP_VERIFIED',
      keyHash: 'ed25519_sig_88f91...',
      lastActive: 'Offline Airgap Node',
    },
    {
      id: 't-004',
      name: 'PT Logistik Digital Mandiri',
      adminEmail: 'devops@logistik.id',
      tier: 'Starter',
      mode: 'Cloud',
      apiCallsUsed: 48200,
      apiCallsMax: 50000,
      status: 'ACTIVE',
      keyHash: 'b3_78c1a9f02e4d...',
      lastActive: '12 menit lalu',
    },
    {
      id: 't-005',
      name: 'PT Retail Niaga Express',
      adminEmail: 'it_sec@retailniaga.co.id',
      tier: 'Starter',
      mode: 'Cloud',
      apiCallsUsed: 50110,
      apiCallsMax: 50000,
      status: 'QUOTA_EXCEEDED',
      keyHash: 'b3_11a8d4c9f7e2...',
      lastActive: '1 jam lalu',
    },
  ]);

  const handleIssueLicense = async () => {
    setGenerating(true);
    try {
      const res = await generateOfflineLicense(tenantName, tier);
      setLicenseResult(res);

      // Add to table if not existing
      const existing = tenants.find(t => t.name.toLowerCase() === tenantName.toLowerCase());
      if (!existing) {
        const newRecord: TenantRecord = {
          id: `t-${String(tenants.length + 1).padStart(3, '0')}`,
          name: tenantName,
          adminEmail: `admin@${tenantName.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.id`,
          tier: tier as any,
          mode: mode as any,
          apiCallsUsed: 0,
          apiCallsMax: tier === 'Enterprise' ? 'Unlimited' : tier === 'Professional' ? 500000 : 50000,
          status: mode === 'AirGap' ? 'AIRGAP_VERIFIED' : 'ACTIVE',
          keyHash: res.license_hash.substring(0, 16) + '...',
          lastActive: 'Baru Diterbitkan',
        };
        setTenants([newRecord, ...tenants]);
      }
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

  const toggleTenantStatus = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
        };
      }
      return t;
    }));
  };

  const rotateTenantKey = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        const randomHash = 'b3_' + Math.random().toString(36).substring(2, 14) + '...';
        return {
          ...t,
          keyHash: randomHash,
          lastActive: 'Key Baru Dirotasi'
        };
      }
      return t;
    }));
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Page Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                SUPERADMIN CONTROL PANEL
              </span>
              <h1 className="text-2xl font-bold">Licensing, Key Vault & Multi-Tenant Directory</h1>
            </div>
            <p className="text-sm text-slate-400">
              Pusat kendali seluruh tenant klien, penerbitan lisensi kriptografis BLAKE3, dan monitoring kuota pengguna
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-400 font-semibold">
            <KeyRound className="w-4 h-4" />
            Superadmin Access Active
          </div>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard label="Total Registered Tenants" value={tenants.length.toString()} subtext="Enterprise & Government" colorClass="text-amber-400" />
          <MetricCard label="Issued API Licenses" value="142" subtext="BLAKE3 Salted Hashes" colorClass="text-cyan-400" />
          <MetricCard label="Monthly Billable MRR" value="IDR 485M" subtext="Automatic Provisioning" colorClass="text-emerald-400" />
          <MetricCard label="Airgap Nodes Active" value="16 Sites" subtext="Offline Sovereign Vaults" colorClass="text-purple-400" />
        </div>

        {/* TABEL DATA PENGGUNA & MANAJEMEN TENANT */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Direktori Data Pengguna & Manajemen Tenant (Multi-Tenant)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Data real-time seluruh perusahaan klien yang terhubung ke platform ZentyCore
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama tenant / email..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/60">
                  <th className="py-3 px-3">ORGANISASI / PERUSAHAAN</th>
                  <th className="py-3 px-3">ADMIN UPN</th>
                  <th className="py-3 px-3">TIER LISENSI</th>
                  <th className="py-3 px-3">PENGGUNAAN API</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3">BLAKE3 KEY HASH</th>
                  <th className="py-3 px-3 text-right">AKSI SUPERADMIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredTenants.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                      {item.adminEmail}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        item.tier === 'Enterprise'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : item.tier === 'Government'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : item.tier === 'Professional'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {item.tier}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <span className="text-cyan-300 font-bold">{item.apiCallsUsed.toLocaleString()}</span>
                      <span className="text-slate-500"> / {typeof item.apiCallsMax === 'number' ? item.apiCallsMax.toLocaleString() : item.apiCallsMax}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'AIRGAP_VERIFIED'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : item.status === 'QUOTA_EXCEEDED'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'ACTIVE' || item.status === 'AIRGAP_VERIFIED' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">
                      {item.keyHash}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => rotateTenantKey(item.id)}
                          title="Rotasi API Key Baru"
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleTenantStatus(item.id)}
                          title={item.status === 'ACTIVE' ? 'Suspend Tenant' : 'Aktifkan Tenant'}
                          className={`p-1 rounded transition-all ${
                            item.status === 'ACTIVE'
                              ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generator & Invoicing Section */}
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

          {/* Billing & Invoicing Panel (webpay.ctar.tech) */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  CTARTech WebPay Gateway & Faktur Pajak
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  webpay.ctar.tech
                </span>
              </div>

              <div className="text-xs text-slate-400 mb-4">
                Gerbang pembayaran resmi multi-metode terpadu untuk provisioning otomatis lisensi ZentyCore:
              </div>

              <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>⚡ CTARTech WebPay Portal</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    App: wp_live_catX...yruI
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>• <strong>QRIS Instant Settlement</strong> (GoPay, OVO, Dana, ShopeePay, BCA)</div>
                  <div>• <strong>Virtual Account 24/7</strong> (BCA, Mandiri, BRI, BNI, Permata)</div>
                  <div>• <strong>Corporate Invoicing & e-Faktur PPN 11%</strong> (Otomatis)</div>
                </div>
                <a
                  href="https://webpay.ctar.tech/checkout?app_key=wp_live_catXjouorFPPv8F2sJT1EY2zQXdqyruI&item=ZentyCore+Enterprise+License&price=15000000"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Proses Pembayaran via webpay.ctar.tech</span>
                </a>
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
              <span className="text-slate-400">BLAKE3 Cryptographic Vault</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
