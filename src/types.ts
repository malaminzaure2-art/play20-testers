export type SocialPlatform = 
  | 'tiktok' 
  | 'youtube' 
  | 'instagram' 
  | 'facebook' 
  | 'twitter' 
  | 'telegram' 
  | 'whatsapp' 
  | 'website';

export type BoostActionType = 
  | 'follow' 
  | 'subscribe' 
  | 'like' 
  | 'view' 
  | 'comment' 
  | 'share' 
  | 'join';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  credits: number; // Coins balance (named credits / coins for compatibility)
  joinedAt: string;
  role: 'user' | 'creator' | 'admin';
  campaignsCreatedCount: number;
  tasksCompletedCount: number;
  dailyStreak: number;
  lastDailyBonusClaimDate?: string;
  referralCode: string;
  referralsCount: number;
  referralEarnings: number;
  boosterTier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond VIP';
}

export interface BoostCampaign {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  platform: SocialPlatform;
  actionType: BoostActionType;
  title: string;
  targetUrl: string;
  category: 'Entertainment' | 'Tech & Gaming' | 'Music & Dance' | 'Education' | 'Comedy & Skits' | 'Business & Finance' | 'News & Politics' | 'Lifestyle' | 'General';
  description: string;
  thumbnailUrl?: string;
  rewardPerAction: number; // e.g. 5 to 25 coins per task completed
  requiredCount: number; // total actions requested (e.g. 100 followers)
  deliveredCount: number; // actions delivered so far
  minDurationSeconds: number; // countdown duration before claim (e.g. 10s)
  active: boolean;
  createdAt: string;
  status: 'running' | 'completed' | 'paused';
  paymentMethod?: 'cash_transfer' | 'cash_card' | 'whatsapp' | 'coins';
  amountPaidNgn?: number;
  orderRef?: string;
  peakerrOrderId?: number | string;
  providerStatus?: string;
}

export interface CompletedTask {
  id: string;
  userId: string;
  userName: string;
  campaignId: string;
  campaignTitle: string;
  platform: SocialPlatform;
  actionType: BoostActionType;
  targetUrl: string;
  coinsEarned: number;
  completedAt: string;
  status: 'approved' | 'pending';
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number; // total coins
  bonusCredits?: number;
  priceUsd: number;
  priceNgn: number;
  popular?: boolean;
  tag?: string;
  badge?: string;
  description: string;
  features: string[];
}

export interface LeaderboardUser {
  rank: number;
  uid: string;
  displayName: string;
  photoURL: string;
  tasksCompleted: number;
  dailyStreak: number;
  totalCoinsEarned: number;
  badge: 'Top Booster ⭐' | 'Viral Creator 🚀' | 'Gold Earner 🛡️' | 'Rising Star 🌟';
}

export interface ReferralHistoryItem {
  id: string;
  referredName: string;
  date: string;
  coinsEarned: number;
  status: 'completed' | 'pending';
}

export type ActiveTab = 'explore' | 'campaigns' | 'tasks' | 'store' | 'guide';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
