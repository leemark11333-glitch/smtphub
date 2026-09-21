import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  Eye,
  MousePointerClick,
  AlertTriangle,
  Server,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Plus,
  RefreshCw,
  Clock,
  Radio,
  ExternalLink,
  Gift,
  CreditCard,
  MessageCircle,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { Campaign, SmtpAccount, LiveEmailEvent, ActiveNav, AppUser } from '../types';
import { checkUserAccessValidity } from '../utils/authUtils';
import { TELEGRAM_ADMIN_ID, TELEGRAM_LINK } from '../data/plansData';

interface DashboardViewProps {
  campaigns: Campaign[];
  smtpAccounts: SmtpAccount[];
  liveEvents: LiveEmailEvent[];
  setActiveNav: (nav: ActiveNav) => void;
  onOpenTestModal: () => void;
  currentUser?: AppUser | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  campaigns,
  smtpAccounts,
  liveEvents,
  setActiveNav,
  onOpenTestModal,
  currentUser,
}) => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  // Live countdown timer state (ticks every second)
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: false });

  useEffect(() => {
    const updateCountdown = () => {
      if (!currentUser || currentUser.role === 'admin') {
        return;
      }
      const validity = checkUserAccessValidity(currentUser);
      let targetTime = 0;
      if (currentUser.expiresAt) {
        targetTime = new Date(currentUser.expiresAt).getTime();
      } else if (currentUser.approvedAt && currentUser.accessDays) {
        targetTime = new Date(currentUser.approvedAt).getTime() + currentUser.accessDays * 86400000;
      } else if (currentUser.accessDays) {
        targetTime = new Date(currentUser.createdAt).getTime() + currentUser.accessDays * 86400000;
      }

      const diff = targetTime - Date.now();
      if (diff <= 0 || !validity.isValid) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true });
      } else {
        const totalSec = Math.floor(diff / 1000);
        const d = Math.floor(totalSec / 86400);
        const h = Math.floor((totalSec % 86400) / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        setCountdown({ days: d, hours: h, minutes: m, seconds: s, totalSeconds: totalSec, isExpired: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Hourly volume breakdown (24 hours)
  const hourlyData = [
    { hour: '00:00', sent: 320, delivered: 318 },
    { hour: '02:00', sent: 180, delivered: 180 },
    { hour: '04:00', sent: 120, delivered: 119 },
    { hour: '06:00', sent: 490, delivered: 488 },
    { hour: '08:00', sent: 1850, delivered: 1838 },
    { hour: '10:00', sent: 3420, delivered: 3395 },
    { hour: '12:00', sent: 4100, delivered: 4072 },
    { hour: '14:00', sent: 3890, delivered: 3860 },
    { hour: '16:00', sent: 2740, delivered: 2715 },
    { hour: '18:00', sent: 1980, delivered: 1965 },
    { hour: '20:00', sent: 1240, delivered: 1230 },
    { hour: '22:00', sent: 750, delivered: 746 },
  ];

  const maxSent = Math.max(...hourlyData.map((d) => d.sent));

  // High-level aggregates
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + c.deliveredCount, 0);
  const totalOpened = campaigns.reduce((acc, c) => acc + c.openedCount, 0);
  const totalClicked = campaigns.reduce((acc, c) => acc + c.clickedCount, 0);
  const totalBounced = campaigns.reduce((acc, c) => acc + c.bouncedCount, 0);

  const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : '99.2';
  const openRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : '48.1';
  const clickRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : '20.7';
  const bounceRate = totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(2) : '0.42';

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* USER LICENSE LIVE COUNTDOWN & EXTENSION BAR */}
      {currentUser && currentUser.role === 'user' && (
        <>
          {countdown.isExpired ? (
            /* EXPIRED LICENSE PROMPT TO EXTEND */
            <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-rose-950/60 via-[#181119] to-red-950/40 border-2 border-rose-500/50 shadow-2xl shadow-rose-950/50 space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start md:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-slate-950 uppercase">
                        License Expired
                      </span>
                      <h2 className="text-base md:text-lg font-extrabold text-white">
                        License Login Time Has Reached Zero (00d 00h 00m 00s)
                      </h2>
                    </div>
                    <p className="text-xs text-rose-200/90 leading-relaxed max-w-2xl">
                      Your assigned login validity period for account <strong>{currentUser.email}</strong> has reached zero. Outbound email dispatching and SMTP relay connections are locked. Please extend your license to resume operations.
                    </p>
                  </div>
                </div>

                {/* Credit balance reminder */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-right shrink-0">
                  <div className="text-[10px] font-mono text-slate-400">Bonus Credit</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">
                    ${currentUser.creditBalance ?? 10}.00 Available
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-rose-500/20">
                <button
                  type="button"
                  onClick={() => setActiveNav('billing')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Extend License Now (Plans from $299)</span>
                </button>

                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-cyan-400" />
                  <span>Instant Activation via Telegram ({TELEGRAM_ADMIN_ID})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            /* ACTIVE LICENSE COUNTDOWN BAR */
            <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#101424] to-cyan-950/30 border border-emerald-500/30 shadow-xl space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left: User & Plan info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-emerald-400 animate-spin" />
                      Active License
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {currentUser.name} ({currentUser.email})
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
                    License Login Time Ends In:
                  </h2>
                </div>

                {/* Center: Live Digital Countdown Blocks */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Days */}
                  <div className="px-3 sm:px-4 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-center min-w-[62px]">
                    <div className="text-xl sm:text-2xl font-mono font-black text-emerald-400">
                      {String(countdown.days).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                      Days
                    </div>
                  </div>

                  <span className="text-xl font-bold text-emerald-400/60 font-mono">:</span>

                  {/* Hours */}
                  <div className="px-3 sm:px-4 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-center min-w-[62px]">
                    <div className="text-xl sm:text-2xl font-mono font-black text-white">
                      {String(countdown.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                      Hours
                    </div>
                  </div>

                  <span className="text-xl font-bold text-emerald-400/60 font-mono">:</span>

                  {/* Minutes */}
                  <div className="px-3 sm:px-4 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-center min-w-[62px]">
                    <div className="text-xl sm:text-2xl font-mono font-black text-white">
                      {String(countdown.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                      Mins
                    </div>
                  </div>

                  <span className="text-xl font-bold text-emerald-400/60 font-mono">:</span>

                  {/* Seconds */}
                  <div className="px-3 sm:px-4 py-2 rounded-xl bg-black/60 border border-emerald-500/40 text-center min-w-[62px]">
                    <div className="text-xl sm:text-2xl font-mono font-black text-cyan-400 animate-pulse">
                      {String(countdown.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                      Secs
                    </div>
                  </div>
                </div>

                {/* Right: Actions & Bonus balance */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-right">
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Gift className="w-3 h-3 text-emerald-400" />
                      Bonus Credit
                    </div>
                    <div className="text-xs font-bold font-mono text-emerald-400">
                      ${currentUser.creditBalance ?? 10}.00 Available
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveNav('billing')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Extend License</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* MASTER ADMIN BANNER */}
      {currentUser && currentUser.role === 'admin' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-[#121324] to-purple-950/30 border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Master Administrator Session Active</span>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  PERPETUAL LICENSE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                You have master authority to approve user registrations, allocate login days, reset passwords, and oversee all SMTP cluster relays.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveNav('admin')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>Master Admin Panel</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner / Cluster Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#111420] to-cyan-950/30 border border-emerald-500/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Active SMTP Load Balancer</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                HEALTH: 99.8%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Routing outbound traffic across 4 geographically distributed SMTP nodes with dynamic failover.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setActiveNav('smtp')}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span>Manage Nodes</span>
          </button>
          <button
            onClick={() => setActiveNav('compose')}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Sent */}
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08] hover:border-emerald-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Total Sent</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {totalSent.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        {/* Delivery Rate */}
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08] hover:border-teal-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Delivery Rate</span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {deliveryRate}%
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-teal-400 font-mono">
            <span>{totalDelivered.toLocaleString()} delivered</span>
          </div>
        </div>

        {/* Open Rate */}
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08] hover:border-purple-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Unique Opens</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {openRate}%
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-purple-400 font-mono">
            <span>{totalOpened.toLocaleString()} opened</span>
          </div>
        </div>

        {/* Click Rate */}
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08] hover:border-cyan-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Click-Through</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <MousePointerClick className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {clickRate}%
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-cyan-400 font-mono">
            <span>{totalClicked.toLocaleString()} clicks</span>
          </div>
        </div>

        {/* Bounce Rate */}
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08] hover:border-rose-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Bounce Rate</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {bounceRate}%
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Optimal (&lt;2% target)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 24h Volume Chart + Live Dispatch Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Volume Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#111420] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">24-Hour Sending Velocity</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time throughput per 2-hour interval</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span className="text-slate-400">Dispatched</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400/60"></span>
                <span className="text-slate-400">Delivered</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-56 flex items-end justify-between gap-2 pt-8 pb-2 border-b border-white/[0.08]">
            {hourlyData.map((d, index) => {
              const heightPct = Math.round((d.sent / maxSent) * 100);
              const isHovered = hoveredHour === index;
              return (
                <div
                  key={d.hour}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                  onMouseEnter={() => setHoveredHour(index)}
                  onMouseLeave={() => setHoveredHour(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/[0.15] text-[11px] font-mono shadow-xl whitespace-nowrap text-center">
                      <div className="text-emerald-400 font-bold">{d.sent.toLocaleString()} sent</div>
                      <div className="text-slate-400 text-[10px]">{d.delivered.toLocaleString()} delivered</div>
                    </div>
                  )}

                  {/* Dual Bar */}
                  <div className="w-full max-w-[28px] bg-white/[0.04] rounded-t-md h-full flex items-end overflow-hidden">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-300 ${
                        isHovered
                          ? 'bg-gradient-to-t from-emerald-600 to-cyan-400'
                          : 'bg-gradient-to-t from-emerald-600/80 to-teal-400/80'
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart X-Axis */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
            {hourlyData.map((d) => (
              <span key={d.hour}>{d.hour}</span>
            ))}
          </div>
        </div>

        {/* Live Delivery Events Feed */}
        <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Live Event Stream</h3>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              ACTIVE FEED
            </span>
          </div>

          <div className="divide-y divide-white/[0.04] flex-1 overflow-y-auto max-h-64 mt-2 pr-1">
            {liveEvents.map((evt) => (
              <div key={evt.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      evt.type === 'opened'
                        ? 'bg-purple-400 ring-2 ring-purple-400/20'
                        : evt.type === 'clicked'
                        ? 'bg-cyan-400 ring-2 ring-cyan-400/20'
                        : evt.type === 'delivered'
                        ? 'bg-emerald-400 ring-2 ring-emerald-400/20'
                        : evt.type === 'bounced'
                        ? 'bg-rose-500 ring-2 ring-rose-500/20'
                        : 'bg-slate-400'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 capitalize font-mono text-[11px]">
                        {evt.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {evt.latencyMs}ms
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] truncate max-w-[160px] font-mono">
                      {evt.recipient}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[170px]">
                      via {evt.smtpNode.split(' ')[0]}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 self-start mt-0.5">
                  {evt.timestamp}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenTestModal}
            className="w-full mt-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trigger Test Dispatch</span>
          </button>
        </div>
      </div>

      {/* Bottom Grid: SMTP Node Health Status & Recent Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-SMTP Nodes Overview */}
        <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">SMTP Pool Status</h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated weighted load balancer</p>
            </div>
            <button
              onClick={() => setActiveNav('smtp')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3.5">
            {smtpAccounts.map((account) => {
              const usagePct = Math.round((account.sentToday / account.dailyLimit) * 100);
              return (
                <div key={account.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="font-semibold text-slate-200">{account.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {account.weight}% weight
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                    <span>{account.sentToday.toLocaleString()} / {account.dailyLimit.toLocaleString()} sent</span>
                    <span className="text-emerald-400 font-semibold">{account.healthScore}% health</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      style={{ width: `${usagePct}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Campaigns Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#111420] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Recent Outbound Campaigns</h3>
              <p className="text-xs text-slate-400 mt-0.5">Delivery benchmarks and engagement statistics</p>
            </div>
            <button
              onClick={() => setActiveNav('campaigns')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 font-mono text-[11px]">
                  <th className="pb-3 font-semibold">Campaign</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Recipients</th>
                  <th className="pb-3 font-semibold">Delivered</th>
                  <th className="pb-3 font-semibold">Open Rate</th>
                  <th className="pb-3 font-semibold">Click Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {campaigns.map((c) => {
                  const cDelivRate = c.sentCount > 0 ? ((c.deliveredCount / c.sentCount) * 100).toFixed(1) : '-';
                  const cOpenRate = c.deliveredCount > 0 ? ((c.openedCount / c.deliveredCount) * 100).toFixed(1) : '-';
                  const cClickRate = c.openedCount > 0 ? ((c.clickedCount / c.openedCount) * 100).toFixed(1) : '-';

                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-3">
                        <div className="font-semibold text-slate-200">{c.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{c.subject}</div>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                            c.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : c.status === 'sending'
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 animate-pulse'
                              : c.status === 'scheduled'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 pr-3 font-mono text-slate-300">
                        {c.recipientCount.toLocaleString()}
                      </td>
                      <td className="py-3 pr-3 font-mono text-emerald-400 font-semibold">
                        {cDelivRate !== '-' ? `${cDelivRate}%` : 'Pending'}
                      </td>
                      <td className="py-3 pr-3 font-mono text-purple-400 font-semibold">
                        {cOpenRate !== '-' ? `${cOpenRate}%` : 'Pending'}
                      </td>
                      <td className="py-3 font-mono text-cyan-400 font-semibold">
                        {cClickRate !== '-' ? `${cClickRate}%` : 'Pending'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
