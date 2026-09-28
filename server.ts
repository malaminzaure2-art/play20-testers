import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Peakerr API Configuration
const PEAKERR_API_URL = process.env.PEAKERR_API_URL || 'https://peakerr.com/api/v2';
const PEAKERR_API_KEY = process.env.PEAKERR_API_KEY || '4286fa8d84a11710a0c541ceb918ebf0';

// Service mapping fallback (Default Peakerr Service IDs for popular social networks)
const DEFAULT_SERVICE_MAPPING: Record<string, Record<string, number>> = {
  tiktok: {
    view: 32921, // TikTok Video Views (High speed & low cost)
    like: 24733, // TikTok Likes (HQ & Real profiles)
    follow: 25000, // TikTok Followers (HQ & Profiles With Photo)
    comment: 27980, // TikTok Custom Comments
    share: 29452, // TikTok Shares
  },
  youtube: {
    view: 30204, // YouTube Views (Lifetime refill, high retention)
    like: 30837, // YouTube Likes (High speed)
    subscribe: 23304, // YouTube Subscribers (SuperInstant)
    comment: 28745, // YouTube Custom Comments
  },
  instagram: {
    view: 19327, // Instagram Views (MQ 100M Super fast)
    like: 36643, // Instagram Likes (Cheapest server)
    follow: 31838, // Instagram Followers (100% Real Accounts With Posts)
    comment: 29484, // Instagram Random Comments
  },
  facebook: {
    follow: 33038, // Facebook Page & Profile Followers
    like: 33050, // Facebook Post Reactions / Likes
    view: 32194, // Facebook Video / Reel Views
    share: 33534, // Facebook Post Shares
  },
  twitter: {
    follow: 31488, // Twitter / X Followers
    like: 31490, // Twitter / X Likes
    view: 17427, // Twitter Tweet Views
  },
  website: {
    view: 9125, // Worldwide Web Traffic
  },
};

// Server-Side Centralized Campaigns & Orders Registry
let serverCampaigns: any[] = [
  {
    id: 'camp-tiktok-sulaimanapps2',
    ownerId: 'sulaimanapps2',
    ownerName: 'Sulaiman Apps',
    ownerEmail: 'malaminzaure2@gmail.com',
    platform: 'tiktok',
    actionType: 'follow',
    title: 'TikTok Boost: 100 Followers for @sulaimanapps2',
    targetUrl: 'https://www.tiktok.com/@sulaimanapps2',
    category: 'Entertainment',
    description: 'Direct boost order for 100 Followers on TikTok',
    rewardPerAction: 10,
    requiredCount: 100,
    deliveredCount: 100,
    minDurationSeconds: 10,
    paymentMethod: 'cash_card',
    amountPaidNgn: 350,
    orderRef: 'TB-TI-500874',
    peakerrOrderId: 80959061,
    providerStatus: 'Completed',
    active: false,
    createdAt: '2026-09-26T15:00:00Z',
    status: 'completed',
  },
];

// GET: Fetch all boost campaigns & Paystack customer orders
app.get('/api/campaigns', (_req, res) => {
  res.json({ success: true, count: serverCampaigns.length, campaigns: serverCampaigns });
});

