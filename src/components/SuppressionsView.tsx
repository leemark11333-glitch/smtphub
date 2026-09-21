import React, { useState } from 'react';
import {
  Ban,
  Plus,
  Search,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { SuppressionItem } from '../types';

interface SuppressionsViewProps {
  suppressions: SuppressionItem[];
  onAddSuppression: (item: SuppressionItem) => void;
  onRemoveSuppression: (id: string) => void;
}

export const SuppressionsView: React.FC<SuppressionsViewProps> = ({
  suppressions,
  onAddSuppression,
  onRemoveSuppression,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [reasonInput, setReasonInput] = useState<SuppressionItem['reason']>('hard_bounce');

  const filtered = suppressions.filter((item) =>
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    onAddSuppression({
      id: `sup-${Date.now()}`,
      email: emailInput.trim(),
      reason: reasonInput,
      addedAt: 'Just now',
      source: 'Manual Admin Entry',
    });

    setShowAddModal(false);
    setEmailInput('');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Suppression & Opt-Out Registry</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Emails on this list are automatically barred from all outbound dispatches to protect domain reputation and CAN-SPAM compliance.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-all shadow-lg shadow-rose-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add to Suppression</span>
        </button>
      </div>

      {/* Filter */}
      <div className="relative w-full md:w-80">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search suppressed emails..."
          className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#111420] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#111420] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Blocked Email</th>
                <th className="py-3.5 px-4 font-semibold">Reason</th>
                <th className="py-3.5 px-4 font-semibold">Added Date</th>
                <th className="py-3.5 px-4 font-semibold">Source</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-200">
                    {item.email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        item.reason === 'hard_bounce'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : item.reason === 'spam_complaint'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                      }`}
                    >
                      {item.reason.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{item.addedAt}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{item.source}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onRemoveSuppression(item.id)}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                      title="Unblock / Remove from suppression"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111420] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Add Email to Blocklist</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="bad-recipient@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500/60 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Suppression Reason
                </label>
                <select
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500/60 cursor-pointer"
                >
                  <option value="hard_bounce">Hard Bounce (Invalid Recipient)</option>
                  <option value="unsubscribe">Recipient Unsubscribe</option>
                  <option value="spam_complaint">Spam Complaint / Feedback Loop</option>
                  <option value="manual">Manual Administrative Block</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-all shadow-lg shadow-rose-500/20 active:scale-95 cursor-pointer"
                >
                  Confirm Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
