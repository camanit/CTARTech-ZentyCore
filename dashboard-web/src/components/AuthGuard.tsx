'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If user is accessing public pages (login, register, landing, or activate), no need to check auth
    if (pathname === '/login' || pathname === '/register' || pathname === '/landing' || pathname === '/activate') {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    // Check if session exists in localStorage
    try {
      const stored = localStorage.getItem('zentycore_auth_user');
      if (!stored) {
        setAuthorized(false);
        setChecking(false);
        router.replace('/login');
      } else {
        const user = JSON.parse(stored);
        if (user && user.mfaVerified) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.replace('/login');
        }
        setChecking(false);
      }
    } catch (e) {
      setAuthorized(false);
      router.replace('/login');
      setChecking(false);
    }
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-3 animate-pulse">
          <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
        </div>
        <p className="text-xs font-mono text-cyan-400">Verifying Zero Trust Session...</p>
      </div>
    );
  }

  // If on login page or authorized, render children
  if (pathname === '/login' || authorized) {
    return <>{children}</>;
  }

  return null;
}
