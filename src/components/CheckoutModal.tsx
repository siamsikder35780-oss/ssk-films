import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  Sparkles,
  Check,
  Loader2,
  AlertCircle,
  Film,
} from 'lucide-react';
import { MembershipPlan, Movie, UserAccount } from '../types/streaming';
import { MEMBERSHIP_PLANS } from '../data/plans';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMovie?: Movie | null;
  targetPlan?: MembershipPlan;
  currentUser: UserAccount;
  onPaymentSuccess: (updatedUser: UserAccount) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  targetMovie,
  targetPlan = MEMBERSHIP_PLANS[2], // Default to Premium
  currentUser,
  onPaymentSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(currentUser.name || 'Siam Sikder');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAutofillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardName(currentUser.name || 'Siam Sikder');
    setExpiry('12/28');
    setCvc('888');
    setErrorMsg(null);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 16) {
      setErrorMsg('Please enter a valid 16-digit payment card number.');
      return;
    }
    if (!expiry || !cvc) {
      setErrorMsg('Please provide card expiration date and CVV.');
      return;
    }

    setIsVerifying(true);

    // Simulate real gateway verification (Stripe/PayPal test mode)
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);

      const lastFour = cleanCard.slice(-4) || '4242';
      const updatedUser: UserAccount = {
        ...currentUser,
        membershipPlan: 'Premium',
        subscriptionStatus: 'active',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        paymentMethod: {
          cardBrand: 'Visa',
          lastFour,
          expiry,
        },
      };

      setTimeout(() => {
        onPaymentSuccess(updatedUser);
        onClose();
      }, 1200);
    }, 1400);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#181818] border border-zinc-800 rounded-lg p-6 sm:p-8 text-white shadow-2xl space-y-5"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Test Payment Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Activate Premium 4K Membership
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {targetMovie ? (
              <span>
                <strong className="text-white">"{targetMovie.title}"</strong> is an exclusive 4K title. Verify test payment to unlock immediately.
              </span>
            ) : (
              <span>Unlimited 4K HDR streaming and offline downloads on 4 devices.</span>
            )}
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="p-3.5 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-white text-sm">{targetPlan.name}</div>
            <div className="text-zinc-400 text-[11px] font-mono">
              Includes 4K UHD, HDR10, and Dolby Atmos
            </div>
          </div>
          <div className="text-right">
            <div className="font-black text-white text-lg">{targetPlan.price}</div>
            <div className="text-[10px] text-zinc-400">{targetPlan.billingPeriod}</div>
          </div>
        </div>

        {/* Test Card Quick Fill Button */}
        <div className="p-2.5 bg-red-950/20 border border-red-800/40 rounded flex items-center justify-between text-xs">
          <div className="text-zinc-300">
            <span className="font-bold text-amber-400">Sandbox Test Mode: </span>
            <span className="text-[11px] text-zinc-400">No real funds are charged.</span>
          </div>
          <button
            type="button"
            onClick={handleAutofillTestCard}
            className="px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded font-bold text-[11px] transition"
          >
            Autofill Test Card
          </button>
        </div>

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-800/80 rounded text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {verificationSuccess && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Payment Verified! Activating your Premium 4K subscription...</span>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleProcessPayment} className="space-y-3.5 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1 font-medium">Card Number</label>
            <div className="relative">
              <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                required
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full bg-zinc-900 border border-zinc-700 rounded pl-9 pr-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-400 block mb-1 font-medium">Expires (MM/YY)</label>
              <input
                type="text"
                required
                maxLength={5}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="12/28"
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-white font-mono focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-medium">Security CVC</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="888"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-white font-mono focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-medium">Cardholder Name</label>
            <input
              type="text"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Full name on card"
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-white focus:outline-none focus:border-[#E50914]"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || verificationSuccess}
            className="w-full py-3 bg-[#E50914] hover:bg-[#b80710] font-bold text-white rounded text-sm transition shadow-lg flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Test Transaction...</span>
              </>
            ) : verificationSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Verified!</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Verify &amp; Subscribe for {targetPlan.price}</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted test sandbox · Safe cancellation anytime</span>
        </div>
      </div>
    </div>
  );
};
