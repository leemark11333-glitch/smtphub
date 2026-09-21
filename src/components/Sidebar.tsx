import React, { useState } from 'react';
import {
  LayoutDashboard,
  Send,
  Megaphone,
  Inbox,
  BarChart3,
  Users,
  LayoutTemplate,
  Zap,
  ShieldAlert,
  Server,
  Globe,
  Flame,
  ShieldCheck,
  Sparkles,
  Settings,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Radio,
  Layers,
  HelpCircle,
  Plus,
  Lock,
  User,
  LogOut
} from 'lucide-react';
import { ActiveNav, SmtpAccount, AppUser } from '../types';
import { checkUserAccessValidity } from '../utils/authUtils';

interface SidebarProps {
  activeNav: ActiveNav;
  setActiveNav: (nav: ActiveNav) => void;
  smtpAccounts: SmtpAccount[];
  contactCount: number;
  draftCount: number;
  currentUser?: AppUser | null;
  pendingApprovalsCount?: number;
  onOpenAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  smtpAccounts,
  contactCount,
  draftCount,
  currentUser,
  pendingApprovalsCount = 0,
  onOpenAuthModal,
}) => {
  const [infraOpen, setInfraOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(true);

  const activeSmtpCount = smtpAccounts.filter((s) => s.status === 'active').length;
  const validity = currentUser ? checkUserAccessValidity(currentUser) : null;

  return (
    <aside className="w-64 bg-[#0d1017] border-r border-white/[0.08] flex flex-col h-screen select-none shrink-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-black text-lg">
            <Radio className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">SMTPHUB</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 tracking-wider font-mono">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">Multi-Relay Engine</p>
          </div>
        </div>
      </div>

      {/* Master Admin Quick Notice if Admin */}
      {currentUser?.role === 'admin' && (
        <div className="mx-3 mt-3">
          <button
            onClick={() => setActiveNav('admin')}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
              activeNav === 'admin'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-white shadow-lg shadow-emerald-500/15'
                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/15'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-extrabold leading-tight">Master Admin Panel</div>
                <div className="text-[10px] text-emerald-400/80 font-mono">Users & Access Days</div>
              </div>
            </div>
            {pendingApprovalsCount > 0 ? (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono animate-bounce">
                {pendingApprovalsCount} new
              </span>
            ) : (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                ACTIVE
              </span>
            )}
          </button>
        </div>
      )}

      {/* Quick Compose Action Button */}
      <div className="p-3">
        <button
          onClick={() => setActiveNav('compose')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 space-y-6 text-xs overflow-y-auto pb-6">
        {/* MAIN */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono mb-1.5">
            Main
          </p>
          <div className="space-y-0.5">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'dashboard'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Master Admin Link in Navigation */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveNav('admin')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeNav === 'admin'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Master Admin Portal</span>
                </div>
                {pendingApprovalsCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setActiveNav('compose')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'compose'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-teal-400" />
                <span>Compose Campaign</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('campaigns')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'campaigns'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-4 h-4 text-purple-400" />
                <span>Campaigns</span>
              </div>
              {draftCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.08] text-slate-300 font-mono">
                  {draftCount} drafts
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveNav('inbox')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'inbox'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-rose-400" />
                <span>Inbox Auto-Closer</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-300 font-mono">
                Auto
              </span>
            </button>

            <button
              onClick={() => setActiveNav('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'analytics'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Analytics</span>
              </div>
            </button>
          </div>
        </div>

        {/* AUDIENCE & ASSETS */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono mb-1.5">
            Audience & Assets
          </p>
          <div className="space-y-0.5">
            <button
              onClick={() => setActiveNav('contacts')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'contacts'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Contacts</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                {contactCount}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('templates')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'templates'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutTemplate className="w-4 h-4 text-cyan-400" />
                <span>Email Templates</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('sequences')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'sequences'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Sequences</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-mono font-bold">
                Beta
              </span>
            </button>

            <button
              onClick={() => setActiveNav('suppressions')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'suppressions'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Suppression List</span>
              </div>
            </button>
          </div>
        </div>

        {/* INFRASTRUCTURE (Collapsible) */}
        <div>
          <button
            onClick={() => setInfraOpen(!infraOpen)}
            className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono mb-1 hover:text-slate-300 cursor-pointer"
          >
            <span>Infrastructure</span>
            {infraOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          {infraOpen && (
            <div className="space-y-0.5 mt-1">
              <button
                onClick={() => setActiveNav('smtp')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeNav === 'smtp'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span>SMTP Accounts</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-300 font-mono">
                  {activeSmtpCount} active
                </span>
              </button>

              <button
                onClick={() => setActiveNav('domains')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeNav === 'domains'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span>Sender Domains</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-300 font-mono">
                  SPF/DKIM
                </span>
              </button>

              <button
                onClick={() => setActiveNav('warmup')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeNav === 'warmup'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>IP Warmup</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/15 text-orange-300 font-mono font-bold">
                  98.6%
                </span>
              </button>

              <button
                onClick={() => setActiveNav('deliverability')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeNav === 'deliverability'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Deliverability</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* AI INTELLIGENCE */}
        <div>
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold tracking-wider text-cyan-400 uppercase font-mono mb-1 hover:text-cyan-300 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>AI Intelligence</span>
            </span>
            {aiOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          {aiOpen && (
            <div className="space-y-0.5 mt-1">
              <button
                onClick={() => setActiveNav('ai-tools')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeNav === 'ai-tools'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Tools Suite</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 font-mono">
                  Smart
                </span>
              </button>
            </div>
          )}
        </div>

        {/* SYSTEM & GUIDES */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono mb-1.5">
            System
          </p>
          <div className="space-y-0.5">
            <button
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'settings'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Relay Settings</span>
            </button>

            <button
              onClick={() => setActiveNav('guides')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeNav === 'guides'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>How-To & Guides</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Active User Account & Validity */}
      <div className="p-3 border-t border-white/[0.08] bg-[#0b0e14]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
              currentUser?.role === 'admin'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/[0.06] text-slate-300'
            }`}>
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate leading-none">
                {currentUser?.name || 'Guest Operator'}
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                {currentUser?.email || 'Not logged in'}
              </div>
            </div>
          </div>
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              title="Switch Account or Login"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Validity Badge */}
        {validity && (
          <div className="flex items-center justify-between text-[10px] font-mono p-1.5 rounded-lg bg-black/40 border border-white/[0.06]">
            <span className="text-slate-400">Validity:</span>
            <span
              className={`font-bold ${
                validity.badgeColor === 'emerald'
                  ? 'text-emerald-400'
                  : validity.badgeColor === 'amber'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {validity.badgeLabel}
            </span>
          </div>
        )}
      </div>

      {/* Quota & Capacity Usage */}
      <div className="p-4 border-t border-white/[0.08] bg-[#090b10]/60">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-slate-400">Monthly Send Quota</span>
          <span className="text-slate-200 font-mono font-semibold">35.4k / 100k</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[35.4%]"></div>
        </div>
        <div className="flex items-center justify-between mt-2.5 text-[10px] text-slate-500">
          <span>SMTP Pool Status</span>
          <span className="text-emerald-400 font-semibold font-mono">OPTIMAL (99.8%)</span>
        </div>
      </div>
    </aside>
  );
};
