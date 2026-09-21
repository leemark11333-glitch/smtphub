import React, { useState, useEffect } from 'react';
import {
  ActiveNav,
  Campaign,
  SmtpAccount,
  DomainRecord,
  Contact,
  EmailTemplate,
  SuppressionItem,
  InboxItem,
  LiveEmailEvent,
  WarmupProfile,
  AnalyticsSummary,
  AppUser,
  AdminNotification,
} from './types';
import {
  initialSmtpAccounts,
  initialDomains,
  initialCampaigns,
  initialContacts,
  initialTemplates,
  initialInboxItems,
  initialSuppressions,
  initialWarmupProfile,
  initialAnalytics,
  initialLiveEvents,
} from './data/mockData';
import {
  loadStoredUsers,
  saveStoredUsers,
  loadStoredNotifications,
  saveStoredNotifications,
  loadStoredCurrentUser,
  saveStoredCurrentUser,
  checkUserAccessValidity,
  MASTER_ADMIN_EMAIL,
  MASTER_ADMIN_PASSWORD,
} from './utils/authUtils';

// Layout & Modals
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { TestEmailModal } from './components/TestEmailModal';
import { AuthModal } from './components/AuthModal';

// Views
import { DashboardView } from './components/DashboardView';
import { ComposeView } from './components/ComposeView';
import { CampaignsView } from './components/CampaignsView';
import { SmtpAccountsView } from './components/SmtpAccountsView';
import { SenderDomainsView } from './components/SenderDomainsView';
import { WarmupView } from './components/WarmupView';
import { DeliverabilityView } from './components/DeliverabilityView';
import { ContactsView } from './components/ContactsView';
import { TemplatesView } from './components/TemplatesView';
import { InboxAutoCloserView } from './components/InboxAutoCloserView';
import { AnalyticsView } from './components/AnalyticsView';
import { SuppressionsView } from './components/SuppressionsView';
import { AiToolsView } from './components/AiToolsView';
import { SequencesView } from './components/SequencesView';
import { SettingsView } from './components/SettingsView';
import { GuidesView } from './components/GuidesView';
import { MasterAdminView } from './components/MasterAdminView';

