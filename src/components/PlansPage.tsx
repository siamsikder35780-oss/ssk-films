import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Tv, Smartphone, Laptop, Zap, ArrowRight, Lock } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../data/plans';
import { MembershipPlan, UserAccount } from '../types/streaming';

interface PlansPageProps {
  currentUser: UserAccount;
  onSelectPlanForCheckout: (plan: MembershipPlan) => void;
  onDowngradeToFree: () => void;
  onReturnToBrowse: () => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({
  currentUser,
  onSelectPlanForCheckout,
  onDowngradeToFree,
  onReturnToBrowse,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<'Free' | 'Standard' | 'Premium'>(
    currentUser.membershipPlan
  );

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 pb-20 bg-[#141414] text-white select-none">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-[#E50914] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SiamFlix Membership Plans</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Flexible plans for every cinema fan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Enjoy unlimited movies and series in crisp 4K Ultra HD and Dolby Atmos. Switch plans, upgrade, or cancel anytime.
          </p>
        </div>

        {/* Current Active Plan Status Banner */}
        <div className="p-4 bg-zinc-900/80 rounded-lg border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#E50914] font-bold">
              ⭐
            </div>
            <div>
              <div className="font-bold text-white">
                Active Tier for {currentUser.name}: <span className="text-amber-400">{currentUser.membershipPlan}</span>
              </div>
              <div className="text-zinc-400 text-[11px]">
                Subscription status: <strong className="text-emerald-400 capitalize">{currentUser.subscriptionStatus}</strong> (Next renewal: {currentUser.renewalDate})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReturnToBrowse}
              className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-medium text-xs transition"
            >
              Back to Movies
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isCurrent = currentUser.membershipPlan === plan.id;
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-xl p-6 sm:p-7 flex flex-col justify-between transition cursor-pointer border ${
                  isSelected
                    ? 'border-[#E50914] bg-gradient-to-b from-red-950/40 via-zinc-900 to-zinc-950 shadow-2xl ring-2 ring-[#E50914]/80'
                    : 'border-zinc-800 bg-[#181818] hover:border-zinc-700'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E50914] text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">{plan.resolution}</div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="py-2">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-zinc-400 ml-1.5 font-medium">/{plan.billingPeriod}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 text-xs text-zinc-300 pt-1">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 pt-4 border-t border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span>{plan.simultaneousScreens} screens at once</span>
                    <span className="text-zinc-200 font-bold">{plan.audio}</span>
                  </div>

                  {isCurrent ? (
                    <div className="w-full py-2.5 bg-zinc-800 text-zinc-300 font-semibold rounded text-xs text-center">
                      Current Active Plan
                    </div>
                  ) : plan.id === 'Free' ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDowngradeToFree();
                      }}
                      className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded text-xs transition border border-zinc-700"
                    >
                      Downgrade to Free
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlanForCheckout(plan);
                      }}
                      className="w-full py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white font-bold rounded text-xs transition shadow-lg flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <span>Subscribe with Test Card</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Feature Table */}
        <div className="bg-[#181818] border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-zinc-800">
            Compare Plan Features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-mono">
                  <th className="py-2.5 pr-4">Feature</th>
                  <th className="py-2.5 px-4">Free Plan</th>
                  <th className="py-2.5 px-4">Standard HD</th>
                  <th className="py-2.5 px-4 text-[#E50914] font-bold">Premium 4K</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                <tr>
                  <td className="py-3 pr-4 text-white font-bold">Monthly Price</td>
                  <td className="py-3 px-4">$0 Forever</td>
                  <td className="py-3 px-4">$6.99 / mo</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">$12.99 / mo</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white font-bold">Max Video Quality</td>
                  <td className="py-3 px-4">720p HD</td>
                  <td className="py-3 px-4">1080p Full HD</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">4K UHD + HDR10</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white font-bold">Exclusive Premium Titles</td>
                  <td className="py-3 px-4 text-zinc-500">Locked (Paywall)</td>
                  <td className="py-3 px-4 text-emerald-400">Unlimited Access</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Unlimited + Early Access</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white font-bold">Audio Quality</td>
                  <td className="py-3 px-4">Stereo 2.0</td>
                  <td className="py-3 px-4">5.1 Surround Sound</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">Dolby Atmos Spatial Audio</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white font-bold">Simultaneous Screens</td>
                  <td className="py-3 px-4">1 Device</td>
                  <td className="py-3 px-4">2 Devices</td>
                  <td className="py-3 px-4 text-white font-bold">4 Devices</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white font-bold">Offline Downloads</td>
                  <td className="py-3 px-4 text-zinc-500">None</td>
                  <td className="py-3 px-4">2 Devices</td>
                  <td className="py-3 px-4 text-white font-bold">Up to 6 Devices</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
