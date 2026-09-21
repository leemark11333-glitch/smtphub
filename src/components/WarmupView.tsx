import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sliders,
  Play,
  Pause,
  Clock,
  Sparkles,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { WarmupProfile } from '../types';

interface WarmupViewProps {
  warmup: WarmupProfile;
  onToggleWarmup: () => void;
}

export const WarmupView: React.FC<WarmupViewProps> = ({ warmup, onToggleWarmup }) => {
  const [targetEmails, setTargetEmails] = useState(warmup.targetDailyLimit);
  const [dailyRamp, setDailyRamp] = useState(15); // 15% increase per day
  const [simulatedReplies, setSimulatedReplies] = useState(42);

  const progressPct = Math.round((warmup.currentDay / warmup.totalDays) * 100);
  const todayProgress = Math.round((warmup.todaySent / warmup.todayTarget) * 100);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Automated IP & Domain Warmup</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/15 text-orange-300 border border-orange-500/30">
              DAY {warmup.currentDay} OF {warmup.totalDays}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gradually increase sending volume through a network of 50,000+ verified warm mailboxes to establish high domain reputation.
          </p>
        </div>

        <button
          onClick={onToggleWarmup}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 cursor-pointer ${
            warmup.status === 'active'
              ? 'bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-orange-500/20'
              : 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
          }`}
        >
          {warmup.status === 'active' ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Warmup Engine</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Resume Warmup Engine</span>
            </>
          )}
        </button>
      </div>

      {/* Warmup Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Deliverability Reputation */}
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Domain Reputation</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {warmup.reputationScore} / 100
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Tier-1 Sender Standing</span>
          </p>
        </div>

        {/* Primary Inbox Placement */}
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Primary Inbox Rate</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {warmup.inboxPlacement}%
          </div>
          <p className="text-[11px] text-teal-400 mt-1 font-mono">
            Gmail, Outlook, Yahoo Verified
          </p>
        </div>

        {/* Spam Placement Saved */}
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Spam Folder Rescues</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            18 Saved
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Auto-moved to Primary & Marked Important
          </p>
        </div>

        {/* Today's Ramp Target */}
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Today's Dispatch Quota</span>
          <div className="text-2xl font-black text-orange-400 font-mono mt-1">
            {warmup.todaySent.toLocaleString()} / {warmup.todayTarget.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            {todayProgress}% of daily curve reached
          </p>
        </div>
      </div>

      {/* Ramp Schedule Visualizer */}
      <div className="p-6 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span>30-Day Automated Ramp-Up Curve</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulates realistic human sending velocity and natural reply threads.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span>Overall Warmup Progress:</span>
            <span className="text-emerald-400 font-bold">{progressPct}%</span>
          </div>
        </div>

        {/* Ramp Chart Visualization */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-white/[0.08]">
          {warmup.rampHistory.map((pt) => {
            const height = Math.min(100, Math.max(15, Math.round((pt.sent / 10000) * 100)));
            const isToday = pt.day === warmup.currentDay;

            return (
              <div key={pt.day} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 hidden group-hover:block px-2 py-1 rounded bg-slate-900 border border-white/[0.15] text-[10px] font-mono whitespace-nowrap z-10 shadow-lg text-center">
                  <div className="text-white font-bold">Day {pt.day}</div>
                  <div className="text-orange-400">{pt.sent.toLocaleString()} warmup emails</div>
                </div>

                <div className="w-full max-w-[36px] bg-white/[0.04] rounded-t-md h-full flex items-end">
                  <div
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-t transition-all ${
                      isToday
                        ? 'bg-gradient-to-t from-orange-600 to-amber-400 animate-pulse'
                        : 'bg-gradient-to-t from-orange-600/60 to-amber-500/60'
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          {warmup.rampHistory.map((pt) => (
            <span key={pt.day}>Day {pt.day}</span>
          ))}
        </div>
      </div>

      {/* Warmup Settings Controller */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Ramp Pacing Configuration</h3>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-mono">
              <span>Maximum Target Capacity</span>
              <span className="text-emerald-400 font-bold">{targetEmails.toLocaleString()} emails/day</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={targetEmails}
              onChange={(e) => setTargetEmails(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-mono">
              <span>Daily Ramp Acceleration</span>
              <span className="text-orange-400 font-bold">+{dailyRamp}% / day</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={dailyRamp}
              onChange={(e) => setDailyRamp(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Simulated Engagement Protocol</h3>
          </div>
          <p className="text-xs text-slate-400">
            Peers in the SMTPHUB Warmup Network open, star, mark important, and reply with custom conversation threads.
          </p>

          <div className="space-y-2.5 text-xs">
            <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
              <span>Auto-reply to 30-40% of warmup test messages</span>
            </label>
            <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
              <span>Mark all warmup emails as "Important / Starred"</span>
            </label>
            <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
              <span>Rescue any messages caught in Spam / Promotions tab</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
