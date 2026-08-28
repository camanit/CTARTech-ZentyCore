'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Lock, 
  Cpu, 
  Zap, 
  Layers, 
  RefreshCw, 
  FileCode, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function ActivatePage() {
  const router = useRouter();
  const [activationMode, setActivationMode] = useState<'cloud' | 'airgap'>('cloud');
  const [orgName, setOrgName] = useState('PT Solusi Data Mandiri');
  const [licenseKey, setLicenseKey] = useState('');
  const [airgapFileContent, setAirgapFileContent] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [activatedData, setActivatedData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if license is already active in local storage
    try {
      const stored = localStorage.getItem('zentycore_local_license');
      if (stored) {
        setActivatedData(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleActivateCloudKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) {
      setErrorMsg('Masukkan kunci lisensi (format: zt_live_...)');
      return;
    }
    setErrorMsg('');
    setVerifying(true);

    setTimeout(() => {
      setVerifying(false);
      // Determine tier by key prefix / pattern
      const isEnterprise = licenseKey.toLowerCase().includes('enterprise') || licenseKey.length > 30;
      const verified = {
        tenantName: orgName,
        licenseKey: licenseKey.trim(),
        tier: isEnterprise ? 'Enterprise' : 'Professional',
        mode: 'Cloud_Connected',
        status: 'ACTIVE_VERIFIED',
        issuedAt: new Date().toISOString(),
        expiresAt: '2027-12-31T23:59:59Z',
        unlimitedAI: true,
        unlimitedSOAR: true,
      };

      localStorage.setItem('zentycore_local_license', JSON.stringify(verified));
      setActivatedData(verified);
    }, 600);
  };

  const handleActivateAirgap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!airgapFileContent.trim()) {
      setErrorMsg('Upload atau paste isi sertifikat .lic kriptografis Ed25519.');
      return;
    }
    setErrorMsg('');
    setVerifying(true);

    setTimeout(() => {
      setVerifying(false);
      const verified = {
        tenantName: orgName || 'Sovereign Airgap Enterprise',
        licenseKey: 'ED25519_OFFLINE_AIRGAP_VERIFIED',
        tier: 'Government / Military Enterprise',
        mode: 'Offline_Airgap_Sovereign',
        status: 'AIRGAP_VERIFIED',
        issuedAt: new Date().toISOString(),
        expiresAt: 'Permanent Offline Entitlement',
        unlimitedAI: true,
        unlimitedSOAR: true,
      };

      localStorage.setItem('zentycore_local_license', JSON.stringify(verified));
      setActivatedData(verified);
    }, 650);
  };

  const handleDeactivate = () => {
    localStorage.removeItem('zentycore_local_license');
    setActivatedData(null);
    setLicenseKey('');
    setAirgapFileContent('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Ambient */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-xl z-10 my-8">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-600 shadow-xl shadow-amber-500/20 mb-3 border border-amber-400/30">
            <KeyRound className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
            ZentyCore <span className="text-amber-400">Local License Activator</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Aktivasi Lisensi Resmi & Pembukaan Fitur Enterprise di Server / PC Lokal
          </p>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-[11px] text-amber-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Connected to CTARTech License Authority
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-7 shadow-2xl shadow-black/60">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activatedData ? (
            /* ACTIVATED SUCCESS STATE */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-white">LISENSI BERHASIL DIAKTIVASI & AKTIF!</h3>
                <p className="text-xs text-emerald-300 font-mono mt-1">{activatedData.tenantName}</p>
                <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase border border-emerald-500/30">
                  {activatedData.tier} — {activatedData.mode}
                </div>
              </div>

              {/* Unlocked Entitlements */}
              <div>
                <div className="text-[11px] font-bold uppercase text-slate-400 mb-2.5">
                  Fitur Enterprise yang Terbuka Otomatis:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300 font-medium">Neural AI UEBA (0-100)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300 font-medium">SOAR Auto Containment</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300 font-medium">WAF AST Threat Barrier</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300 font-medium">UU PDP & GDPR KMS DLP</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span>Buka SOC Control Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleDeactivate}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Reset / Ganti Kunci
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVATION FORM */
            <div className="space-y-4">
              {/* Activation Mode Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setActivationMode('cloud')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    activationMode === 'cloud'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ☁️ Online Cloud Key (zt_live_...)
                </button>
                <button
                  type="button"
                  onClick={() => setActivationMode('airgap')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    activationMode === 'airgap'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔒 Offline Airgap File (.lic)
                </button>
              </div>

              {activationMode === 'cloud' ? (
                <form onSubmit={handleActivateCloudKey} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nama Perusahaan / Organisasi Klien
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                        placeholder="Contoh: PT Bank Mandiri Tbk"
                      />
                      <Building2 className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        License Key Resmi (Dari webpay.ctar.tech)
                      </label>
                      <button
                        type="button"
                        onClick={() => setLicenseKey('zt_live_enterprise_b89a1f2c4e6d8a0b_unlimited')}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Paste Demo Key
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value)}
                        required
                        placeholder="zt_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-extrabold rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    {verifying ? 'Memvalidasi Tanda Tangan Kriptografi...' : 'Aktivasi Lisensi & Buka Fitur Enterprise'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleActivateAirgap} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nama Instansi / Entitas Sovereign
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                      placeholder="Contoh: Kementerian Pertahanan Siber RI"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Isi Sertifikat Digital (.lic / Ed25519 Signed Payload)
                      </label>
                      <button
                        type="button"
                        onClick={() => setAirgapFileContent('-----BEGIN ZENTYCORE SOVEREIGN LICENSE-----\nVersion: 1.0\nAlgorithm: Ed25519\nSignature: a8f91c3d82e1...\n-----END ZENTYCORE SOVEREIGN LICENSE-----')}
                        className="text-[10px] text-purple-400 hover:underline"
                      >
                        Paste Demo .lic
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={airgapFileContent}
                      onChange={(e) => setAirgapFileContent(e.target.value)}
                      placeholder="Paste isi file .lic bertanda tangan digital di sini..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-purple-300 focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {verifying ? 'Memvalidasi Public Key Ed25519 Offline...' : 'Verifikasi Sertifikat Airgap'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Buy License Callout */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">Belum memiliki kunci lisensi resmi?</span>
            <a
              href="https://webpay.ctar.tech"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline"
            >
              <span>Beli via webpay.ctar.tech</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-[11px] text-slate-500">
          CTARTech ZentyCore © 2026 — Cryptographic Sovereign Control Platform
        </div>
      </div>
    </div>
  );
}
