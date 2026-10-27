import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, Check, Eye, EyeOff, ArrowRight, ShieldCheck, Film } from 'lucide-react';
import { UserAccount } from '../types/streaming';
import { DEMO_USERS } from '../data/plans';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterUser: (newUser: UserAccount) => void;
  users: UserAccount[];
  onCancel: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onLoginSuccess,
  onRegisterUser,
  users,
  onCancel,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter an email address.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (mode === 'login') {
      const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!foundUser) {
        setErrorMessage(
          "Sorry, we can't find an account with this email address. Please try again or create a new account."
        );
        return;
      }

      if (foundUser.password && foundUser.password !== password) {
        setErrorMessage('Incorrect password. Please try again or click a demo account below.');
        return;
      }

      setSuccessMessage(`Welcome back, ${foundUser.name}! Logging you in...`);
      setTimeout(() => {
        onLoginSuccess(foundUser);
      }, 700);
    } else {
      // Sign Up
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Your password must contain between 6 and 60 characters.');
        return;
      }

      const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        setErrorMessage('An account with this email address already exists. Please sign in instead.');
        return;
      }

      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        password,
        avatarUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        isKids: false,
        membershipPlan: 'Free',
        subscriptionStatus: 'active',
        renewalDate: 'Ongoing',
        myList: [],
        continueWatching: [],
        createdAt: new Date().toISOString().split('T')[0],
      };

      onRegisterUser(newUser);
      setSuccessMessage('Account registered successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 800);
    }
  };

  const handleQuickLogin = (user: UserAccount) => {
    setErrorMessage(null);
    setSuccessMessage(`Signing in as ${user.name} (${user.membershipPlan})...`);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 500);
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col justify-between select-none">
      {/* Background Poster Collage with Dark Vignette */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-[1720px] w-full mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 focus:outline-none text-left"
        >
          <span className="text-3xl sm:text-4xl font-black tracking-tighter text-[#E50914] uppercase drop-shadow-[0_2px_12px_rgba(229,9,20,0.6)]">
            SIAMFLIX
          </span>
          <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest text-zinc-400 uppercase border border-zinc-700/80 px-1 py-0.5 rounded bg-black/60">
            SSK FILMS
          </span>
        </button>

        <button
          onClick={onCancel}
          className="text-xs text-zinc-300 hover:text-white transition px-3 py-1.5 rounded border border-zinc-700 bg-black/40"
        >
          Back to Browse
        </button>
      </header>

      {/* Center Auth Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="bg-black/80 backdrop-blur-md border border-zinc-800 rounded-lg p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </h1>
            <p className="text-xs text-zinc-400">
              {mode === 'login'
                ? 'Access your private watchlist, continue watching, and 4K streams.'
                : 'Create an account to begin streaming Bengali, Hindi, English & Korean cinema.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-[#E50914]/20 border border-[#E50914]/60 rounded text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 rounded text-xs text-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="text-zinc-400 block mb-1 font-medium">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Siam Sikder"
                    className="w-full bg-[#333333]/80 border border-zinc-700 rounded pl-9 pr-3 py-3 text-white focus:outline-none focus:border-[#E50914] transition text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-zinc-400 block mb-1 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#333333]/80 border border-zinc-700 rounded pl-9 pr-3 py-3 text-white focus:outline-none focus:border-[#E50914] transition text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-medium">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#333333]/80 border border-zinc-700 rounded pl-9 pr-10 py-3 text-white focus:outline-none focus:border-[#E50914] transition text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#E50914] rounded cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to demo registered email.')}
                className="hover:underline text-zinc-400 hover:text-zinc-200"
              >
                Need help?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#E50914] hover:bg-[#b80710] font-bold text-white rounded text-sm transition shadow-xl flex items-center justify-center gap-2 active:scale-98 mt-2"
            >
              <span>{mode === 'login' ? 'Sign In' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="text-xs text-zinc-400 pt-2 border-t border-zinc-800 flex items-center justify-between">
            {mode === 'login' ? (
              <>
                <span>New to SiamFlix?</span>
                <button
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="text-white font-bold hover:underline"
                >
                  Sign up now.
                </button>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <button
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-white font-bold hover:underline"
                >
                  Sign in here.
                </button>
              </>
            )}
          </div>

          {/* Quick Demo Logins Section */}
          <div className="pt-2 space-y-2">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">
              Instant 1-Click Demo Accounts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin(DEMO_USERS[0])}
                className="p-2.5 rounded bg-zinc-900/90 hover:bg-zinc-800 border border-amber-500/50 text-left transition flex items-center gap-2.5 group"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-xs">
                  ⭐
                </div>
                <div className="truncate">
                  <div className="font-bold text-white group-hover:text-amber-400 truncate">
                    Siam Sikder
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono">Premium 4K Tier</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(DEMO_USERS[1])}
                className="p-2.5 rounded bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-left transition flex items-center gap-2.5 group"
              >
                <div className="w-6 h-6 rounded-full bg-zinc-700 text-white font-bold flex items-center justify-center text-xs">
                  👤
                </div>
                <div className="truncate">
                  <div className="font-bold text-white group-hover:text-zinc-200 truncate">
                    Guest User
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">Free Plan (Paywall)</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-zinc-500 border-t border-zinc-900/60">
        <span>© 2026 SiamFlix by SSK Films. Encrypted Bubble-style authentication session.</span>
      </footer>
    </div>
  );
};
