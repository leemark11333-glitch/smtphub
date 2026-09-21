import { AppUser, AdminNotification } from '../types';

export const MASTER_ADMIN_EMAIL = 'admin@smtphub.com';
export const MASTER_ADMIN_PASSWORD = 'Killnom@9692';

const USERS_STORAGE_KEY = 'smtphub_users_v1';
const CURRENT_USER_STORAGE_KEY = 'smtphub_current_user_v1';
const NOTIFICATIONS_STORAGE_KEY = 'smtphub_admin_notifications_v1';

// Seed Users with realistic dates and states
export const INITIAL_USERS: AppUser[] = [
  {
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
    lastLoginAt: '2026-09-21T11:00:00.000Z',
    notes: 'Super Master Admin with full cluster rights',
  },
  {
    id: 'user-client-alex',
    name: 'Alex Growth',
    email: 'alex.growth@scaleup.io',
    password: 'Growth2026!@',
    role: 'user',
    status: 'approved',
    accessDays: 30,
    createdAt: '2026-09-12T09:30:00.000Z',
    approvedAt: '2026-09-12T09:35:00.000Z',
    // 30 days from Sept 12 = Oct 12 (~21 days remaining)
    expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: '2026-09-21T09:15:00.000Z',
    notes: 'Assigned 30 days trial access for outbound tests',
  },
  {
    id: 'user-client-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.j@revflow.com',
    password: 'PassSecure#2026',
    role: 'user',
    status: 'pending',
    accessDays: 0,
    createdAt: '2026-09-21T10:45:00.000Z',
    notes: 'Self-registered via signup form. Needs approval & day allocation.',
  },
  {
    id: 'user-client-david',
    name: 'David Miller',
    email: 'david.m@apexmetrics.org',
    password: 'ApexPassword123!',
    role: 'user',
    status: 'approved',
    accessDays: 7,
    createdAt: '2026-09-01T08:00:00.000Z',
    approvedAt: '2026-09-01T08:05:00.000Z',
    // Expired 5 days ago
    expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: '2026-09-07T14:20:00.000Z',
    passwordResetRequested: true,
    passwordResetRequestDate: '2026-09-21T11:10:00.000Z',
    notes: 'Access expired after 7 days trial. Also requested password reset.',
  },
];

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    type: 'signup_request',
    userId: 'user-client-sarah',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@revflow.com',
    message: 'New user signup request received. Awaiting admin review and day allocation.',
    createdAt: '2026-09-21T10:45:00.000Z',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'password_reset_request',
    userId: 'user-client-david',
    userName: 'David Miller',
    userEmail: 'david.m@apexmetrics.org',
    message: 'User requested password change from admin on portal.',
    createdAt: '2026-09-21T11:10:00.000Z',
    read: false,
  },
];

export interface AccessValidityResult {
  isValid: boolean;
  isExpired: boolean;
  remainingDays: number;
  remainingHours: number;
  expiryDateFormatted: string;
  badgeLabel: string;
  badgeColor: 'emerald' | 'amber' | 'rose' | 'slate';
  reason?: string;
}

/**
 * Validates whether user access is active, expired, or pending based on assigned days.
 */
export function checkUserAccessValidity(user: AppUser): AccessValidityResult {
  if (user.role === 'admin') {
    return {
      isValid: true,
      isExpired: false,
      remainingDays: 99999,
      remainingHours: 99999,
      expiryDateFormatted: 'Permanent Master Access',
      badgeLabel: 'MASTER ADMIN',
      badgeColor: 'emerald',
    };
  }

  if (user.status === 'pending') {
    return {
      isValid: false,
      isExpired: false,
      remainingDays: 0,
      remainingHours: 0,
      expiryDateFormatted: 'Awaiting Admin Approval',
      badgeLabel: 'Pending Approval',
      badgeColor: 'amber',
      reason: 'Your account is pending review by the Master Admin. Please wait for days to be granted.',
    };
  }

  if (user.status === 'declined') {
    return {
      isValid: false,
      isExpired: false,
      remainingDays: 0,
      remainingHours: 0,
      expiryDateFormatted: 'Access Declined',
      badgeLabel: 'Declined',
      badgeColor: 'rose',
      reason: user.declineReason || 'Your signup request was declined by the Master Administrator.',
    };
  }

  // Approved user: check expiry date
  let expiresAtMs: number;
  if (user.expiresAt) {
    expiresAtMs = new Date(user.expiresAt).getTime();
  } else {
    const baseTime = user.approvedAt ? new Date(user.approvedAt).getTime() : new Date(user.createdAt).getTime();
    expiresAtMs = baseTime + user.accessDays * 24 * 60 * 60 * 1000;
  }

  const now = Date.now();
  const diffMs = expiresAtMs - now;

  const expiryDateObj = new Date(expiresAtMs);
  const expiryDateFormatted = isNaN(expiryDateObj.getTime())
    ? 'Invalid date'
    : expiryDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  if (diffMs <= 0) {
    const expiredDaysAgo = Math.max(1, Math.round(Math.abs(diffMs) / (24 * 60 * 60 * 1000)));
    return {
      isValid: false,
      isExpired: true,
      remainingDays: 0,
      remainingHours: 0,
      expiryDateFormatted,
      badgeLabel: `Expired (${expiredDaysAgo}d ago)`,
      badgeColor: 'rose',
      reason: `Your access validity of ${user.accessDays} day(s) expired on ${expiryDateFormatted}. Contact Master Admin to renew access.`,
    };
  }

  const remainingDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  const remainingHours = Math.ceil(diffMs / (60 * 60 * 1000));

  let badgeColor: 'emerald' | 'amber' | 'rose' | 'slate' = 'emerald';
  if (remainingDays <= 3) {
    badgeColor = 'rose';
  } else if (remainingDays <= 7) {
    badgeColor = 'amber';
  }

  return {
    isValid: true,
    isExpired: false,
    remainingDays,
    remainingHours,
    expiryDateFormatted,
    badgeLabel: `${remainingDays} Day${remainingDays === 1 ? '' : 's'} Remaining`,
    badgeColor,
  };
}

// Storage helpers
export function loadStoredUsers(): AppUser[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY) || localStorage.getItem('smtpdock_users_v1');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load users from storage', e);
  }
  return INITIAL_USERS;
}

export function saveStoredUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to storage', e);
  }
}

export function loadStoredNotifications(): AdminNotification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load notifications', e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveStoredNotifications(notifs: AdminNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

export function loadStoredCurrentUser(): AppUser | null {
  try {
    const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load current user', e);
  }
  // Default to Master Admin for easy demonstration
  return INITIAL_USERS[0];
}

export function saveStoredCurrentUser(user: AppUser | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save current user', e);
  }
}
