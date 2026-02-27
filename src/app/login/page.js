'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // login | register

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();

    if (mode === 'register') {
      const { error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (signUpErr) {
        setError(signUpErr.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInErr) {
        setError(signInErr.message);
        setLoading(false);
        return;
      }
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ze-body bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.08)_0%,transparent_70%),radial-gradient(ellipse_40%_50%_at_80%_100%,rgba(59,130,246,0.06)_0%,transparent_70%)]">
      <div className="w-full max-w-sm px-6">

        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 text-2xl font-extrabold text-white mb-4">
            Z<span className="bg-gradient-to-r from-purple-200 to-blue-300 bg-clip-text text-transparent">E</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">ZenEnhance</h1>
          <p className="text-sm text-slate-500 mt-1">Visual effects engine for Zenler</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-slate-400">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="py-2.5 px-3.5 text-sm text-slate-200 bg-ze-surface border border-white/10 rounded-lg outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/15 placeholder:text-slate-600 transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-slate-400">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="py-2.5 px-3.5 text-sm text-slate-200 bg-ze-surface border border-white/10 rounded-lg outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/15 placeholder:text-slate-600 transition"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-lg shadow-lg shadow-purple-500/20 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="py-2 text-sm font-medium text-slate-400 border border-white/10 rounded-lg hover:bg-ze-elevated hover:text-slate-200 transition"
          >
            {mode === 'login' ? 'Create Free Account' : 'Back to Sign In'}
          </button>

          <p className="text-center text-[11px] text-slate-600 mt-1">
            Free tier includes 12 effects &middot; Upgrade anytime for all 25+
          </p>
        </form>
      </div>
    </div>
  );
}