export default function App() {
  const [activeNav, setActiveNav] = useState<ActiveNav>('dashboard');

  // Authentication & Master Admin State
  const [users, setUsers] = useState<AppUser[]>(() => loadStoredUsers());
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => loadStoredNotifications());
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => loadStoredCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [adminToast, setAdminToast] = useState<{ title: string; desc: string } | null>(null);

  // Sync to localStorage whenever state updates
  useEffect(() => {
    saveStoredUsers(users);
  }, [users]);

  useEffect(() => {
    saveStoredNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveStoredCurrentUser(currentUser);
  }, [currentUser]);

  // Application Data State
  const [smtpAccounts, setSmtpAccounts] = useState<SmtpAccount[]>(initialSmtpAccounts);
  const [domains, setDomains] = useState<DomainRecord[]>(initialDomains);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(initialInboxItems);
  const [suppressions, setSuppressions] = useState<SuppressionItem[]>(initialSuppressions);
  const [warmupProfile, setWarmupProfile] = useState<WarmupProfile>(initialWarmupProfile);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary>(initialAnalytics);
  const [liveEvents, setLiveEvents] = useState<LiveEmailEvent[]>(initialLiveEvents);

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testModalSubject, setTestModalSubject] = useState('Automating deliverability for {{company}}');
  const [testModalHtml, setTestModalHtml] = useState('<p>Hi {{first_name}}, testing deliverability.</p>');
  const [testModalSmtpId, setTestModalSmtpId] = useState('rotation');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Pending user approvals count for badges
  const pendingApprovalsCount = users.filter((u) => u.status === 'pending').length;

  const showToast = (title: string, desc: string) => {
    setAdminToast({ title, desc });
    setTimeout(() => {
      setAdminToast(null);
    }, 4000);
  };

  // Auth & Admin Actions
  const handleApproveUser = (userId: string, accessDays: number) => {
    const expiresAt = new Date(Date.now() + accessDays * 24 * 60 * 60 * 1000).toISOString();
    const approvedAt = new Date().toISOString();

    let targetUser: AppUser | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          targetUser = u;
          return {
            ...u,
            status: 'approved',
            accessDays,
            approvedAt,
            expiresAt,
            notes: `Approved with ${accessDays} days validity by Master Admin.`,
          };
        }
        return u;
      })
    );

    // Update notifications
    setNotifications((prev) =>
      prev.map((n) =>
        n.userId === userId ? { ...n, read: true, actionTaken: 'approved' as const } : n
      )
    );

    if (targetUser) {
      showToast(
        'User Approved Successfully',
        `Granted ${accessDays} days login validity to ${targetUser.name} (${targetUser.email}).`
      );
    }
  };

  const handleDeclineUser = (userId: string, reason?: string) => {
    let targetUser: AppUser | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          targetUser = u;
          return {
            ...u,
            status: 'declined',
            declineReason: reason || 'Declined by Master Administrator.',
          };
        }
        return u;
      })
    );

    setNotifications((prev) =>
      prev.map((n) =>
        n.userId === userId ? { ...n, read: true, actionTaken: 'declined' as const } : n
      )
    );

    if (targetUser) {
      showToast('User Request Declined', `Declined registration for ${targetUser.name}.`);
    }
  };

  const handleCreateUser = (newUser: AppUser) => {
    setUsers((prev) => [newUser, ...prev]);
    showToast(
      'New User Provisioned',
      `Directly created ${newUser.name} with ${newUser.accessDays} days login validity.`
    );
  };

  const handleChangeUserPassword = (userId: string, newPassword: string) => {
    let targetUser: AppUser | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          targetUser = u;
          return {
            ...u,
            password: newPassword,
            passwordResetRequested: false,
          };
        }
        return u;
      })
    );

    setNotifications((prev) =>
      prev.map((n) =>
        n.userId === userId && n.type === 'password_reset_request'
          ? { ...n, read: true, actionTaken: 'password_changed' as const }
          : n
      )
    );

    if (targetUser) {
      showToast(
        'Password Updated on Request',
        `Successfully changed password for ${targetUser.name}. New credentials active immediately.`
      );
    }
  };

  const handleAdjustUserDays = (userId: string, additionalDays: number) => {
    let targetUser: AppUser | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          targetUser = u;
          const currentExpiryMs = u.expiresAt ? new Date(u.expiresAt).getTime() : Date.now();
          const baseMs = Math.max(Date.now(), currentExpiryMs);
          const newExpiresAt = new Date(baseMs + additionalDays * 24 * 60 * 60 * 1000).toISOString();
          return {
            ...u,
            accessDays: (u.accessDays || 0) + additionalDays,
            status: 'approved',
            expiresAt: newExpiresAt,
          };
        }
        return u;
      })
    );

    if (targetUser) {
      showToast(
        'Access Days Extended',
        `Added ${additionalDays} days of login validity to ${targetUser.name}.`
      );
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('User Deleted', 'Account removed from system database.');
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleUserRegistered = (newUser: AppUser, notif: AdminNotification) => {
    setUsers((prev) => [newUser, ...prev]);
    setNotifications((prev) => [notif, ...prev]);
    showToast(
      'New Signup Notification Received',
      `${newUser.name} (${newUser.email}) submitted an account request. Awaiting admin approval.`
    );
  };

  const handleRequestPasswordReset = (email: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                passwordResetRequested: true,
                passwordResetRequestDate: new Date().toISOString(),
              }
            : u
        )
      );

      const notif: AdminNotification = {
        id: `notif-${Date.now()}`,
        type: 'password_reset_request',
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        message: `User ${user.name} (${user.email}) submitted a password change request.`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      showToast(
        'Password Change Request Logged',
        `Master Admin has been notified to change credentials for ${user.email}.`
      );
    }
  };

  // Handlers for Campaigns
  const handleSaveCampaign = (newCampaign: Campaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    setLiveEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        type: 'delivered',
        recipient: 'first-prospect@scaleup.io',
        campaignName: newCampaign.name,
        smtpNode: 'Auto-Balancing Relay',
        timestamp: 'Just now',
        latencyMs: 68,
      },
      ...prev.slice(0, 19),
    ]);
  };

  const handleCloneCampaign = (camp: Campaign) => {
    const cloned: Campaign = {
      ...camp,
      id: `cmp-${Date.now()}`,
      name: `${camp.name} (Copy)`,
      status: 'draft',
      createdAt: 'Just now',
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      unsubscribedCount: 0,
    };
    setCampaigns((prev) => [cloned, ...prev]);
  };

  const handleUpdateCampaignStatus = (id: string, newStatus: Campaign['status']) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  // Handlers for SMTP Accounts
  const handleAddSmtpAccount = (acc: SmtpAccount) => {
    setSmtpAccounts((prev) => [...prev, acc]);
  };

  const handleUpdateSmtpWeight = (id: string, weight: number) => {
    setSmtpAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, weight } : a))
    );
  };

  const handleDeleteSmtpAccount = (id: string) => {
    setSmtpAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // Handlers for Domains
  const handleAddDomain = (domain: DomainRecord) => {
    setDomains((prev) => [...prev, domain]);
  };

  const handleVerifyDomain = (id: string) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, lastChecked: 'Just now', spf: { ...d.spf, status: 'valid' } } : d
      )
    );
  };

  // Handlers for Contacts
  const handleAddContact = (c: Contact) => {
    setContacts((prev) => [c, ...prev]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleImportContacts = (newContacts: Contact[]) => {
    setContacts((prev) => [...newContacts, ...prev]);
  };

  // Handlers for Suppressions
  const handleAddSuppression = (item: SuppressionItem) => {
    setSuppressions((prev) => [item, ...prev]);
  };

  const handleRemoveSuppression = (id: string) => {
    setSuppressions((prev) => prev.filter((s) => s.id !== id));
  };

  // Handlers for Inbox Auto-Closer
  const handleResolveInboxItem = (id: string) => {
    setInboxItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'resolved' } : i))
    );
  };

  const handleResolveAllInbox = () => {
    setInboxItems((prev) =>
      prev.map((i) => ({ ...i, status: 'resolved' }))
    );
  };

  // Handlers for Warmup
  const handleToggleWarmup = () => {
    setWarmupProfile((prev) => ({
      ...prev,
      status: prev.status === 'active' ? 'paused' : 'active',
    }));
  };

  // Trigger Send Test Email Modal
  const handleOpenTestModal = (
    subject = 'Automating deliverability for {{company}}',
    html = '<p>Hi {{first_name}}, testing deliverability.</p>',
    smtpId = 'rotation'
  ) => {
    setTestModalSubject(subject);
    setTestModalHtml(html);
    setTestModalSmtpId(smtpId);
    setIsTestModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#090b10] text-slate-100 antialiased overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Desktop & Mobile Sidebar */}
      <div className={`${isMobileSidebarOpen ? 'block fixed inset-0 z-50' : 'hidden md:block'} shrink-0`}>
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        <Sidebar
          activeNav={activeNav}
          setActiveNav={(nav) => {
            setActiveNav(nav);
            setIsMobileSidebarOpen(false);
          }}
          smtpAccounts={smtpAccounts}
          contactCount={contacts.length}
          draftCount={campaigns.filter((c) => c.status === 'draft').length}
          currentUser={currentUser}
          pendingApprovalsCount={pendingApprovalsCount}
          onOpenAuthModal={() => {
            setAuthModalTab('login');
            setIsAuthModalOpen(true);
          }}
        />
      </div>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Persistent Top Header */}
        <Header
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          smtpAccounts={smtpAccounts}
          liveEvents={liveEvents}
          onOpenTestModal={() => handleOpenTestModal()}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          currentUser={currentUser}
          onOpenAuthModal={() => {
            setAuthModalTab('login');
            setIsAuthModalOpen(true);
          }}
        />

        {/* Floating Notification Toast */}
        {adminToast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#111624] border border-emerald-500/40 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 animate-ping" />
              <div>
                <h4 className="text-xs font-bold text-white">{adminToast.title}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{adminToast.desc}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto bg-[#090b10]">
          {activeNav === 'dashboard' && (
            <DashboardView
              campaigns={campaigns}
              smtpAccounts={smtpAccounts}
              liveEvents={liveEvents}
              setActiveNav={setActiveNav}
              onOpenTestModal={() => handleOpenTestModal()}
            />
          )}

          {activeNav === 'admin' && (
            <MasterAdminView
              users={users}
              notifications={notifications}
              currentUser={currentUser}
              onApproveUser={handleApproveUser}
              onDeclineUser={handleDeclineUser}
              onCreateUser={handleCreateUser}
              onChangeUserPassword={handleChangeUserPassword}
              onAdjustUserDays={handleAdjustUserDays}
              onDeleteUser={handleDeleteUser}
              onMarkNotificationRead={handleMarkNotificationRead}
            />
          )}

          {activeNav === 'compose' && (
            <ComposeView
              smtpAccounts={smtpAccounts}
              templates={templates}
              onSaveCampaign={handleSaveCampaign}
              onSendTest={(s, h, id) => handleOpenTestModal(s, h, id)}
            />
          )}

          {activeNav === 'campaigns' && (
            <CampaignsView
              campaigns={campaigns}
              setActiveNav={setActiveNav}
              onUpdateCampaignStatus={handleUpdateCampaignStatus}
              onCloneCampaign={handleCloneCampaign}
              onDeleteCampaign={handleDeleteCampaign}
            />
          )}

          {activeNav === 'smtp' && (
            <SmtpAccountsView
              smtpAccounts={smtpAccounts}
              onAddAccount={handleAddSmtpAccount}
              onUpdateWeight={handleUpdateSmtpWeight}
              onDeleteAccount={handleDeleteSmtpAccount}
            />
          )}

          {activeNav === 'domains' && (
            <SenderDomainsView
              domains={domains}
              onAddDomain={handleAddDomain}
              onVerifyDomain={handleVerifyDomain}
            />
          )}

          {activeNav === 'warmup' && (
            <WarmupView
              warmup={warmupProfile}
              onToggleWarmup={handleToggleWarmup}
            />
          )}

          {activeNav === 'deliverability' && <DeliverabilityView />}

          {activeNav === 'contacts' && (
            <ContactsView
              contacts={contacts}
              onAddContact={handleAddContact}
              onDeleteContact={handleDeleteContact}
              onImportContacts={handleImportContacts}
            />
          )}

          {activeNav === 'templates' && (
            <TemplatesView
              templates={templates}
              setActiveNav={setActiveNav}
              onSelectTemplateForCompose={(tpl) => {
                setTestModalSubject(tpl.subject);
                setTestModalHtml(tpl.htmlContent);
              }}
            />
          )}

          {activeNav === 'inbox' && (
            <InboxAutoCloserView
              inboxItems={inboxItems}
              onResolveItem={handleResolveInboxItem}
              onResolveAll={handleResolveAllInbox}
            />
          )}

          {activeNav === 'analytics' && (
            <AnalyticsView
              analytics={analyticsData}
              smtpAccounts={smtpAccounts}
            />
          )}

          {activeNav === 'suppressions' && (
            <SuppressionsView
              suppressions={suppressions}
              onAddSuppression={handleAddSuppression}
              onRemoveSuppression={handleRemoveSuppression}
            />
          )}

          {(activeNav === 'ai_tools' || activeNav === 'ai-tools') && (
            <AiToolsView
              setActiveNav={setActiveNav}
              onSendGeneratedToCompose={(subject, body) => {
                setTestModalSubject(subject);
                setTestModalHtml(body);
              }}
            />
          )}

          {activeNav === 'sequences' && (
            <SequencesView setActiveNav={setActiveNav} />
          )}

          {activeNav === 'settings' && <SettingsView />}

          {activeNav === 'guides' && (
            <GuidesView setActiveNav={setActiveNav} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveNav={setActiveNav}
      />

      <TestEmailModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        subject={testModalSubject}
        htmlContent={testModalHtml}
        smtpAccounts={smtpAccounts}
        initialSmtpId={testModalSmtpId}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        initialTab={authModalTab}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
          showToast(
            'Authentication Successful',
            `Logged in as ${user.name} (${user.role === 'admin' ? 'Master Admin' : 'Client User'}).`
          );
        }}
        onUserRegistered={handleUserRegistered}
        onRequestPasswordReset={handleRequestPasswordReset}
      />
    </div>
  );
}
