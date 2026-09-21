import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Server,
  Users,
  Eye,
  Code,
  Smartphone,
  Monitor,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  HelpCircle,
  Flame,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Campaign, SmtpAccount, EmailTemplate } from '../types';

interface ComposeViewProps {
  smtpAccounts: SmtpAccount[];
  templates: EmailTemplate[];
  onSaveCampaign: (campaign: Campaign) => void;
  onSendTest: (subject: string, html: string, smtpId: string) => void;
}

export const ComposeView: React.FC<ComposeViewProps> = ({
  smtpAccounts,
  templates,
  onSaveCampaign,
  onSendTest,
}) => {
  const [name, setName] = useState('Outbound Sprint - High Intent Leads');
  const [subject, setSubject] = useState('Automating deliverability for {{company}}');
  const [previewText, setPreviewText] = useState('Quick benchmark comparison on multi-SMTP routing');
  const [fromName, setFromName] = useState('Sarah Jenkins');
  const [fromEmail, setFromEmail] = useState('sarah@mail.cloudreach.io');
  const [selectedSmtp, setSelectedSmtp] = useState<string>('rotation');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [throttleSpeed, setThrottleSpeed] = useState<'slow' | 'balanced' | 'fast'>('balanced');
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [htmlContent, setHtmlContent] = useState<string>(
    `<p>Hi {{first_name}},</p>
<p>I noticed {{company}} has been aggressively expanding outbound outreach lately.</p>
<p>Most teams hitting 20k+ monthly sends run into Google and Outlook spam filters because of single-IP throttling. We built an automated multi-SMTP router that balances sends across SES, Postmark, and custom nodes.</p>
<p>Are you open to seeing our 30-day inbox placement audit?</p>
<p>Best regards,<br><strong>Sarah Jenkins</strong><br>Head of Growth</p>
<hr style="border:0;border-top:1px solid #334155;margin:24px 0;" />
<p style="font-size:11px;color:#64748b;">You received this because of your role at {{company}}. <a href="{{unsubscribe_url}}" style="color:#10b981;">Unsubscribe</a> anytime.</p>`
  );

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isOptimizingAi, setIsOptimizingAi] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchSuccess, setLaunchSuccess] = useState(false);

  // Merge tag helper
  const insertTag = (tag: string) => {
    setHtmlContent((prev) => prev + ` ${tag} `);
  };

  // Anti-Spam Scanner Score calculation
  const calculateSpamScore = () => {
    let score = 98;
    const lower = (subject + ' ' + htmlContent).toLowerCase();
    const spamTriggers = ['guaranteed', '100% free', 'make money', 'urgent', 'act now', 'winner', 'risk free'];
    spamTriggers.forEach((word) => {
      if (lower.includes(word)) score -= 12;
    });
    if (htmlContent.length < 100) score -= 10;
    if (!htmlContent.includes('{{unsubscribe_url}}') && !htmlContent.includes('unsubscribe')) score -= 25;
    return Math.max(10, Math.min(100, score));
  };

  const spamScore = calculateSpamScore();

  // AI Subject Line Generator
  const handleGenerateAiSubjects = () => {
    setIsOptimizingAi(true);
    setTimeout(() => {
      setAiSuggestions([
        '{{first_name}}, quick question regarding {{company}}\'s outbound infrastructure',
        'Cutting outbound bounce rates by 68% for {{company}}',
        'How {{company}} can achieve 99.8% inbox placement on cold email',
      ]);
      setIsOptimizingAi(false);
    }, 600);
  };

  const handleApplyTemplate = (tpl: EmailTemplate) => {
    setSubject(tpl.subject);
    setPreviewText(tpl.previewText);
    setHtmlContent(tpl.htmlContent);
  };

  // Launch Campaign
  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setLaunchSuccess(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6'],
      });

      const newCampaign: Campaign = {
        id: `cmp-${Date.now()}`,
        name,
        subject,
        previewText,
        fromName,
        fromEmail,
        smtpAccountId: selectedSmtp,
        recipientCount: selectedAudience === 'all' ? 1240 : 490,
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        bouncedCount: 0,
        unsubscribedCount: 0,
        status: 'sending',
        createdAt: 'Just now',
        tags: ['Outbound', 'Active'],
        htmlContent,
      };
      onSaveCampaign(newCampaign);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Campaign Composer</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure sender nodes, template personalization, and anti-spam verification before launching.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSendTest(subject, htmlContent, selectedSmtp)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Send Test Preview</span>
          </button>

          <button
            onClick={handleLaunch}
            disabled={isLaunching || launchSuccess}
            className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer ${
              launchSuccess
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isLaunching ? (
              <span>Dispatching Relay...</span>
            ) : launchSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Dispatched to Relay Queue!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Launch Campaign</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Campaign Setup & Body Editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card: Campaign Metadata & Sender */}
          <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Campaign Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-sm text-white focus:outline-none focus:border-emerald-500/60 font-medium"
                placeholder="e.g. Q4 Inbound Follow-up"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Outbound SMTP Routing</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Load Balanced</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedSmtp}
                    onChange={(e) => setSelectedSmtp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 cursor-pointer"
                  >
                    <option value="rotation">⚡ Smart Multi-SMTP Rotation (Auto Failover)</option>
                    {smtpAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.provider} &bull; {acc.host})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Audience Segment
                </label>
                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 cursor-pointer"
                >
                  <option value="all">All Verified Subscribers (1,240 contacts)</option>
                  <option value="high-intent">High-Intent Tech Founders (490 contacts)</option>
                  <option value="fintech">Fintech Executives (310 contacts)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  From Name
                </label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Sender Email (SPF/DKIM Verified)
                </label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card: Subject Line & AI Improver */}
          <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Email Subject Line
              </label>
              <button
                type="button"
                onClick={handleGenerateAiSubjects}
                disabled={isOptimizingAi}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isOptimizingAi ? 'Analyzing NLP...' : 'AI Subject Optimizer'}</span>
              </button>
            </div>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-sm text-white focus:outline-none focus:border-emerald-500/60 font-medium"
              placeholder="Enter attention-grabbing subject line..."
            />

            {/* AI suggestions box */}
            {aiSuggestions.length > 0 && (
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 animate-in fade-in">
                <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1 font-mono uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  AI Recommended Variations (Projected Open Rate: 54-62%)
                </span>
                <div className="space-y-1.5">
                  {aiSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSubject(s)}
                      className="w-full text-left p-2 rounded-lg bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.06] text-xs text-slate-200 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span className="font-medium">{s}</span>
                      <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 font-mono">
                        Apply &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Preview Text / Pre-header
              </label>
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-slate-300 focus:outline-none focus:border-emerald-500/60"
                placeholder="Visible in recipient inbox preview before opening..."
              />
            </div>
          </div>

          {/* Card: Email Body & Template Editor */}
          <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">Email Message Body</span>
                <span className="text-[10px] text-slate-400 font-mono">HTML & Responsive Ready</span>
              </div>

              {/* Merge Tag Chips */}
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-400 mr-1">Insert:</span>
                <button
                  type="button"
                  onClick={() => insertTag('{{first_name}}')}
                  className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-white/[0.08] transition-colors cursor-pointer"
                >
                  {'{{first_name}}'}
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('{{company}}')}
                  className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-white/[0.08] transition-colors cursor-pointer"
                >
                  {'{{company}}'}
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('{{unsubscribe_url}}')}
                  className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-white/[0.08] transition-colors cursor-pointer"
                >
                  {'{{unsubscribe_url}}'}
                </button>
              </div>
            </div>

            {/* Mode Toggle & Device Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditorMode('visual')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    editorMode === 'visual' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Visual Mode
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('code')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    editorMode === 'code' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Raw HTML
                </button>
              </div>

              <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-white/[0.1] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-white/[0.1] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile Frame"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Editor Area */}
            {editorMode === 'code' ? (
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-xl bg-black/60 border border-white/[0.1] text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-y"
              />
            ) : (
              <div
                className={`mx-auto transition-all p-4 rounded-xl bg-[#090b10] border border-white/[0.1] ${
                  previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'
                }`}
              >
                <div
                  className="prose prose-invert max-w-none text-slate-200 text-sm focus:outline-none min-h-[220px]"
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  onBlur={(e) => setHtmlContent(e.currentTarget.innerHTML)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Deliverability Scanner, Throttling & Template Presets */}
        <div className="space-y-5">
          {/* Anti-Spam Health Radar */}
          <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Anti-Spam Verification</span>
              </h3>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  spamScore >= 90
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}
              >
                {spamScore} / 100
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                style={{ width: `${spamScore}%` }}
                className={`h-full transition-all duration-500 rounded-full ${
                  spamScore >= 90
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-amber-500 to-rose-400'
                }`}
              ></div>
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>DMARC / SPF Alignment</span>
                </span>
                <span className="text-emerald-400">PASSED</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Opt-out Unsubscribe Link</span>
                </span>
                <span className={htmlContent.includes('unsubscribe') ? 'text-emerald-400' : 'text-rose-400'}>
                  {htmlContent.includes('unsubscribe') ? 'PRESENT' : 'MISSING'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Spam Trigger Words</span>
                </span>
                <span className="text-emerald-400">CLEAN (0 found)</span>
              </div>
            </div>
          </div>

          {/* Sending Throttle / Speed Limit */}
          <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-3">
            <label className="block text-xs font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Throttle & Sending Velocity</span>
            </label>
            <p className="text-[11px] text-slate-400">
              Pacing prevents SMTP rate-limiting and keeps domain reputation pristine.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setThrottleSpeed('slow')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  throttleSpeed === 'slow'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-black/30 border-white/[0.08] text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">Warmup</div>
                <div className="text-[10px] text-slate-400 font-mono">100 / hr</div>
              </button>

              <button
                type="button"
                onClick={() => setThrottleSpeed('balanced')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  throttleSpeed === 'balanced'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-black/30 border-white/[0.08] text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">Balanced</div>
                <div className="text-[10px] text-slate-400 font-mono">1,500 / hr</div>
              </button>

              <button
                type="button"
                onClick={() => setThrottleSpeed('fast')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  throttleSpeed === 'fast'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-black/30 border-white/[0.08] text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">Max Speed</div>
                <div className="text-[10px] text-slate-400 font-mono">5,000 / hr</div>
              </button>
            </div>
          </div>

          {/* Quick Template Presets */}
          <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-3">
            <h3 className="text-xs font-bold text-white">Load Pre-built Template</h3>
            <div className="space-y-2">
              {templates.slice(0, 3).map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="p-2.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover:text-emerald-400">
                    <span>{tpl.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{tpl.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-1">{tpl.subject}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
