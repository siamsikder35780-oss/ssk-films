import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle, Check, Sparkles } from 'lucide-react';
import { UserAccount } from '../types/streaming';
import { DEMO_USERS } from '../data/plans';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  users: UserAccount[];
  onRegisterUser: (newUser: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  users,
  onRegisterUser,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (tab === 'login') {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (!found) {
        setErrorMsg('No SiamFlix account found with this email address.');
        return;
      }

      if (found.password && found.password !== password) {
        setErrorMsg('Incorrect password. Please try again or use a demo login.');
        return;
      }

      setSuccessMsg(`Welcome back, ${found.name}!`);
      setTimeout(() => {
        onLoginSuccess(found);
        onClose();
      }, 600);
    } else {
      // Sign Up
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }

      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }

      const existing = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );
      if (existing) {
        setErrorMsg('An account with this email already exists. Please log in.');
        return;
      }

      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        password,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        isKids: false,
        membershipPlan: 'Free',
        subscriptionStatus: 'active',
        renewalDate: 'Ongoing',
        myList: [],
        continueWatching: [],
        createdAt: new Date().toISOString().split('T')[0],
      };

      onRegisterUser(newUser);
      setSuccessMsg('Account created successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 700);
    }
  };

  const handleQuickDemoLogin = (demoUser: UserAccount) => {
    setErrorMsg(null);
    setSuccessMsg(`Logging in as ${demoUser.name} (${demoUser.membershipPlan})...`);
    setTimeout(() => {
      onLoginSuccess(demoUser);
      onClose();
    }, 500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#181818] border border-zinc-800 rounded-lg p-6 sm:p-8 text-white shadow-2xl space-y-5"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="text-2xl font-black text-[#E50914] tracking-tight uppercase">
            SIAMFLIX
          </div>
          <p className="text-xs text-zinc-400">
            {tab === 'login' ? 'Sign in to access your personal watchlist & 4K streams' : 'Create your SiamFlix member account'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-1 bg-zinc-900 p-1 rounded-md border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
            }}
            className={`py-2 rounded transition ${
              tab === 'login' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setErrorMsg(null);
            }}
            className={`py-2 rounded transition ${
              tab === 'signup' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-800/80 rounded text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {tab === 'signup' && (
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
                  className="w-full bg-zinc-900 border border-zinc-700 rounded pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
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
                className="w-full bg-zinc-900 border border-zinc-700 rounded pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-700 rounded pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#E50914] hover:bg-[#b80710] font-bold text-white rounded text-sm transition shadow-lg flex items-center justify-center gap-1.5 active:scale-98"
          >
            <span>{tab === 'login' ? 'Sign In' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="pt-3 border-t border-zinc-800 space-y-2">
          <div className="text-[11px] font-semibold text-zinc-400 text-center uppercase tracking-wider">
            Quick 1-Click Demo Accounts
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemoLogin(DEMO_USERS[0])}
              className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-left transition flex items-center gap-2 group"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-[10px]">
                ⭐
              </div>
              <div className="truncate">
                <div className="font-bold text-white group-hover:text-amber-400 truncate">
                  Siam Sikder
                </div>
                <div className="text-[10px] text-amber-400 font-mono">Premium 4K Member</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin(DEMO_USERS[1])}
              className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition flex items-center gap-2 group"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-700 text-white font-bold flex items-center justify-center text-[10px]">
                👤
              </div>
              <div className="truncate">
                <div className="font-bold text-white group-hover:text-zinc-300 truncate">
                  Guest User
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">Free Plan (Test Paywall)</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
