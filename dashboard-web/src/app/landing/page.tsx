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
  Database
} from 'lucide-react';

export default function LandingPage() {
  const [activeSdkTab, setActiveSdkTab] = useState<'rust' | 'python' | 'node' | 'go'>('rust');
  const [copied, setCopied] = useState(false);

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

  const pillars = [
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
      desc: 'Integrasi telemetri CrowdStrike/Defender, TPM 2.0 BitLocker/LUKS attestation, dan deteksi anti-jailbreak.',
      color: 'from-indigo-500/20 to-purple-500/20',
      border: 'border-indigo-500/30'
    },
    {
      icon: Network,
      title: '3. Network & ZTNA',
      desc: 'Mikrosegmentasi virtual terenkapsulasi mTLS TLS_AES_256_GCM dan tombol darurat subnet quarantine.',
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30'
    },
    {
      icon: Layers,
      title: '4. App & Workload',
      desc: 'WAF AST Payload Inspector aktif menangkal OWASP Top 10 (SQLi, XSS, Path Traversal, SSRF) secara real-time.',
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30'
    },
    {
      icon: Lock,
      title: '5. Data Protection',
      desc: 'Klasifikasi data otomatis sesuai UU PDP No. 27/2022, GDPR Art. 9, PCI-DSS dengan enkripsi KMS tingkat militer.',
      color: 'from-rose-500/20 to-pink-500/20',
      border: 'border-rose-500/30'
    },
    {
      icon: Activity,
      title: '6. Visibility & Ledger',
      desc: 'Cryptographic Audit Ledger SHA-256 rantai blok tamper-proof dengan WebSocket live streaming real-time.',
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30'
    },
    {
      icon: Zap,
      title: '7. Automated SOAR',
      desc: 'Respons insiden otomatis berkecepatan 0 detik: isolasi malware, pemutusan sesi aktif, dan rotasi credential.',
      color: 'from-yellow-500/20 to-amber-500/20',
      border: 'border-yellow-500/30'
    },
    {
      icon: FileCheck2,
      title: '8. Governance Matrix',
      desc: 'Audit kepatuhan otomatis terhadap NIST SP 800-207, OJK POJK 11, EU GDPR, SOC 2 Type II, dan ISO 27001.',
      color: 'from-violet-500/20 to-purple-500/20',
      border: 'border-violet-500/30'
    }
  ];

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

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">8 Pillars</a>
            <a href="#compliance" className="hover:text-cyan-400 transition-colors">Compliance</a>
            <a href="#sdks" className="hover:text-cyan-400 transition-colors">Developer SDKs</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing & License</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Community</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/camanit/CTARTech-ZentyCore" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Launch SOC Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6 shadow-xl shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Unified 8-in-1 Zero Trust Architecture (NIST SP 800-207)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight sm:leading-none">
          "Never Trust, <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Always Verify</span>."
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Platform Kendali Keamanan Siber Terpadu Berkinerja Tinggi bertenaga <strong className="text-slate-200">Rust Core Engine</strong>, 
          dilengkapi <strong className="text-slate-200">AI UEBA Threat Intelligence</strong>, audit log kriptografis tamper-proof, dan Next.js SOC Dashboard.
        </p>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Buka Live SOC Portal Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/camanit/CTARTech-ZentyCore"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" />
            <span>Dokumentasi & Source Code</span>
          </a>
        </div>

        {/* Live Metrics Showcase */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl font-black text-cyan-400 font-mono">&lt; 0.1 ms</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Policy Cache Latency</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl font-black text-emerald-400 font-mono">8-in-1</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Zero Trust Pillars</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl font-black text-purple-400 font-mono">SHA-256</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Immutable Audit Chain</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl font-black text-amber-400 font-mono">100% Rust</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Memory-Safe Core Engine</div>
          </div>
        </div>
      </section>

      {/* 8 Pillars Grid Section */}
      <section id="features" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Unified Defense in Depth</h2>
          <h3 className="text-3xl font-black text-white mt-1">8 Pilar Arsitektur Zero Trust Terpadu</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
            Semua komponen keamanan krusial saling terhubung dalam satu sistem orkestrasi kontrol terpusat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-slate-900/70 border ${item.border} hover:scale-[1.02] transition-all backdrop-blur-sm flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center mb-4 border ${item.border}`}>
                    <Icon className="w-5 h-5 text-slate-200" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-[11px] text-cyan-400 font-semibold">
                  <span>Enforced by PEP Gateway →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Developer SDKs Section */}
      <section id="sdks" className="py-16 px-6 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Developer First Security</h2>
            <h3 className="text-3xl font-black text-white mt-1">Amankan API Anda dalam 3 Baris Kode</h3>
            <p className="text-sm text-slate-400 mt-2">
              SDK dan Middleware resmi tersedia untuk ekosistem Rust, Python, Node.js, dan Go.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex justify-center gap-2 mb-4">
            {(['rust', 'python', 'node', 'go'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSdkTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeSdkTab === tab
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'rust' ? '🦀 Rust (SDK)' : tab === 'python' ? '🐍 Python (FastAPI)' : tab === 'node' ? '🟩 Node.js (Express)' : '🐹 Go (Gin)'}
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-5 shadow-2xl font-mono text-xs text-slate-300">
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-800 text-slate-500 text-[11px]">
              <span>ZentyCore Middleware Integration Example</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-all text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>
            <pre className="overflow-x-auto text-cyan-300 leading-relaxed">
              <code>{sdkCodeSnippets[activeSdkTab]}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Compliance & Regulation Standards */}
      <section id="compliance" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Multi-Regulatory Compliance</h2>
          <h3 className="text-3xl font-black text-white mt-1">Audit-Ready untuk Standar Nasional & Global</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-base font-extrabold text-white">NIST SP 800-207</div>
            <div className="text-[11px] text-cyan-400 mt-1">Zero Trust Architecture</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-base font-extrabold text-white">UU PDP No. 27/2022</div>
            <div className="text-[11px] text-emerald-400 mt-1">Privasi Data Indonesia</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-base font-extrabold text-white">OJK POJK 11 / BSSN</div>
            <div className="text-[11px] text-amber-400 mt-1">Sektor Keuangan & Perbankan</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-base font-extrabold text-white">EU GDPR Art. 9</div>
            <div className="text-[11px] text-blue-400 mt-1">European Privacy Guard</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-base font-extrabold text-white">SOC 2 Type II</div>
            <div className="text-[11px] text-purple-400 mt-1">Security & Availability</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-base font-extrabold text-white">ISO/IEC 27001</div>
            <div className="text-[11px] text-pink-400 mt-1">ISMS Standard</div>
          </div>
        </div>
      </section>

      {/* Pricing & License Section */}
      <section id="pricing" className="py-16 px-6 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Hybrid Licensing Model</h2>
            <h3 className="text-3xl font-black text-white mt-1">Pilihan Lisensi Fleksibel Sesuai Kebutuhan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free Tier */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white">🆓 Community Free</h4>
                <div className="text-2xl font-black text-white mt-2">Rp 0 <span className="text-xs text-slate-400 font-normal">/bulan</span></div>
                <p className="text-xs text-slate-400 mt-2">Untuk pengembang individu & self-hosted internal.</p>
                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 1,000 API Calls / bulan</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 8 Modul Zero Trust Core</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Community Forum Support</li>
                </ul>
              </div>
              <Link href="/login" className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold text-center">
                Mulai Gratis
              </Link>
            </div>

            {/* Starter Tier */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white">🥈 Starter Tier</h4>
                <div className="text-2xl font-black text-white mt-2">Rp 500.000 <span className="text-xs text-slate-400 font-normal">/bulan</span></div>
                <p className="text-xs text-slate-400 mt-2">Untuk startup & aplikasi berkembang.</p>
                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 50,000 API Calls / bulan</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> AI Risk Scoring Endpoint</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Webhook Integration (3 Endpoints)</li>
                </ul>
              </div>
              <a 
                href="https://webpay.ctar.tech" 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 w-full py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-bold text-center block"
              >
                Bayar via webpay.ctar.tech
              </a>
            </div>

            {/* Pro Tier */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/50 shadow-xl shadow-cyan-500/10 flex flex-col justify-between relative">
              <div className="absolute top-[-10px] right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-[10px] font-black text-slate-950 uppercase">
                POPULAR
              </div>
              <div>
                <h4 className="text-base font-bold text-white">🥇 Professional</h4>
                <div className="text-2xl font-black text-cyan-400 mt-2">Rp 2.000.000 <span className="text-xs text-slate-400 font-normal">/bulan</span></div>
                <p className="text-xs text-slate-400 mt-2">Untuk perusahaan & SOC Operations.</p>
                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 500,000 API Calls / bulan</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Full AI UEBA Threat Intelligence</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 99.9% SLA & Live Chat Support</li>
                </ul>
              </div>
              <a 
                href="https://webpay.ctar.tech" 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs text-center shadow-lg shadow-cyan-500/20 block"
              >
                Bayar via webpay.ctar.tech
              </a>
            </div>

            {/* Enterprise Tier */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/40 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white">👑 Enterprise Airgap</h4>
                <div className="text-2xl font-black text-purple-400 mt-2">Custom <span className="text-xs text-slate-400 font-normal">/tahunan</span></div>
                <p className="text-xs text-slate-400 mt-2">Untuk Perbankan, BUMN & Pemerintahan.</p>
                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Unlimited API Access</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Offline Ed25519 Signed Key (.lic)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Dedicated 24/7 Incident Response</li>
                </ul>
              </div>
              <a href="https://wa.me/6281260006666" target="_blank" rel="noreferrer" className="mt-6 w-full py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 text-xs font-bold text-center">
                Hubungi Enterprise
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Donation Section */}
      <section id="contact" className="py-16 px-6 max-w-4xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 text-slate-950 font-black">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">Dukungan Riset & Komunitas CTARTech</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xl mx-auto">
            Dukung pengembangan open-source Zero Trust Control Platform buatan anak bangsa.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-500 font-semibold">🏦 Donasi Riset Keamanan:</div>
              <div className="text-sm font-bold text-white mt-1">Allo Bank Indonesia</div>
              <div className="text-xs font-mono text-cyan-400 font-bold mt-0.5">0812 6000 6666</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-500 font-semibold">💬 Kontak Resmi & Konsultasi:</div>
              <div className="text-sm font-bold text-white mt-1">WhatsApp Fast Response</div>
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
              <span>Chat WhatsApp Sekarang</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            CTARTech ZentyCore © 2026 — Powered by Rust | Secured by Design
          </div>
          <div className="flex gap-6">
            <Link href="/landing" className="hover:text-slate-300">Home</Link>
            <Link href="/login" className="hover:text-slate-300">Portal Login</Link>
            <a href="https://github.com/camanit/CTARTech-ZentyCore" target="_blank" rel="noreferrer" className="hover:text-slate-300">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
