'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Globe, FileText, CheckCircle2, ArrowLeft, Building2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');

  const content = {
    EN: {
      badge: 'LEGAL & DATA PROTECTION COMPLIANCE',
      title: 'Global Privacy Policy',
      subtitle: 'Compliant with EU GDPR, US CCPA/CPRA, and Indonesian Personal Data Protection Act (UU PDP No. 27/2022).',
      lastUpdated: 'Last Updated: August 2026',
      introTitle: '1. Commitment to Zero-Knowledge & Data Sovereignty',
      introText: 'CTARTech ZentyCore ("ZentyCore", "we", "our") is architected with a strict "Never Trust, Always Verify" philosophy. We operate on a Zero-Knowledge & Data Minimization model. We never inspect, store, or sell unencrypted customer payloads, sensitive database records, or unmasked credentials.',
      sections: [
        {
          title: '2. Data Processed by the Zero Trust Control Plane',
          items: [
            'Cryptographic identity token claims (e.g. Ed25519 signatures, hashed user identifiers, dynamic RBAC/ABAC role claims).',
            'Device posture health telemetry (e.g. TPM 2.0 attestation state, BitLocker/LUKS encryption status, EDR agent version).',
            'Network metadata (source IP, microsegment target zone, requested port, TLS cipher suite).',
            'Cryptographic Audit Logs (SHA-256 block hashes, Merkle roots, time-stamped access decisions).',
          ]
        },
        {
          title: '3. Data Sovereignty & AirGap On-Premise Rights',
          items: [
            'For Enterprise AirGap & Self-Hosted deployments: 100% of telemetry, log ledgers, and master encryption keys remain entirely within the customer data center perimeter.',
            'Zero external telemetry callback: AirGap nodes function 100% offline without communicating with CTARTech central servers.',
            'Customers maintain absolute legal and technological sovereignty over their operational data.',
          ]
        },
        {
          title: '4. Legal Compliance Mapping (UU PDP & GDPR)',
          items: [
            'EU GDPR (Articles 25, 32 & 33): Privacy by Design, automated 72-hour breach isolation notification readiness, and end-to-end encryption.',
            'UU PDP No. 27/2022 (Indonesia): Mandatory personal data anonymization, strict access control, and encrypted audit trail retention.',
            'Data Subject Rights: Authorized data subjects may request access, rectification, or erasure of non-immutable metadata through their designated tenant SecOps administrator.',
          ]
        },
        {
          title: '5. Security Measures & Encryption Standards',
          items: [
            'Data in Transit: Encrypted using TLS 1.3 / mTLS with modern elliptic curve ciphers (ECDHE-ECDSA-AES256-GCM).',
            'Data at Rest: Encrypted using AES-256-GCM and BLAKE3 cryptographic hashing.',
            'Audit Ledger: Cryptographically chained using SHA-256 Merkle trees to guarantee anti-tamper immutability.',
          ]
        },
        {
          title: '6. Contact & Data Protection Officer (DPO)',
          text: 'If you have questions regarding this Privacy Policy or compliance certifications, contact our Security & Compliance Desk at privacy@ctartech.id or via WhatsApp: +62 812-6000-6666.'
        }
      ]
    },
    ID: {
      badge: 'KEPATUHAN HUKUM & PERLINDUNGAN DATA',
      title: 'Kebijakan Privasi Global',
      subtitle: 'Memenuhi Ketentuan UU No. 27/2022 (UU PDP), EU GDPR, dan Standar Regulasi Keamanan Siber Perbankan (OJK POJK 11 / BSSN).',
      lastUpdated: 'Pembaruan Terakhir: Agustus 2026',
      introTitle: '1. Komitmen terhadap Zero-Knowledge & Kedaulatan Data',
      introText: 'CTARTech ZentyCore ("ZentyCore", "kami") dirancang dengan filosofi ketat "Never Trust, Always Verify". Kami beroperasi dengan prinsip Zero-Knowledge & Minimalisasi Data. Kami tidak pernah melihat, menyimpan, atau memperjualbelikan payload mentah, basis data sensitif, atau password pengguna.',
      sections: [
        {
          title: '2. Kategori Data yang Diproses oleh Sistem',
          items: [
            'Klaim token identitas kriptografis (tanda tangan Ed25519, hash ID pengguna, klaim peran RBAC/ABAC dinamis).',
            'Telemetri kesehatan perangkat endpoint (status TPM 2.0, enkripsi BitLocker/LUKS, status agen EDR/antivirus).',
            'Metadata jaringan (IP asal, segmen zona tujuan, port yang diminta, TLS cipher).',
            'Log Audit Kriptografis (SHA-256 hash block, Merkle root, timestamp keputusan otorisasi).',
          ]
        },
        {
          title: '3. Kedaulatan Data & Hak Lisensi AirGap On-Premise',
          items: [
            'Untuk penyebaran Enterprise AirGap & Self-Hosted: 100% data telemetri, log audit, dan kunci privat enkripsi berada sepenuhnya di server lokal milik klien.',
            'Nol komunikasi eksternal: Node AirGap bekerja secara independen tanpa mengirimkan data apa pun ke server pusat CTARTech.',
            'Klien memegang kedaulatan hukum dan teknologi penuh atas seluruh data operasional mereka.',
          ]
        },
        {
          title: '4. Pemetaan Kepatuhan Regulasi (UU PDP No. 27/2022 & GDPR)',
          items: [
            'UU PDP No. 27/2022: Kewajiban enkripsi pemrosesan data, anonimisasi log audit, dan mekanisme notifikasi insiden <72 jam.',
            'EU GDPR (Pasal 25, 32, & 33): Perlindungan data sejak tahap perancangan (Privacy by Design) dan enkripsi state-of-the-art.',
            'Hak Subjek Data: Pemilik data berhak mengajukan permohonan akses, pembaruan, atau penghapusan metadata non-immutable melalui administrator SecOps organisasi masing-masing.',
          ]
        },
        {
          title: '5. Standar Keamanan & Enkripsi',
          items: [
            'Data dalam Pengiriman (In-Transit): Terenkripsi TLS 1.3 / mTLS (ECDHE-ECDSA-AES256-GCM).',
            'Data dalam Penyimpanan (At-Rest): Terenkripsi AES-256-GCM dan hashing satu arah BLAKE3.',
            'Audit Ledger: Menggunakan rantai hash SHA-256 dan Merkle Tree untuk menjamin keaslian dan bukti anti-manipulasi.',
          ]
        },
        {
          title: '6. Kontak Pejabat Perlindungan Data (DPO)',
          text: 'Untuk pertanyaan seputar kepatuhan privasi dan sertifikasi keamanan, hubungi Tim Keamanan & Kepatuhan kami di privacy@ctartech.id atau WhatsApp: +62 812-6000-6666.'
        }
      ]
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t.title}</h1>
          <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>
          <div className="mt-2 text-xs font-mono text-slate-500">{t.lastUpdated}</div>
        </div>

        <div className="space-y-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          {/* Intro Section */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              {t.introTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t.introText}</p>
          </section>

          {/* Dynamic Sections */}
          {t.sections.map((sec, idx) => (
            <section key={idx} className="space-y-3 pt-6 border-t border-slate-800/80">
              <h2 className="text-base font-bold text-white">{sec.title}</h2>
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
              {sec.text && <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{sec.text}</p>}
            </section>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-xs text-slate-500">
          CTARTech ZentyCore © 2026 — Zero Trust Control Platform. All Rights Reserved.
        </div>
      </main>
    </div>
  );
}
