import React, { useState } from 'react';
import {
  Search,
  Bell,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  ExternalLink,
  ChevronDown,
  User,
  Zap,
  ShieldAlert,
  KeyRound,
  LogOut,
  Clock,
  Sparkles
} from 'lucide-react';
import { ActiveNav, SmtpAccount, LiveEmailEvent, AppUser } from '../types';
import { checkUserAccessValidity } from '../utils/authUtils';

interface HeaderProps {
  activeNav: ActiveNav;
  setActiveNav: (nav: ActiveNav) => void;
  smtpAccounts: SmtpAccount[];
  liveEvents: LiveEmailEvent[];
  onOpenTestModal: () => void;
  onOpenSearch: () => void;
  onToggleMobileMenu?: () => void;
  currentUser?: AppUser | null;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  setActiveNav,
  smtpAccounts,
  liveEvents,
  onOpenTestModal,
  onOpenSearch,
  currentUser,
  onOpenAuthModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const activeNodesCount = smtpAccounts.filter((a) => a.status === 'active').length;
  const avgLatency = Math.round(
    smtpAccounts.reduce((sum, a) => sum + a.latencyMs, 0) / (smtpAccounts.length || 1)
  );

  const validity = currentUser ? checkUserAccessValidity(currentUser) : null;

  const getPageTitle = (nav: ActiveNav) => {
    switch (nav) {
      case 'dashboard':
        return 'System Dashboard';
      case 'compose':
        return 'Campaign Composer';
      case 'campaigns':
        return 'Campaign Manager';
      case 'inbox':
        return 'Inbox Auto-Closer & Resolver';
      case 'analytics':
        return 'Deliverability & Sending Analytics';
      case 'contacts':
        return 'Audience & Contact Lists';
      case 'templates':
        return 'Email Templates Library';
      case 'sequences':
        return 'Automated Sequences (Drip)';
      case 'suppressions':
        return 'Suppression & Blacklist Pool';
      case 'smtp':
        return 'SMTP Accounts & Load Balancer';
      case 'domains':
        return 'Sender Domains & DNS Authentication';
      case 'warmup':
        return 'Automated IP & Domain Warmup';
      case 'deliverability':
        return 'Deliverability Watchdog & RBL Scanner';
      case 'ai-tools':
        return 'AI Intelligence Suite';
      case 'admin':
        return 'Master Admin Portal & Access Allocation';
      case 'settings':
        return 'Workspace & Relay Settings';
      case 'guides':
        return 'Documentation & RFC Protocols';
      default:
        return 'SMTPDock';
    }
  };

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AD';

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#0c0e16]/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Current Page Breadcrumb */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase font-mono">
              SMTPDock &bull; Relay Engine
            </span>
            <span className="text-white/20">/</span>
            <h1 className="text-sm md:text-base font-bold text-slate-100">{getPageTitle(activeNav)}</h1>
          </div>
        </div>
      </div>

      {/* Center: Global Search & Quick Jumper */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-xs text-slate-400 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span>Search campaigns, contacts, SMTP nodes, DNS...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.06] text-slate-400 rounded border border-white/[0.08]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Live Cluster Status + Test Send + Notifications + User */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Master Admin Panel Quick Button if admin */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveNav('admin')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'admin'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Master Admin</span>
          </button>
        )}

        {/* Live Cluster Indicator */}
        <div
          onClick={() => setActiveNav('smtp')}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium cursor-pointer hover:bg-emerald-500/15 transition-colors"
          title="Click to manage SMTP Accounts"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px]">
            {activeNodesCount}/{smtpAccounts.length} Nodes &bull; {avgLatency}ms
          </span>
        </div>

        {/* Quick Send Test Button */}
        <button
          onClick={onOpenTestModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send Test</span>
        </button>

        {/* Live Event Stream Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition-colors relative cursor-pointer"
            title="Real-time Dispatch Log"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#111420] border border-white/[0.1] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">Real-Time Event Stream</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  LIVE
                </span>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-64 overflow-y-auto mt-2">
                {liveEvents.slice(0, 5).map((evt) => (
                  <div key={evt.id} className="py-2.5 flex items-start justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            evt.type === 'opened'
                              ? 'bg-purple-400'
                              : evt.type === 'clicked'
                              ? 'bg-cyan-400'
                              : evt.type === 'delivered'
                              ? 'bg-emerald-400'
                              : evt.type === 'bounced'
                              ? 'bg-red-400'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="font-semibold capitalize text-slate-200">{evt.type}</span>
                        <span className="text-slate-500 text-[11px]">({evt.latencyMs}ms)</span>
                      </div>
                      <p className="text-slate-400 text-[11px] truncate max-w-[200px] mt-0.5 font-mono">
                        {evt.recipient}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{evt.timestamp}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2.5 mt-2 border-t border-white/[0.08] text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveNav('analytics');
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                >
                  View full analytics & stream &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
              currentUser?.role === 'admin'
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950'
                : 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950'
            }`}>
              {userInitials}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser?.name || 'Master Admin'}
              </p>
              <p className="text-[10px] text-emerald-400 leading-tight font-mono">
                {currentUser?.role === 'admin' ? 'Master Admin' : validity?.badgeLabel || 'User'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#111420] border border-white/[0.1] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2.5 border-b border-white/[0.06] space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">{currentUser?.name || 'Master Admin'}</p>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                    {currentUser?.role || 'admin'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  {currentUser?.email || 'admin@smtpdock.com'}
                </p>

                {validity && (
                  <div className="pt-1">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                      Validity: {validity.badgeLabel}
                    </span>
                  </div>
                )}
              </div>

              <div className="py-1.5 space-y-0.5">
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveNav('admin');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-500/15 rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span>Master Admin Portal</span>
                  </button>
                )}

                {onOpenAuthModal && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-cyan-300 hover:bg-cyan-500/15 rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4 text-cyan-400" />
                    <span>Switch User / Sign In</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveNav('settings');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span>Workspace Settings</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveNav('guides');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>RFC Protocols & Guides</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
