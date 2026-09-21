import React, { useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Ban,
  MailCheck,
  Filter,
  Sparkles,
  Sliders,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { InboxItem } from '../types';

interface InboxAutoCloserViewProps {
  inboxItems: InboxItem[];
  onResolveItem: (id: string) => void;
  onResolveAll: () => void;
}

export const InboxAutoCloserView: React.FC<InboxAutoCloserViewProps> = ({
  inboxItems,
  onResolveItem,
  onResolveAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'human_reply' | 'out_of_office' | 'bounce' | 'unsubscribe_request'>('all');

  const filteredItems = inboxItems.filter((item) => {
    if (filter !== 'all' && item.classification !== filter) return false;
    return true;
  });

  const pendingCount = inboxItems.filter((i) => i.status === 'pending').length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Inbox Auto-Closer & AI Classifier</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              {pendingCount} PENDING ACTION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-detects bounces, out-of-office loops, and opt-outs to automatically clean suppression lists and protect sender health.
          </p>
        </div>

        <button
          onClick={onResolveAll}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Auto-Resolve All System Replies</span>
        </button>
      </div>

      {/* Rules Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Human Lead Detection</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Filters genuine interested prospects and forwards directly to your primary CRM inbox.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <MailCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Out-of-Office Snoozer</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Parses return dates in vacation replies and automatically pauses sequences until they return.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
            <Ban className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Instant Auto-Suppression</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Adds hard bounces and opt-out phrasing ("unsubscribe", "remove me") to the global blocklist.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Incoming' },
          { id: 'human_reply', label: 'Human Responses' },
          { id: 'out_of_office', label: 'Out of Office' },
          { id: 'bounce', label: 'Mail Delivery Failures' },
          { id: 'unsubscribe_request', label: 'Unsubscribe Requests' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === f.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-[#111420] text-slate-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Inbox Items List */}
      <div className="rounded-2xl bg-[#111420] border border-white/[0.08] divide-y divide-white/[0.04] overflow-hidden">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    item.classification === 'human_reply'
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      : item.classification === 'out_of_office'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : item.classification === 'bounce'
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                  }`}
                >
                  {item.classification.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-bold text-slate-200">{item.from}</span>
                <span className="text-[10px] text-slate-500 font-mono">{item.receivedAt}</span>
              </div>

              <h4 className="text-xs font-semibold text-white">{item.subject}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 max-w-3xl leading-relaxed">
                "{item.snippet}"
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {item.suggestedAction}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              {item.status === 'pending' ? (
                <button
                  onClick={() => onResolveItem(item.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer"
                >
                  Confirm Action
                </button>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-400 text-xs font-mono">
                  ✓ Resolved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
