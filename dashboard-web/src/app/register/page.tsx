'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Building2, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  KeyRound, 
  Sparkles,
  Fingerprint
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !orgName) {
      setErrorMsg('Harap lengkapi semua kolom pendaftaran.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password minimal harus 8 karakter.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      // Send welcome / verification OTP via KaoWhat WhatsApp API if WA number provided
      if (waNumber) {
        try {
          await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              channel: 'whatsapp',
              recipient: waNumber,
              otp: Math.floor(100000 + Math.random() * 900000).toString(),
            }),
          });
        } catch (e) {
          console.warn('WA OTP dispatch warning (non-fatal):', e);
        }
      }

      // Save user record in local registered database
      const newUser = {
        fullName,
        email,
        orgName,
        waNumber: waNumber || '082129745115',
        role: 'Tenant Admin',
        tier: 'Community Free (Upgradable)',
        registeredAt: new Date().toISOString(),
      };

      localStorage.setItem('zentycore_auth_user', JSON.stringify({
        email: newUser.email,
        name: newUser.fullName,
        org: newUser.orgName,
        role: newUser.role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        loginTime: new Date().toISOString(),
      }));

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-lg z-10 my-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-xl shadow-cyan-500/20 mb-3 border border-cyan-400/30">
            <ShieldCheck className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
            Registrasi Akun <span className="text-cyan-400">ZentyCore</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Buat akun tenant Zero Trust & aktifkan proteksi AI UEBA untuk organisasi Anda
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-7 shadow-2xl shadow-black/60">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white">PENDAFTARAN BERHASIL!</h3>
              <p className="text-xs text-emerald-300">
                Akun Zero Trust untuk <strong>{orgName}</strong> telah aktif. Mengalihkan ke Dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Lengkap Admin
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Budi Santoso"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <UserCheck className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Perusahaan / Organisasi
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                      placeholder="PT Solusi Data Mandiri"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <Building2 className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Resmi Perusahaan
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@perusahaan.co.id"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nomor WhatsApp (Untuk OTP MFA)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      placeholder="082129745115"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kata Sandi Utama
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Minimal 8 karakter"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Ulangi kata sandi"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="agree" className="text-[11px] text-slate-400 leading-snug cursor-pointer">
                  Saya menyetujui <Link href="/landing#terms-privacy" className="text-cyan-400 hover:underline">Syarat & Ketentuan Lisensi</Link> serta <Link href="/landing#terms-privacy" className="text-cyan-400 hover:underline">Kebijakan Privasi Zero-Knowledge UU PDP</Link>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Mendaftarkan Tenant & Kunci...' : 'Daftar Akun Tenant Baru'}
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <span>Sudah memiliki akun terdaftar?</span>
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline">
              Masuk ke Portal ↗
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-[11px] text-slate-500">
          CTARTech ZentyCore © 2026 — Zero Trust Identity Plane
        </div>
      </div>
    </div>
  );
}
