import React, { useState } from 'react';
import {
  LayoutTemplate,
  Plus,
  Eye,
  Send,
  Copy,
  Code,
  Check,
  Smartphone,
  Monitor,
  Sparkles
} from 'lucide-react';
import { EmailTemplate, ActiveNav } from '../types';

interface TemplatesViewProps {
  templates: EmailTemplate[];
  setActiveNav: (nav: ActiveNav) => void;
  onSelectTemplateForCompose: (tpl: EmailTemplate) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  setActiveNav,
  onSelectTemplateForCompose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const categories = ['all', 'Cold Outreach', 'Onboarding', 'Newsletter', 'Promotion'];

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedCategory !== 'all' && tpl.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Email Templates Library</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-tested responsive email layouts optimized for 99%+ primary inbox delivery and engagement.
          </p>
        </div>

        <button
          onClick={() => setActiveNav('compose')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Blank Template</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-[#111420] text-slate-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            {cat === 'all' ? 'All Templates' : cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                  {tpl.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Updated {tpl.lastUpdated}</span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {tpl.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Subject: <span className="text-slate-200">{tpl.subject}</span>
              </p>

              {/* Rendered HTML snippet miniature */}
              <div className="mt-4 p-4 rounded-xl bg-black/50 border border-white/[0.06] text-xs text-slate-300 max-h-40 overflow-hidden relative font-sans leading-relaxed pointer-events-none opacity-80">
                <div dangerouslySetInnerHTML={{ __html: tpl.htmlContent }} />
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tpl.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
              <button
                onClick={() => setPreviewTemplate(tpl)}
                className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Preview Layout</span>
              </button>

              <button
                onClick={() => {
                  onSelectTemplateForCompose(tpl);
                  setActiveNav('compose');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Use in Campaign</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111420] border border-white/[0.1] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-400">{previewTemplate.subject}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/[0.08]">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                      previewDevice === 'desktop' ? 'bg-white/[0.1] text-white' : 'text-slate-400'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                      previewDevice === 'mobile' ? 'bg-white/[0.1] text-white' : 'text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-slate-400 hover:text-white text-sm ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Email Canvas Preview */}
            <div className="max-h-[60vh] overflow-y-auto p-4 rounded-xl bg-[#090b10] border border-white/[0.08]">
              <div
                className={`mx-auto bg-[#0d1017] p-6 rounded-xl text-slate-200 transition-all ${
                  previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'
                }`}
                dangerouslySetInnerHTML={{ __html: previewTemplate.htmlContent }}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  onSelectTemplateForCompose(previewTemplate);
                  setPreviewTemplate(null);
                  setActiveNav('compose');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                Insert into Composer &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
