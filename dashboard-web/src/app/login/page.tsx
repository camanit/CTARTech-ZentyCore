'use client';

import { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'CREDENTIALS' | 'MFA_CHALLENGE'>('CREDENTIALS');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveEmail = email.trim() || 'secops_admin@ctartech.id';
    setEmail(effectiveEmail);
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Zero Trust Always Enforces Step-Up MFA
      setStep('MFA_CHALLENGE');
    }, 450);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length !== 6) {
      setErrorMsg('Masukkan 6-digit kode OTP / FIDO2 authenticator.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const authUser = {
        email: email || 'secops_admin@ctartech.id',
        role: (email || '').includes('auditor') ? 'Compliance_Auditor' : 'SecOps_Admin',
        token: 'zt_live_jwt_authenticated_' + Math.random().toString(36).substring(2, 10),
        mfaVerified: true,
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
        email: isAuditor ? 'auditor_external@pwc-audit.com' : 'secops_admin@ctartech.id',
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
        <div className="text-center mb-8">
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
                  Corporate Identity (Email / UPN)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                    placeholder="user@enterprise.id"
                  />
                  <UserCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Primary Password
                  </label>
                  <span className="text-[11px] text-cyan-400 cursor-pointer hover:underline">
                    FIDO2 Passwordless?
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                {loading ? 'Verifying Identity...' : 'Next: Verify MFA Challenge'}
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
            /* STEP 2: MFA Challenge */
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <div className="inline-flex p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2">
                  <Fingerprint className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-white">Step-Up MFA Challenge Required</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Sent to hardware authenticator for <span className="text-cyan-400 font-mono">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                  6-Digit TOTP / Hardware Security Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required
                  placeholder="000000"
                  className="w-full bg-slate-950 border border-cyan-500/40 rounded-xl py-3 text-center text-lg font-mono tracking-[8px] text-cyan-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                />
                <div className="flex justify-center mt-2">
                  <button
                    type="button"
                    onClick={() => setMfaCode('849201')}
                    className="text-[10px] text-cyan-400/80 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-md hover:bg-cyan-900/40 transition-all"
                  >
                    🎲 Klik untuk Auto-Fill OTP Demo (849201)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                {loading ? 'Attesting Hardware Key...' : 'Authorize Zero Trust Access'}
              </button>

              <button
                type="button"
                onClick={() => setStep('CREDENTIALS')}
                className="w-full text-center text-[11px] text-slate-500 hover:text-slate-300 pt-1"
              >
                ← Back to Credential Step
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

        {/* Footer info */}
        <div className="text-center mt-6 text-[11px] text-slate-500 font-medium">
          Protected by CTARTech ZentyCore Autonomous Policy Enforcement Point
        </div>
      </div>
    </div>
  );
}
