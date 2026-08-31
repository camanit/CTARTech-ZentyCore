'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Scale, ShieldCheck, ArrowLeft, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

export default function TermsOfServicePage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');

  const content = {
    EN: {
      badge: 'ENTERPRISE SERVICE AGREEMENT & TERMS',
      title: 'Terms of Service & Licensing',
      subtitle: 'Governing the use of CTARTech ZentyCore Open-Source & Enterprise Commercial Security Platform.',
      lastUpdated: 'Last Updated: August 2026',
      sections: [
        {
          title: '1. Acceptance of Terms & Dual-License Model',
          text: 'By downloading, compiling, integrating, or accessing CTARTech ZentyCore, you agree to these Terms. ZentyCore operates under a Dual-License model:',
          items: [
            'Open-Source Edition: Licensed under the GNU General Public License v3 (GPLv3) for non-commercial and community self-hosted use.',
            'Enterprise & Commercial Edition: Governed by the CTARTech Enterprise Master Agreement, providing AirGap offline validation, private closed-source Defense SDK binaries, and 24/7 dedicated SOC support.',
          ]
        },
        {
          title: '2. Service Level Agreement (SLA) & Uptime Commitments',
          items: [
            'Rust Core Policy Engine evaluates access authorization in <0.1ms with 99.99% system availability SLA for Enterprise clusters.',
            'High Availability: Support for multi-node clustering with automatic PostgreSQL failover replica and sub-second Redis session synchronization.',
            'Scheduled Maintenance: Notifications provided at least 72 hours in advance for non-emergency cloud gateway updates.',
          ]
        },
        {
          title: '3. Acceptable Use & Anti-Abuse Policy',
          text: 'Users and organizations strictly agree NOT to:',
          items: [
            'Use ZentyCore SDKs, WAF payloads, or AIControlPlane to conduct unauthorized network penetration or malicious cyber warfare.',
            'Decompile, disassemble, or reverse engineer encrypted private proprietary modules (e.g. Master Licensing Authority or signed .lic certificate structures).',
            'Distribute fraudulent license keys or bypass the BLAKE3 cryptographic rate limiter.',
          ]
        },
        {
          title: '4. Intellectual Property & AirGap Sovereign Rights',
          items: [
            'All core algorithmic architectures, SIMD AST parsers, and Zero-Knowledge verification engines remain the intellectual property of CTARTech.',
            'AirGap Perpetual Rights: Enterprise AirGap license holders possess non-revocable runtime rights for offline operation in isolated sovereign data centers.',
          ]
        },
        {
          title: '5. Limitation of Liability & Cybersecurity Warranty',
          text: 'ZentyCore provides state-of-the-art defense against OWASP Top 10, ransomware, and unauthorized lateral movement. However, because cyber threats continually evolve, no software is 100% impenetrable. CTARTech provides warranties strictly up to the SLA commitment outlined in the written Enterprise contract.',
        },
        {
          title: '6. Governing Law & Dispute Resolution',
          text: 'These Terms are governed by international commercial arbitration standards and the laws of the Republic of Indonesia. For legal inquiries, contact legal@ctartech.id.'
        }
      ]
    },
    ID: {
      badge: 'PERJANJIAN LAYANAN ENTERPRISE & SYARAT LISENSI',
      title: 'Syarat & Ketentuan Layanan',
      subtitle: 'Ketentuan penggunaan Platform Keamanan Zero Trust CTARTech ZentyCore untuk Open-Source dan Enterprise Komersial.',
      lastUpdated: 'Pembaruan Terakhir: Agustus 2026',
      sections: [
        {
          title: '1. Penerimaan Ketentuan & Model Lisensi Ganda',
          text: 'Dengan mengunduh, mengompilasi, mengintegrasikan, atau menggunakan CTARTech ZentyCore, Anda menyetujui syarat ini. ZentyCore beroperasi dengan model Lisensi Ganda (Dual-License):',
          items: [
            'Edisi Open-Source: Dilisensikan di bawah GNU General Public License v3 (GPLv3) untuk penggunaan komunitas dan mandiri non-komersial.',
            'Edisi Enterprise Komersial: Diatur oleh Perjanjian Lisensi Enterprise CTARTech, menyediakan validasi offline AirGap, SDK Defense tertutup terenkripsi, dan dukungan SOC 24/7.',
          ]
        },
        {
          title: '2. Perjanjian Tingkat Layanan (SLA) & Komitmen Ketersediaan',
          items: [
            'Rust Core Policy Engine mengevaluasi otorisasi dalam waktu <0.1ms dengan garansi uptime 99.99% untuk cluster Enterprise.',
            'High Availability: Mendukung multi-node clustering dengan failover otomatis PostgreSQL dan sinkronisasi sesi Redis dalam hitungan sub-detik.',
            'Pemeliharaan Terjadwal: Pemberitahuan diberikan sekurang-kurangnya 72 jam sebelum pemeliharaan rutin non-darurat.',
          ]
        },
        {
          title: '3. Kebijakan Penggunaan yang Diizinkan (Acceptable Use)',
          text: 'Pengguna dan organisasi dilarang keras untuk:',
          items: [
            'Menggunakan SDK ZentyCore atau modul WAF untuk aktivitas penetrasi tidak sah atau serangan siber ilegal.',
            'Mendekompilasi atau melakukan reverse engineering terhadap modul biner terenkripsi (seperti Master Authority Signing Key atau berkas sertifikat .lic).',
            'Menyebarkan kunci lisensi palsu atau memanipulasi rate limiter kriptografis BLAKE3.',
          ]
        },
        {
          title: '4. Hak Kekayaan Intelektual & Kedaulatan AirGap',
          items: [
            'Seluruh arsitektur algoritma inti, AST parser SIMD, dan mesin verifikasi Zero-Knowledge merupakan hak kekayaan intelektual CTARTech.',
            'Hak Permanen AirGap: Pemegang lisensi Enterprise AirGap memiliki hak pakai independen selamanya di data center tertutup tanpa ketergantungan server luar.',
          ]
        },
        {
          title: '5. Batasan Tanggung Jawab & Jaminan Keamanan',
          text: 'ZentyCore menyediakan pertahanan mutakhir terhadap OWASP Top 10, ransomware, dan pergerakan lateral ilegal. Namun, karena ancaman siber selalu berkembang, CTARTech memberikan jaminan performa sesuai dengan komitmen SLA yang tertuang dalam kontrak tertulis Enterprise.',
        },
        {
          title: '6. Hukum yang Mengatur & Kontak Hukum',
          text: 'Ketentuan ini tunduk pada standar arbitrase komersial internasional dan hukum Republik Indonesia. Untuk pertanyaan hukum, hubungi legal@ctartech.id.'
        }
      ]
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  lang === 'EN' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ID')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  lang === 'ID' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                ID
              </button>
            </div>

            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold tracking-wider uppercase mb-3">
            <Scale className="w-3.5 h-3.5" />
            {t.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t.title}</h1>
          <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>
          <div className="mt-2 text-xs font-mono text-slate-500">{t.lastUpdated}</div>
        </div>

        <div className="space-y-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          {t.sections.map((sec, idx) => (
            <section key={idx} className={`space-y-3 ${idx !== 0 ? 'pt-6 border-t border-slate-800/80' : ''}`}>
              <h2 className="text-base font-bold text-white">{sec.title}</h2>
              {sec.text && <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{sec.text}</p>}
              {sec.items && (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {sec.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 text-center text-xs text-slate-500">
          CTARTech ZentyCore © 2026 — Enterprise Security Agreement. All Rights Reserved.
        </div>
      </main>
    </div>
  );
}
