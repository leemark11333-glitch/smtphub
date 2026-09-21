import React, { useState } from 'react';
import {
  Globe,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Copy,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';
import { DomainRecord } from '../types';

interface SenderDomainsViewProps {
  domains: DomainRecord[];
  onAddDomain: (domain: DomainRecord) => void;
  onVerifyDomain: (domainId: string) => void;
}

export const SenderDomainsView: React.FC<SenderDomainsViewProps> = ({
  domains,
  onAddDomain,
  onVerifyDomain,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleRunVerify = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      onVerifyDomain(id);
      setVerifyingId(null);
    }, 900);
  };

  const handleCreateDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainName.trim()) return;

    const newRecord: DomainRecord = {
      id: `dom-${Date.now()}`,
      domain: newDomainName.trim(),
      smtpProvider: 'Amazon SES / Postmark Dual',
      spf: {
        status: 'valid',
        record: `v=spf1 include:amazonses.com include:smtpdock.com ~all`,
        expected: `v=spf1 include:amazonses.com include:smtpdock.com ~all`,
      },
      dkim: {
        status: 'valid',
        record: `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQ...`,
        expected: `p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8...`,
      },
      dmarc: {
        status: 'valid',
        record: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@${newDomainName.trim()}`,
        policy: 'quarantine',
      },
      mx: {
        status: 'valid',
        record: `mail.${newDomainName.trim()} (Priority 10)`,
      },
      bimi: {
        status: 'missing',
        record: 'Not configured',
      },
      lastChecked: 'Just now',
    };

    onAddDomain(newRecord);
    setShowAddModal(false);
    setNewDomainName('');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Sender Domains & DNS Authentication</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Validate SPF, DKIM, DMARC, and BIMI records to guarantee 100% RFC alignment and avoid spam filters.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Custom Domain</span>
        </button>
      </div>

      {/* Domain Cards */}
      <div className="space-y-6">
        {domains.map((dom) => (
          <div
            key={dom.id}
            className="p-6 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-5 shadow-xl"
          >
            {/* Domain Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-mono">{dom.domain}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      RFC STRICT COMPLIANT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assigned Relay: {dom.smtpProvider} &bull; Last checked: {dom.lastChecked}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRunVerify(dom.id)}
                disabled={verifyingId === dom.id}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 transition-colors cursor-pointer self-start sm:self-center"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${verifyingId === dom.id ? 'animate-spin' : ''}`} />
                <span>{verifyingId === dom.id ? 'Querying DNS...' : 'Verify DNS Propagation'}</span>
              </button>
            </div>

            {/* DNS Records Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SPF Record */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">SPF (Sender Policy Framework)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                    VALID TXT
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1017] border border-white/[0.06] font-mono text-xs text-slate-300">
                  <code className="truncate max-w-[280px]">{dom.spf.record}</code>
                  <button
                    onClick={() => copyToClipboard(dom.spf.record)}
                    className="p-1 rounded hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy SPF Record"
                  >
                    {copiedText === dom.spf.record ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* DKIM Record */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">DKIM (2048-bit Cryptographic Signature)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                    VALID CNAME/TXT
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1017] border border-white/[0.06] font-mono text-xs text-slate-300">
                  <code className="truncate max-w-[280px]">{dom.dkim.record}</code>
                  <button
                    onClick={() => copyToClipboard(dom.dkim.record)}
                    className="p-1 rounded hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy DKIM Record"
                  >
                    {copiedText === dom.dkim.record ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* DMARC Record */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {dom.dmarc.policy === 'reject' || dom.dmarc.policy === 'quarantine' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-xs font-bold text-white">DMARC Policy Enforcement</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      dom.dmarc.policy === 'reject'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : dom.dmarc.policy === 'quarantine'
                        ? 'bg-cyan-500/15 text-cyan-300'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    POLICY: {dom.dmarc.policy.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1017] border border-white/[0.06] font-mono text-xs text-slate-300">
                  <code className="truncate max-w-[280px]">{dom.dmarc.record}</code>
                  <button
                    onClick={() => copyToClipboard(dom.dmarc.record)}
                    className="p-1 rounded hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy DMARC Record"
                  >
                    {copiedText === dom.dmarc.record ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* MX & BIMI */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">MX & BIMI Brand Avatar</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                    ROUTING OK
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1017] border border-white/[0.06] font-mono text-xs text-slate-300">
                  <code className="truncate max-w-[280px]">{dom.mx.record}</code>
                  <button
                    onClick={() => copyToClipboard(dom.mx.record)}
                    className="p-1 rounded hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy MX Record"
                  >
                    {copiedText === dom.mx.record ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111420] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Add Sending Domain</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDomain} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Domain Name (or Subdomain)
                </label>
                <input
                  type="text"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  placeholder="e.g. mail.yourbrand.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-sm text-white focus:outline-none focus:border-emerald-500/60 font-mono"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  We recommend using a dedicated subdomain like <code className="text-emerald-400">mail.domain.com</code> to isolate reputation.
                </p>
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
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  Generate DNS Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
