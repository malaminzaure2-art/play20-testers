export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  credits: number;
  joinedAt: string;
  role: 'developer' | 'tester' | 'admin';
  appsSubmittedCount: number;
  appsTestedCount: number;
  dailyStreak: number;
  referralCode: string;
  referralsCount: number;
  referralEarnings: number;
  testerRank: 'Bronze' | 'Silver' | 'Gold' | 'Top Tester';
  completedFullTests: number;
}

export interface AppListing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  title: string;
  packageName: string;
  category: 'Productivity' | 'Tools' | 'Games' | 'Finance' | 'Health & Fitness' | 'Social' | 'Education' | 'Lifestyle';
  description: string;
  iconUrl: string;
  groupUrl: string;
  storeWebUrl: string;
  storeAndroidUrl: string;
  requiredTesters: number;
  currentTesters: number;
  daysRequired: number; // typically 14
  rewardPerDay: number; // e.g. 10 coins
  completionBonus: number; // e.g. 50 coins
  active: boolean;
  createdAt: string;
  targetRegion: string;
  minAndroidVersion: string;
  feedbackPrompt?: string;
}

export interface TestingTask {
  id: string;
  userId: string;
  appId: string;
  app: AppListing;
  startDate: string;
  currentDay: number; // 1 to 14
  totalDays: number; // 14
  status: 'active' | 'completed' | 'abandoned';
  lastFeedbackDate?: string;
  proofSubmittedToday: boolean;
  totalCreditsEarned: number;
  feedbacks: TestingFeedback[];
}

export interface TestingFeedback {
  id: string;
  taskId: string;
  appId: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  dayNumber: number;
  rating: number; // 1-5 stars
  feedbackText: string;
  screenshotUrl: string;
  deviceModel: string;
  androidVersion: string;
  status: 'approved' | 'pending' | 'flagged';
  creditsAwarded: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
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
  completedTests: number;
  dailyStreak: number;
  totalCoinsEarned: number;
  badge: 'Top Tester ⭐' | 'Elite Dev 🚀' | 'Verified Tester 🛡️' | 'Rising Star 🌟';
}

export interface ReferralHistoryItem {
  id: string;
  referredName: string;
  date: string;
  coinsEarned: number;
  status: 'completed' | 'pending';
}

export type ActiveTab = 'explore' | 'tasks' | 'my-apps' | 'store' | 'guide';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
