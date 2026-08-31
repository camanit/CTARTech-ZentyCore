'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  Cpu, 
  FileCheck2, 
  Activity, 
  Layers, 
  Network, 
  Laptop, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Github, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  Building2,
  Scale,
  Database,
  CreditCard,
  KeyRound,
  FileCode,
  Globe,
  Radio,
  FileText
} from 'lucide-react';

export default function LandingPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');
  const [activeSdkTab, setActiveSdkTab] = useState<'rust' | 'python' | 'node' | 'go'>('rust');
  const [copied, setCopied] = useState(false);

  const dict = {
    EN: {
      badge: 'UNIFIED ZERO TRUST CONTROL PLANE (NIST SP 800-207)',
      heroTagline: 'BUILD ZERO TRUST',
      heroTaglineSub: 'WITH THE CONTROLS YOU ALREADY HAVE',
      heroDesc: 'Zero Trust is not another isolated product. It is a unified security model that connects, orchestrates, and strengthens the controls you already own — powered by a ultra-fast Rust Core Engine & AI UEBA Threat Intelligence.',
      goalText: 'ONE GOAL: Verify every access, restrict by least privilege, and continuously monitor.',
      ctaPrimary: 'Launch Live SOC Portal',
      ctaSecondary: 'Documentation & GitHub',
      stats: [
        { value: '< 0.1 ms', label: 'Policy Cache Latency' },
        { value: '8 Pillars', label: 'In 1 Unified Control' },
        { value: 'SHA-256', label: 'Immutable Audit Chain' },
        { value: '100% Rust', label: 'Memory-Safe Engine' }
      ],
      pillarsTitle: 'The 8 Pillars of Zero Trust Security',
      pillarsSubtitle: 'Connecting and orchestrating all security dimensions into one synchronized defense perimeter.',
      pillars: [
        {
          icon: UserCheck,
          title: '1. Identity & IAM',
          desc: 'Ed25519 token claims, Zero-Knowledge authentication, and hardware MFA/FIDO2 step-up enforcement.',
          color: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-cyan-500/30'
        },
        {
          icon: Laptop,
          title: '2. Device Posture',
          desc: 'EDR/XDR telemetry integration, TPM 2.0 BitLocker/LUKS attestation, and anti-tamper jailbreak detection.',
          color: 'from-indigo-500/20 to-purple-500/20',
          border: 'border-indigo-500/30'
        },
        {
          icon: Network,
          title: '3. Network & ZTNA',
          desc: 'Microsegmentation encapsulated with mTLS TLS_AES_256_GCM and instant quarantine sandbox switches.',
          color: 'from-emerald-500/20 to-teal-500/20',
          border: 'border-emerald-500/30'
        },
        {
          icon: Layers,
          title: '4. App & Workload',
          desc: 'WAF AST Payload Inspector blocking OWASP Top 10 (SQLi, XSS, Path Traversal, BOLA) with token-bucket rate limiting.',
          color: 'from-amber-500/20 to-orange-500/20',
          border: 'border-amber-500/30'
        },
        {
          icon: Lock,
          title: '5. Data Protection',
          desc: 'Automated PII data classification, DLP policies, and military-grade AES-256-GCM KMS vault encryption.',
          color: 'from-rose-500/20 to-pink-500/20',
          border: 'border-rose-500/30'
        },
        {
          icon: Activity,
          title: '6. Visibility & SOC',
          desc: 'Cryptographic Audit Ledger SHA-256 tamper-proof hash chains with real-time WebSocket telemetry stream.',
          color: 'from-cyan-500/20 to-blue-500/20',
          border: 'border-cyan-500/30'
        },
        {
          icon: Zap,
          title: '7. Automated SOAR',
          desc: 'Zero-second automated containment: ransomware lateral isolation, honeytoken trip triage, and snapshot self-healing.',
          color: 'from-yellow-500/20 to-amber-500/20',
          border: 'border-yellow-500/30'
        },
        {
          icon: FileCheck2,
          title: '8. Governance Matrix',
          desc: 'Automated compliance mapping for NIST SP 800-207, ISO/IEC 27001, ISO 22301, ISO 9001, UU PDP, and EU GDPR.',
          color: 'from-violet-500/20 to-purple-500/20',
          border: 'border-violet-500/30'
        }
      ],
      complianceBadge: 'MULTI-REGULATORY COMPLIANCE',
      complianceTitle: 'Audit-Ready for National & Global Standards',
      sdkTitle: 'Developer Experience: Plug-and-Play in 3 Lines of Code',
      sdkSubtitle: 'Official multi-language SDKs for seamless backend and microservices integration.',
      pricingBadge: 'ENTERPRISE LICENSING & AIRGAP',
      pricingTitle: 'Flexible Deployment Options',
      contactTitle: 'CTARTech Research & Community Support',
      contactDesc: 'Empowering open-source cybersecurity research and enterprise Zero Trust transformation.',
      footerRights: 'CTARTech ZentyCore © 2026 — Powered by Rust | Secured by Design'
    },
    ID: {
      badge: 'UNIFIED ZERO TRUST CONTROL PLANE (NIST SP 800-207)',
      heroTagline: 'BANGUN ZERO TRUST',
      heroTaglineSub: 'DENGAN KENDALI KEAMANAN YANG SUDAH ANDA MILIKI',
      heroDesc: 'Zero Trust bukanlah produk yang terisolasi. Ini adalah model arsitektur keamanan terpadu yang menghubungkan dan memperkuat seluruh kontrol sistem yang sudah Anda miliki — ditenagai oleh Rust Core Engine berkecepatan tinggi & AI UEBA Threat Intelligence.',
      goalText: 'SATU TUJUAN: Verifikasi setiap akses, batasi dengan hak terendah (least privilege), dan pantau secara berkelanjutan.',
      ctaPrimary: 'Buka Live SOC Portal Demo',
      ctaSecondary: 'Dokumentasi & GitHub',
      stats: [
        { value: '< 0.1 ms', label: 'Latensi Cache Policy' },
        { value: '8 Pilar', label: 'Dalam 1 Unified Control' },
        { value: 'SHA-256', label: 'Rantai Audit Imutabel' },
        { value: '100% Rust', label: 'Engine Bebas Bug Memori' }
      ],
      pillarsTitle: '8 Pilar Utama Keamanan Zero Trust',
      pillarsSubtitle: 'Menghubungkan dan mengorkestrasi seluruh dimensi keamanan ke dalam satu perisai pertahanan terpadu.',
      pillars: [
        {
          icon: UserCheck,
          title: '1. Identity & IAM',
          desc: 'Autentikasi berbasis Ed25519 token, Zero-Knowledge Claims, dan penegakan wajib FIDO2 / TOTP step-up MFA.',
          color: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-cyan-500/30'
        },
        {
          icon: Laptop,
          title: '2. Device Posture',
          desc: 'Integrasi telemetri CrowdStrike/Defender, TPM 2.0 BitLocker/LUKS attestation, dan deteksi anti-tamper.',
          color: 'from-indigo-500/20 to-purple-500/20',
          border: 'border-indigo-500/30'
        },
        {
          icon: Network,
          title: '3. Network & ZTNA',
          desc: 'Mikrosegmentasi virtual terenkapsulasi mTLS TLS_AES_256_GCM dan isolasi karantina darurat.',
          color: 'from-emerald-500/20 to-teal-500/20',
          border: 'border-emerald-500/30'
        },
        {
          icon: Layers,
          title: '4. App & Workload',
          desc: 'WAF AST Payload Inspector aktif menangkal OWASP Top 10 (SQLi, XSS, Path Traversal, BOLA) dengan rate limiter.',
          color: 'from-amber-500/20 to-orange-500/20',
          border: 'border-amber-500/30'
        },
        {
          icon: Lock,
          title: '5. Data Protection',
          desc: 'Klasifikasi data sensitif otomatis sesuai UU PDP No. 27/2022, GDPR Art. 9, dan enkripsi KMS militer AES-256.',
          color: 'from-rose-500/20 to-pink-500/20',
          border: 'border-rose-500/30'
        },
        {
          icon: Activity,
          title: '6. Visibility & SOC',
          desc: 'Cryptographic Audit Ledger SHA-256 rantai blok tamper-proof dengan WebSocket live streaming real-time.',
          color: 'from-cyan-500/20 to-blue-500/20',
          border: 'border-cyan-500/30'
        },
        {
          icon: Zap,
          title: '7. Automated SOAR',
          desc: 'Respons insiden otomatis berkecepatan 0 detik: isolasi ransomware, jebakan honeytoken, dan self-healing.',
          color: 'from-yellow-500/20 to-amber-500/20',
          border: 'border-yellow-500/30'
        },
        {
          icon: FileCheck2,
          title: '8. Governance Matrix',
          desc: 'Audit kepatuhan otomatis terhadap NIST SP 800-207, ISO 27001, ISO 22301, ISO 9001, UU PDP, dan EU GDPR.',
          color: 'from-violet-500/20 to-purple-500/20',
          border: 'border-violet-500/30'
        }
      ],
      complianceBadge: 'KEPATUHAN MULTI-REGULASI',
      complianceTitle: 'Audit-Ready untuk Standar Nasional & Global',
      sdkTitle: 'Pengalaman Developer: Integrasi Cepat dalam 3 Baris Kode',
      sdkSubtitle: 'SDK resmi multi-bahasa untuk integrasi backend dan mikrolayanan pihak ketiga.',
      pricingBadge: 'LISENSI ENTERPRISE & AIRGAP',
      pricingTitle: 'Pilihan Deployment Fleksibel',
      contactTitle: 'Dukungan Riset & Komunitas CTARTech',
      contactDesc: 'Mendukung riset keamanan siber open-source dan transformasi Zero Trust mandiri buatan anak bangsa.',
      footerRights: 'CTARTech ZentyCore © 2026 — Powered by Rust | Secured by Design'
    }
  };

  const t = dict[lang];

  const sdkCodeSnippets = {
    rust: `// Cargo.toml: zt_sdk = "0.1"
use zt_sdk::{ZeroTrustClient, AccessRequest};

#[tokio::main]
async fn main() {
    let client = ZeroTrustClient::new("https://api.zentycore.id", "zt_live_key");
    let is_allowed = client.verify_request(
        "user@corp.id", 
        token, 
        device_id, 
        "api:finance:transfer", 
        ip_addr
    ).await;
}`,
    python: `# pip install zentycore-sdk httpx
from fastapi import FastAPI
from zentycore import ZeroTrustClient

app = FastAPI()
zt = ZeroTrustClient(base_url="https://api.zentycore.id", api_key="zt_live_key")

# Protect entire API with 1 line of middleware:
zt.fastapi_middleware(app, resource_prefix="prod-core-api")`,
    node: `// npm install @ctartech/zentycore-middleware
import express from 'express';
import { ZeroTrustClient } from '@ctartech/zentycore-middleware';

const app = express();
const zt = new ZeroTrustClient({ controlPlaneUrl: 'https://api.zentycore.id', apiKey: 'zt_live_key' });

app.use('/api/v1', zt.expressMiddleware({ resourceName: 'api:customer:records' }));`,
    go: `// go get github.com/ctartech/zentycore/sdks/go-sdk
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/ctartech/zentycore/sdks/go-sdk"
)

func main() {
    r := gin.Default()
    zt := zentycore.NewClient("https://api.zentycore.id", "zt_live_key")
    r.Use(zt.GinMiddleware("api:banking:wire"))
}`
  };

  const copyCode = () => {
    navigator.clipboard.writeText(sdkCodeSnippets[activeSdkTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="fixed top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none"></div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
              <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white flex items-center gap-1">
                CTAR<span className="text-cyan-400">ZentyCore</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Zero Trust Control Plane</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">8 Pillars</a>
            <a href="#compliance" className="hover:text-cyan-400 transition-colors">Compliance</a>
            <a href="#sdks" className="hover:text-cyan-400 transition-colors">Developer SDKs</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing & License</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Community</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Switcher Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-bold shadow-inner">
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  lang === 'EN' ? 'bg-cyan-500 text-slate-950 shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ID')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  lang === 'ID' ? 'bg-cyan-500 text-slate-950 shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ID
              </button>
            </div>

            <a 
              href="https://github.com/camanit/CTARTech-ZentyCore" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all hidden sm:flex items-center gap-2 text-xs font-semibold"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Launch Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6 shadow-xl shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{t.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          {t.heroTagline} <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {t.heroTaglineSub}
          </span>
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {t.heroDesc}
        </p>

        <div className="mt-4 inline-block px-4 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          {t.goalText}
        </div>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{t.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/camanit/CTARTech-ZentyCore"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" />
            <span>{t.ctaSecondary}</span>
          </a>
        </div>

        {/* Live Metrics Showcase */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {t.stats.map((st, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-black text-cyan-400 font-mono">{st.value}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 8 Pillars Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">{t.pillarsTitle}</h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">{t.pillarsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx}
                className="group relative p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/5"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} border ${p.border} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Compliance Matrix Section */}
      <section id="compliance" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-bold text-cyan-400 tracking-widest uppercase mb-2 block">{t.complianceBadge}</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">{t.complianceTitle}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">NIST SP 800-207</div>
              <div className="text-xs text-slate-400">Zero Trust Architecture Standard</div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">ISO/IEC 27001:2022</div>
              <div className="text-xs text-slate-400">Information Security Management (ISMS)</div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-purple-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">UU PDP No. 27/2022</div>
              <div className="text-xs text-slate-400">Indonesian Data Protection Act</div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-blue-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">EU GDPR (Articles 25, 32)</div>
              <div className="text-xs text-slate-400">European Privacy by Design & Default</div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">OJK POJK 11 / BSSN</div>
              <div className="text-xs text-slate-400">Banking & Critical Infrastructure Defense</div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">ISO 22301 & ISO 9001</div>
              <div className="text-xs text-slate-400">BCM Resilience & QMS RCA Gate</div>
            </div>
          </div>
        </div>
      </section>

      {/* SDK & DX Code Section */}
      <section id="sdks" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.sdkTitle}</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">{t.sdkSubtitle}</p>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex gap-2">
              {(['rust', 'python', 'node', 'go'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveSdkTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    activeSdkTab === tab ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'node' ? 'Node.js' : tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="p-6 bg-slate-950/90 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre className="leading-relaxed">{sdkCodeSnippets[activeSdkTab]}</pre>
          </div>
        </div>
      </section>

      {/* Community & Contact Section */}
      <section id="contact" className="py-16 px-6 max-w-4xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 text-slate-950 font-black">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">{t.contactTitle}</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xl mx-auto">{t.contactDesc}</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-500 font-semibold">🏦 Security Research & Funding:</div>
              <div className="text-sm font-bold text-white mt-1">Allo Bank Indonesia</div>
              <div className="text-xs font-mono text-cyan-400 font-bold mt-0.5">0812 6000 6666</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-500 font-semibold">💬 Enterprise Inquiries & Consulting:</div>
              <div className="text-sm font-bold text-white mt-1">Official WhatsApp Support</div>
              <div className="text-xs font-mono text-emerald-400 font-bold mt-0.5">+62 812-6000-6666</div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="https://wa.me/6281260006666"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <span>Chat via WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {t.footerRights}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/landing" className="hover:text-slate-300">Home</Link>
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Privacy Policy</span>
            </Link>
            <Link href="/terms" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Scale className="w-3 h-3" />
              <span>Terms of Service</span>
            </Link>
            <Link href="/login" className="hover:text-slate-300">Portal Login</Link>
            <a href="https://github.com/camanit/CTARTech-ZentyCore" target="_blank" rel="noreferrer" className="hover:text-slate-300">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
