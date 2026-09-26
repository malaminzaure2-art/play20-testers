import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  BoostCampaign, 
  CompletedTask, 
  SocialPlatform, 
  BoostActionType, 
  ActiveTab, 
  ToastMessage, 
  LeaderboardUser, 
  ReferralHistoryItem, 
  CreditPackage 
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_CAMPAIGNS, 
  CREDIT_PACKAGES, 
  MOCK_LEADERBOARD, 
  INITIAL_REFERRALS 
} from '../data/mockData';
import { getFirebaseInstance } from '../firebase/config';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  increment
} from 'firebase/firestore';

interface AppContextType {
  user: UserProfile | null;
  campaigns: BoostCampaign[];
  completedTasks: CompletedTask[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signOutUser: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  // Campaign Actions
  createNewCampaign: (campaignData: Omit<BoostCampaign, 'id' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'deliveredCount' | 'createdAt' | 'status' | 'active'>) => boolean;
  editingCampaign: BoostCampaign | null;
  setEditingCampaign: (camp: BoostCampaign | null) => void;
  updateCampaign: (campaignId: string, fields: Partial<BoostCampaign>) => boolean;
  toggleCampaignStatus: (campaignId: string) => boolean;
  deleteCampaign: (campaignId: string) => boolean;
  
  // Task Execution Actions
  selectedCampaignForTask: BoostCampaign | null;
  setSelectedCampaignForTask: (camp: BoostCampaign | null) => void;
  executeBoostTask: (campaign: BoostCampaign) => { success: boolean; message: string; coinsEarned?: number };
  
  // Daily Bonus & Rewards
  canClaimDailyBonus: boolean;
  claimDailyBonus: () => { success: boolean; coins: number };
  
  // Buy Coins
  buyCredits: (packageId: string) => void;
  
  // Modals & Navigation
  isCreateCampaignModalOpen: boolean;
  setIsCreateCampaignModalOpen: (open: boolean) => void;
  isDeployGuideOpen: boolean;
  setIsDeployGuideOpen: (open: boolean) => void;
  isFirebaseModalOpen: boolean;
  setIsFirebaseModalOpen: (open: boolean) => void;
  isReferralModalOpen: boolean;
  setIsReferralModalOpen: (open: boolean) => void;
  isLeaderboardModalOpen: boolean;
  setIsLeaderboardModalOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  legalModalType: 'privacy' | 'terms' | 'about' | 'contact' | 'safety' | null;
  setLegalModalType: (type: 'privacy' | 'terms' | 'about' | 'contact' | 'safety' | null) => void;
  
  // Leaderboard & Referrals
  leaderboardUsers: LeaderboardUser[];
  referrals: ReferralHistoryItem[];
  copyReferralLink: () => void;
  claimReferralBonus: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Provider Live Sync
  isSyncingOrders: boolean;
  refreshLiveCampaignStatus: (showNotification?: boolean) => Promise<void>;
  
  // Admin Panel & Customer Order Dispatcher
  isAdmin: boolean;
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  registeredUsers: UserProfile[];
  refreshUsersList: () => Promise<void>;
  dispatchAdminCustomerOrder: (order: {
    customerName: string;
    platform: SocialPlatform;
    actionType: BoostActionType;
    targetUrl: string;
    quantity: number;
    amountChargedNgn?: number;
    notes?: string;
  }) => Promise<{ success: boolean; peakerrOrder?: number | string; error?: string }>;

  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (plat: string) => void;
  selectedActionType: string;
  setSelectedActionType: (action: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const ADMIN_EMAILS = [
  'msngapps@gmail.com',
  'msngappsgmail.com',
  'malaminzaure2@gmail.com',
  'sulaimanapps2@gmail.com',
];

export const isUserAdmin = (userEmail?: string | null, role?: string): boolean => {
  if (role === 'admin') return true;
  if (!userEmail) return false;
  const cleanEmail = userEmail.toLowerCase().trim();
  return ADMIN_EMAILS.some(admin => 
    cleanEmail === admin || 
    cleanEmail.replace(/[@.]/g, '') === admin.replace(/[@.]/g, '') ||
    cleanEmail.startsWith('msngapps')
  );
};

const STORAGE_KEYS = {
  USER: 'trendboost_user_v3',
  CAMPAIGNS: 'trendboost_campaigns_v3',
  TASKS: 'trendboost_tasks_v3',
  USERS: 'trendboost_registered_users_v3',
};

export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  {
    uid: 'admin-msngapps',
    email: 'msngapps@gmail.com',
    displayName: 'Sulaiman (Admin)',
    credits: 5000,
    joinedAt: '2026-03-01T08:00:00Z',
    role: 'admin',
    campaignsCreatedCount: 12,
    tasksCompletedCount: 45,
    dailyStreak: 18,
    referralCode: 'TB-ADMIN1',
    referralsCount: 24,
    referralEarnings: 2400,
    boosterTier: 'Diamond VIP',
  },
  {
    uid: 'user-malaminzaure2',
    email: 'malaminzaure2@gmail.com',
    displayName: 'Malam Inzaure',
    credits: 1200,
    joinedAt: '2026-03-10T11:20:00Z',
    role: 'admin',
    campaignsCreatedCount: 5,
    tasksCompletedCount: 28,
    dailyStreak: 7,
    referralCode: 'TB-MALAM2',
    referralsCount: 8,
    referralEarnings: 800,
    boosterTier: 'Gold',
  },
];

// Check if daily bonus was claimed today
export const isBonusClaimedToday = (lastClaimDate?: string): boolean => {
  if (!lastClaimDate) return false;
  try {
    const lastDate = new Date(lastClaimDate);
    const now = new Date();
    return (
      lastDate.getFullYear() === now.getFullYear() &&
      lastDate.getMonth() === now.getMonth() &&
      lastDate.getDate() === now.getDate()
    );
  } catch (e) {
    return false;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default guest profile if none
    return null;
  });

  const [campaigns, setCampaigns] = useState<BoostCampaign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize and ensure Sulaiman's active campaign has provider order ID linked
          return parsed.map((c: BoostCampaign) => {
            if (c.orderRef === 'TB-TI-500874' || c.targetUrl?.includes('sulaimanapps2')) {
              return {
                ...c,
                peakerrOrderId: c.peakerrOrderId || 80959061,
                providerStatus: c.providerStatus || 'In progress',
              };
            }
            return c;
          });
        }
      } catch (e) { console.error(e); }
    }
    return INITIAL_CAMPAIGNS;
  });

  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<BoostCampaign | null>(null);
  const [selectedCampaignForTask, setSelectedCampaignForTask] = useState<BoostCampaign | null>(null);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'about' | 'contact' | 'safety' | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Admin Panel State
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const isAdmin = isUserAdmin(user?.email, user?.role);

  // Registered Users Registry for Admin Panel (Only real users & admins, no test data)
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove any dummy/sample emails
          const cleaned = parsed.filter((u: UserProfile) => 
            u && u.email &&
            !u.email.includes('ali_kannywood') && 
            !u.email.includes('hausacomedy') && 
            !u.email.includes('ibrahim.kaduna') && 
            !u.email.includes('maryam.fashion') &&
            !u.uid?.includes('kannywood') &&
            !u.uid?.includes('hausa-comedy')
          );
          if (cleaned.length > 0) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cleaned));
            return cleaned;
          }
        }
      } catch (e) {}
    }
    return INITIAL_REGISTERED_USERS;
  });

  // Keep registeredUsers list in sync when current user changes/logs in
  useEffect(() => {
    if (user && user.email) {
      setRegisteredUsers(prev => {
        const cleanUserEmail = user.email.toLowerCase().trim();
        const existingIdx = prev.findIndex(u => u.uid === user.uid || u.email.toLowerCase().trim() === cleanUserEmail);
        let updated: UserProfile[];
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = { 
            ...updated[existingIdx], 
            ...user,
            role: isUserAdmin(user.email, user.role) ? 'admin' : updated[existingIdx].role 
          };
        } else {
          updated = [{ ...user, role: isUserAdmin(user.email, user.role) ? 'admin' : user.role }, ...prev];
        }
        try { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated)); } catch (e) {}
        return updated;
      });

      // Synchronize to centralized server so mobile, laptop, and all browsers see it
      fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      }).catch(() => {});
    }
  }, [user]);

  // Initial Cross-Device Server Sync (Runs on page load for phone & computer)
  useEffect(() => {
    const syncUsersAcrossDevices = async () => {
      try {
        // Send whatever users this device has (e.g. from laptop) to server
        const saved = localStorage.getItem(STORAGE_KEYS.USERS);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              await fetch('/api/users/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ users: parsed }),
              });
            }
          } catch (e) {}
        }

        // Fetch latest merged users from server
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users) && data.users.length > 0) {
            setRegisteredUsers(prev => {
              const map = new Map<string, UserProfile>();
              prev.forEach(u => map.set(u.email.toLowerCase().trim(), u));
              data.users.forEach((u: UserProfile) => {
                if (u && u.email) {
                  map.set(u.email.toLowerCase().trim(), {
                    ...u,
                    role: isUserAdmin(u.email, u.role) ? 'admin' : (u.role || 'user'),
                  });
                }
              });
              const merged = Array.from(map.values());
              try { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(merged)); } catch (e) {}
              return merged;
            });
          }
        }
      } catch (err) {
        // Offline resilient
      }
    };

    syncUsersAcrossDevices();
  }, []);

  const refreshUsersList = async () => {
    try {
      let fetchedCount = 0;
      // 1. Fetch from Centralized Server API
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users) && data.users.length > 0) {
            setRegisteredUsers(prev => {
              const map = new Map<string, UserProfile>();
              prev.forEach(u => map.set(u.email.toLowerCase().trim(), u));
              data.users.forEach((u: UserProfile) => {
                if (u && u.email) {
                  map.set(u.email.toLowerCase().trim(), {
                    ...u,
                    role: isUserAdmin(u.email, u.role) ? 'admin' : (u.role || 'user'),
                  });
                }
              });
              const merged = Array.from(map.values());
              try { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(merged)); } catch (e) {}
              fetchedCount = merged.length;
              return merged;
            });
          }
        }
      } catch (serverErr) {
        console.warn('[Sync Server Users]', serverErr);
      }

      // 2. Fetch from Firebase Firestore
      const { db } = getFirebaseInstance();
      if (db) {
        try {
          const usersCol = collection(db, 'trendboost_users');
          const snap = await getDocs(usersCol);
          if (!snap.empty) {
            const fromDb: UserProfile[] = [];
            snap.forEach(docSnap => {
              const data = docSnap.data() as UserProfile;
              if (data && data.email) fromDb.push(data);
            });
            if (fromDb.length > 0) {
              setRegisteredUsers(prev => {
                const map = new Map<string, UserProfile>();
                prev.forEach(u => map.set(u.email.toLowerCase().trim(), u));
                fromDb.forEach(u => map.set(u.email.toLowerCase().trim(), { ...u, role: isUserAdmin(u.email, u.role) ? 'admin' : u.role }));
                const merged = Array.from(map.values());
                try { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(merged)); } catch (e) {}
                fetchedCount = merged.length;
                return merged;
              });
            }
          }
        } catch (dbErr) {
          console.warn('[Sync Firestore Users]', dbErr);
        }
      }

      addToast('success', 'An Sabunta Masu Amfani 🎉', `An jero bayanan mutane ${fetchedCount || registeredUsers.length} daga sabar sadarwa.`);
    } catch (err) {
      console.warn('[Sync Users]', err);
      addToast('info', 'Users List', 'Ana nuna jerin masu amfani a halin yanzu.');
    }
  };

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedActionType, setSelectedActionType] = useState('all');

  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(MOCK_LEADERBOARD);
  const [referrals, setReferrals] = useState<ReferralHistoryItem[]>(INITIAL_REFERRALS);

  // Helper: Toasts
  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(completedTasks));
  }, [completedTasks]);

  // Firebase Auth & Firestore Sync
  useEffect(() => {
    const { auth, db } = getFirebaseInstance();
    if (!auth || !db) return;

    // Listen to Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'trendboost_users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as UserProfile;
            setUser(data);
          } else {
            // Initialize new user profile
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || 'booster@trendboost.app',
              displayName: firebaseUser.displayName || 'Digital Creator',
              photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
              credits: 100, // 100 free welcome coins!
              joinedAt: new Date().toISOString(),
              role: 'user',
              campaignsCreatedCount: 0,
              tasksCompletedCount: 0,
              dailyStreak: 1,
              referralCode: `TB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
              referralsCount: 0,
              referralEarnings: 0,
              boosterTier: 'Bronze',
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
            addToast('success', 'Welcome!', 'You received 100 Free Welcome Coins to start boosting!');
          }
        } catch (err) {
          console.error('Error fetching user profile from Firestore:', err);
        }
      }
    });

    // Listen to live Campaigns
    let unsubscribeCampaigns = () => {};
    try {
      const campaignsQuery = collection(db, 'boost_campaigns');
      unsubscribeCampaigns = onSnapshot(
        campaignsQuery, 
        (snapshot) => {
          if (!snapshot.empty) {
            const loadedCampaigns: BoostCampaign[] = [];
            snapshot.forEach((doc) => {
              loadedCampaigns.push({ id: doc.id, ...doc.data() } as BoostCampaign);
            });
            setCampaigns(loadedCampaigns);
          }
        }, 
        (_err) => {
          // Gracefully operate in offline/local storage mode without interruption
        }
      );
    } catch (_err) {
      // Silent offline mode fallback
    }

    return () => {
      unsubscribeAuth();
      unsubscribeCampaigns();
    };
  }, []);

  // Live status synchronization with Peakerr API
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);

  const refreshLiveCampaignStatus = async (showNotification = false) => {
    setIsSyncingOrders(true);
    let updatedCount = 0;
    let latestDeliveredInfo = '';

    try {
      // Find all campaigns that need syncing
      const activeProviderCampaigns = campaigns.filter(c => 
        Boolean(c.peakerrOrderId || c.orderRef === 'TB-TI-500874' || c.targetUrl?.includes('sulaimanapps2'))
      );

      if (activeProviderCampaigns.length === 0) {
        if (showNotification) {
          addToast('info', 'Live Status Synced', 'No active provider orders to sync.');
        }
        setIsSyncingOrders(false);
        return;
      }

      const updated = await Promise.all(
        campaigns.map(async (camp) => {
          const orderId = camp.peakerrOrderId || (camp.orderRef === 'TB-TI-500874' || camp.targetUrl?.includes('sulaimanapps2') ? 80959061 : null);
          if (!orderId) return camp;

          try {
            const targetUrlParam = camp.targetUrl ? `?targetUrl=${encodeURIComponent(camp.targetUrl)}` : '';
            const res = await fetch(`/api/smm/status/${orderId}${targetUrlParam}`);
            if (!res.ok) return camp;
            const json = await res.json();
            
            if (json && json.success && json.data) {
              const statusData = json.data;
              const remains = parseInt(statusData.remains, 10);
              const startCount = parseInt(statusData.start_count, 10) || 0;
              const total = camp.requiredCount || 100;
              
              let deliveredFromProvider = total - (isNaN(remains) ? 0 : remains);
              if (deliveredFromProvider < 0) deliveredFromProvider = 0;

              // Check live count from direct TikTok profile inspection
              let liveDelivered = 0;
              if (typeof json.liveFollowerCount === 'number' && json.liveFollowerCount >= 0) {
                liveDelivered = Math.max(0, json.liveFollowerCount - startCount);
              }

              // Use the highest real-time count
              let delivered = Math.max(deliveredFromProvider, liveDelivered);

              if (statusData.status?.toLowerCase() === 'completed') {
                delivered = total;
              }

              const isCompleted = delivered >= total || statusData.status?.toLowerCase() === 'completed';
              const newDelivered = Math.min(total, Math.max(camp.deliveredCount || 0, delivered));

              if (newDelivered !== camp.deliveredCount || statusData.status !== camp.providerStatus) {
                updatedCount++;
                latestDeliveredInfo = `${newDelivered} / ${total}`;
              }

              return {
                ...camp,
                peakerrOrderId: orderId,
                deliveredCount: newDelivered,
                providerStatus: statusData.status || 'In progress',
                status: isCompleted ? ('completed' as const) : camp.status,
              };
            }
          } catch (err) {
            console.warn('[Sync Status] Failed for order', orderId, err);
          }
          return camp;
        })
      );

      setCampaigns(updated);

      if (showNotification) {
        if (updatedCount > 0 || latestDeliveredInfo) {
          addToast('success', '⚡ An Sabunta Ci Gaban Aiki!', `A halin yanzu an tura ${latestDeliveredInfo || 'sabbin'} followers ta Peakerr!`);
        } else {
          addToast('info', 'Live Status Synced', 'Cikakkun bayanai sun daidaitu da sabar Peakerr.');
        }
      }
    } catch (err) {
      console.warn('[Sync Status Notice]', err);
    } finally {
      setIsSyncingOrders(false);
    }
  };

  // Auto-sync active campaigns from Peakerr every 15 seconds
  useEffect(() => {
    // Initial sync after 1 second
    const initialTimer = setTimeout(() => {
      refreshLiveCampaignStatus(false);
    }, 1200);

    const interval = setInterval(() => {
      refreshLiveCampaignStatus(false);
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Firebase Auth Methods
  const signInWithGoogle = async () => {
    const { auth, googleProvider, db } = getFirebaseInstance();
    if (!auth || !googleProvider) {
      // Demo / offline fallback
      const demoUser: UserProfile = {
        uid: 'demo-' + Date.now(),
        email: 'creator@demo.com',
        displayName: 'Demo Creator',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        credits: 250,
        joinedAt: new Date().toISOString(),
        role: 'user',
        campaignsCreatedCount: 1,
        tasksCompletedCount: 4,
        dailyStreak: 3,
        referralCode: 'TB-DEMO1',
        referralsCount: 2,
        referralEarnings: 60,
        boosterTier: 'Silver',
      };
      setUser(demoUser);
      setIsAuthModalOpen(false);
      addToast('success', 'Signed In Successfully', 'Logged in as Demo Creator!');
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      if (db) {
        const userDocRef = doc(db, 'trendboost_users', fbUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          const newUser: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'Trend Booster',
            photoURL: fbUser.photoURL || undefined,
            credits: 100, // 100 free coins on signup
            joinedAt: new Date().toISOString(),
            role: 'user',
            campaignsCreatedCount: 0,
            tasksCompletedCount: 0,
            dailyStreak: 1,
            referralCode: `TB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            referralsCount: 0,
            referralEarnings: 0,
            boosterTier: 'Bronze',
          };
          await setDoc(userDocRef, newUser);
          setUser(newUser);
        }
      }
      setIsAuthModalOpen(false);
      addToast('success', 'Welcome!', `Welcome back, ${fbUser.displayName || 'Creator'}!`);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      addToast('error', 'Sign In Error', err.message || 'Failed to sign in with Google.');
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const { auth } = getFirebaseInstance();
    if (!auth) {
      const demoUser: UserProfile = {
        uid: 'user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        credits: 150,
        joinedAt: new Date().toISOString(),
        role: 'user',
        campaignsCreatedCount: 0,
        tasksCompletedCount: 0,
        dailyStreak: 1,
        referralCode: `TB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        referralsCount: 0,
        referralEarnings: 0,
        boosterTier: 'Bronze',
      };
      setUser(demoUser);
      setIsAuthModalOpen(false);
      addToast('success', 'Signed In Successfully', 'Logged in to your account.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setIsAuthModalOpen(false);
      addToast('success', 'Signed In Successfully', 'Welcome back to TrendBoost!');
    } catch (err: any) {
      throw new Error(err.message || 'Unable to sign in. Please verify credentials.');
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const { auth, db } = getFirebaseInstance();
    if (!auth) {
      const demoUser: UserProfile = {
        uid: 'user-' + Date.now(),
        email: email,
        displayName: name,
        credits: 100,
        joinedAt: new Date().toISOString(),
        role: 'user',
        campaignsCreatedCount: 0,
        tasksCompletedCount: 0,
        dailyStreak: 1,
        referralCode: `TB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        referralsCount: 0,
        referralEarnings: 0,
        boosterTier: 'Bronze',
      };
      setUser(demoUser);
      setIsAuthModalOpen(false);
      addToast('success', 'Account Created', 'Account created with 100 Free Bonus Coins!');
      return;
    }
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        if (db) {
          const newUser: UserProfile = {
            uid: res.user.uid,
            email: email,
            displayName: name,
            credits: 100,
            joinedAt: new Date().toISOString(),
            role: 'user',
            campaignsCreatedCount: 0,
            tasksCompletedCount: 0,
            dailyStreak: 1,
            referralCode: `TB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            referralsCount: 0,
            referralEarnings: 0,
            boosterTier: 'Bronze',
          };
          await setDoc(doc(db, 'trendboost_users', res.user.uid), newUser);
          setUser(newUser);
        }
      }
      setIsAuthModalOpen(false);
      addToast('success', 'Account Created!', 'Welcome to TrendBoost! 100 Welcome Coins added.');
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create account.');
    }
  };

  const signOutUser = () => {
    const { auth } = getFirebaseInstance();
    if (auth) {
      signOut(auth).catch(console.error);
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    addToast('info', 'Signed Out', 'You have been logged out successfully.');
  };

  // 2. Create Campaign (Boosting Request / Direct Order)
  const createNewCampaign = (
    data: Omit<BoostCampaign, 'id' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'deliveredCount' | 'createdAt' | 'status' | 'active'>
  ): boolean => {
    // If guest, auto-create a user profile so they are not blocked
    let currentUser = user;
    if (!currentUser) {
      const guestId = `guest-${Date.now()}`;
      currentUser = {
        uid: guestId,
        email: 'customer@trendboost.app',
        displayName: 'Valued Customer',
        credits: 100,
        joinedAt: new Date().toISOString(),
        role: 'user',
        campaignsCreatedCount: 0,
        tasksCompletedCount: 0,
        dailyStreak: 1,
        referralCode: `TB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        referralsCount: 0,
        referralEarnings: 0,
        boosterTier: 'Bronze',
      };
      setUser(currentUser);
    }

    const isPaidWithCash = data.paymentMethod && data.paymentMethod !== 'coins';
    const totalCoinCost = data.requiredCount * (data.rewardPerAction || 10);

    if (!isPaidWithCash && currentUser.credits < totalCoinCost) {
      addToast('error', 'Insufficient Coins', `You have ${currentUser.credits} Coins, but ${totalCoinCost} Coins are required. Choose Card/Transfer/WhatsApp or buy coins.`);
      return false;
    }

    const orderRef = `TB-${data.platform.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const newCampaignId = `camp-${data.platform}-${Date.now()}`;
    const newCampaign: BoostCampaign = {
      ...data,
      id: newCampaignId,
      ownerId: currentUser.uid,
      ownerName: currentUser.displayName,
      ownerEmail: currentUser.email,
      deliveredCount: 0,
      active: true,
      status: 'running',
      createdAt: new Date().toISOString(),
      orderRef,
    };

    // Deduct coins only if paid with coins
    let updatedCredits = currentUser.credits;
    if (!isPaidWithCash) {
      updatedCredits = Math.max(0, currentUser.credits - totalCoinCost);
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      credits: updatedCredits,
      campaignsCreatedCount: (currentUser.campaignsCreatedCount || 0) + 1,
    };

    setUser(updatedUser);
    setCampaigns(prev => [newCampaign, ...prev]);

    // Dispatch order to Peakerr API in background
    fetch('/api/smm/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: data.platform,
        actionType: data.actionType,
        targetUrl: data.targetUrl,
        quantity: data.requiredCount,
      }),
    })
      .then(res => res.json())
      .then(result => {
        if (result && result.success && result.peakerrOrder) {
          const peakerrId = result.peakerrOrder;
          console.log(`[Peakerr API] Order successfully placed: ID #${peakerrId}`);
          setCampaigns(prev => prev.map(c => c.id === newCampaignId ? { ...c, peakerrOrderId: peakerrId, providerStatus: 'In Progress' } : c));
          const { db } = getFirebaseInstance();
          if (db) {
            updateDoc(doc(db, 'boost_campaigns', newCampaignId), {
              peakerrOrderId: peakerrId,
              providerStatus: 'In Progress'
            }).catch(() => {});
          }
          addToast('success', '⚡ Peakerr Provider Connected', `Automated server started dispatching #${peakerrId}`);
        } else if (result && result.error) {
          console.warn('[Peakerr API Notice]', result.error);
        }
      })
      .catch(err => {
        console.warn('[Peakerr API fetch notice]', err);
      });

    // Sync to Firebase
    const { db } = getFirebaseInstance();
    if (db) {
      setDoc(doc(db, 'boost_campaigns', newCampaignId), newCampaign).catch(() => {});
      updateDoc(doc(db, 'trendboost_users', currentUser.uid), {
        credits: updatedCredits,
        campaignsCreatedCount: increment(1)
      }).catch(() => {});
    }

    setIsCreateCampaignModalOpen(false);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    
    if (isPaidWithCash) {
      addToast('success', 'Order Activated! 🚀', `Your ${data.platform.toUpperCase()} promotion (${data.requiredCount.toLocaleString()} ${data.actionType}) is now live. Ref: ${orderRef}`);
    } else {
      addToast('success', 'Campaign Created! 🚀', `Your ${data.platform.toUpperCase()} boost campaign is now live! Deducted ${totalCoinCost} Coins.`);
    }
    
    setActiveTab('campaigns');
    return true;
  };

  // Dispatch Admin Order for Customer (Direct Peakerr Integration)
  const dispatchAdminCustomerOrder = async (orderData: {
    customerName: string;
    platform: SocialPlatform;
    actionType: BoostActionType;
    targetUrl: string;
    quantity: number;
    amountChargedNgn?: number;
    notes?: string;
  }): Promise<{ success: boolean; peakerrOrder?: number | string; error?: string }> => {
    try {
      const response = await fetch('/api/smm/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: orderData.platform,
          actionType: orderData.actionType,
          targetUrl: orderData.targetUrl,
          quantity: orderData.quantity,
        }),
      });

      const resJson = await response.json();
      if (!resJson.success) {
        throw new Error(resJson.error || 'Failed to dispatch order to Peakerr');
      }

      const peakerrId = resJson.peakerrOrder;
      const orderRef = `ADM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newCampaignId = `camp-adm-${Date.now()}`;

      const newCampaign: BoostCampaign = {
        id: newCampaignId,
        ownerId: user?.uid || 'admin',
        ownerName: `Client: ${orderData.customerName}`,
        ownerEmail: user?.email || 'msngapps@gmail.com',
        platform: orderData.platform,
        actionType: orderData.actionType,
        title: `[Admin Order] ${orderData.customerName} - ${orderData.quantity.toLocaleString()} ${orderData.platform.toUpperCase()} ${orderData.actionType.toUpperCase()}`,
        targetUrl: orderData.targetUrl.trim(),
        category: 'General',
        description: `Customer order dispatched via Admin Panel. ${orderData.notes || ''}`.trim(),
        rewardPerAction: 10,
        requiredCount: orderData.quantity,
        deliveredCount: 0,
        minDurationSeconds: 10,
        active: true,
        createdAt: new Date().toISOString(),
        status: 'running',
        paymentMethod: 'cash_transfer',
        amountPaidNgn: orderData.amountChargedNgn || 0,
        orderRef,
        peakerrOrderId: peakerrId,
        providerStatus: 'In progress',
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      const { db } = getFirebaseInstance();
      if (db) {
        setDoc(doc(db, 'boost_campaigns', newCampaignId), newCampaign).catch(() => {});
      }

      confetti({ particleCount: 110, spread: 85, origin: { y: 0.6 } });
      addToast('success', '🚀 Odar Abokin Ciniki Ta Tafi!', `An tura odar #${peakerrId} zuwa Peakerr na ${orderData.customerName} cikin nasara!`);
      return { success: true, peakerrOrder: peakerrId };
    } catch (err: any) {
      addToast('error', 'Kuskuren Tura Oda', err.message || 'An samu matsala wajen tura oda.');
      return { success: false, error: err.message };
    }
  };

  // Edit Campaign
  const updateCampaign = (campaignId: string, fields: Partial<BoostCampaign>): boolean => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, ...fields } : c));
    const { db } = getFirebaseInstance();
    if (db) {
      updateDoc(doc(db, 'boost_campaigns', campaignId), fields).catch(() => {});
    }
    setEditingCampaign(null);
    addToast('success', 'Updated Successfully', 'Campaign settings and details have been updated.');
    return true;
  };

  // Pause / Resume Campaign
  const toggleCampaignStatus = (campaignId: string): boolean => {
    const target = campaigns.find(c => c.id === campaignId);
    if (!target) return false;
    const newStatus = target.status === 'running' ? 'paused' : 'running';
    const newActive = newStatus === 'running';

    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: newStatus, active: newActive } : c));
    const { db } = getFirebaseInstance();
    if (db) {
      updateDoc(doc(db, 'boost_campaigns', campaignId), { status: newStatus, active: newActive }).catch(() => {});
    }
    addToast('info', newStatus === 'running' ? 'Campaign Resumed' : 'Campaign Paused', `Campaign "${target.title}" is now ${newStatus === 'running' ? 'active' : 'paused'}.`);
    return true;
  };

  // Delete Campaign with Coins Refund
  const deleteCampaign = (campaignId: string): boolean => {
    const target = campaigns.find(c => c.id === campaignId);
    if (!target) return false;

    // Refund remaining undelivered coins
    const remainingCount = Math.max(0, target.requiredCount - target.deliveredCount);
    const refundAmount = remainingCount * target.rewardPerAction;

    setCampaigns(prev => prev.filter(c => c.id !== campaignId));

    if (user && user.uid === target.ownerId && refundAmount > 0) {
      const newCredits = user.credits + refundAmount;
      const updatedUser = { ...user, credits: newCredits };
      setUser(updatedUser);

      const { db } = getFirebaseInstance();
      if (db) {
        updateDoc(doc(db, 'trendboost_users', user.uid), {
          credits: newCredits
        }).catch(console.error);
      }
      addToast('info', 'Deleted & Refunded', `Campaign deleted. Refunded ${refundAmount} unspent Coins back to your wallet.`);
    } else {
      addToast('info', 'Campaign Deleted', 'The campaign was removed from the active queue.');
    }

    const { db } = getFirebaseInstance();
    if (db) {
      deleteDoc(doc(db, 'boost_campaigns', campaignId)).catch(console.error);
    }
    return true;
  };

  // 3. Execute / Complete Boost Task (Earn Coins)
  const executeBoostTask = (campaign: BoostCampaign): { success: boolean; message: string; coinsEarned?: number } => {
    if (!user) {
      setIsAuthModalOpen(true);
      return { success: false, message: 'Please sign in first to perform tasks.' };
    }

    // Check if user is trying to do their own campaign
    if (user.uid === campaign.ownerId) {
      return { success: false, message: 'You cannot complete your own campaign tasks.' };
    }

    // Check if already completed
    const alreadyDone = completedTasks.some(t => t.userId === user.uid && t.campaignId === campaign.id);
    if (alreadyDone) {
      return { success: false, message: 'You have already completed this task!' };
    }

    const coinsEarned = campaign.rewardPerAction || 10;
    const newTask: CompletedTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user.uid,
      userName: user.displayName,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      platform: campaign.platform,
      actionType: campaign.actionType,
      targetUrl: campaign.targetUrl,
      coinsEarned: coinsEarned,
      completedAt: new Date().toISOString(),
      status: 'approved',
    };

    // Update user balance & counts
    const newCredits = user.credits + coinsEarned;
    const newTasksCount = (user.tasksCompletedCount || 0) + 1;
    const updatedUser: UserProfile = {
      ...user,
      credits: newCredits,
      tasksCompletedCount: newTasksCount,
    };

    setUser(updatedUser);
    setCompletedTasks(prev => [newTask, ...prev]);

    // Increment campaign delivery
    const updatedDelivered = campaign.deliveredCount + 1;
    const isCompleted = updatedDelivered >= campaign.requiredCount;
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaign.id) {
        return {
          ...c,
          deliveredCount: updatedDelivered,
          status: isCompleted ? 'completed' : c.status,
          active: !isCompleted && c.active,
        };
      }
      return c;
    }));

    // Firebase Sync
    const { db } = getFirebaseInstance();
    if (db) {
      setDoc(doc(db, 'boost_completed_tasks', newTask.id), newTask).catch(() => {});
      updateDoc(doc(db, 'trendboost_users', user.uid), {
        credits: increment(coinsEarned),
        tasksCompletedCount: increment(1)
      }).catch(() => {});
      updateDoc(doc(db, 'boost_campaigns', campaign.id), {
        deliveredCount: increment(1),
        status: isCompleted ? 'completed' : 'running',
        active: !isCompleted
      }).catch(() => {});
    }

    // Celebration
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    addToast('success', `+${coinsEarned} Coins Earned! 🎉`, `Added ${coinsEarned} Coins to your account balance.`);
    return { success: true, message: `Earned +${coinsEarned} Coins!`, coinsEarned };
  };

  // 4. Daily Bonus
  const canClaimDailyBonus = !isBonusClaimedToday(user?.lastDailyBonusClaimDate);

  const claimDailyBonus = (): { success: boolean; coins: number } => {
    if (!user) {
      setIsAuthModalOpen(true);
      return { success: false, coins: 0 };
    }

    if (!canClaimDailyBonus) {
      addToast('info', 'Already Claimed', 'You have already claimed today’s daily bonus. Come back tomorrow!');
      return { success: false, coins: 0 };
    }

    const bonusCoins = 30 + ((user.dailyStreak || 1) * 5); // scales with streak
    const newStreak = (user.dailyStreak || 0) + 1;
    const newCredits = user.credits + bonusCoins;

    const updatedUser: UserProfile = {
      ...user,
      credits: newCredits,
      dailyStreak: newStreak,
      lastDailyBonusClaimDate: new Date().toISOString(),
    };

    setUser(updatedUser);

    const { db } = getFirebaseInstance();
    if (db) {
      updateDoc(doc(db, 'trendboost_users', user.uid), {
        credits: increment(bonusCoins),
        dailyStreak: newStreak,
        lastDailyBonusClaimDate: new Date().toISOString(),
      }).catch(console.error);
    }

    confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    addToast('success', `Daily Reward: +${bonusCoins} Coins! 🔥`, `Current Streak: ${newStreak} Days!`);
    return { success: true, coins: bonusCoins };
  };

  // 5. Buy Credits / Packages
  const buyCredits = (packageId: string) => {
    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!pkg) return;

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const addedCredits = pkg.credits + (pkg.bonusCredits || 0);
    const newCredits = user.credits + addedCredits;
    const updatedUser = { ...user, credits: newCredits, boosterTier: (addedCredits >= 1000 ? 'Diamond VIP' : 'Gold') as any };

    setUser(updatedUser);

    const { db } = getFirebaseInstance();
    if (db) {
      updateDoc(doc(db, 'trendboost_users', user.uid), {
        credits: increment(addedCredits),
        boosterTier: updatedUser.boosterTier,
      }).catch(console.error);
    }

    confetti({ particleCount: 140, spread: 90, origin: { y: 0.5 } });
    addToast('success', `Coin Purchase Successful! 🎉`, `Credited ${addedCredits.toLocaleString()} Coins to your wallet.`);
  };

  // 6. Referrals
  const copyReferralLink = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const link = `https://trendboost.app?ref=${user.referralCode || 'TREND'}`;
    navigator.clipboard.writeText(link).then(() => {
      addToast('success', 'Link Copied!', 'Referral link copied to clipboard. Share with friends to earn free coins!');
    }).catch(() => {
      addToast('info', 'Your Referral Link:', link);
    });
  };

  const claimReferralBonus = () => {
    if (!user) return;
    const bonus = 50;
    const newCredits = user.credits + bonus;
    setUser({ ...user, credits: newCredits, referralEarnings: (user.referralEarnings || 0) + bonus });
    addToast('success', '+50 Referral Coins!', 'Claimed your friend referral bonus reward.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        campaigns,
        completedTasks,
        activeTab,
        setActiveTab,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        createNewCampaign,
        editingCampaign,
        setEditingCampaign,
        updateCampaign,
        toggleCampaignStatus,
        deleteCampaign,
        selectedCampaignForTask,
        setSelectedCampaignForTask,
        executeBoostTask,
        canClaimDailyBonus,
        claimDailyBonus,
        buyCredits,
        isCreateCampaignModalOpen,
        setIsCreateCampaignModalOpen,
        isDeployGuideOpen,
        setIsDeployGuideOpen,
        isFirebaseModalOpen,
        setIsFirebaseModalOpen,
        isReferralModalOpen,
        setIsReferralModalOpen,
        isLeaderboardModalOpen,
        setIsLeaderboardModalOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        legalModalType,
        setLegalModalType,
        leaderboardUsers,
        referrals,
        copyReferralLink,
        claimReferralBonus,
        toasts,
        addToast,
        removeToast,
        isSyncingOrders,
        refreshLiveCampaignStatus,
        isAdmin,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        registeredUsers,
        refreshUsersList,
        dispatchAdminCustomerOrder,
        searchQuery,
        setSearchQuery,
        selectedPlatform,
        setSelectedPlatform,
        selectedActionType,
        setSelectedActionType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
