import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Zap,
  Target,
  FileText,
  TrendingUp,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { ActiveNav, EmailTemplate } from '../types';

interface AiToolsViewProps {
  setActiveNav: (nav: ActiveNav) => void;
  onSendGeneratedToCompose: (subject: string, body: string) => void;
}

export const AiToolsView: React.FC<AiToolsViewProps> = ({
  setActiveNav,
  onSendGeneratedToCompose,
}) => {
  const [tone, setTone] = useState('executive');
  const [persona, setPersona] = useState('Chief Technology Officer & VP of Engineering');
  const [productValue, setProductValue] = useState(
    'Multi-SMTP dynamic load balancing that eliminates IP throttling and increases primary inbox delivery to 99.4%.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    subjectA: string;
    subjectB: string;
    body: string;
    openEst: string;
    replyEst: string;
  } | null>({
    subjectA: 'Fixing deliverability degradation across {{company}}\'s outbound nodes',
    subjectB: '{{first_name}}, quick benchmark on {{company}}\'s sender reputation',
    body: `<p>Hi {{first_name}},</p>
<p>Most engineering leaders scaling outbound infrastructure hit a wall when Google & Outlook begin silently junking messages due to single-node throttling.</p>
<p>We built SMTPDock to dynamically distribute outbound relays across Amazon SES, Postmark, and custom nodes based on real-time bounce signals.</p>
<p>Would you be opposed to reviewing our 1-page architecture benchmark?</p>
<p>Best regards,<br>Sarah</p>`,
    openEst: '58.4%',
    replyEst: '12.8%',
  });

  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedResult({
        subjectA: `Question regarding {{company}}'s outbound delivery architecture`,
        subjectB: `Scaling cold email inbox placement for {{company}} without spam penalties`,
        body: `<p>Hi {{first_name}},</p>
<p>I came across {{company}} while researching high-growth SaaS engineering teams.</p>
<p>When outbound velocity reaches 20,000+ dispatches a month, relying on a single SMTP relay typically results in domain throttling and unexpected blacklisting.</p>
<p>${productValue}</p>
<p>Do you have 5 minutes this Thursday for a brief deliverability sanity check?</p>
<p>Warmly,<br><strong>Growth Operations Team</strong></p>`,
        openEst: '62.1%',
        replyEst: '14.5%',
      });
      setIsGenerating(false);
    }, 800);
  };

  const copyBody = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult.body.replace(/<[^>]*>?/gm, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">AI Copywriting & Deliverability Copilot</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>TRAINED ON 10M+ DISPATCHES</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate high-converting outbound sequences written specifically to bypass AI spam detectors and drive human replies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Prompt Parameters</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Prospect Persona
            </label>
            <input
              type="text"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500/60"
              placeholder="e.g. VP Sales, Tech Founder, CFO"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Sequence Tone & Archetype
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'executive', label: 'Direct Executive' },
                { id: 'conversational', label: 'Casual & Friendly' },
                { id: 'technical', label: 'Technical & Data-Driven' },
                { id: 'fomo', label: 'Urgent & Exclusive' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left ${
                    tone === t.id
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold'
                      : 'bg-black/30 border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Core Value Proposition / Offer
            </label>
            <textarea
              rows={4}
              value={productValue}
              onChange={(e) => setProductValue(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500/60 resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing Copy...' : 'Generate Optimized Email'}</span>
          </button>
        </div>

        {/* Right Output (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Generated High-Placement Output</h3>
            </div>

            {generatedResult && (
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-emerald-400">Est. Open: {generatedResult.openEst}</span>
                <span className="text-purple-400">Est. Reply: {generatedResult.replyEst}</span>
              </div>
            )}
          </div>

          {generatedResult && (
            <div className="space-y-4">
              {/* Subject Lines A/B */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Recommended Subject Variations (A/B Test)
                </span>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-200 font-medium space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold">
                      A
                    </span>
                    <span>{generatedResult.subjectA}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 text-[10px] font-mono font-bold">
                      B
                    </span>
                    <span>{generatedResult.subjectB}</span>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Message Copy
                </span>
                <div
                  className="p-4 rounded-xl bg-black/50 border border-white/[0.08] text-xs text-slate-200 leading-relaxed min-h-[160px]"
                  dangerouslySetInnerHTML={{ __html: generatedResult.body }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={copyBody}
                  className="py-2 px-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Plaintext'}</span>
                </button>

                <button
                  onClick={() => {
                    onSendGeneratedToCompose(generatedResult.subjectA, generatedResult.body);
                    setActiveNav('compose');
                  }}
                  className="flex-1 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Insert into Campaign Composer &rarr;</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
