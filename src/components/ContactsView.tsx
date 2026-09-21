import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Trash2,
  Mail,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';
import { Contact } from '../types';

interface ContactsViewProps {
  contacts: Contact[];
  onAddContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onImportContacts: (contacts: Contact[]) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onAddContact,
  onDeleteContact,
  onImportContacts,
}) => {
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // New Contact State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [tagsInput, setTagsInput] = useState('Outreach, Founder');

  // CSV paste state
  const [csvText, setCsvText] = useState(
    `email,firstName,lastName,company
nathan.d@scaleup.io,Nathan,Drake,ScaleUp AI
samantha.k@fintechmatrix.com,Samantha,Keller,Fintech Matrix
jordan.bell@apexsaas.co,Jordan,Bell,Apex SaaS`
  );

  // Unique tags
  const allTags = Array.from(new Set(contacts.flatMap((c) => c.tags)));

  const filteredContacts = contacts.filter((c) => {
    if (tagFilter !== 'all' && !c.tags.includes(tagFilter)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.email.toLowerCase().includes(q) ||
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const newContact: Contact = {
      id: `cnt-${Date.now()}`,
      email: email.trim(),
      firstName: firstName.trim() || 'Valued',
      lastName: lastName.trim() || 'Partner',
      company: company.trim() || 'Enterprise Co',
      status: 'subscribed',
      deliverabilityRating: 'A+',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      lastEngagement: 'Just added',
      opens: 0,
      clicks: 0,
    };

    onAddContact(newContact);
    setShowAddModal(false);
    setEmail('');
    setFirstName('');
    setLastName('');
    setCompany('');
  };

  const handleCsvImport = () => {
    const lines = csvText.trim().split('\n');
    const newItems: Contact[] = [];

    lines.slice(1).forEach((line, index) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts[0] && parts[0].includes('@')) {
        newItems.push({
          id: `cnt-${Date.now()}-${index}`,
          email: parts[0],
          firstName: parts[1] || 'Friend',
          lastName: parts[2] || '',
          company: parts[3] || 'Organization',
          status: 'subscribed',
          deliverabilityRating: 'A+',
          tags: ['CSV-Imported', 'Verified'],
          lastEngagement: 'Imported',
          opens: 0,
          clicks: 0,
        });
      }
    });

    if (newItems.length > 0) {
      onImportContacts(newItems);
      setShowImportModal(false);
    }
  };

  const exportCsv = () => {
    const header = 'email,firstName,lastName,company,deliverabilityRating,status\n';
    const rows = filteredContacts
      .map(
        (c) =>
          `"${c.email}","${c.firstName}","${c.lastName}","${c.company}","${c.deliverabilityRating}","${c.status}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smtphub-contacts-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Audience & Contact Lists</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage verified subscribers, custom tags, deliverability ratings, and bulk imports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#111420] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        {/* Tag Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          <button
            onClick={() => setTagFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              tagFilter === 'all'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-white/[0.04] text-slate-400 hover:text-white'
            }`}
          >
            All Contacts ({contacts.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                tagFilter === tag
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="rounded-2xl bg-[#111420] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Subscriber</th>
                <th className="py-3.5 px-4 font-semibold">Company</th>
                <th className="py-3.5 px-4 font-semibold">Deliverability Score</th>
                <th className="py-3.5 px-4 font-semibold">Tags</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Engagement</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredContacts.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{c.company}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        c.deliverabilityRating === 'A+'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : c.deliverabilityRating === 'A'
                          ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                          : c.deliverabilityRating === 'B'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      GRADE {c.deliverabilityRating}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 text-[10px] font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize ${
                        c.status === 'subscribed'
                          ? 'text-emerald-400'
                          : c.status === 'bounced'
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      &bull; {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    <span className="text-purple-400 font-bold">{c.opens} opens</span> &bull;{' '}
                    <span className="text-cyan-400 font-bold">{c.clicks} clicks</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteContact(c.id)}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Single Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111420] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Add New Subscriber</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Acme Corp"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60 font-mono"
                />
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
                  Save Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111420] border border-white/[0.1] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Import Contacts from CSV</h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste standard CSV rows with columns: <code>email, firstName, lastName, company</code>.
            </p>

            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={8}
              className="w-full p-3 rounded-xl bg-black/50 border border-white/[0.1] text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500/60 leading-relaxed"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCsvImport}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
              >
                Process & Import Contacts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
