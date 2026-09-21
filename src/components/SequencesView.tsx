import React, { useState } from 'react';
import {
  GitFork,
  Plus,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  Mail,
  ArrowDown,
  Sparkles,
  Users,
  Settings
} from 'lucide-react';
import { ActiveNav } from '../types';

interface SequencesViewProps {
  setActiveNav: (nav: ActiveNav) => void;
}

export const SequencesView: React.FC<SequencesViewProps> = ({ setActiveNav }) => {
  const [isActive, setIsActive] = useState(true);

  const steps = [
    {
      step: 1,
      name: 'Initial Cold Pitch (Multi-Relay Dispatched)',
      delay: 'Immediate upon enrollment',
      subject: 'Automating deliverability for {{company}}',
      openRate: '64.2%',
      replyRate: '9.4%',
    },
    {
      step: 2,
      name: 'Follow-Up #1: 1-Page Benchmark Case Study',
      delay: 'Wait 3 business days if no reply',
      subject: 'Re: Automating deliverability for {{company}}',
      openRate: '51.8%',
      replyRate: '12.1%',
    },
    {
      step: 3,
      name: 'Follow-Up #2: Alternative Angle (IP Warmup Guarantee)',
      delay: 'Wait 4 business days if no reply',
      subject: 'Quick question regarding {{company}}\'s IP pool',
      openRate: '43.5%',
      replyRate: '7.8%',
    },
    {
      step: 4,
      name: 'Step 4: Polite Breakup & Resource Link',
      delay: 'Wait 6 business days if no reply',
      subject: 'Permission to close file for {{company}}',
      openRate: '57.0%',
      replyRate: '15.2%',
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Automated Drip Sequences</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {isActive ? 'SEQUENCE ACTIVE (324 ENROLLED)' : 'PAUSED'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-step email workflows that automatically halt as soon as a recipient replies or unsubscribes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 cursor-pointer ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isActive ? 'Pause Sequence' : 'Resume Sequence'}</span>
          </button>
        </div>
      </div>

      {/* Rules Banner */}
      <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08] flex items-center justify-between text-xs">
        <span className="text-slate-300 font-medium">
          Auto-Stop Condition: <span className="text-emerald-400 font-bold">Stop immediately on prospect reply, meeting booked, or unsubscribe</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400">Strict Anti-Spam Guard Enabled</span>
      </div>

      {/* Sequence Timeline */}
      <div className="space-y-4">
        {steps.map((s, idx) => (
          <div key={s.step} className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                    0{s.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-0.5">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{s.delay}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <div className="text-purple-400 font-bold">{s.openRate}</div>
                    <div className="text-[10px] text-slate-500">Open Rate</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">{s.replyRate}</div>
                    <div className="text-[10px] text-slate-500">Reply Rate</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>Subject: {s.subject}</span>
                <span className="text-[10px] text-slate-500">Multi-SMTP Dynamic Node</span>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-white/[0.1] relative">
                  <ArrowDown className="w-3 h-3 text-slate-500 absolute -bottom-2 -left-1" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
