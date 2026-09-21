import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  Zap,
  Server,
  ShieldCheck,
  Send,
  MessageCircle,
  Copy,
  CheckCircle2,
  ExternalLink,
  Gift,
  HelpCircle,
  ArrowRight,
  Flame,
  Radio,
  Layers,
  Sparkles,
  Clock,
  ChevronRight
} from 'lucide-react';
import { AppUser, PlanTier } from '../types';
import { SUBSCRIPTION_PLANS, TELEGRAM_ADMIN_ID, TELEGRAM_LINK } from '../data/plansData';
import { checkUserAccessValidity } from '../utils/authUtils';

interface BillingPlansViewProps {
  currentUser: AppUser | null;
  onOpenAuth?: () => void;
  onSelectPlan?: (planId: string) => void;
}

export const BillingPlansView: React.FC<BillingPlansViewProps> = ({
  currentUser,
  onOpenAuth,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [applyBonusCredit, setApplyBonusCredit] = useState(true);
  const [copiedTelegramId, setCopiedTelegramId] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const validity = currentUser ? checkUserAccessValidity(currentUser) : null;
  const userCredit = currentUser?.creditBalance ?? 10;

  const handleOpenBuyModal = (plan: PlanTier) => {
    setSelectedPlan(plan);
    setCopiedTelegramId(false);
    setCopiedMessage(false);
  };

  const handleCloseBuyModal = () => {
    setSelectedPlan(null);
  };

  const copyTelegramId = () => {
    navigator.clipboard.writeText(TELEGRAM_ADMIN_ID);
    setCopiedTelegramId(true);
    setTimeout(() => setCopiedTelegramId(false), 2500);
  };

  const getOrderMessage = (plan: PlanTier, creditApplied: boolean) => {
    const finalPrice = creditApplied && userCredit > 0 ? plan.price - userCredit : plan.price;
    const userEmail = currentUser?.email || 'my-account@email.com';
    const userName = currentUser?.name || 'Client';
    return `Hello ${TELEGRAM_ADMIN_ID}, I would like to purchase the ${plan.name} (${plan.emailsPerDay}) on SMTPHUB.
Account: ${userEmail} (${userName})
Plan Price: $${plan.price}/mo
${creditApplied && userCredit > 0 ? `Bonus Credit Applied: -$${userCredit}.00\n` : ''}Final Total: $${finalPrice}/mo
Please provide payment details (Crypto USDT / Card / Wire) to activate my SMTP license.`;
  };

  const copyOrderMessage = () => {
    if (!selectedPlan) return;
    const msg = getOrderMessage(selectedPlan, applyBonusCredit);
    navigator.clipboard.writeText(msg);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              High-Throughput SMTP Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
              Instant Node Setup
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Subscription Plans & Licensing
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Multi-relay email rotation across Amazon SES, Postmark, Mailgun, and self-hosted VPS. High inbox placement with automated IP warmup and bounce failover.
          </p>
        </div>

        {/* Current User Credit Card / Status */}
        {currentUser ? (
          <div className="p-4 rounded-2xl bg-[#111420] border border-white/[0.1] shadow-xl flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Gift className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Account Balance</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500 text-slate-950">
                  BONUS
                </span>
              </div>
              <div className="text-xl font-mono font-black text-white">
                ${userCredit}.00 <span className="text-xs font-normal text-emerald-400">Credit</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>
                  {validity?.isValid
                    ? `${validity.remainingDays} days validity remaining`
                    : 'License expired - Extend now'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 shrink-0">
            <Gift className="w-8 h-8 text-emerald-400 shrink-0 animate-bounce" />
            <div>
              <div className="text-xs font-bold text-white">$10.00 Signup Bonus Credit</div>
              <div className="text-[11px] text-slate-300">Register today to receive $10 instant credit!</div>
            </div>
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer ml-2 shrink-0"
              >
                Sign In / Up
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bonus Credit Callout Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>$10.00 Signup Bonus Credit Applicable to All Plans</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold uppercase">
                Active Offer
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              New signups receive $10.00 bonus balance upon account registration. Apply it directly at checkout toward your Basic, Advance, or Pro tier!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 shrink-0">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <span>Telegram Support:</span>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1"
          >
            {TELEGRAM_ADMIN_ID}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 3 Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isAdvance = plan.popular;
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                isAdvance
                  ? 'bg-gradient-to-b from-[#131b2e] to-[#0c101c] border-2 border-emerald-500/60 shadow-2xl shadow-emerald-500/15 scale-[1.02] lg:-translate-y-2'
                  : 'bg-[#0f131f] border border-white/[0.08] hover:border-white/[0.18]'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-wider uppercase shadow-md ${
                      isAdvance
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-emerald-500/30'
                        : 'bg-white/[0.1] text-slate-300 border border-white/[0.15]'
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300">
                    {plan.id === 'basic' && <Server className="w-4 h-4 text-cyan-400" />}
                    {plan.id === 'advance' && <Flame className="w-4 h-4 text-emerald-400" />}
                    {plan.id === 'pro' && <Zap className="w-4 h-4 text-amber-400" />}
                  </div>
                </div>

                {/* Price Display */}
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{plan.period}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                      {plan.emailsPerDay}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({plan.monthlyCapacity})
                    </span>
                  </div>
                </div>

                {/* SMTP Description Box */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SMTP Protocols & Relays:</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {plan.smtpDescription}
                  </p>

                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="text-[10px] font-mono text-slate-500 mb-1.5 uppercase tracking-wider">
                      Compatible Relays
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plan.supportedRelays.map((relay, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                        >
                          {relay}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-bold text-slate-300">Key Capabilities Included:</div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Buy Now Button */}
              <div className="pt-6 mt-6 border-t border-white/[0.08] space-y-2">
                <button
                  type="button"
                  onClick={() => handleOpenBuyModal(plan)}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                    isAdvance
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/25 font-black'
                      : 'bg-white/[0.08] hover:bg-emerald-500 hover:text-slate-950 text-white border border-white/[0.12]'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Buy Now &bull; ${plan.price}/mo</span>
                </button>

                <div className="text-center text-[10px] font-mono text-slate-500 flex items-center justify-center gap-1">
                  <span>Fast Telegram activation with</span>
                  <span className="text-slate-400 font-bold">{TELEGRAM_ADMIN_ID}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature & Protocol Comparison Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0f131f] border border-white/[0.08] space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">How SMTP Relay Routing Operates</h3>
            <p className="text-xs text-slate-400">
              SMTPHUB dynamically balances outgoing traffic between connected cloud and VPS relays to ensure zero rate-limit blocks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06] space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-IP Load Balancing</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Distribute bursts across multiple IP addresses. When ISP algorithms detect high volumes on one IP, secondary relays absorb traffic automatically.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06] space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Automated Ramp-Up Protocols</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              New sender domains are safely warmed over 30 days. Sending volume ramps gradually from 50/day up to full plan capacity without burning reputation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06] space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              <span>24/7 Licensing via Telegram</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Get rapid key provisioning, custom quota allocation, and dedicated setup support directly through our verified Telegram handle <strong>{TELEGRAM_ADMIN_ID}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* BUY NOW / TELEGRAM ORDER MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e111a] border border-white/[0.15] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative my-8">
            {/* Close Button */}
            <button
              onClick={handleCloseBuyModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                  Order & License Activation
                </span>
                <span className="text-xs text-slate-400 font-mono">Instant Setup</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Purchase {selectedPlan.name}
              </h2>
              <p className="text-xs text-slate-400">
                Contact our licensing specialist on Telegram to complete payment and receive your activation credentials.
              </p>
            </div>

            {/* Selected Plan Summary Card */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{selectedPlan.name}</div>
                  <div className="text-xs text-emerald-400 font-mono font-semibold">
                    {selectedPlan.emailsPerDay}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold font-mono text-white">
                    ${selectedPlan.price}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {selectedPlan.monthlyCapacity}
                  </div>
                </div>
              </div>

              {/* Bonus Credit Deduction Toggle */}
              {userCredit > 0 && (
                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={applyBonusCredit}
                      onChange={(e) => setApplyBonusCredit(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-emerald-300 font-semibold flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-emerald-400" />
                      Apply $10 Signup Bonus Credit
                    </span>
                  </label>
                  <span className="font-mono font-bold text-emerald-400">
                    {applyBonusCredit ? `-$${userCredit}.00` : '$0.00'}
                  </span>
                </div>
              )}

              {/* Total Due */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-sm">
                <span className="text-slate-300 font-bold">Total Amount Due:</span>
                <span className="text-lg font-black font-mono text-emerald-400">
                  ${applyBonusCredit && userCredit > 0 ? selectedPlan.price - userCredit : selectedPlan.price}
                  <span className="text-xs text-slate-400 font-normal"> / month</span>
                </span>
              </div>
            </div>

            {/* Telegram Contact Option Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-950/40 via-blue-950/20 to-black/40 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono">Contact License Admin</div>
                    <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      <span>Telegram ID:</span>
                      <span className="text-cyan-400 font-mono">{TELEGRAM_ADMIN_ID}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={copyTelegramId}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-slate-300 border border-white/[0.1] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {copiedTelegramId ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Telegram Chat Button */}
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Open Telegram & Chat with {TELEGRAM_ADMIN_ID}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>

              {/* Pre-formatted Message Copy Helper */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Pre-written Order Message:</span>
                  <button
                    type="button"
                    onClick={copyOrderMessage}
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedMessage ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Message Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/[0.06] text-[11px] font-mono text-slate-300 leading-relaxed select-all">
                  {getOrderMessage(selectedPlan, applyBonusCredit)}
                </div>
              </div>
            </div>

            {/* Payment & Activation Assurance */}
            <div className="text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Accepted Payment Methods via Telegram:</span>
              </div>
              <p className="leading-snug">
                USDT (TRC20 / ERC20), Bitcoin, Credit/Debit Card, Wire Transfer, and PayPal. Once payment is confirmed, license keys and SMTP cluster nodes are provisioned in under 5 minutes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseBuyModal}
              className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
