'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { useEnhance } from '@/context/EnhanceContext';

export default function Navbar({ email, tier, onToggleSidebar }) {
  const router = useRouter();
  const { setSearch, searchQuery } = useEnhance();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-5 bg-ze-surface border-b border-white/[0.06]">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden flex flex-col gap-1 p-1.5"
          aria-label="Toggle sidebar"
        >
          <span className="block w-[18px] h-[2px] bg-slate-400 rounded" />
          <span className="block w-[18px] h-[2px] bg-slate-400 rounded" />
          <span className="block w-[18px] h-[2px] bg-slate-400 rounded" />
        </button>
        <span className="text-lg font-extrabold tracking-tight text-slate-100">
          Zen<span className="bg-gradient-to-r from-purple-300 via-indigo-400 to-blue-400 bg-clip-text text-transparent">Enhance</span>
        </span>
      </div>

      {/* Center — search */}
      <div className="hidden sm:block flex-1 max-w-sm mx-6 relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search effects..."
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-1.5 pl-9 pr-3 text-sm text-slate-200 bg-ze-elevated border border-white/[0.06] rounded-lg outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 placeholder:text-slate-600 transition"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide rounded-full ${
          tier === 'pro'
            ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
            : 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
        }`}>
          {tier === 'pro' ? 'Pro' : 'Free'}
        </span>
        <span className="hidden md:inline text-xs text-slate-500 truncate max-w-[140px]">{email}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-xs font-medium text-slate-500 border border-white/[0.06] rounded-lg hover:text-slate-300 hover:bg-ze-hover transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
