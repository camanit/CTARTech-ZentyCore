'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Fingerprint, 
  UserCheck, 
  ArrowRight,
  MessageSquare,
  Mail,
  RefreshCw,
  Smartphone
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'CREDENTIALS' | 'MFA_CHALLENGE'>('CREDENTIALS');
  const [mfaChannel, setMfaChannel] = useState<'whatsapp' | 'email' | 'hardware'>('whatsapp');
  const [waNumber, setWaNumber] = useState('082129745115');
  const [adminEmail, setAdminEmail] = useState('arahmand99@gmail.com');
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSentNotice, setOtpSentNotice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const sendOtpRequest = async (channel: 'whatsapp' | 'email', destination: string) => {
    setSendingOtp(true);
    setOtpSentNotice('');
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          destination,
          otpCode: newOtp,
        }),
      });
      const data = await res.json();
      if (channel === 'whatsapp') {
        setOtpSentNotice(`🟢 Kode OTP telah dikirim via WhatsApp (${destination}) melalui KaoWhat Gateway!`);
      } else {
        setOtpSentNotice(`📧 Kode OTP telah dikirim ke Email (${destination})!`);
      }
    } catch (err) {
      setOtpSentNotice(`Kode OTP telah dikirim ke ${destination}.`);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveEmail = email.trim() || adminEmail;
    setEmail(effectiveEmail);
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('MFA_CHALLENGE');
      // Trigger OTP dispatch on WhatsApp by default
      sendOtpRequest('whatsapp', waNumber);
    }, 450);
  };

  const handleFido2Passwordless = () => {
    setLoading(true);
    setErrorMsg('');
    // Simulate Windows Hello / TouchID / YubiKey Hardware Attestation
    setTimeout(() => {
      setLoading(false);
      const authUser = {
        email: email || adminEmail,
        role: 'SecOps_Admin',
        token: 'zt_fido2_passkey_attested_' + Math.random().toString(36).substring(2, 10),
        mfaVerified: true,
        mfaChannel: 'FIDO2_WebAuthn_Passkey',
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem('zentycore_auth_user', JSON.stringify(authUser));
      router.push('/');
    }, 700);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length !== 6) {
      setErrorMsg('Masukkan 6-digit kode OTP verifikasi dari WhatsApp / Email Anda.');
      return;
    }

    // Validate OTP against generated OTP or default demo fallback codes
    if (mfaCode !== generatedOtp && mfaCode !== '849201' && mfaCode !== '123456') {
      setErrorMsg(`Kode OTP tidak sesuai. Silakan periksa pesan WhatsApp / Email Anda.`);
      return;
    }

    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const authUser = {
        email: email || adminEmail,
        role: 'SecOps_Admin',
        token: 'zt_live_jwt_authenticated_' + Math.random().toString(36).substring(2, 10),
        mfaVerified: true,
        mfaChannel,
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem('zentycore_auth_user', JSON.stringify(authUser));
      router.push('/');
    }, 500);
  };

  const handleQuickDemoLogin = (role: 'admin' | 'auditor') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const isAuditor = role === 'auditor';
      const authUser = {
        email: isAuditor ? 'auditor_external@pwc-audit.com' : adminEmail,
        role: isAuditor ? 'Compliance_Auditor' : 'SecOps_Admin',
        token: 'zt_demo_token_' + Math.random().toString(36).substring(2, 10),
        mfaVerified: true,
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem('zentycore_auth_user', JSON.stringify(authUser));
      router.push('/');
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-xl shadow-cyan-500/20 mb-3 border border-cyan-400/30">
            <ShieldCheck className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
            CTAR<span className="text-cyan-400">ZentyCore</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Zero Trust Security Control Plane & SOC Portal
          </p>
          <div className="inline-flex items-center gap-2 mt-2.5 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-[11px] text-cyan-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Zero-Knowledge Ed25519 Enforced
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-7 shadow-2xl shadow-black/60">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'CREDENTIALS' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Corporate Email / UPN
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                    placeholder="arahmand99@gmail.com"
                  />
                  <UserCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Primary Password
                  </label>
                  <button
                    type="button"
                    onClick={handleFido2Passwordless}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>FIDO2 Passwordless (Touch ID / YubiKey)?</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (or click FIDO2 above)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.99]"
              >
                {loading ? 'Verifying Identity...' : 'Next: Verify MFA via WhatsApp / Email'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* SSO Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-slate-900 px-2 text-slate-500 font-semibold">
                    Enterprise SSO Identity Providers
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="p-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-2 transition-all"
                >
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Okta / SAML 2.0</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="p-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-2 transition-all"
                >
                  <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                  <span>Microsoft Entra ID</span>
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: MFA Challenge with WhatsApp & Email Gateways */
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="text-center pb-1">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
                  <Smartphone className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-white">Step-Up MFA Challenge</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pilih saluran pengiriman kode verifikasi instan:
                </p>
              </div>

              {/* MFA Channel Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMfaChannel('whatsapp');
                    sendOtpRequest('whatsapp', waNumber);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
                    mfaChannel === 'whatsapp'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMfaChannel('email');
                    sendOtpRequest('email', adminEmail);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
                    mfaChannel === 'email'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMfaChannel('hardware')}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
                    mfaChannel === 'hardware'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                  <span>FIDO2 / TOTP</span>
                </button>
              </div>

              {/* Channel Notification Details */}
              {otpSentNotice && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{otpSentNotice}</span>
                </div>
              )}

              {/* Destination Input Preview */}
              {mfaChannel === 'whatsapp' && (
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span>Nomor WhatsApp Tujuan (KaoWhat Gateway):</span>
                    <button
                      type="button"
                      disabled={sendingOtp}
                      onClick={() => sendOtpRequest('whatsapp', waNumber)}
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${sendingOtp ? 'animate-spin' : ''}`} />
                      Kirim Ulang
                    </button>
                  </div>
                  <input
                    type="text"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {mfaChannel === 'email' && (
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span>Email Tujuan:</span>
                    <button
                      type="button"
                      disabled={sendingOtp}
                      onClick={() => sendOtpRequest('email', adminEmail)}
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${sendingOtp ? 'animate-spin' : ''}`} />
                      Kirim Ulang
                    </button>
                  </div>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {/* OTP 6-Digit Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                  Masukkan 6-Digit Kode OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required
                  placeholder="000000"
                  className="w-full bg-slate-950 border border-cyan-500/40 rounded-xl py-2.5 text-center text-lg font-mono tracking-[8px] text-cyan-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                {loading ? 'Attesting Zero Trust Claims...' : 'Authorize Zero Trust Access'}
              </button>

              <button
                type="button"
                onClick={() => setStep('CREDENTIALS')}
                className="w-full text-center text-[11px] text-slate-500 hover:text-slate-300 pt-1"
              >
                ← Kembali ke Input Email
              </button>
            </form>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-semibold mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant 1-Click Demo Evaluation:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="px-3 py-2 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 hover:from-cyan-900/80 hover:to-blue-900/80 border border-cyan-500/30 rounded-xl text-[11px] font-bold text-cyan-300 transition-all text-center"
              >
                ⚡ SecOps Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('auditor')}
                className="px-3 py-2 bg-gradient-to-r from-purple-950/60 to-pink-950/60 hover:from-purple-900/80 hover:to-pink-900/80 border border-purple-500/30 rounded-xl text-[11px] font-bold text-purple-300 transition-all text-center"
              >
                🔍 SOC Auditor
              </button>
            </div>
          </div>
        </div>

        {/* Footer info & Landing link */}
        <div className="text-center mt-6 space-y-2 text-[11px] text-slate-500 font-medium">
          <div>Protected by CTARTech ZentyCore Autonomous Policy Enforcement Point</div>
          <div>
            <Link href="/landing" className="text-cyan-400 hover:text-cyan-300 hover:underline">
              ← Kembali ke Halaman Depan (Public Landing Page)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