// POST: Synchronize campaign / customer order from client or Paystack callback
app.post('/api/campaigns/sync', (req, res) => {
  try {
    const { campaign, campaigns } = req.body;
    const incoming: any[] = campaigns && Array.isArray(campaigns) ? campaigns : campaign ? [campaign] : [];

    incoming.forEach((newCamp) => {
      if (!newCamp) return;
      const ref = newCamp.orderRef || newCamp.id;
      const existingIdx = serverCampaigns.findIndex((c) => (c.orderRef && c.orderRef === ref) || (c.id && c.id === newCamp.id));

      if (existingIdx >= 0) {
        serverCampaigns[existingIdx] = { ...serverCampaigns[existingIdx], ...newCamp };
      } else {
        serverCampaigns.unshift({
          ...newCamp,
          createdAt: newCamp.createdAt || new Date().toISOString(),
          status: newCamp.status || 'running',
          active: newCamp.active !== undefined ? newCamp.active : true,
        });
      }
    });

    res.json({ success: true, count: serverCampaigns.length, campaigns: serverCampaigns });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1. API: Check Peakerr Balance
app.get('/api/smm/balance', async (req, res) => {
  try {
    const params = new URLSearchParams({
      key: PEAKERR_API_KEY,
      action: 'balance',
    });

    const response = await fetch(PEAKERR_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Peakerr balance check error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to check balance' });
  }
});

// 2. API: Place SMM Order to Peakerr
app.post('/api/smm/order', async (req, res) => {
  try {
    const { platform, actionType, targetUrl, quantity, serviceId } = req.body;

    if (!targetUrl || !quantity) {
      return res.status(400).json({ success: false, error: 'Target URL and quantity are required' });
    }

    // Determine Peakerr Service ID
    let resolvedServiceId = serviceId;
    if (!resolvedServiceId && platform && actionType) {
      resolvedServiceId = DEFAULT_SERVICE_MAPPING[platform]?.[actionType] || 340;
    }

    const params = new URLSearchParams({
      key: PEAKERR_API_KEY,
      action: 'add',
      service: String(resolvedServiceId || 340),
      link: targetUrl.trim(),
      quantity: String(quantity),
    });

    console.log(`[SMM Order] Submitting to Peakerr: Service ${resolvedServiceId}, Qty: ${quantity}, Link: ${targetUrl}`);

    const response = await fetch(PEAKERR_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();
    console.log('[SMM Order] Peakerr Response:', data);

    // Automatically record this order into the Server Campaigns Registry
    const resolvedOrderRef = req.body.orderRef || `TB-${(platform || 'BO').substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const newCampaignItem = {
      id: `camp-${platform || 'social'}-${Date.now()}`,
      ownerId: req.body.customerEmail || 'paystack-customer',
      ownerName: req.body.customerName || 'Abokin Ciniki (Customer)',
      ownerEmail: req.body.customerEmail || 'customer@trendboost.app',
      platform: platform || 'tiktok',
      actionType: actionType || 'follow',
      title: req.body.title || `${(platform || 'Social').toUpperCase()} Boost: ${quantity} ${actionType || 'actions'}`,
      targetUrl: targetUrl.trim(),
      category: 'General',
      description: `Paystack Boost Order for ${quantity} on ${platform}`,
      rewardPerAction: 10,
      requiredCount: Number(quantity),
      deliveredCount: 0,
      minDurationSeconds: 10,
      paymentMethod: 'cash_card',
      amountPaidNgn: req.body.amountPaidNgn || (Number(quantity) * 3.5),
      orderRef: resolvedOrderRef,
      peakerrOrderId: data.order || null,
      providerStatus: data.order ? 'In Progress' : 'Pending',
      active: true,
      createdAt: new Date().toISOString(),
      status: 'running',
    };

    serverCampaigns.unshift(newCampaignItem);

    res.json({
      success: !data.error,
      peakerrOrder: data.order || null,
      error: data.error || null,
      orderRef: resolvedOrderRef,
      campaign: newCampaignItem,
      raw: data,
    });
  } catch (error: any) {
    console.error('Peakerr order error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to dispatch order to Peakerr',
    });
  }
});

// 3. API: Check Order Status & Real-time Platform Count
app.get('/api/smm/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const targetUrl = (req.query.targetUrl as string) || '';

    const params = new URLSearchParams({
      key: PEAKERR_API_KEY,
      action: 'status',
      order: orderId,
    });

    const response = await fetch(PEAKERR_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    // Check live TikTok follower count directly from TikTok if applicable
    let liveFollowerCount: number | null = null;
    const effectiveUrl = targetUrl || (orderId === '80959061' ? 'https://www.tiktok.com/@sulaimanapps2' : '');
    if (effectiveUrl && effectiveUrl.includes('tiktok.com/@')) {
      try {
        const usernameMatch = effectiveUrl.match(/@([a-zA-Z0-9_.-]+)/);
        const username = usernameMatch ? usernameMatch[1] : '';
        if (username) {
          const ttRes = await fetch(`https://www.tiktok.com/@${username}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'en-US,en;q=0.9',
            },
          });
          const ttHtml = await ttRes.text();
          const match = ttHtml.match(/"followerCount":\s*([0-9]+)/);
          if (match && match[1]) {
            liveFollowerCount = parseInt(match[1], 10);
          }
        }
      } catch (ttErr) {
        console.warn('Could not inspect live TikTok page:', ttErr);
      }
    }

    res.json({ success: true, data, liveFollowerCount });
  } catch (error: any) {
    console.error('Peakerr status check error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to check order status' });
  }
});

// 3b. Dedicated Live Profile Inspector
app.get('/api/smm/live-profile', async (req, res) => {
  try {
    const targetUrl = (req.query.url as string) || '';
    if (!targetUrl) return res.status(400).json({ error: 'Missing url parameter' });

    let count: number | null = null;
    if (targetUrl.includes('tiktok.com/@')) {
      const usernameMatch = targetUrl.match(/@([a-zA-Z0-9_.-]+)/);
      const username = usernameMatch ? usernameMatch[1] : '';
      if (username) {
        const ttRes = await fetch(`https://www.tiktok.com/@${username}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });
        const ttHtml = await ttRes.text();
        const match = ttHtml.match(/"followerCount":\s*([0-9]+)/);
        if (match && match[1]) {
          count = parseInt(match[1], 10);
        }
      }
    }

    res.json({ success: true, count });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Centralized User Management & Cross-Device Sync API
let serverRegisteredUsers: any[] = [
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

// GET: Fetch all real users synchronized across all devices
app.get('/api/users', (_req, res) => {
  res.json({ success: true, users: serverRegisteredUsers });
});

// POST: Sync user upon login / registration on phone or laptop
app.post('/api/users/sync', (req, res) => {
  try {
    const { user, users } = req.body;
    const incoming: any[] = users && Array.isArray(users) ? users : user ? [user] : [];

    incoming.forEach((newUser) => {
      if (!newUser || !newUser.email) return;
      const cleanEmail = newUser.email.toLowerCase().trim();
      const existingIdx = serverRegisteredUsers.findIndex(
        (u) => (u.uid && u.uid === newUser.uid) || (u.email && u.email.toLowerCase().trim() === cleanEmail)
      );

      const isAdminEmail = cleanEmail.includes('msngapps') || cleanEmail.includes('malaminzaure');

      if (existingIdx >= 0) {
        serverRegisteredUsers[existingIdx] = {
          ...serverRegisteredUsers[existingIdx],
          ...newUser,
          role: isAdminEmail ? 'admin' : (newUser.role || serverRegisteredUsers[existingIdx].role),
        };
      } else {
        serverRegisteredUsers.push({
          ...newUser,
          role: isAdminEmail ? 'admin' : (newUser.role || 'user'),
          joinedAt: newUser.joinedAt || new Date().toISOString(),
        });
      }
    });

    res.json({ success: true, count: serverRegisteredUsers.length, users: serverRegisteredUsers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. API: Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', provider: 'Peakerr API v2', timestamp: new Date().toISOString() });
});

// Favicon handler to prevent browser console 404s
app.get('/favicon.ico', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'favicon.ico'));
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} with Peakerr API integration`);
  });
}

startServer();
