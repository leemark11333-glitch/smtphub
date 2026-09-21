export type SmtpProvider = 'SES' | 'SendGrid' | 'Postmark' | 'Mailgun' | 'Brevo' | 'Custom';
export type SmtpSecurity = 'TLS' | 'SSL' | 'STARTTLS' | 'None';
export type SmtpStatus = 'active' | 'warming' | 'paused' | 'error';

export interface SmtpAccount {
  id: string;
  name: string;
  provider: SmtpProvider;
  host: string;
  port: number;
  username: string;
  password?: string;
  fromName: string;
  fromEmail: string;
  security: SmtpSecurity;
  status: SmtpStatus;
  dailyLimit: number;
  sentToday: number;
  speedLimitPerHour: number;
  healthScore: number; // e.g. 99.4%
  bounceRate: number; // e.g. 0.8%
  latencyMs: number; // e.g. 84ms
  weight: number; // 1-100 load balancer
  lastTested: string;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused';

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  fromName: string;
  fromEmail: string;
  smtpAccountId: string | 'rotation';
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  unsubscribedCount: number;
  status: CampaignStatus;
  createdAt: string;
  scheduledFor?: string;
  templateId?: string;
  tags: string[];
  htmlContent: string;
}

export interface Contact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  deliverabilityRating: 'A+' | 'A' | 'B' | 'Risky';
  tags: string[];
  lastEngagement: string;
  opens: number;
  clicks: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'Cold Outreach' | 'Onboarding' | 'Newsletter' | 'Promotion' | 'Transactional';
  subject: string;
  previewText: string;
  htmlContent: string;
  tags: string[];
  lastUpdated: string;
}

export interface WarmupProfile {
  id: string;
  smtpAccountId: string;
  smtpName: string;
  domain: string;
  currentDay: number;
  totalDays: number;
  targetDailyLimit: number;
  todaySent: number;
  todayTarget: number;
  reputationScore: number;
  inboxPlacement: number; // e.g. 98.2%
  spamPlacement: number; // e.g. 1.8%
  status: 'active' | 'paused';
  rampHistory: { day: number; sent: number; target: number }[];
}

export interface DomainRecord {
  id: string;
  domain: string;
  smtpProvider: string;
  spf: { status: 'valid' | 'invalid' | 'warning'; record: string; expected: string };
  dkim: { status: 'valid' | 'invalid' | 'warning'; record: string; expected: string };
  dmarc: { status: 'valid' | 'invalid' | 'warning'; record: string; policy: 'reject' | 'quarantine' | 'none' };
  mx: { status: 'valid' | 'invalid'; record: string };
  bimi: { status: 'valid' | 'missing'; record: string };
  lastChecked: string;
}

export interface LiveEmailEvent {
  id: string;
  timestamp: string;
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complaint';
  recipient: string;
  campaignName: string;
  smtpNode: string;
  latencyMs: number;
}

export interface SequenceStep {
  id: string;
  dayOffset: number;
  subject: string;
  previewText: string;
  condition?: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
}

export interface Sequence {
  id: string;
  name: string;
  trigger: string;
  status: 'active' | 'paused' | 'draft';
  subscribersCount: number;
  steps: SequenceStep[];
}

export interface SuppressionEntry {
  id: string;
  email: string;
  reason: 'hard_bounce' | 'complaint' | 'manual' | 'unsubscribe' | 'spam_complaint';
  sourceCampaign?: string;
  addedAt: string;
  source?: string;
}

export type SuppressionItem = SuppressionEntry;

export interface AnalyticsDailyStat {
  date: string;
  delivered: number;
  opens: number;
  clicks: number;
  bounces: number;
}

export interface AnalyticsSummary {
  totalSent: number;
  totalDelivered: number;
  totalOpens: number;
  totalClicks: number;
  totalBounces: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  dailyStats: AnalyticsDailyStat[];
}

export interface InboxItem {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  classification: 'out_of_office' | 'auto_reply' | 'bounce' | 'human_reply' | 'unsubscribe_request';
  status: 'auto_resolved' | 'pending' | 'ignored' | 'resolved';
  receivedAt: string;
  suggestedAction: string;
}

export type ActiveNav =
  | 'dashboard'
  | 'compose'
  | 'campaigns'
  | 'inbox'
  | 'analytics'
  | 'contacts'
  | 'templates'
  | 'sequences'
  | 'suppressions'
  | 'smtp'
  | 'domains'
  | 'warmup'
  | 'deliverability'
  | 'ai-tools'
  | 'ai_tools'
  | 'admin'
  | 'settings'
  | 'guides';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'declined';
  accessDays: number;
  createdAt: string;
  approvedAt?: string;
  expiresAt?: string;
  lastLoginAt?: string;
  declineReason?: string;
  passwordResetRequested?: boolean;
  passwordResetRequestDate?: string;
  notes?: string;
}

export interface AdminNotification {
  id: string;
  type: 'signup_request' | 'password_reset_request' | 'access_expiring' | 'user_approved' | 'user_declined';
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionTaken?: 'approved' | 'declined' | 'password_changed';
}
