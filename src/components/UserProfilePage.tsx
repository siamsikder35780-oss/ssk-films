import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Film,
  Check,
  Calendar,
  LogOut,
  Clock,
  ArrowRight,
  Bookmark,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { UserAccount } from '../types/streaming';
import { MEMBERSHIP_PLANS } from '../data/plans';

interface UserProfilePageProps {
  currentUser: UserAccount;
  onOpenMembership: () => void;
  onOpenCheckout: () => void;
  onLogout: () => void;
  onNavigateToMyList: () => void;
  onUpdateUser: (updated: UserAccount) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  currentUser,
  onOpenMembership,
  onOpenCheckout,
  onLogout,
  onNavigateToMyList,
  onUpdateUser,
}) => {
  const [preferredLang, setPreferredLang] = useState('Bengali');
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const planDetails =
    MEMBERSHIP_PLANS.find((p) => p.id === currentUser.membershipPlan) ||
    MEMBERSHIP_PLANS[0];

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your Premium subscription? You will return to the Free plan at the end of the billing cycle.')) {
      const updated: UserAccount = {
        ...currentUser,
        membershipPlan: 'Free',
        subscriptionStatus: 'cancelled',
      };
      onUpdateUser(updated);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    }
  };

  const handleSavePreferences = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 pb-16 bg-[#141414] text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Hero Card */}
        <div className="bg-[#181818] border border-zinc-800 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover ring-2 ring-[#E50914] shadow-lg"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {currentUser.membershipPlan}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">{currentUser.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-zinc-500 font-mono mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {currentUser.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 rounded text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Subscription Status Section (Required) */}
        <div className="bg-[#181818] border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Membership &amp; Subscription Status
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Billing: {planDetails.price}/{planDetails.billingPeriod}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Current Plan */}
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Current Tier</span>
              <div className="font-bold text-white text-base flex items-center gap-1.5">
                <span>{planDetails.name}</span>
                {currentUser.membershipPlan === 'Premium' && (
                  <span className="text-amber-400 text-xs">⭐</span>
                )}
              </div>
              <div className="text-zinc-400 text-[11px] font-mono">{planDetails.resolution}</div>
            </div>

            {/* Status & Renewal */}
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Status &amp; Renewal</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-emerald-400 capitalize">
                  {currentUser.subscriptionStatus}
                </span>
              </div>
              <div className="text-zinc-400 text-[11px] font-mono">
                Next billing: {currentUser.renewalDate}
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Payment Card</span>
              {currentUser.paymentMethod ? (
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-zinc-400" />
                  <span>{currentUser.paymentMethod.cardBrand} •••• {currentUser.paymentMethod.lastFour}</span>
                </div>
              ) : (
                <div className="text-zinc-400 font-medium">No card on file (Free Plan)</div>
              )}
              <div className="text-zinc-400 text-[11px] font-mono">
                {currentUser.paymentMethod ? `Exp: ${currentUser.paymentMethod.expiry}` : 'Standard access'}
              </div>
            </div>
          </div>

          {/* Subscription Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {currentUser.membershipPlan === 'Free' ? (
                <button
                  onClick={onOpenCheckout}
                  className="px-5 py-2 bg-[#E50914] hover:bg-[#b80710] font-bold text-white text-xs rounded transition shadow-lg flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade to Premium 4K</span>
                </button>
              ) : (
                <button
                  onClick={onOpenMembership}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded transition"
                >
                  Change Subscription Plan
                </button>
              )}

              {currentUser.membershipPlan !== 'Free' && (
                <button
                  onClick={handleCancelSubscription}
                  className="px-3 py-2 text-zinc-400 hover:text-red-400 text-xs font-medium transition"
                >
                  Cancel Subscription
                </button>
              )}
            </div>

            <div className="text-[11px] text-zinc-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified encrypted streaming license</span>
            </div>
          </div>
        </div>

        {/* Private Watchlist & Continue Watching Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={onNavigateToMyList}
            className="p-5 bg-[#181818] border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-red-600/10 border border-red-600/30 flex items-center justify-center text-[#E50914]">
                <Bookmark className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-[#E50914] transition">
                  Private Watchlist (My List)
                </h3>
                <p className="text-xs text-zinc-400">{currentUser.myList.length} saved movies &amp; series</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition" />
          </div>

          <div
            onClick={onNavigateToMyList}
            className="p-5 bg-[#181818] border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition">
                  Continue Watching
                </h3>
                <p className="text-xs text-zinc-400">{currentUser.continueWatching.length} in-progress titles</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition" />
          </div>
        </div>

        {/* Streaming & Audio Preferences */}
        <div className="bg-[#181818] border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-4 shadow-xl text-xs">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sliders className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-bold text-white">Playback &amp; Audio Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 block mb-1">Preferred Audio Language</label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white"
              >
                <option value="Bengali">Bengali (বাংলা Original)</option>
                <option value="Hindi">Hindi (हिंदी Dubbed)</option>
                <option value="English">English</option>
                <option value="Korean">Korean (한국어)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-900 rounded border border-zinc-800">
              <div>
                <div className="font-bold text-white">Autoplay Next Episode</div>
                <div className="text-[11px] text-zinc-400">Play next web series episode automatically</div>
              </div>
              <input
                type="checkbox"
                checked={autoplayNext}
                onChange={(e) => setAutoplayNext(e.target.checked)}
                className="w-4 h-4 accent-[#E50914] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedNotice ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" /> Preferences saved!
              </span>
            ) : (
              <span className="text-zinc-500">Settings synced to this device</span>
            )}
            <button
              onClick={handleSavePreferences}
              className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-medium"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
