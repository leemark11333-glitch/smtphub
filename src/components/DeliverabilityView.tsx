import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Globe,
  Lock,
  FileCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const DeliverabilityView: React.FC = () => {
  const [ipToCheck, setIpToCheck] = useState('54.240.10.42');
  const [domainToCheck, setDomainToCheck] = useState('mail.cloudreach.io');
  const [isScanning, setIsScanning] = useState(false);
  const [scanDone, setScanDone] = useState(true);

  // Blacklist RBL providers
  const blacklists = [
    { name: 'Spamhaus ZEN (SBL + XBL + PBL)', status: 'clean', type: 'Reputation RBL' },
    { name: 'Barracuda Reputation Network', status: 'clean', type: 'Reputation RBL' },
    { name: 'SpamCop Blocking List (SCBL)', status: 'clean', type: 'Spam Trap Network' },
    { name: 'SORBS (Spam and Open Relay Blocking)', status: 'clean', type: 'Relay & Spam DB' },
    { name: 'Invaluement Anti-Spam (ivmURI)', status: 'clean', type: 'URI & IP Blacklist' },
    { name: 'UCEPROTECT Level 1', status: 'clean', type: 'Abuse Network' },
    { name: 'SURBL Multi-Category', status: 'clean', type: 'Phishing & URI' },
    { name: 'LashBack Unsubscribe Blacklist (UBL)', status: 'clean', type: 'Compliance RBL' },
    { name: 'Mailspike IP Reputation (Z)', status: 'clean', type: 'Reputation Scoring' },
    { name: 'Hostkarma Blacklist', status: 'clean', type: 'Heuristic DB' },
  ];

  // Run Blacklist Scan
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanDone(true);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Deliverability Watchdog & RBL Scanner</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              0 / 10 BLACKLISTS DETECTED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuously monitors your sender IP pools and domain names across major DNSBL security providers.
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Querying DNSBLs...' : 'Scan All Blacklists'}</span>
        </button>
      </div>

      {/* Lookup Bar */}
      <div className="p-5 rounded-2xl bg-[#111420] border border-white/[0.08] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:w-auto flex-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Sender IP</label>
            <input
              type="text"
              value={ipToCheck}
              onChange={(e) => setIpToCheck(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-emerald-500/60"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Sender Domain</label>
            <input
              type="text"
              value={domainToCheck}
              onChange={(e) => setDomainToCheck(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto pt-2 md:pt-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-emerald-400 font-mono">PTR REVERSE DNS</div>
            <div className="text-[10px] text-slate-400 font-mono">Matched: mail-out.cloudreach.io</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* RBL Results Table */}
      <div className="rounded-2xl bg-[#111420] border border-white/[0.08] overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <span className="text-xs font-bold text-white">Global DNSBL Monitor Table</span>
          <span className="text-[10px] font-mono text-emerald-400">100% Reputational Health</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {blacklists.map((bl, i) => (
            <div
              key={i}
              className="px-5 py-3.5 flex items-center justify-between text-xs hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-200">{bl.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{bl.type}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">TTL: 180s &bull; Response: NXDOMAIN</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>CLEAN (LISTED: NO)</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
