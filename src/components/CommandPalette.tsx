import React, { useState, useEffect } from 'react';
import {
  Search,
  Send,
  Server,
  Globe,
  Flame,
  ShieldCheck,
  Users,
  LayoutTemplate,
  Inbox,
  Settings,
  X,
  ArrowRight
} from 'lucide-react';
import { ActiveNav } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveNav: (nav: ActiveNav) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveNav,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { title: 'System Dashboard', desc: 'Real-time telemetry and active sending metrics', icon: Send, nav: 'dashboard' as ActiveNav },
    { title: 'Compose New Campaign', desc: 'Draft an outbound email with AI assistance', icon: Send, nav: 'compose' as ActiveNav },
    { title: 'Manage Campaigns', desc: 'View dispatches, scheduled sends, and stats', icon: Send, nav: 'campaigns' as ActiveNav },
    { title: 'SMTP Relay Cluster', desc: 'Configure multi-node SMTP routing and latency', icon: Server, nav: 'smtp' as ActiveNav },
    { title: 'Sender Domains (SPF/DKIM/DMARC)', desc: 'Verify DNS propagation and authentication', icon: Globe, nav: 'domains' as ActiveNav },
    { title: 'Automated IP & Domain Warmup', desc: 'Manage 30-day warmup ramp schedules', icon: Flame, nav: 'warmup' as ActiveNav },
    { title: 'Deliverability & Blacklist Scanner', desc: 'Check 18+ DNSBL providers for reputation flags', icon: ShieldCheck, nav: 'deliverability' as ActiveNav },
    { title: 'Audience & Contacts', desc: 'View subscribers, import CSVs, manage tags', icon: Users, nav: 'contacts' as ActiveNav },
    { title: 'Email Templates Library', desc: 'Responsive high-converting email layouts', icon: LayoutTemplate, nav: 'templates' as ActiveNav },
    { title: 'Inbox Auto-Closer', desc: 'AI classifier for out-of-office and bounce resolution', icon: Inbox, nav: 'inbox' as ActiveNav },
    { title: 'Master Admin Portal', desc: 'Manage user access approvals, login validity in days, and password resets', icon: ShieldCheck, nav: 'admin' as ActiveNav },
    { title: 'Platform Settings', desc: 'Custom tracking domain, webhooks, and API keys', icon: Settings, nav: 'settings' as ActiveNav },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-[#111420] border border-white/[0.12] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-white/[0.08] flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or navigate anywhere..."
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 font-medium"
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-400">
            ESC
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching commands or navigation pages.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveNav(item.nav);
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl hover:bg-white/[0.04] flex items-center justify-between text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/[0.05] text-slate-300 group-hover:text-emerald-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-sm">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-white/[0.06] bg-black/40 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Navigate with arrows or mouse</span>
          <span>SMTPHUB Command Protocol</span>
        </div>
      </div>
    </div>
  );
};
