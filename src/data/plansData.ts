import { PlanTier } from '../types';

export const TELEGRAM_ADMIN_ID = '@rdpgopro';
export const TELEGRAM_LINK = 'https://t.me/rdpgopro';

export const SUBSCRIPTION_PLANS: PlanTier[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 299,
    period: '/ month',
    emailsPerDay: '50,000 emails per day',
    dailyCapacity: 50000,
    monthlyCapacity: '1,500,000 emails / mo',
    badge: 'STARTER CLUSTER',
    smtpDescription:
      'Connect up to 5 concurrent SMTP relays (Amazon SES, Postmark, SendGrid, Mailgun, or self-hosted VPS). Features automated IP rotation, multi-port TLS (25, 465, 587, 2525), and standard SPF/DKIM verification for clean bulk deliverability.',
    supportedRelays: [
      'Amazon SES Standard Nodes',
      'Postmark Transactional & Bulk',
      'Mailgun & SendGrid Relays',
      'Self-Hosted VPS (Postfix / Exim)',
    ],
    features: [
      '50,000 emails daily dispatch limit',
      'Up to 5 concurrent SMTP accounts',
      'Round-Robin & Weighted load balancing',
      'Real-time delivery & bounce tracker',
      'Multi-port TLS support (25, 465, 587, 2525)',
      'Global RBL blacklist watchdog scan',
      'Custom DKIM, SPF & DMARC verification',
      'Standard email & ticket support',
    ],
  },
  {
    id: 'advance',
    name: 'Advance Plan',
    price: 399,
    period: '/ month',
    emailsPerDay: '100,000 emails per day',
    dailyCapacity: 100000,
    monthlyCapacity: '3,000,000 emails / mo',
    popular: true,
    badge: 'MOST POPULAR',
    smtpDescription:
      'Supports up to 15 concurrent high-throughput SMTP nodes with dynamic failover on bounce thresholds (<20ms), automated 30-day domain & IP warmup scheduler, custom envelope return-path headers, and high-speed multi-threaded dispatch.',
    supportedRelays: [
      'Amazon SES Dedicated Pools',
      'Postmark High-Throughput Streams',
      'PowerMTA Linux Clusters',
      'Custom Multi-IP VPS Farms',
    ],
    features: [
      '100,000 emails daily dispatch limit',
      'Up to 15 concurrent SMTP accounts',
      'Dynamic failover routing on bounce signals (<20ms)',
      'Automated 30-day domain & IP warmup scheduler',
      'Custom envelope return-path & CNAME tracking',
      'AI Subject line and spam score analyzer',
      'Zero-latency multi-threaded queue engine',
      'Priority 24/7 technical support desk',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 449,
    period: '/ month',
    emailsPerDay: '200,000 emails per day',
    dailyCapacity: 200000,
    monthlyCapacity: '6,000,000 emails / mo',
    badge: 'ENTERPRISE SCALE',
    smtpDescription:
      'Enterprise multi-relay cluster with unlimited SMTP accounts & dedicated IP pools, ultra-low latency routing (<45ms), automated RBL blacklist protection, custom header injection, priority queue dispatch, and bespoke ISP warmups.',
    supportedRelays: [
      'Dedicated Cloud Outbound Cluster',
      'Amazon SES Dedicated IP Farm',
      'Self-Hosted PowerMTA Nodes',
      'High-Speed Bulletproof VPS Relays',
    ],
    features: [
      '200,000 emails daily dispatch limit',
      'Unlimited SMTP accounts & dedicated IP pools',
      'Ultra-low latency routing engine (<45ms handshake)',
      'Automated ISP-specific warmup algorithms',
      'Dedicated IP rotation & reputation isolation',
      'Custom SMTP header injection & DKIM selectors',
      'AI Smart Inbox Auto-Closer & Sentiment Engine',
      'Direct Telegram dedicated VIP manager (@rdpgopro)',
    ],
  },
];
