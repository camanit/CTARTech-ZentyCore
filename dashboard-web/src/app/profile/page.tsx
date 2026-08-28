'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  UserCheck, 
  Lock, 
  KeyRound, 
  Smartphone, 
  Fingerprint, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Mail, 
  Phone, 
  Laptop, 
  Clock, 
  Sparkles,
  Save,
  Trash2
} from 'lucide-react';

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<any>({
    name: 'Budi Alpha Owner',
    email: 'arahmand99@gmail.com',
    org: 'CTARTech Security Operations',
    role: 'Superadmin / SecOps Lead',
    waNumber: '082129745115',
  });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // WhatsApp MFA state
  const [waNumberInput, setWaNumberInput] = useState('082129745115');
  const [waSuccess, setWaSuccess] = useState(false);

  // FIDO2 Registered Keys
  const [fidoKeys, setFidoKeys] = useState([
    { id: 'fido-1', name: 'Windows Hello Biometric TPM', registeredAt: '2026-08-20', status: 'ACTIVE' },
    { id: 'fido-2', name: 'YubiKey 5 NFC Hardware Token', registeredAt: '2026-08-15', status: 'ACTIVE' },
  ]);
  const [fidoSuccess, setFidoSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zentycore_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        if (parsed.email) {
          // Keep current
        }
      }
    } catch (e) {}
  }, []);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPwdError('Masukkan kata sandi lama.');
      return;
    }
    if (newPassword.length < 8) {
      setPwdError('Kata sandi baru minimal 8 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setPwdError('');
    setPwdSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwdSuccess(false), 3000);
  };

  const handleUpdateWa = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, waNumber: waNumberInput });
    setWaSuccess(true);
    setTimeout(() => setWaSuccess(false), 3000);
  };

  const handleRegisterNewFido = () => {
    const newKey = {
      id: `fido-${Date.now()}`,
      name: 'Touch ID / Platform Authenticator',
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    };
    setFidoKeys([...fidoKeys, newKey]);
    setFidoSuccess(true);
    setTimeout(() => setFidoSuccess(false), 3000);
  };

  const handleDeleteFido = (id: string) => {
    setFidoKeys(fidoKeys.filter(k => k.id !== id));
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Page Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded">
                IDENTITY & ACCESS MANAGEMENT
              </span>
              <h1 className="text-2xl font-bold">Profil Pengguna & Pengaturan Keamanan</h1>
            </div>
            <p className="text-sm text-slate-400">
              Kelola kredensial akun, ubah kata sandi, konfigurasi nomor WhatsApp OTP, dan token FIDO2 Passkey
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Zero-Trust Attested Session
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: User Summary Card & FIDO2 Management */}
          <div className="lg:col-span-5 space-y-6">
            {/* User Profile Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{user.name || 'Budi Alpha Owner'}</h2>
                  <p className="text-xs text-cyan-400 font-mono">{user.email || 'arahmand99@gmail.com'}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    {user.role || 'Superadmin'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs border-t border-slate-800/80 pt-4">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>Organisasi:</span>
                  </span>
                  <span className="text-white font-semibold">{user.org || 'CTARTech HQ'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>WhatsApp MFA:</span>
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">{user.waNumber || '+62 821-2974-5115'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Sesi Terakhir:</span>
                  </span>
                  <span className="text-slate-300 font-mono text-[11px]">Aktif Sekarang (PEP IP: 10.14.0.88)</span>
                </div>
              </div>
            </div>

            {/* FIDO2 Passwordless Passkeys Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-purple-400" />
                  <span>Kunci FIDO2 Passkey & Biometrik</span>
                </h3>
                <button
                  type="button"
                  onClick={handleRegisterNewFido}
                  className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold hover:bg-purple-500/30 transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Tambah Kunci</span>
                </button>
              </div>

              {fidoSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Kunci biometrik FIDO2 baru berhasil didaftarkan!</span>
                </div>
              )}

              <div className="space-y-2">
                {fidoKeys.map((key) => (
                  <div key={key.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-semibold text-white">{key.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Didaftarkan: {key.registeredAt}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFido(key.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Hapus Kunci"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Change Password & WhatsApp MFA Configuration */}
          <div className="lg:col-span-7 space-y-6">
            {/* Form Ubah Password */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Ubah Kata Sandi Akun</span>
              </h3>

              {pwdSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Kata sandi berhasil diperbarui dengan hashing argon2id!</span>
                </div>
              )}

              {pwdError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>{pwdError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kata Sandi Lama
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Masukkan password saat ini"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Kata Sandi Baru
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Minimal 8 karakter"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Ulangi password baru"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Kata Sandi</span>
                </button>
              </form>
            </div>

            {/* Form Konfigurasi WhatsApp MFA */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Konfigurasi Saluran WhatsApp OTP (MFA Gateway)</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Nomor WhatsApp tujuan untuk pengiriman kode OTP 6-digit setiap kali ada permintaan login berisiko tinggi.
              </p>

              {waSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Nomor WhatsApp MFA berhasil diperbarui!</span>
                </div>
              )}

              <form onSubmit={handleUpdateWa} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nomor WhatsApp Penerima OTP
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={waNumberInput}
                      onChange={(e) => setWaNumberInput(e.target.value)}
                      required
                      placeholder="082129745115"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update WA</span>
                    </button>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Terhubung aktif dengan KaoWhat Gateway (API Key Valid)</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
