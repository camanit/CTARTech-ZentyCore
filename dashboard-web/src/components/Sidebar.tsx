'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  UserCheck, 
  Laptop, 
  Network, 
  Layers, 
  Lock, 
  Activity, 
  Zap, 
  FileCheck2, 
  Cpu, 
  KeyRound,
  LogOut,
  User
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zentycore_auth_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('zentycore_auth_user');
    } catch (e) {}
    setCurrentUser(null);
    router.replace('/login');
  };

  const coreModules = [
    { name: '1. Identity & IAM', path: '/modules/identity', icon: UserCheck },
    { name: '2. Device Posture', path: '/modules/device', icon: Laptop },
    { name: '3. Network & ZTNA', path: '/modules/network', icon: Network },
    { name: '4. App & Workload', path: '/modules/app-workload', icon: Layers },
    { name: '5. Data Protection', path: '/modules/data-protection', icon: Lock },
    { name: '6. Visibility & SOC', path: '/', icon: Activity },
    { name: '7. Automated SOAR', path: '/modules/response', icon: Zap },
    { name: '8. Governance Matrix', path: '/modules/governance', icon: FileCheck2 },
  ];

  const intelligenceAndAdmin = [
    { name: 'AI UEBA Engine', path: '/modules/ai', icon: Cpu, badge: 'AI' },
    { name: 'Superadmin & License', path: '/modules/licensing', icon: KeyRound, badge: 'PRO' },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 backdrop-blur-md text-slate-300 min-h-screen p-4 flex flex-col border-r border-slate-800 flex-shrink-0">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 px-2 py-3 mb-4 rounded-xl hover:bg-slate-800/60 transition-all">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20">
          <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-white tracking-wider flex items-center gap-1.5">
            CTAR<span className="text-cyan-400">ZentyCore</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Unified Control Plane</div>
        </div>
      </Link>

      {/* User Session Profile Badge */}
      {currentUser && (
        <div className="mb-5 p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <div className="text-[11px] font-bold text-slate-200 truncate">{currentUser.email}</div>
              <div className="text-[9px] text-cyan-400 font-mono font-semibold">{currentUser.role || 'SecOps_Admin'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out Session"
            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 8 Core Zero Trust Pillars */}
      <div className="mb-2 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        8 Zero Trust Pillars
      </div>
      <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
        {coreModules.map((mod, idx) => {
          const Icon = mod.icon;
          const isActive = pathname === mod.path;
          return (
            <Link
              key={idx}
              href={mod.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="truncate">{mod.name}</span>
            </Link>
          );
        })}

        {/* Intelligence & Superadmin Section */}
        <div className="mt-4 mb-2 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          AI & Operations
        </div>
        {intelligenceAndAdmin.map((mod, idx) => {
          const Icon = mod.icon;
          const isActive = pathname === mod.path;
          return (
            <Link
              key={`admin-${idx}`}
              href={mod.path}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-300 border border-purple-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span className="truncate">{mod.name}</span>
              </div>
              {mod.badge && (
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                  mod.badge === 'AI' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {mod.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Status */}
      <div className="pt-3 mt-auto border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between px-2">
        <span>Control Plane :8080</span>
        <Link href="/login" className="text-[10px] text-cyan-400 hover:underline">
          Portal Login →
        </Link>
      </div>
    </aside>
  );
}
