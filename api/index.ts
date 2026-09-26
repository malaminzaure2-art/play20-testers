import express from 'express';

const app = express();
app.use(express.json());

const PEAKERR_API_URL = process.env.PEAKERR_API_URL || 'https://peakerr.com/api/v2';
const PEAKERR_API_KEY = process.env.PEAKERR_API_KEY || '4286fa8d84a11710a0c541ceb918ebf0';

// Service mapping fallback
const DEFAULT_SERVICE_MAPPING: Record<string, Record<string, number>> = {
  tiktok: {
    view: 32921,
    like: 24733,
    follow: 25000,
    comment: 27980,
    share: 29452,
  },
  youtube: {
    view: 30204,
    like: 30837,
    subscribe: 23304,
    comment: 28745,
  },
  instagram: {
    view: 19327,
    like: 36643,
    follow: 31838,
    comment: 29484,
  },
  facebook: {
    follow: 33038,
    like: 33050,
    view: 32194,
    share: 33534,
  },
  twitter: {
    follow: 31488,
    like: 31490,
    view: 17427,
  },
  website: {
    view: 9125,
  },
};

// 1. API: Check Peakerr Balance
app.get('/api/smm/balance', async (_req, res) => {
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

    const response = await fetch(PEAKERR_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();
    res.json({
      success: !data.error,
      peakerrOrder: data.order || null,
      error: data.error || null,
      raw: data,
    });
  } catch (error: any) {
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
      } catch (_ttErr) {
        // Safe fallback
      }
    }

    res.json({ success: true, data, liveFollowerCount });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to check order status' });
  }
});

// 3b. Dedicated Live Profile Inspector
app.get('/api/smm/live-profile', async (req, res) => {
  try {
    const url = (req.query.url as string) || '';
    let count: number | null = null;

    if (url && url.includes('tiktok.com/@')) {
      const usernameMatch = url.match(/@([a-zA-Z0-9_.-]+)/);
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

// 4. API: Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', provider: 'Peakerr API v2', timestamp: new Date().toISOString() });
});

export default app;
