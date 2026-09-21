import React from 'react';
import {
  BookOpen,
  Server,
  ShieldCheck,
  Flame,
  Radio,
  ExternalLink,
  Code,
  CheckCircle2
} from 'lucide-react';
import { ActiveNav } from '../types';

interface GuidesViewProps {
  setActiveNav: (nav: ActiveNav) => void;
}

export const GuidesView: React.FC<GuidesViewProps> = ({ setActiveNav }) => {
  const guides = [
    {
      title: 'Google & Yahoo 2024+ Bulk Sender Mandates',
      tag: 'Compliance & SPF/DKIM',
      readTime: '4 min read',
      icon: ShieldCheck,
      content:
        'As of 2024, Google and Yahoo reject incoming mail sent without valid SPF and DKIM alignment, or where spam complaint rates exceed 0.3%. Learn how to configure your DMARC quarantine policy and ensure 100% pass rates across your relay clusters.',
      action: 'Check Sender Domains',
      nav: 'domains' as ActiveNav,
    },
    {
      title: 'Multi-SMTP Rotation vs. Single IP Infrastructure',
      tag: 'Infrastructure Routing',
      readTime: '6 min read',
      icon: Server,
      content:
        'Distributing email bursts across Amazon SES, Postmark, and self-hosted VPS nodes prevents IP rate-limiting. When an ISP throttles one node, SMTPHUB automatically reroutes queued outbound messages to your secondary relay within 20 milliseconds.',
      action: 'Manage SMTP Cluster',
      nav: 'smtp' as ActiveNav,
    },
    {
      title: 'Automated 30-Day Domain & IP Warmup Playbook',
      tag: 'Warmup & Deliverability',
      readTime: '5 min read',
      icon: Flame,
      content:
        'New sender domains have zero reputation. Starting with 50 emails/day and graduating to 25,000/day over 30 days while generating realistic peer responses marks your IP as high-trust, eliminating the Gmail Promotions tab hurdle.',
      action: 'Inspect Warmup Engine',
      nav: 'warmup' as ActiveNav,
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Documentation & Deliverability Architecture</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Engineering best practices for high-volume cold email delivery, DNS protocol alignment, and multi-relay architecture.
        </p>
      </div>

      <div className="space-y-4">
        {guides.map((g, idx) => {
          const Icon = g.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#111420] border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{g.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs font-mono text-slate-400">
                      <span className="text-emerald-400">{g.tag}</span>
                      <span>&bull;</span>
                      <span>{g.readTime}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveNav(g.nav)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-400 text-xs font-semibold border border-white/[0.08] transition-colors cursor-pointer hidden sm:block"
                >
                  {g.action} &rarr;
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{g.content}</p>

              <button
                onClick={() => setActiveNav(g.nav)}
                className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-400 text-xs font-semibold border border-white/[0.08] transition-colors cursor-pointer sm:hidden"
              >
                {g.action} &rarr;
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
