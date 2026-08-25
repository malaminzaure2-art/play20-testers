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
// Peakerr allows dynamic selection or direct service IDs
const DEFAULT_SERVICE_MAPPING: Record<string, Record<string, number>> = {
  tiktok: {
    view: 340,
    like: 345,
    follow: 350,
  },
  youtube: {
    view: 112,
    like: 115,
    subscribe: 4510,
  },
  instagram: {
    view: 890,
    like: 892,
    follow: 895,
  },
  facebook: {
    view: 410,
    like: 412,
    follow: 415,
  },
  twitter: {
    like: 510,
    follow: 515,
  },
  website: {
    view: 601,
  },
};

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

    res.json({
      success: !data.error,
      peakerrOrder: data.order || null,
      error: data.error || null,
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

// 3. API: Check Order Status
app.get('/api/smm/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

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
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Peakerr status check error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to check order status' });
  }
});

// 4. API: Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', provider: 'Peakerr API v2', timestamp: new Date().toISOString() });
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
