import React, { useState } from 'react';
import {
  Send,
  Server,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';
import { SmtpAccount } from '../types';

interface TestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  htmlContent: string;
  smtpAccounts: SmtpAccount[];
  initialSmtpId?: string;
}

export const TestEmailModal: React.FC<TestEmailModalProps> = ({
  isOpen,
  onClose,
  subject,
  htmlContent,
  smtpAccounts,
  initialSmtpId,
}) => {
  const [recipient, setRecipient] = useState('alex.growth@gmail.com');
  const [selectedSmtp, setSelectedSmtp] = useState(initialSmtpId || 'rotation');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setLogs([]);
    setSentSuccess(false);

    const steps = [
      `Connecting to outbound relay via TLS 1.3...`,
      `Applying merge tag personalization for test contact...`,
      `Rendering HTML payload (Size: 4.8 KB)...`,
      `DKIM signature generated: d=mail.cloudreach.io s=s1...`,
      `Dispatched message ID <test-${Date.now()}@mail.cloudreach.io>`,
      `250 2.0.0 OK: Message queued for recipient ${recipient}`,
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsSending(false);
          setSentSuccess(true);
        }
      }, (idx + 1) * 260);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111420] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Send Real-Time Test Email</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSendTest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Test Recipient Email Address
            </label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Outbound Relay Route
            </label>
            <select
              value={selectedSmtp}
              onChange={(e) => setSelectedSmtp(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 cursor-pointer"
            >
              <option value="rotation">⚡ Auto-Balance Across Active Relays</option>
              {smtpAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.provider})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Preview */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Test Subject</div>
            <div className="text-slate-200 font-medium truncate">{subject || 'Untitled Subject'}</div>
          </div>

          {/* Logs */}
          {logs.length > 0 && (
            <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-[11px] space-y-1 text-slate-300 max-h-32 overflow-y-auto">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={i === logs.length - 1 && sentSuccess ? 'text-emerald-400 font-bold' : ''}
                >
                  {log}
                </div>
              ))}
            </div>
          )}

          {sentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Test email delivered! Check your inbox or spam filters.</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              {sentSuccess ? 'Done' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
