import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  UserPlus,
  KeyRound,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sliders,
  Check,
  Trash2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { AppUser, AdminNotification } from '../types';
import { checkUserAccessValidity, MASTER_ADMIN_EMAIL } from '../utils/authUtils';

interface MasterAdminViewProps {
  users: AppUser[];
  notifications: AdminNotification[];
  currentUser: AppUser | null;
  onApproveUser: (userId: string, accessDays: number) => void;
  onDeclineUser: (userId: string, reason?: string) => void;
  onCreateUser: (newUser: AppUser) => void;
  onChangeUserPassword: (userId: string, newPassword: string) => void;
  onAdjustUserDays: (userId: string, additionalDays: number) => void;
  onDeleteUser: (userId: string) => void;
  onMarkNotificationRead: (notifId: string) => void;
}

export const MasterAdminView: React.FC<MasterAdminViewProps> = ({
  users,
  notifications,
  currentUser,
  onApproveUser,
  onDeclineUser,
  onCreateUser,
  onChangeUserPassword,
  onAdjustUserDays,
  onDeleteUser,
  onMarkNotificationRead,
}) => {
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'expired' | 'declined'>('all');

  // Modals state
  const [approvingUser, setApprovingUser] = useState<AppUser | null>(null);
  const [approvalDays, setApprovalDays] = useState<number>(30);

  const [decliningUser, setDecliningUser] = useState<AppUser | null>(null);
  const [declineReason, setDeclineReason] = useState('Incomplete signup details or unverified company email.');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('RelayClient2026!');
  const [newDays, setNewDays] = useState<number>(30);
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');

  const [passwordChangeUser, setPasswordChangeUser] = useState<AppUser | null>(null);
  const [newCustomPassword, setNewCustomPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<Record<string, boolean>>({});
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);

  const [adjustingDaysUser, setAdjustingDaysUser] = useState<AppUser | null>(null);
  const [extraDays, setExtraDays] = useState<number>(30);

  // Computed metrics
  const pendingUsers = users.filter((u) => u.status === 'pending');
  const activeValidUsers = users.filter((u) => {
    if (u.status !== 'approved') return false;
    const v = checkUserAccessValidity(u);
    return v.isValid;
  });
  const expiredUsers = users.filter((u) => {
    if (u.status !== 'approved') return false;
    const v = checkUserAccessValidity(u);
    return v.isExpired;
  });
  const passwordResetRequests = users.filter((u) => u.passwordResetRequested);
  const unreadNotifs = notifications.filter((n) => !n.read);

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return u.status === 'pending';
    if (statusFilter === 'declined') return u.status === 'declined';
    if (statusFilter === 'approved') {
      if (u.status !== 'approved') return false;
      const v = checkUserAccessValidity(u);
      return v.isValid;
    }
    if (statusFilter === 'expired') {
      if (u.status !== 'approved') return false;
      const v = checkUserAccessValidity(u);
      return v.isExpired;
    }
    return true;
  });

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const submitApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingUser) return;
    onApproveUser(approvingUser.id, Number(approvalDays) || 30);
    setApprovingUser(null);
  };

  const submitDecline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningUser) return;
    onDeclineUser(decliningUser.id, declineReason);
    setDecliningUser(null);
  };

  const submitCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    const calculatedExpiresAt = new Date(
      Date.now() + (Number(newDays) || 30) * 24 * 60 * 60 * 1000
    ).toISOString();

    const createdUser: AppUser = {
      id: `user-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      password: newPassword,
      role: newRole,
      status: 'approved',
      accessDays: Number(newDays) || 30,
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      expiresAt: newRole === 'admin' ? '2099-12-31T23:59:59.000Z' : calculatedExpiresAt,
      notes: `Directly created and assigned ${newDays} days by Master Admin.`,
    };

    onCreateUser(createdUser);
    setIsCreateModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const submitPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordChangeUser || !newCustomPassword.trim()) return;
    onChangeUserPassword(passwordChangeUser.id, newCustomPassword.trim());
    setPasswordChangeSuccess(`Password updated for ${passwordChangeUser.name}: "${newCustomPassword.trim()}"`);
    setTimeout(() => {
      setPasswordChangeSuccess(null);
      setPasswordChangeUser(null);
      setNewCustomPassword('');
    }, 2500);
  };

  const submitAdjustDays = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingDaysUser) return;
    onAdjustUserDays(adjustingDaysUser.id, Number(extraDays) || 30);
    setAdjustingDaysUser(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner with Master Admin Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#121624] via-[#101926] to-[#121624] border border-emerald-500/25 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 shrink-0">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                Master Admin Portal & Access Control
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                MASTER ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized session for <span className="font-mono text-emerald-400 font-semibold">{MASTER_ADMIN_EMAIL}</span>. Manage user approvals, day-based validity limits, and password resets.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setNewPassword(handleGenerateRandomPassword());
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create & Assign User</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl bg-[#0e111a] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400">Total Users</div>
            <div className="text-2xl font-black text-white mt-1">{users.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Accounts in database</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.05] text-slate-300">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
          pendingUsers.length > 0
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            : 'bg-[#0e111a] border-white/[0.08] text-slate-300'
        }`}>
          <div>
            <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5 font-bold">
              {pendingUsers.length > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
              <span>Pending Approvals</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{pendingUsers.length}</div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">Requires day assignment</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e111a] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 font-bold">Active within Days</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{activeValidUsers.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Valid access remaining</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e111a] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-rose-400 font-bold">Expired / Actions</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{expiredUsers.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{passwordResetRequests.length} pass reset req.</div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SECTION 1: PENDING SIGNUP REQUESTS NOTIFICATION QUEUE */}
      {pendingUsers.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/15 to-transparent border border-amber-500/35 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Pending User Signup Approvals</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-500/40">
                    {pendingUsers.length} ACTION REQUIRED
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  New users have registered. Review credentials, choose Approve or Decline, and specify access validity in days.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-xl bg-[#0d1017] border border-amber-500/30 space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>{user.name}</span>
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Pending
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] text-[10px] font-mono space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Registered:</span>
                    <span className="text-slate-200">{new Date(user.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Password:</span>
                    <span className="text-slate-300">•••••••• ({user.password.length} chars)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setApprovingUser(user);
                      setApprovalDays(30);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm shadow-emerald-500/20"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Approve & Grant Days</span>
                  </button>

                  <button
                    onClick={() => {
                      setDecliningUser(user);
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-white/[0.05] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/30 font-medium text-xs transition-all cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: PASSWORD CHANGE REQUESTS QUEUE */}
      {passwordResetRequests.length > 0 && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Password Reset / Change Requests ({passwordResetRequests.length})
            </h3>
          </div>
          <div className="space-y-2">
            {passwordResetRequests.map((u) => (
              <div
                key={u.id}
                className="p-3 rounded-xl bg-black/40 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-200">{u.name}</span>{' '}
                  <span className="font-mono text-cyan-300">({u.email})</span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Requested on: {u.passwordResetRequestDate ? new Date(u.passwordResetRequestDate).toLocaleString() : 'Recent'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPasswordChangeUser(u);
                    setNewCustomPassword(handleGenerateRandomPassword());
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Change Password Now</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ALL REGISTERED USERS DIRECTORY & VALIDATION TABLE */}
      <div className="p-5 rounded-2xl bg-[#0e111a] border border-white/[0.08] space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>User Directory & Day Validity Management</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review granted days, real-time login validation status, passwords, and renewal options.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 font-medium"
              />
            </div>

            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.08] text-xs">
              {(['all', 'approved', 'pending', 'expired', 'declined'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setStatusFilter(filterKey)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer capitalize text-[11px] ${
                    statusFilter === filterKey
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121622] text-slate-400 font-mono text-[10px] uppercase border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role & Status</th>
                <th className="py-3 px-4">Login Validity (Days)</th>
                <th className="py-3 px-4">Current Password</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No users match the current search filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const validity = checkUserAccessValidity(user);
                  const isPasswordVisible = showCurrentPassword[user.id];

                  return (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* User Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                            user.role === 'admin'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white/[0.06] text-slate-200 border border-white/[0.08]'
                          }`}>
                            {user.name.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.passwordResetRequested && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  Reset Req.
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Status */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              user.role === 'admin'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                            }`}>
                              {user.role}
                            </span>

                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              validity.badgeColor === 'emerald'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : validity.badgeColor === 'amber'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            }`}>
                              {validity.badgeLabel}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Login Validity (Days) */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {user.role === 'admin' ? (
                              <span className="text-emerald-400 font-bold">Infinite Master Validity</span>
                            ) : user.status === 'pending' ? (
                              <span className="text-amber-400">0 Days (Pending Approval)</span>
                            ) : (
                              <span>
                                <strong className="text-white">{user.accessDays}</strong> Days Assigned
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {user.role === 'admin'
                              ? 'Permanent Authority'
                              : user.status === 'pending'
                              ? 'Awaiting Day Grant'
                              : `Expires: ${validity.expiryDateFormatted}`}
                          </div>
                        </div>
                      </td>

                      {/* Password Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <div className="px-2 py-1 rounded bg-black/40 border border-white/[0.06] text-slate-300 text-[11px] select-all">
                            {isPasswordVisible ? user.password : '••••••••••••'}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword((prev) => ({
                                ...prev,
                                [user.id]: !prev[user.id],
                              }))
                            }
                            className="p-1 text-slate-500 hover:text-slate-300 cursor-pointer"
                            title="Toggle password view"
                          >
                            {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Admin Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {user.status === 'pending' ? (
                            <button
                              onClick={() => {
                                setApprovingUser(user);
                                setApprovalDays(30);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-sm shadow-emerald-500/20"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Approve</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setAdjustingDaysUser(user);
                                setExtraDays(30);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/[0.08] hover:border-emerald-500/30 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                              title="Extend or Adjust Days"
                            >
                              <Clock className="w-3 h-3" />
                              <span>Extend Days</span>
                            </button>
                          )}

                          {/* Change Password Button */}
                          <button
                            onClick={() => {
                              setPasswordChangeUser(user);
                              setNewCustomPassword(handleGenerateRandomPassword());
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-white/[0.08] hover:border-cyan-500/30 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                            title="Change password on request"
                          >
                            <KeyRound className="w-3 h-3" />
                            <span>Change Pass</span>
                          </button>

                          {user.role !== 'admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove user "${user.name}"?`)) {
                                  onDeleteUser(user.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: APPROVE USER & ASSIGN DAYS */}
      {approvingUser && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10141f] border border-emerald-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Approve & Grant Login Access</h3>
              </div>
              <button
                onClick={() => setApprovingUser(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitApproval} className="space-y-4">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs font-mono space-y-1">
                <div className="text-slate-400">Recipient Candidate:</div>
                <div className="text-white font-bold text-sm">{approvingUser.name}</div>
                <div className="text-emerald-400">{approvingUser.email}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Grant Login Validity (In Days)</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    Expires in {approvalDays} days
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="3650"
                  value={approvalDays}
                  onChange={(e) => setApprovalDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-emerald-500/40 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Quick Day Presets */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400">Quick Day Presets:</div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[7, 14, 30, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setApprovalDays(d)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        approvalDays === d
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Expiry Preview */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                  Live Expiry Validation Preview
                </div>
                <div className="text-slate-200">
                  Access will remain active until:{' '}
                  <strong className="text-emerald-300 font-mono">
                    {new Date(Date.now() + approvalDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Once approved, the user can immediately sign in using the password they created during registration.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setApprovingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Grant {approvalDays} Days & Approve</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DECLINE SIGNUP REQUEST */}
      {decliningUser && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10141f] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Decline User Request</h3>
              </div>
              <button
                onClick={() => setDecliningUser(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitDecline} className="space-y-3">
              <p className="text-xs text-slate-300">
                Are you sure you want to decline registration for <strong className="text-white">{decliningUser.name}</strong> ({decliningUser.email})?
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Reason (Optional)</label>
                <input
                  type="text"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500/60 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setDecliningUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-all shadow-lg shadow-rose-500/20 active:scale-95 cursor-pointer"
                >
                  Decline Access Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE & ASSIGN USER DIRECTLY */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10141f] border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Create & Assign New User</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="jordan@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-emerald-500/60"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Initial Password</label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(handleGenerateRandomPassword())}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-emerald-500/60"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Access Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500/60"
                  >
                    <option value="user">Client User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Grant Days Validity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    value={newDays}
                    onChange={(e) => setNewDays(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  Create & Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CHANGE USER PASSWORD ON REQUEST */}
      {passwordChangeUser && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10141f] border border-cyan-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Change Password on Request</h3>
              </div>
              <button
                onClick={() => setPasswordChangeUser(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {passwordChangeSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <div className="font-bold">Password Successfully Updated!</div>
                <div className="text-[11px] font-mono text-white bg-black/40 p-2 rounded-lg">
                  {passwordChangeSuccess}
                </div>
                <div className="text-[10px] text-slate-400">
                  The user can now immediately log in with this new password.
                </div>
              </div>
            ) : (
              <form onSubmit={submitPasswordChange} className="space-y-4">
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs font-mono space-y-1">
                  <div className="text-slate-400">Target User:</div>
                  <div className="text-white font-bold">{passwordChangeUser.name}</div>
                  <div className="text-cyan-400">{passwordChangeUser.email}</div>
                  <div className="text-[10px] text-slate-500 pt-1">
                    Current password: <span className="text-slate-300 font-bold">{passwordChangeUser.password}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">Set New Password</label>
                    <button
                      type="button"
                      onClick={() => setNewCustomPassword(handleGenerateRandomPassword())}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Generate Random</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newCustomPassword}
                    onChange={(e) => setNewCustomPassword(e.target.value)}
                    placeholder="Enter new password for user"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-cyan-500/40 text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300">
                  Updating this password overrides the user's login credentials immediately. Share the new credentials with the user upon completion.
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setPasswordChangeUser(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Confirm & Update Password</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 5: ADJUST / EXTEND DAYS */}
      {adjustingDaysUser && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10141f] border border-white/[0.12] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Renew / Extend Login Days</h3>
              </div>
              <button
                onClick={() => setAdjustingDaysUser(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitAdjustDays} className="space-y-4">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs font-mono space-y-1">
                <div className="text-white font-bold">{adjustingDaysUser.name}</div>
                <div className="text-slate-400">{adjustingDaysUser.email}</div>
                <div className="text-[11px] text-emerald-400">
                  Current Status: {checkUserAccessValidity(adjustingDaysUser).badgeLabel}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Additional Days to Grant</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+{extraDays} days</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={extraDays}
                  onChange={(e) => setExtraDays(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500/60"
                  required
                />
              </div>

              {/* Day presets */}
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 60, 90].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setExtraDays(d)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                      extraDays === d
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]'
                    }`}
                  >
                    +{d}d
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setAdjustingDaysUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  Renew & Extend {extraDays} Days
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
