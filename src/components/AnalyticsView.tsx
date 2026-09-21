import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Calendar,
  Download,
  CheckCircle2,
  Mail,
  MousePointerClick,
  AlertOctagon,
  Percent,
  Server,
  Layers
} from 'lucide-react';
import { AnalyticsSummary, AnalyticsDailyStat, SmtpAccount } from '../types';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary;
  smtpAccounts: SmtpAccount[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, smtpAccounts }) => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Delivery & Engagement Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Deep dive into delivery rates, engagement retention, mailbox provider splits, and node throughput.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#111420] border border-white/[0.08] p-1 rounded-xl">
            {['7d', '30d', '90d'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  timeRange === r ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="p-2 rounded-xl bg-[#111420] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Delivered</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {analytics.totalDelivered.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>99.2% Delivery Benchmark</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Unique Opens</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {analytics.totalOpens.toLocaleString()}
          </div>
          <div className="text-xs text-purple-400 font-mono flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" />
            <span>54.4% Avg Open Rate</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Click Throughs</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {analytics.totalClicks.toLocaleString()}
          </div>
          <div className="text-xs text-cyan-400 font-mono flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" />
            <span>19.7% Click-To-Open Ratio</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Hard Bounces</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {analytics.totalBounces.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <span>0.41% Rate (Well below 2% limit)</span>
          </div>
        </div>
      </div>

      {/* Daily Sends & Open Volume Histogram */}
      <div className="p-6 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white">Daily Sending & Delivery Trends</h3>
            <p className="text-xs text-slate-400">Volume tracking across past 14 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Delivered</span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Opened</span>
            </span>
          </div>
        </div>

        {/* Bar Chart Visualizer */}
        <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-white/[0.08]">
          {analytics.dailyStats.map((stat: AnalyticsDailyStat, i: number) => {
            const deliveredHeight = Math.min(100, Math.round((stat.delivered / 3500) * 100));
            const openedHeight = Math.min(100, Math.round((stat.opens / 3500) * 100));

            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-12 hidden group-hover:block px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.15] text-[10px] font-mono whitespace-nowrap z-10 shadow-xl text-center">
                  <div className="text-white font-bold">{stat.date}</div>
                  <div className="text-emerald-400">{stat.delivered.toLocaleString()} sent</div>
                  <div className="text-purple-400">{stat.opens.toLocaleString()} opens</div>
                </div>

                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div
                    style={{ height: `${deliveredHeight}%` }}
                    className="w-1/2 max-w-[18px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t transition-all group-hover:brightness-125"
                  ></div>
                  <div
                    style={{ height: `${openedHeight}%` }}
                    className="w-1/2 max-w-[18px] bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t transition-all group-hover:brightness-125"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          {analytics.dailyStats.map((stat: AnalyticsDailyStat, i: number) => (
            <span key={i} className="truncate max-w-[40px]">{stat.date.slice(5)}</span>
          ))}
        </div>
      </div>

      {/* SMTP Relay Nodes & Provider Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Node Performance */}
        <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Relay Cluster Breakdown</h3>
          </div>

          <div className="space-y-3">
            {smtpAccounts.map((acc) => (
              <div key={acc.id} className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{acc.name}</span>
                  <span className="text-emerald-400 font-mono font-bold">{acc.healthScore}% health</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Sent Today: {acc.sentToday.toLocaleString()}</span>
                  <span>Latency: {acc.latencyMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mailbox Provider Split */}
        <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Mailbox Provider Destination Split</h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Google Workspace / Gmail</span>
                <span className="font-bold text-emerald-400">58.4%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="w-[58.4%] h-full bg-emerald-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Microsoft 365 / Outlook</span>
                <span className="font-bold text-cyan-400">28.2%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="w-[28.2%] h-full bg-cyan-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Apple iCloud / Private Relay</span>
                <span className="font-bold text-purple-400">8.9%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="w-[8.9%] h-full bg-purple-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Yahoo & Corporate Custom MX</span>
                <span className="font-bold text-amber-400">4.5%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="w-[4.5%] h-full bg-amber-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
