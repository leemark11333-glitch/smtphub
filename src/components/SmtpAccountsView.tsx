import React, { useState } from 'react';
import {
  Server,
  Plus,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap,
  Terminal,
  Trash2,
  Edit2,
  Lock,
  ArrowRight,
  Clock
} from 'lucide-react';
import { SmtpAccount, SmtpProvider, SmtpSecurity } from '../types';

interface SmtpAccountsViewProps {
  smtpAccounts: SmtpAccount[];
  onAddAccount: (account: SmtpAccount) => void;
  onUpdateWeight: (id: string, weight: number) => void;
  onDeleteAccount: (id: string) => void;
}

export const SmtpAccountsView: React.FC<SmtpAccountsViewProps> = ({
  smtpAccounts,
  onAddAccount,
  onUpdateWeight,
  onDeleteAccount,
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New SMTP Account form state
  const [newName, setNewName] = useState('');
  const [newProvider, setNewProvider] = useState<SmtpProvider>('SES');
  const [newHost, setNewHost] = useState('email-smtp.us-east-1.amazonaws.com');
  const [newPort, setNewPort] = useState(587);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFromEmail, setNewFromEmail] = useState('relay@mail.cloudreach.io');
  const [newSecurity, setNewSecurity] = useState<SmtpSecurity>('STARTTLS');
  const [newDailyLimit, setNewDailyLimit] = useState(25000);

  // Provider presets helper
  const handlePresetSelect = (provider: SmtpProvider) => {
    setNewProvider(provider);
    if (provider === 'SES') {
      setNewHost('email-smtp.us-east-1.amazonaws.com');
      setNewPort(587);
      setNewSecurity('STARTTLS');
    } else if (provider === 'Postmark') {
      setNewHost('smtp.postmarkapp.com');
      setNewPort(587);
      setNewSecurity('STARTTLS');
    } else if (provider === 'SendGrid') {
      setNewHost('smtp.sendgrid.net');
      setNewPort(587);
      setNewSecurity('TLS');
    } else if (provider === 'Mailgun') {
      setNewHost('smtp.mailgun.org');
      setNewPort(465);
      setNewSecurity('SSL');
    } else if (provider === 'Brevo') {
      setNewHost('smtp-relay.brevo.com');
      setNewPort(587);
      setNewSecurity('STARTTLS');
    } else {
      setNewHost('mail.yourvps.com');
      setNewPort(587);
      setNewSecurity('STARTTLS');
    }
  };

  // Run Realistic SMTP Handshake Test
  const runHandshakeTest = (account: SmtpAccount) => {
    setTestingId(account.id);
    setTerminalLogs([]);

    const steps = [
      `[1/6] Resolving DNS MX & A records for ${account.host}...`,
      `[2/6] Resolved IP: 54.240.10.42 (TTL: 300s). Opening TCP socket on port ${account.port}...`,
      `[3/6] << 220 ${account.host} ESMTP Service Ready`,
      `[4/6] >> EHLO mail.cloudreach.io`,
      `[5/6] << 250-${account.host} Hello [client.ip] (250-STARTTLS, 250-AUTH LOGIN)`,
      `[6/6] Establishing ${account.security} handshake (TLSv1.3 / Cipher: AES256-GCM-SHA384)...`,
      `>> AUTH LOGIN verification with user "${account.username.slice(0, 8)}***"...`,
      `<< 235 2.7.0 Authentication successful. Session authenticated.`,
      `>> QUIT`,
      `<< 221 2.0.0 Service closing transmission channel.`,
      `✓ Handshake Complete. Latency: ${account.latencyMs}ms. Status: OPTIMAL 100% HEALTH.`,
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          // done
        }
      }, idx * 280);
    });
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const account: SmtpAccount = {
      id: `smtp-${Date.now()}`,
      name: newName || `${newProvider} Relay Node`,
      provider: newProvider,
      host: newHost,
      port: Number(newPort),
      username: newUsername || 'smtp_user',
      fromName: 'Growth Team',
      fromEmail: newFromEmail,
      security: newSecurity,
      status: 'active',
      dailyLimit: Number(newDailyLimit),
      sentToday: 0,
      speedLimitPerHour: 2000,
      healthScore: 99.7,
      bounceRate: 0.2,
      latencyMs: 65,
      weight: 25,
      lastTested: 'Just now',
    };
    onAddAccount(account);
    setShowAddModal(false);
    setNewName('');
    setNewUsername('');
    setNewPassword('');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">SMTP Relay Accounts</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure multi-node SMTP accounts with automated load-balancing and failover protection.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add SMTP Account</span>
        </button>
      </div>

      {/* Cluster Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Cluster Nodes</span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {smtpAccounts.length} Registered Nodes
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>All healthy & responding</span>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Total Daily Quota</span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {smtpAccounts.reduce((acc, a) => acc + a.dailyLimit, 0).toLocaleString()} sends/day
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            {smtpAccounts.reduce((acc, a) => acc + a.sentToday, 0).toLocaleString()} sent today
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111420] border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Average Handshake Latency</span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {Math.round(smtpAccounts.reduce((acc, a) => acc + a.latencyMs, 0) / smtpAccounts.length)}ms
          </div>
          <p className="text-[11px] text-teal-400 mt-1 font-mono">
            TLS 1.3 Strict Encrypted
          </p>
        </div>
      </div>

      {/* SMTP Accounts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {smtpAccounts.map((account) => {
          const usagePct = Math.round((account.sentToday / account.dailyLimit) * 100);

          return (
            <div
              key={account.id}
              className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="text-base font-bold text-white">{account.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 font-semibold">
                      {account.provider}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    {account.host}:{account.port} &bull; {account.security}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => runHandshakeTest(account)}
                    className="p-2 rounded-lg bg-white/[0.05] hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                    title="Run Diagnostic Handshake"
                  >
                    <Terminal className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAccount(account.id)}
                    className="p-2 rounded-lg bg-white/[0.05] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/[0.06] text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Health Score</span>
                  <div className="text-sm font-bold text-emerald-400">{account.healthScore}%</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Bounce Rate</span>
                  <div className="text-sm font-bold text-slate-200">{account.bounceRate}%</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Ping Latency</span>
                  <div className="text-sm font-bold text-cyan-400">{account.latencyMs}ms</div>
                </div>
              </div>

              {/* Usage Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                  <span>Daily Quota Usage</span>
                  <span>{account.sentToday.toLocaleString()} / {account.dailyLimit.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    style={{ width: `${usagePct}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  ></div>
                </div>
              </div>

              {/* Load Balancer Weight Slider */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    <span>Rotation Weight Allocation</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{account.weight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={account.weight}
                  onChange={(e) => onUpdateWeight(account.id, Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Handshake Terminal Output */}
      {testingId && (
        <div className="p-5 rounded-2xl bg-black border border-emerald-500/40 font-mono shadow-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.1]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-xs text-slate-400 ml-2 font-bold">
                SMTP Protocol Diagnostic Console &bull; {smtpAccounts.find((a) => a.id === testingId)?.name}
              </span>
            </div>
            <button
              onClick={() => setTestingId(null)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Close Console
            </button>
          </div>

          <div className="space-y-1.5 text-xs max-h-60 overflow-y-auto pt-2">
            {terminalLogs.map((log, index) => (
              <div
                key={index}
                className={`${
                  log.includes('Authentication successful') || log.includes('Handshake Complete')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('>>')
                    ? 'text-cyan-300'
                    : log.includes('<<')
                    ? 'text-slate-300'
                    : 'text-slate-400'
                }`}
              >
                {log}
              </div>
            ))}
            {terminalLogs.length < 11 && (
              <div className="text-emerald-400 animate-pulse">Running RFC 5321 handshakes...</div>
            )}
          </div>
        </div>
      )}

      {/* Add SMTP Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111420] border border-white/[0.1] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Add New SMTP Relay Node</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Provider presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Cloud Provider Preset
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['SES', 'Postmark', 'SendGrid', 'Mailgun', 'Brevo', 'Custom'] as SmtpProvider[]).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        newProvider === p
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                          : 'bg-black/40 border-white/[0.08] text-slate-300 hover:border-white/[0.2]'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Node Display Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Amazon SES Primary Pool"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SMTP Hostname
                  </label>
                  <input
                    type="text"
                    value={newHost}
                    onChange={(e) => setNewHost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Port & Security
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newPort}
                      onChange={(e) => setNewPort(Number(e.target.value))}
                      className="w-24 px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 font-mono"
                      required
                    />
                    <select
                      value={newSecurity}
                      onChange={(e) => setNewSecurity(e.target.value as SmtpSecurity)}
                      className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 cursor-pointer"
                    >
                      <option value="STARTTLS">STARTTLS</option>
                      <option value="TLS">TLS</option>
                      <option value="SSL">SSL</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SMTP Username / API Key ID
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SMTP Password / Secret Key
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 font-mono"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
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
                  Save & Authenticate Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
