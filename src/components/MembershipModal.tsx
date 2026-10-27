import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Tv, Smartphone, Zap } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../data/plans';
import { UserProfile } from '../types/streaming';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onUpdatePlan: (plan: 'Free' | 'Standard' | 'Premium') => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onUpdatePlan,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<'Free' | 'Standard' | 'Premium'>(
    currentProfile.membershipPlan
  );
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleConfirmPlan = () => {
    onUpdatePlan(selectedPlanId);
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#141414] border border-zinc-800 rounded-lg overflow-hidden shadow-2xl p-6 sm:p-8 my-auto text-white space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-lg mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-[#E50914] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SiamFlix Membership</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Choose the plan that's right for you
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Watch all of SiamFlix &amp; SSK Films in brilliant clarity. Switch or cancel anytime.
          </p>
        </div>

        {/* Plans Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isCurrent = currentProfile.membershipPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-lg p-5 flex flex-col justify-between transition cursor-pointer border ${
                  isSelected
                    ? 'border-[#E50914] bg-gradient-to-b from-red-950/30 via-zinc-900 to-zinc-950 shadow-xl shadow-red-950/20 ring-1 ring-[#E50914]'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                }`}
              >
                {/* Plan Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E50914] text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div>
                      <h3 className="text-base font-bold text-white">{plan.name}</h3>
                      <div className="text-xs text-zinc-400 font-mono">{plan.resolution}</div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                        Active Plan
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="py-4">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-zinc-400 ml-1">/{plan.billingPeriod}</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 text-xs text-zinc-300">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>{plan.simultaneousScreens} screens</span>
                  <span className="text-zinc-200 font-semibold">{plan.audio}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation Footer */}
        <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure 256-bit encryption · No contract commitments</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmPlan}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white font-bold rounded text-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              {successMessage ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Plan Activated!</span>
                </>
              ) : (
                <span>Switch to {selectedPlanId}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
