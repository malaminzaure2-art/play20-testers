import { AppListing, CreditPackage, TestingTask, UserProfile, LeaderboardUser, ReferralHistoryItem } from '../types';

export const INITIAL_USER: UserProfile | null = null;

export const INITIAL_APPS: AppListing[] = [];

export const INITIAL_TASKS: TestingTask[] = [];

export const INITIAL_REFERRALS: ReferralHistoryItem[] = [];

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'pkg-basic',
    name: 'Starter Developer Pack',
    credits: 200,
    priceUSD: 14.99,
    description: 'Perfect for 1 app launch. Hire 20 testers for 14 days + bonus pool.',
    popular: false,
    badge: '1 App Test',
    features: [
      '20 Opt-in Testers for 14 Days',
      'Daily Screenshot & Feedback Logs',
      'Play Console Compliance Guarantee',
      'Automated Reminder Engine',
    ],
  },
  {
    id: 'pkg-pro',
    name: 'Pro Studio Launch Pack',
    credits: 500,
    priceUSD: 29.99,
    description: 'Best value for active indie devs. Launch 2-3 apps with priority tester queue.',
    popular: true,
    badge: 'Most Popular',
    features: [
      'Enough for 2-3 Full App Tests (20 Testers x 14 Days)',
      'Priority Listing on Explore Feed',
      'Detailed Device Model & OS Matrix',
      'Fraud Detection & Daily Activity Verification',
      'Email / Telegram Push Alerts to Testers',
    ],
  },
  {
    id: 'pkg-enterprise',
    name: 'Unlimited Agency Fleet',
    credits: 1200,
    priceUSD: 59.99,
    description: 'For dev agencies and studios managing multiple closed testing tracks simultaneously.',
    popular: false,
    badge: 'Agency Choice',
    features: [
      '6+ Complete App Launches',
      'Dedicated Community Support',
      'Instant Tester Queue Matching',
      'CSV Export for Play Console 14-Day Audit',
      'Zero-Spam Verified Tester Verification',
    ],
  },
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'DevTariq',
    appsTested: 48,
    totalCoinsEarned: 1420,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rankTitle: 'Grandmaster Tester',
    badgeColor: 'text-amber-500 bg-amber-50 border-amber-200',
  },
  {
    rank: 2,
    name: 'Elena_Code',
    appsTested: 41,
    totalCoinsEarned: 1190,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    rankTitle: 'Master Tester',
    badgeColor: 'text-slate-400 bg-slate-50 border-slate-200',
  },
  {
    rank: 3,
    name: 'KenjiDev',
    appsTested: 35,
    totalCoinsEarned: 980,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    rankTitle: 'Elite Tester',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
  },
];
