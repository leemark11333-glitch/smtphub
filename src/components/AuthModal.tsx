import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Radio,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { AppUser, AdminNotification } from '../types';
import {
  MASTER_ADMIN_EMAIL,
  MASTER_ADMIN_PASSWORD,
  checkUserAccessValidity
} from '../utils/authUtils';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  users: AppUser[];
  onLoginSuccess: (user: AppUser) => void;
  onUserRegistered: (newUser: AppUser, notif: AdminNotification) => void;
  onRequestPasswordReset?: (email: string) => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  onUserRegistered,
  onRequestPasswordReset,
  initialTab = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<{ title: string; message: string; type: 'error' | 'pending' | 'expired' } | null>(null);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState<AppUser | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  // Reset request state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const emailClean = loginEmail.trim().toLowerCase();
    const passClean = loginPassword;

    // Check special admin shortcut or stored users
    let user = users.find((u) => u.email.toLowerCase() === emailClean);

    // Fallback if admin email matches master admin credentials
    if (!user && emailClean === MASTER_ADMIN_EMAIL.toLowerCase() && passClean === MASTER_ADMIN_PASSWORD) {
      user = {
        id: 'user-master-admin',
        name: 'Master Administrator',
        email: MASTER_ADMIN_EMAIL,
        password: MASTER_ADMIN_PASSWORD,
        role: 'admin',
        status: 'approved',
        accessDays: 99999,
        createdAt: '2026-09-01T00:00:00.000Z',
        approvedAt: '2026-09-01T00:00:00.000Z',
        expiresAt: '2099-12-31T23:59:59.000Z',
      };
    }

    if (!user) {
      setLoginError({
        title: 'Account Not Found',
        message: 'No registered user exists with this email address. Please verify or sign up.',
        type: 'error',
      });
      return;
    }

    // Check password
    if (user.password !== passClean) {
      setLoginError({
        title: 'Incorrect Password',
        message: 'The password entered does not match our records. You can request a password change from Master Admin.',
        type: 'error',
      });
      return;
    }

    // Check Day Validity & Status
    const validity = checkUserAccessValidity(user);

    if (user.role === 'admin') {
      // Master admin always logs in
      onLoginSuccess(user);
      if (onClose) onClose();
      return;
    }

    if (user.status === 'pending') {
      setLoginError({
        title: 'Signup Approval Pending',
        message: 'Your account registration was transmitted to the Master Admin portal. Access will be unlocked as soon as the admin approves your request and allocates your access days.',
        type: 'pending',
      });
      return;
    }

    if (user.status === 'declined') {
      setLoginError({
        title: 'Account Request Declined',
        message: user.declineReason || 'Your signup request was declined by the Master Administrator.',
        type: 'error',
      });
      return;
    }

    if (validity.isExpired) {
      setLoginError({
        title: 'Login Validity Expired',
        message: `Your granted access of ${user.accessDays} day(s) expired on ${validity.expiryDateFormatted}. Contact Master Admin (${MASTER_ADMIN_EMAIL}) to renew your access in days.`,
        type: 'expired',
      });
      return;
    }

    // Valid User
    onLoginSuccess(user);
    if (onClose) onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    const emailClean = signupEmail.trim().toLowerCase();
    if (!signupName.trim()) {
      setSignupError('Please enter your full name.');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match. Please re-check.');
      return;
    }

    // Check if email already exists
    const existing = users.find((u) => u.email.toLowerCase() === emailClean);
    if (existing) {
      setSignupError('An account with this email address already exists. Please login instead.');
      return;
    }

    const newUser: AppUser = {
      id: `user-${Date.now()}`,
      name: signupName.trim(),
      email: emailClean,
      password: signupPassword,
      role: 'user',
      status: 'pending',
      accessDays: 0,
      createdAt: new Date().toISOString(),
      notes: 'New registration awaiting Master Admin approval and day allocation',
    };

    const newNotification: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'signup_request',
      userId: newUser.id,
      userName: newUser.name,
      userEmail: newUser.email,
      message: `New registration request from ${newUser.name} (${newUser.email}). Review and allocate login days in Master Admin Panel.`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    onUserRegistered(newUser, newNotification);
    setSignupSuccess(newUser);
  };

  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRequestPasswordReset && resetEmail) {
      onRequestPasswordReset(resetEmail.trim());
    }
    setResetSuccess(true);
  };

  // Quick Demo Autofill Helper
  const fillCredentials = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setLoginError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e111a] border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative my-8">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 mb-1">
            <Radio className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">SMTPHUB Access Portal</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            High-throughput cold outbound relay with master admin access controls and day-based validity validation.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-black/40 p-1 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLoginError(null);
              setSignupSuccess(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setSignupError(null);
              setSignupSuccess(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'signup'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Request Account</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('forgot');
              setResetSuccess(false);
            }}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'forgot'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Reset Pass</span>
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-1 ${
                  loginError.type === 'pending'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : loginError.type === 'expired'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError.title}</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90 pl-6">{loginError.message}</p>
                {loginError.type === 'pending' && (
                  <div className="pt-2 pl-6">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-200">
                      STATUS: PENDING ADMIN APPROVAL
                    </span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-slate-500 font-mono">Work or Personal Email</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@smtphub.com or user@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Password</span>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  Forgot or Change?
                </button>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Validate & Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Fillers for Testing */}
            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>One-Click Test Accounts:</span>
                </span>
                <span className="text-[10px] text-slate-500">Auto-fills credentials</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials(MASTER_ADMIN_EMAIL, MASTER_ADMIN_PASSWORD)}
                  className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-emerald-300 group-hover:text-emerald-200">
                    Master Admin
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    admin@smtphub.com
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400/80 mt-0.5">
                    Pass: Killnom@9692
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials('alex.growth@scaleup.io', 'Growth2026!@')}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-slate-200 group-hover:text-white">
                    Approved User
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    alex.growth@scaleup.io
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                    Active (21 days left)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials('sarah.j@revflow.com', 'PassSecure#2026')}
                  className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-amber-300 group-hover:text-amber-200">
                    Pending User
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    sarah.j@revflow.com
                  </div>
                  <div className="text-[9px] font-mono text-amber-400/80 mt-0.5">
                    Tests Pending Flow
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials('david.m@apexmetrics.org', 'ApexPassword123!')}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-rose-300 group-hover:text-rose-200">
                    Expired User
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    david.m@apexmetrics.org
                  </div>
                  <div className="text-[9px] font-mono text-rose-400/80 mt-0.5">
                    Tests Days Validation
                  </div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: SIGNUP */}
        {tab === 'signup' && (
          <div className="space-y-4">
            {signupSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Registration Dispatched to Master Admin</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you, <strong className="text-emerald-400">{signupSuccess.name}</strong>! Your account request has been submitted. A real-time notification was delivered to the Master Admin Portal.
                </p>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-left text-xs font-mono space-y-1 text-slate-300">
                  <div><span className="text-slate-500">Email:</span> {signupSuccess.email}</div>
                  <div><span className="text-slate-500">Status:</span> <span className="text-amber-400">Awaiting Admin Day Allocation</span></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Once the Master Admin approves and sets your access validity in days, you can sign in directly using this same email and password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setLoginEmail(signupSuccess.email);
                    setLoginPassword('');
                    setSignupSuccess(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                {signupError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Rachel Adams"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email ID</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="rachel@scaleup.io"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showSignupPassword ? 'Hide password' : 'Show password'}</span>
                  </button>
                  <span className="text-slate-500 font-mono">Approval required</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
                  <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>How Signup Approval Works:</span>
                  </div>
                  <p>
                    1. Once submitted, your registration request appears immediately in the Master Admin portal.
                    <br />
                    2. The administrator reviews and allocates your access duration (in days).
                    <br />
                    3. Once approved, you log in using this same email and password.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Submit Signup Request to Admin</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: FORGOT / REQUEST PASSWORD CHANGE */}
        {tab === 'forgot' && (
          <div className="space-y-4">
            {resetSuccess ? (
              <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Password Change Request Logged</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your request has been filed with Master Admin for <strong className="text-cyan-400">{resetEmail}</strong>. The administrator can change or reset your password directly from the Master Admin Panel.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 leading-relaxed flex items-start gap-2.5">
                  <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Per security protocol, account passwords can be updated or reset directly by the Master Admin on request. Submit your registered email address below.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="user@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Transmit Password Change Request to Admin</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
