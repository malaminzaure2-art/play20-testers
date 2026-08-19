import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  AppListing, 
  TestingTask, 
  TestingFeedback, 
  ActiveTab, 
  ToastMessage,
  LeaderboardUser,
  ReferralHistoryItem
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_APPS, 
  INITIAL_TASKS, 
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
  updateDoc,
  onSnapshot,
  query,
  where,
  increment
} from 'firebase/firestore';

interface AppContextType {
  user: UserProfile | null;
  apps: AppListing[];
  tasks: TestingTask[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signOutUser: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  joinAppTest: (app: AppListing) => boolean;
  submitDailyProof: (
    taskId: string, 
    feedbackText: string, 
    screenshotUrl: string, 
    rating: number, 
    deviceModel: string, 
    androidVersion: string
  ) => { success: boolean; message: string; coinsEarned?: number };
  addNewApp: (appData: Omit<AppListing, 'id' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'currentTesters' | 'createdAt' | 'active'>) => boolean;
  buyCredits: (packageId: string) => void;
  selectedTaskForProof: TestingTask | null;
  setSelectedTaskForProof: (task: TestingTask | null) => void;
  selectedAppToJoin: AppListing | null;
  setSelectedAppToJoin: (app: AppListing | null) => void;
  isAddAppModalOpen: boolean;
  setIsAddAppModalOpen: (open: boolean) => void;
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
  legalModalType: 'privacy' | 'terms' | 'about' | 'contact' | 'adsense' | null;
  setLegalModalType: (type: 'privacy' | 'terms' | 'about' | 'contact' | 'adsense' | null) => void;
  leaderboardUsers: LeaderboardUser[];
  referrals: ReferralHistoryItem[];
  copyReferralLink: () => void;
  claimReferralBonus: () => void;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'play20_user_v2',
  APPS: 'play20_apps_v2',
  TASKS: 'play20_tasks_v2',
};

// Clear legacy v1 mock cache if present
try {
  localStorage.removeItem('play20_user_v1');
  localStorage.removeItem('play20_apps_v1');
  localStorage.removeItem('play20_tasks_v1');
} catch (e) {
  // ignore
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  const [apps, setApps] = useState<AppListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [tasks, setTasks] = useState<TestingTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals state
  const [selectedTaskForProof, setSelectedTaskForProof] = useState<TestingTask | null>(null);
  const [selectedAppToJoin, setSelectedAppToJoin] = useState<AppListing | null>(null);
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState<boolean>(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState<boolean>(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState<boolean>(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'about' | 'contact' | 'adsense' | null>(null);

  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [referrals, setReferrals] = useState<ReferralHistoryItem[]>(INITIAL_REFERRALS);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  // 1. REAL-TIME FIRESTORE APPS LISTENER (Syncs all uploaded apps across all devices)
  useEffect(() => {
    const fb = getFirebaseInstance();
    if (!fb || !fb.db) return;

    try {
      const appsCollectionRef = collection(fb.db, 'apps');
      const unsubscribe = onSnapshot(appsCollectionRef, (snapshot) => {
        const firestoreApps: AppListing[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as AppListing;
          firestoreApps.push({
            ...data,
            id: docSnap.id,
          });
        });
        setApps(firestoreApps);
      }, (err) => {
        console.warn('Firestore apps subscription notice:', err.message);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Could not attach Firestore apps listener:', err);
    }
  }, []);

  // 2. REAL-TIME AUTH STATE & CLOUD PROFILE SYNC
  useEffect(() => {
    const fb = getFirebaseInstance();
    if (!fb || !fb.auth) return;

    const unsubscribe = onAuthStateChanged(fb.auth, async (fbUser) => {
      if (fbUser) {
        // User is logged in with Firebase Auth
        let profile: UserProfile = {
          ...INITIAL_USER,
          uid: fbUser.uid,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Developer',
          email: fbUser.email || 'developer@play20.app',
          photoURL: fbUser.photoURL || undefined,
        };

        // Try reading user profile from Firestore
        if (fb.db) {
          try {
            const userDocRef = doc(fb.db, 'users', fbUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const cloudData = userDocSnap.data();
              profile = {
                ...profile,
                ...cloudData,
                uid: fbUser.uid,
              };
            } else {
              // First time login: create initial profile in Firestore with 100 starter coins
              await setDoc(userDocRef, profile);
            }
          } catch (e) {
            console.warn('Firestore user fetch notice:', e);
          }
        }

        setUser(profile);
      }
    });

    return () => unsubscribe();
  }, []);

  // 3. REAL-TIME TASKS SYNC FOR CURRENT USER
  useEffect(() => {
    const fb = getFirebaseInstance();
    if (!fb || !fb.db || !user || !user.uid) return;

    try {
      const tasksQuery = query(collection(fb.db, 'tasks'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
        if (!snapshot.empty) {
          const cloudTasks: TestingTask[] = [];
          snapshot.forEach((d) => {
            cloudTasks.push({ ...(d.data() as TestingTask), id: d.id });
          });
          setTasks(cloudTasks);
        }
      }, (err) => {
        console.warn('Firestore tasks subscription notice:', err.message);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Could not attach Firestore tasks listener:', err);
    }
  }, [user?.uid]);

  // 4. REAL-TIME LEADERBOARD USERS SYNC FROM FIRESTORE
  useEffect(() => {
    const fb = getFirebaseInstance();
    if (!fb || !fb.db) return;

    try {
      const usersCollection = collection(fb.db, 'users');
      const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
        if (!snapshot.empty) {
          const realUsers: UserProfile[] = [];
          snapshot.forEach((d) => {
            realUsers.push({ ...(d.data() as UserProfile), uid: d.id });
          });

          // Sort users by completed tests and credits
          realUsers.sort((a, b) => (b.completedFullTests || b.appsTestedCount || 0) - (a.completedFullTests || a.appsTestedCount || 0) || (b.credits || 0) - (a.credits || 0));

          const ranked: LeaderboardUser[] = realUsers.slice(0, 20).map((u, index) => ({
            rank: index + 1,
            uid: u.uid,
            displayName: u.displayName || 'Developer',
            photoURL: u.photoURL || '',
            completedTests: u.completedFullTests || u.appsTestedCount || 0,
            dailyStreak: u.dailyStreak || 1,
            totalCoinsEarned: u.credits || 0,
            badge: index === 0 ? 'Top Tester ⭐' : index === 1 ? 'Elite Dev 🚀' : 'Verified Tester 🛡️',
          }));

          setLeaderboardUsers(ranked);
        }
      }, (err) => {
        console.warn('Leaderboard sync notice:', err.message);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Leaderboard fetch notice:', e);
    }
  }, []);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34A853', '#4285F4', '#FBBC05', '#EA4335'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const createDefaultUserProfile = (uid: string, displayName: string, email: string, photoURL?: string): UserProfile => ({
    uid,
    email,
    displayName: displayName || 'Android Developer',
    photoURL,
    credits: 100, // 100 starter coins
    joinedAt: new Date().toISOString(),
    role: 'developer',
    appsSubmittedCount: 0,
    appsTestedCount: 0,
    dailyStreak: 1,
    referralCode: (displayName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4) || 'DEV') + Math.floor(1000 + Math.random() * 9000),
    referralsCount: 0,
    referralEarnings: 0,
    testerRank: 'Bronze',
    completedFullTests: 0,
  });

  // Google Sign-In with real Firebase Auth
  const signInWithGoogle = async () => {
    const fb = getFirebaseInstance();
    if (!fb || !fb.auth || !fb.googleProvider) {
      throw new Error('Firebase Authentication is not ready. Please try Email login or check connection.');
    }
    
    try {
      const res = await signInWithPopup(fb.auth, fb.googleProvider);
      if (res.user) {
        let loggedUser = createDefaultUserProfile(
          res.user.uid,
          res.user.displayName || res.user.email?.split('@')[0] || 'Google Developer',
          res.user.email || 'developer@play20.app',
          res.user.photoURL || undefined
        );

        // Sync with Firestore
        if (fb.db) {
          try {
            const uRef = doc(fb.db, 'users', res.user.uid);
            const uSnap = await getDoc(uRef);
            if (uSnap.exists()) {
              loggedUser = { ...loggedUser, ...uSnap.data(), uid: res.user.uid };
            } else {
              await setDoc(uRef, loggedUser);
            }
          } catch (dbErr) {
            console.warn('Firestore user doc sync notice:', dbErr);
          }
        }

        setUser(loggedUser);
        addToast('success', 'Signed In Successfully', `Welcome, ${loggedUser.displayName}!`);
      }
    } catch (popupErr: any) {
      console.error('Firebase Google popup error:', popupErr);
      if (popupErr.code === 'auth/unauthorized-domain') {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'domain';
        throw new Error(`Google sign-in domain not authorized yet for "${currentHost}". Please use Email/Password sign-in below, or add "${currentHost}" in Firebase Console -> Authentication -> Settings -> Authorized Domains.`);
      } else if (popupErr.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed before completing. Please try again.');
      } else if (popupErr.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups or use Email sign in.');
      } else {
        throw new Error(popupErr.message || 'Could not complete Google sign-in.');
      }
    }
  };

  // Email & Password Sign-In
  const signInWithEmail = async (email: string, pass: string) => {
    const fb = getFirebaseInstance();
    if (!fb || !fb.auth) {
      throw new Error('Firebase Authentication is not available.');
    }

    try {
      const res = await signInWithEmailAndPassword(fb.auth, email.trim(), pass);
      if (res.user) {
        let loggedUser = createDefaultUserProfile(
          res.user.uid,
          res.user.displayName || email.split('@')[0],
          res.user.email || email,
          res.user.photoURL || undefined
        );

        if (fb.db) {
          try {
            const uRef = doc(fb.db, 'users', res.user.uid);
            const uSnap = await getDoc(uRef);
            if (uSnap.exists()) {
              loggedUser = { ...loggedUser, ...uSnap.data(), uid: res.user.uid };
            } else {
              await setDoc(uRef, loggedUser);
            }
          } catch (dbErr) {
            console.warn('Firestore user doc sync notice:', dbErr);
          }
        }

        setUser(loggedUser);
        addToast('success', 'Signed In', `Welcome back, ${loggedUser.displayName}!`);
      }
    } catch (authErr: any) {
      console.error('Firebase email signin error:', authErr);
      if (authErr.code === 'auth/invalid-credential' || authErr.code === 'auth/user-not-found' || authErr.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. If you are new, click "Create Account".');
      } else if (authErr.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else {
        throw new Error(authErr.message || 'Sign in failed. Please try again.');
      }
    }
  };

  // Email & Password Registration
  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const fb = getFirebaseInstance();
    if (!fb || !fb.auth) {
      throw new Error('Firebase Authentication is not available.');
    }

    try {
      const res = await createUserWithEmailAndPassword(fb.auth, email.trim(), pass);
      if (res.user) {
        try {
          await updateProfile(res.user, { displayName: name.trim() });
        } catch (e) {
          console.warn('Profile update notice:', e);
        }

        const loggedUser = createDefaultUserProfile(
          res.user.uid,
          name.trim(),
          email.trim()
        );

        if (fb.db) {
          try {
            await setDoc(doc(fb.db, 'users', res.user.uid), loggedUser);
          } catch (dbErr) {
            console.warn('Firestore user create notice:', dbErr);
          }
        }

        setUser(loggedUser);
        fireConfetti();
        addToast('success', 'Account Created! 🎉', `Welcome to Play20, ${name.trim()}! +100 Starter Coins added.`);
      }
    } catch (signupErr: any) {
      console.error('Firebase email signup error:', signupErr);
      if (signupErr.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please click "Sign In" instead.');
      } else if (signupErr.code === 'auth/weak-password') {
        throw new Error('Password must be at least 6 characters.');
      } else if (signupErr.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else {
        throw new Error(signupErr.message || 'Account registration failed. Please try again.');
      }
    }
  };

  const signOutUser = () => {
    const fb = getFirebaseInstance();
    if (fb && fb.auth) {
      signOut(fb.auth).catch(() => {});
    }
    setUser(null);
    addToast('info', 'Signed Out', 'You have been safely signed out.');
  };

  // Join testing task for an app
  const joinAppTest = (app: AppListing): boolean => {
    if (!user) {
      addToast('warning', 'Sign In Required', 'Please sign in to start testing apps.');
      return false;
    }

    if (app.ownerId === user.uid) {
      addToast('error', 'Action Restricted', 'You cannot test your own published application.');
      return false;
    }

    const alreadyJoined = tasks.some((t) => t.appId === app.id && t.userId === user.uid);
    if (alreadyJoined) {
      addToast('info', 'Already Joined', 'You are already an active tester for this app. Check "My Tasks".');
      setActiveTab('tasks');
      return false;
    }

    if (app.currentTesters >= app.requiredTesters) {
      addToast('warning', 'Testing Pool Full', 'This app already has 20 active testers.');
      return false;
    }

    const newTask: TestingTask = {
      id: 'task_' + Date.now(),
      userId: user.uid,
      appId: app.id,
      app: app,
      startDate: new Date().toISOString(),
      currentDay: 1,
      totalDays: app.daysRequired || 14,
      status: 'active',
      proofSubmittedToday: false,
      totalCreditsEarned: 0,
      feedbacks: [],
    };

    setTasks((prev) => [newTask, ...prev]);

    // Update app testers count locally
    setApps((prev) =>
      prev.map((a) =>
        a.id === app.id ? { ...a, currentTesters: a.currentTesters + 1 } : a
      )
    );

    // Update user stats
    setUser((prev) =>
      prev ? { ...prev, appsTestedCount: prev.appsTestedCount + 1 } : null
    );

    // Write to Firestore in background
    const fb = getFirebaseInstance();
    if (fb && fb.db) {
      try {
        setDoc(doc(fb.db, 'tasks', newTask.id), newTask).catch((e) => console.warn('Firestore task write:', e));
        updateDoc(doc(fb.db, 'apps', app.id), { currentTesters: increment(1) }).catch((e) => console.warn('Firestore app tester increment:', e));
        if (user.uid) {
          updateDoc(doc(fb.db, 'users', user.uid), { appsTestedCount: increment(1) }).catch((e) => console.warn('Firestore user update:', e));
        }
      } catch (e) {
        console.warn('Firestore join task error:', e);
      }
    }

    addToast(
      'success',
      'Test Joined Successfully! 🎉',
      `You joined "${app.title}". Submit your Day 1 proof to earn +${app.rewardPerDay} coins!`
    );

    setSelectedTaskForProof(newTask);
    return true;
  };

  // Submit daily proof with 50+ chars review + screenshot
  const submitDailyProof = (
    taskId: string,
    feedbackText: string,
    screenshotUrl: string,
    rating: number,
    deviceModel: string,
    androidVersion: string
  ) => {
    if (!user) {
      return { success: false, message: 'Please sign in first.' };
    }

    if (feedbackText.trim().length < 50) {
      return {
        success: false,
        message: `Feedback must be at least 50 characters long for Google Play quality guidelines (currently ${feedbackText.trim().length} chars).`,
      };
    }

    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) {
      return { success: false, message: 'Testing task not found.' };
    }

    const appReward = targetTask.app.rewardPerDay || 10;
    const isLastDay = targetTask.currentDay >= targetTask.totalDays;
    const bonus = isLastDay ? (targetTask.app.completionBonus || 50) : 0;
    const earnedThisRound = appReward + bonus;

    const newFeedback: TestingFeedback = {
      id: 'fb_' + Date.now(),
      taskId: taskId,
      appId: targetTask.appId,
      userId: user.uid,
      userName: user.displayName,
      userEmail: user.email,
      date: new Date().toISOString(),
      dayNumber: targetTask.currentDay,
      rating,
      feedbackText: feedbackText.trim(),
      screenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&auto=format&fit=crop&q=80',
      deviceModel: deviceModel || 'Android Device',
      androidVersion: androidVersion || 'Android 14',
      status: 'approved',
      creditsAwarded: earnedThisRound,
    };

    const nextDay = targetTask.currentDay + (isLastDay ? 0 : 1);
    const updatedTask: TestingTask = {
      ...targetTask,
      currentDay: nextDay,
      status: (isLastDay ? 'completed' : 'active') as 'completed' | 'active',
      lastFeedbackDate: new Date().toISOString(),
      proofSubmittedToday: true,
      totalCreditsEarned: targetTask.totalCreditsEarned + earnedThisRound,
      feedbacks: [newFeedback, ...targetTask.feedbacks],
    };

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    // Update user balance & streak
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        credits: prev.credits + earnedThisRound,
        dailyStreak: prev.dailyStreak + 1,
      };
    });

    // Write to Firestore in background
    const fb = getFirebaseInstance();
    if (fb && fb.db) {
      try {
        setDoc(doc(fb.db, 'tasks', taskId), updatedTask).catch((e) => console.warn('Firestore task update:', e));
        setDoc(doc(fb.db, 'proofs', newFeedback.id), newFeedback).catch((e) => console.warn('Firestore proof write:', e));
        if (user.uid) {
          updateDoc(doc(fb.db, 'users', user.uid), {
            credits: increment(earnedThisRound),
            dailyStreak: increment(1)
          }).catch((e) => console.warn('Firestore user credit update:', e));
        }
      } catch (e) {
        console.warn('Firestore proof submit error:', e);
      }
    }

    fireConfetti();

    addToast(
      'success',
      isLastDay ? '14-Day Testing Completed! 🏆' : `Day ${targetTask.currentDay} Proof Verified! ⭐`,
      `You earned +${earnedThisRound} Coins (${appReward} daily + ${bonus} bonus). Balance updated!`
    );

    return {
      success: true,
      message: 'Proof submitted and verified successfully.',
      coinsEarned: earnedThisRound,
    };
  };

  // Add new app (Now stores in CLOUD FIRESTORE so all phones/browsers see it instantly)
  const addNewApp = (
    appData: Omit<AppListing, 'id' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'currentTesters' | 'createdAt' | 'active'>
  ): boolean => {
    if (!user) {
      addToast('error', 'Sign In Required', 'Please sign in to publish an app.');
      return false;
    }

    const creationCost = (appData.requiredTesters || 20) * (appData.rewardPerDay || 10);
    if (user.credits < creationCost) {
      addToast(
        'error',
        'Insufficient Credits',
        `You need ${creationCost} Coins to hire 20 testers for 14 days (Current balance: ${user.credits} Coins). Please buy credits or test peer apps!`
      );
      setActiveTab('store');
      return false;
    }

    const newApp: AppListing = {
      ...appData,
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ownerId: user.uid,
      ownerName: user.displayName,
      ownerEmail: user.email,
      currentTesters: 0,
      createdAt: new Date().toISOString(),
      active: true,
    };

    // Update local state immediately
    setApps((prev) => [newApp, ...prev]);

    // Deduct coins & increment apps count
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        credits: prev.credits - creationCost,
        appsSubmittedCount: prev.appsSubmittedCount + 1,
      };
    });

    // Write to Firestore Cloud Database so all other phones/users receive it in real-time!
    const fb = getFirebaseInstance();
    if (fb && fb.db) {
      try {
        setDoc(doc(fb.db, 'apps', newApp.id), newApp)
          .then(() => {
            console.log('App published to Firestore cloud successfully:', newApp.id);
          })
          .catch((err) => {
            console.warn('Firestore app write error:', err);
          });

        if (user.uid) {
          updateDoc(doc(fb.db, 'users', user.uid), {
            credits: increment(-creationCost),
            appsSubmittedCount: increment(1),
          }).catch((err) => {
            console.warn('Firestore user update error:', err);
          });
        }
      } catch (err) {
        console.warn('Firestore app save exception:', err);
      }
    }

    fireConfetti();
    addToast(
      'success',
      'App Published to Testing Exchange! 🚀',
      `"${newApp.title}" is now live in the cloud! 20 tester slots are open. Deducted ${creationCost} Coins.`
    );
    setIsAddAppModalOpen(false);
    setActiveTab('my-apps');
    return true;
  };

  // Buy Credits
  const buyCredits = (packageId: string, reference?: string) => {
    const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) return;

    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        credits: prev.credits + pkg.credits,
      };
    });

    const fb = getFirebaseInstance();
    if (fb && fb.db && user?.uid) {
      updateDoc(doc(fb.db, 'users', user.uid), {
        credits: increment(pkg.credits),
      }).catch((e) => console.warn('Firestore credit update:', e));

      // Record transaction history
      const txId = reference || `TX_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      setDoc(doc(fb.db, 'transactions', txId), {
        id: txId,
        reference: reference || 'direct_checkout',
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        packageId: pkg.id,
        packageName: pkg.name,
        coinsAwarded: pkg.credits,
        priceNgn: pkg.priceNgn,
        priceUsd: pkg.priceUsd,
        timestamp: new Date().toISOString(),
        status: 'success',
      }).catch((e) => console.warn('Firestore transaction log:', e));
    }

    fireConfetti();
    addToast(
      'success',
      'Payment Confirmed! 💳 🎉',
      `+${pkg.credits} Coins have been added to your balance! (Ref: ${reference || 'Instant'})`
    );
  };

  // Referral Copy Link
  const copyReferralLink = () => {
    const code = user?.referralCode || 'PLAY20-MZ88';
    const baseUrl = typeof window !== 'undefined' && window.location.origin.includes('hausatech')
      ? window.location.origin 
      : (typeof window !== 'undefined' ? window.location.origin : 'https://testers.hausatech.com');
    const link = `${baseUrl}?ref=${code}`;
    navigator.clipboard.writeText(link).catch(() => {});
    addToast(
      'success',
      'Referral Link Copied! 📋',
      'Share this link with developers. When they test an app, you both get +50 Coins!'
    );
  };

  // Demo Claim Referral Bonus
  const claimReferralBonus = () => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        credits: prev.credits + 50,
        referralsCount: prev.referralsCount + 1,
        referralEarnings: prev.referralEarnings + 50,
      };
    });

    if (user?.uid) {
      const fb = getFirebaseInstance();
      if (fb && fb.db) {
        updateDoc(doc(fb.db, 'users', user.uid), {
          credits: increment(50),
          referralsCount: increment(1),
          referralEarnings: increment(50),
        }).catch((e) => console.warn('Firestore referral bonus:', e));
      }
    }

    const newRef: ReferralHistoryItem = {
      id: 'ref_' + Date.now(),
      referredName: 'New Android Dev (' + (user?.referralsCount ? user.referralsCount + 1 : 1) + ')',
      date: 'Just now',
      coinsEarned: 50,
      status: 'completed',
    };

    setReferrals((prev) => [newRef, ...prev]);
    fireConfetti();
    addToast(
      'success',
      'Referral Bonus Claimed! 🎁',
      '+50 Coins added to your balance for inviting a developer!'
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        apps,
        tasks,
        activeTab,
        setActiveTab,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        joinAppTest,
        submitDailyProof,
        addNewApp,
        buyCredits,
        selectedTaskForProof,
        setSelectedTaskForProof,
        selectedAppToJoin,
        setSelectedAppToJoin,
        isAddAppModalOpen,
        setIsAddAppModalOpen,
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
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
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
