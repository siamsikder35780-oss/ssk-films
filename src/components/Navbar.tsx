import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  User,
  Shield,
  LogOut,
  CreditCard,
  Check,
  Menu,
  X,
  LogIn,
} from 'lucide-react';
import { UserAccount } from '../types/streaming';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  myListCount: number;
  currentUser: UserAccount;
  onOpenAuth: () => void;
  onOpenMembership: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  myListCount,
  currentUser,
  onOpenAuth,
  onOpenMembership,
  onOpenAdmin,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'bengali', label: 'Bengali' },
    { id: 'hindi', label: 'Hindi' },
    { id: 'english', label: 'English' },
    { id: 'korean', label: 'Korean' },
    { id: 'series', label: 'Web Series' },
    { id: 'mylist', label: `My List ${myListCount > 0 ? `(${myListCount})` : ''}` },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl py-2.5'
          : 'bg-gradient-to-b from-black/95 via-black/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 md:px-12 flex items-center justify-between gap-4">
        {/* Left Section: Brand & Nav Links */}
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 focus:outline-none group text-left"
          >
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-[#E50914] uppercase drop-shadow-[0_2px_12px_rgba(229,9,20,0.5)]">
              SIAMFLIX
            </span>
            <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest text-zinc-400 uppercase border border-zinc-700/80 px-1 py-0.5 rounded bg-black/40">
              SSK FILMS
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5 text-[13px] font-medium text-zinc-300">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`transition-colors relative py-1 ${
                    isActive ? 'text-white font-bold' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E50914] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Search, Membership, Notifications, Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Box */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <div className="flex items-center bg-black/80 border border-zinc-700 rounded px-2.5 py-1 text-xs transition-all w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0 mr-2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Titles, language, genres, year..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentView !== 'search') onNavigate('search');
                  }}
                  className="bg-transparent text-white focus:outline-none w-full text-xs"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    onSearchChange('');
                    if (currentView === 'search') onNavigate('home');
                  }}
                  className="text-zinc-500 hover:text-white ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSearchOpen(true);
                  if (currentView !== 'search') onNavigate('search');
                }}
                className="text-zinc-300 hover:text-white p-1 transition"
                title="Search movies and series"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Membership Badge */}
          <button
            onClick={onOpenMembership}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded border transition ${
              currentUser.membershipPlan === 'Premium'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{currentUser.membershipPlan}</span>
          </button>

          {/* Admin Dashboard Button */}
          <button
            onClick={onOpenAdmin}
            title="Open Admin Dashboard to manage movies and video links"
            className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-zinc-900/80 hover:bg-red-950/60 border border-zinc-700 text-zinc-300 hover:text-red-400 transition"
          >
            <Shield className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden md:inline font-medium">Admin</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="text-zinc-300 hover:text-white p-1 transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#E50914] rounded-full ring-2 ring-black" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-zinc-950 border border-zinc-800 rounded-md shadow-2xl p-3 z-50 text-xs">
                <div className="font-bold text-white mb-2 pb-1 border-b border-zinc-800 flex items-center justify-between">
                  <span>Notifications</span>
                  <span className="text-[10px] text-zinc-500 font-mono">SiamFlix</span>
                </div>
                <div className="space-y-2 text-zinc-300">
                  <div className="p-2 bg-zinc-900/60 rounded border border-zinc-800">
                    <div className="font-semibold text-white">New Premiere Today</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      "Dhaka Nights: The Underworld" is now streaming in 4K Ultra HD.
                    </div>
                  </div>
                  <div className="p-2 bg-zinc-900/60 rounded border border-zinc-800">
                    <div className="font-semibold text-amber-400">Subscription Status</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Current Plan: {currentUser.membershipPlan} ({currentUser.subscriptionStatus}).
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-1.5 focus:outline-none group p-0.5"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded object-cover ring-1 ring-zinc-700 group-hover:ring-white transition"
              />
              <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-white transition" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-black/95 border border-zinc-800 rounded-md shadow-2xl p-2 z-50 text-xs">
                {/* User info card */}
                <div className="px-2 py-2 border-b border-zinc-800 mb-1">
                  <div className="font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{currentUser.email}</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                    Tier: {currentUser.membershipPlan}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigate('profile');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded"
                >
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Profile &amp; Subscription</span>
                </button>

                <button
                  onClick={() => {
                    onOpenMembership();
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Membership Plans</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAdmin();
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-zinc-300 hover:text-red-400 hover:bg-zinc-900 rounded"
                >
                  <Shield className="w-3.5 h-3.5 text-red-500" />
                  <span>Admin Panel</span>
                </button>

                <div className="h-[1px] bg-zinc-800 my-1" />

                <button
                  onClick={() => {
                    onOpenAuth();
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded"
                >
                  <LogIn className="w-3.5 h-3.5 text-sky-400" />
                  <span>Switch / Sign In</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-red-400 hover:bg-zinc-900 rounded"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-zinc-300 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#141414] border-b border-zinc-800 px-6 py-4 space-y-3 mt-2 shadow-2xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left text-sm py-1.5 font-medium ${
                currentView === link.id ? 'text-[#E50914] font-bold' : 'text-zinc-300'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => {
                onNavigate('profile');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-zinc-300 flex items-center gap-1 font-semibold"
            >
              <User className="w-3.5 h-3.5 text-[#E50914]" />
              <span>My Profile &amp; Plans</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-red-400 flex items-center gap-1 font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
