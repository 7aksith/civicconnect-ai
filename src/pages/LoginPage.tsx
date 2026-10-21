import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type LoginMode = 'user' | 'admin';

const demoAccounts: Record<LoginMode, { email: string; password: string; label: string; helper: string }> = {
  user: {
    email: 'citizen@civicconnect.in',
    password: 'citizen123',
    label: 'Citizen User',
    helper: 'Report challenges, track updates, and support local issues.',
  },
  admin: {
    email: 'laksith0987@gmail.com',
    password: 'laksith0987@',
    label: 'Admin / Authority',
    helper: 'Monitor priority incidents and coordinate emergency response.',
  },
};

export const LoginPage: React.FC = () => {
  const { currentView, loginWithCredentials, setCurrentView } = useApp();
  const [mode, setMode] = useState<LoginMode>(currentView === 'login-admin' ? 'admin' : 'user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const nextMode = currentView === 'login-admin' ? 'admin' : 'user';
    setMode(nextMode);

    if (nextMode === 'admin') {
      setEmail('laksith0987@gmail.com');
      setPassword('laksith0987@');
    } else {
      try {
        const raw = localStorage.getItem('civicconnect_saved_accounts_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          const saved = parsed?.user || {};
          setEmail(saved.email || '');
          setPassword(saved.password || '');
        } else {
          setEmail('');
          setPassword('');
        }
      } catch {
        setEmail('');
        setPassword('');
      }
    }

    setError('');
  }, [currentView]);

  const handleModeChange = (nextMode: LoginMode) => {
    setMode(nextMode);

    if (nextMode === 'admin') {
      setEmail('laksith0987@gmail.com');
      setPassword('laksith0987@');
    } else {
      try {
        const raw = localStorage.getItem('civicconnect_saved_accounts_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          const saved = parsed?.user || {};
          setEmail(saved.email || '');
          setPassword(saved.password || '');
        } else {
          setEmail('');
          setPassword('');
        }
      } catch {
        setEmail('');
        setPassword('');
      }
    }

    setError('');
    setCurrentView(nextMode === 'admin' ? 'login-admin' : 'login');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = loginWithCredentials(email, password, mode);
    if (!result.success) {
      setError(result.message);
      return;
    }

    setCurrentView(mode === 'admin' ? 'authority-dashboard' : 'dashboard');
  };

  const currentAccount = demoAccounts[mode];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.22),transparent_40%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-blue-950/30 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden border-b border-slate-800 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.18),rgba(15,23,42,0.2),rgba(8,145,178,0.12))]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                <Sparkles size={14} />
                CivicConnect AI
              </div>

              <h1 className="mt-6 max-w-md text-3xl font-black tracking-tight text-white sm:text-4xl">
                Build safer communities with smarter civic response.
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                Sign in to report hazards, coordinate local action, and help authorities resolve high-priority community challenges faster.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-700/90 bg-slate-900/60 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-300">
                    <UserRound size={20} />
                  </div>
                  <div className="text-sm font-bold text-white">Citizen access</div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Submit reports, attach evidence, and raise alerts with AI-assisted triage.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700/90 bg-slate-900/60 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-300">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="text-sm font-bold text-white">Admin access</div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Review critical incidents, assign response teams, and monitor incident resolution.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-300">
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Saved account access</div>
                <p className="text-xs leading-6 text-slate-400">
                  Enter your own email and password, then sign in. The app saves this account for future login on this browser.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Welcome back</p>
                <h2 className="mt-2 text-2xl font-black text-white">Sign in</h2>
              </div>

              <button
                type="button"
                onClick={() => setCurrentView('landing')}
                className="text-xs font-semibold text-blue-300 transition hover:text-blue-200"
              >
                Back to site
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-800/80 p-1.5">
              <button
                type="button"
                onClick={() => handleModeChange('user')}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  mode === 'user'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                    : 'text-slate-300 hover:bg-slate-700/70'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('admin')}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  mode === 'admin'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                    : 'text-slate-300 hover:bg-slate-700/70'
                }`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
                    placeholder="••••••••"
                    autoComplete={mode === 'admin' ? 'current-password' : 'off'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-3 text-sm text-slate-300">
                <div className="font-bold text-white">{currentAccount.label}</div>
                <p className="mt-1 text-xs leading-5 text-slate-400">{currentAccount.helper}</p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition hover:brightness-110"
              >
                Sign in
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
