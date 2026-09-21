import React, { useState } from 'react';
import {
  Megaphone,
  Search,
  Plus,
  Play,
  Pause,
  Copy,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  BarChart2
} from 'lucide-react';
import { Campaign, CampaignStatus, ActiveNav } from '../types';

interface CampaignsViewProps {
  campaigns: Campaign[];
  setActiveNav: (nav: ActiveNav) => void;
  onUpdateCampaignStatus: (id: string, newStatus: CampaignStatus) => void;
  onCloneCampaign: (campaign: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  setActiveNav,
  onUpdateCampaignStatus,
  onCloneCampaign,
  onDeleteCampaign,
}) => {
  const [filterTab, setFilterTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = campaigns.filter((c) => {
    if (filterTab !== 'all' && c.status !== filterTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.fromEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const countByStatus = (status: CampaignStatus) =>
    campaigns.filter((c) => c.status === status).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Campaign Manager</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time dispatch progress, open benchmarks, and delivery telemetry.
          </p>
        </div>

        <button
          onClick={() => setActiveNav('compose')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111420] border border-white/[0.08] rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All', count: campaigns.length },
            { id: 'sending', label: 'Sending', count: countByStatus('sending') },
            { id: 'scheduled', label: 'Scheduled', count: countByStatus('scheduled') },
            { id: 'completed', label: 'Completed', count: countByStatus('completed') },
            { id: 'draft', label: 'Drafts', count: countByStatus('draft') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  filterTab === tab.id ? 'bg-black/20 text-slate-900 font-bold' : 'bg-white/[0.06] text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#111420] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-2xl bg-[#111420] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Campaign Info</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Recipients</th>
                <th className="py-3.5 px-4 font-semibold">Delivered</th>
                <th className="py-3.5 px-4 font-semibold">Open Rate</th>
                <th className="py-3.5 px-4 font-semibold">Click Rate</th>
                <th className="py-3.5 px-4 font-semibold">Bounces</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No campaigns matching your filter.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((c) => {
                  const delivPct = c.sentCount > 0 ? ((c.deliveredCount / c.sentCount) * 100).toFixed(1) : '-';
                  const openPct = c.deliveredCount > 0 ? ((c.openedCount / c.deliveredCount) * 100).toFixed(1) : '-';
                  const clickPct = c.openedCount > 0 ? ((c.clickedCount / c.openedCount) * 100).toFixed(1) : '-';
                  const bouncePct = c.sentCount > 0 ? ((c.bouncedCount / c.sentCount) * 100).toFixed(2) : '-';

                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Campaign Name & Subject */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200 text-sm group-hover:text-emerald-400 transition-colors">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5">
                          {c.subject}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
                          <span>Route: {c.smtpAccountId === 'rotation' ? 'Smart Multi-Relay' : 'Dedicated SES'}</span>
                          <span>&bull;</span>
                          <span>Created: {c.createdAt}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            c.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : c.status === 'sending'
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 animate-pulse'
                              : c.status === 'scheduled'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : c.status === 'paused'
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      {/* Recipients */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                        {c.recipientCount.toLocaleString()}
                      </td>

                      {/* Delivered */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-emerald-400">
                          {delivPct !== '-' ? `${delivPct}%` : 'Pending'}
                        </div>
                        {delivPct !== '-' && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            {c.deliveredCount.toLocaleString()} sent
                          </div>
                        )}
                      </td>

                      {/* Open Rate */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-purple-400">
                          {openPct !== '-' ? `${openPct}%` : 'Pending'}
                        </div>
                        {openPct !== '-' && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            {c.openedCount.toLocaleString()} opens
                          </div>
                        )}
                      </td>

                      {/* Click Rate */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-cyan-400">
                          {clickPct !== '-' ? `${clickPct}%` : 'Pending'}
                        </div>
                        {clickPct !== '-' && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            {c.clickedCount.toLocaleString()} clicks
                          </div>
                        )}
                      </td>

                      {/* Bounce Rate */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className={c.bouncedCount > 50 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                          {bouncePct !== '-' ? `${bouncePct}%` : '-'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.status === 'sending' ? (
                            <button
                              onClick={() => onUpdateCampaignStatus(c.id, 'paused')}
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                              title="Pause sending"
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          ) : c.status === 'paused' ? (
                            <button
                              onClick={() => onUpdateCampaignStatus(c.id, 'sending')}
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                              title="Resume sending"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          ) : null}

                          <button
                            onClick={() => onCloneCampaign(c)}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Duplicate campaign"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setActiveNav('analytics')}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-cyan-400 transition-colors cursor-pointer"
                            title="View campaign analytics"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteCampaign(c.id)}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
