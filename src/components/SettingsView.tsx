import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Key,
  Shield,
  Bell,
  Copy,
  Check,
  RefreshCw,
  Globe,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [apiKey, setApiKey] = useState('smtphub_live_sk_948f98a2b3491d9047b8e');
  const [trackingDomain, setTrackingDomain] = useState('track.mail.cloudreach.io');
  const [webhookUrl, setWebhookUrl] = useState('https://api.cloudreach.io/webhooks/smtphub');
  const [copiedKey, setCopiedKey] = useState(false);
  const [openTracking, setOpenTracking] = useState(true);
  const [clickTracking, setClickTracking] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Platform & Cluster Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure custom tracking domains, API keys, webhook endpoints, and global throttle boundaries.
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings Saved Successfully</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* API Access Key */}
        <div className="p-6 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">REST API Authentication Key</h3>
              <p className="text-xs text-slate-400">
                Use this token to programmatically dispatch campaigns and sync contacts from your backend.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/50 border border-white/[0.1] font-mono text-xs text-slate-300">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="bg-transparent border-none outline-none flex-1 text-emerald-400 select-all"
            />
            <button
              type="button"
              onClick={copyKey}
              className="p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Custom White-Label Tracking Domain */}
        <div className="p-6 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Custom White-Label Tracking CNAME</h3>
              <p className="text-xs text-slate-400">
                Branded tracking links prevent spam filter flags caused by generic third-party redirect domains.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom CNAME Domain (pointing to cname.smtphub.com)
            </label>
            <input
              type="text"
              value={trackingDomain}
              onChange={(e) => setTrackingDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500/60 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={openTracking}
                onChange={(e) => setOpenTracking(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Enable 1x1 Transparent Pixel Open Tracking</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={clickTracking}
                onChange={(e) => setClickTracking(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Enable Click-Through Redirect Analytics</span>
            </label>
          </div>
        </div>

        {/* Webhooks */}
        <div className="p-6 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Real-Time Event Webhooks</h3>
              <p className="text-xs text-slate-400">
                Receives HTTP POST payloads for <code>email.delivered</code>, <code>email.opened</code>, and <code>email.bounced</code> events.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Destination Webhook Endpoint URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500/60 font-mono"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
