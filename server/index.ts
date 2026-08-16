try {
  await import("dotenv/config");
} catch (e) {}
import express, { type Request, Response, NextFunction } from "express";


import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync } from './stripeClient';
import { StripeWebhookHandlers } from './stripeWebhookHandlers';

const app = express();

// Initialize Stripe on startup
async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log('⚠️ DATABASE_URL not set - Stripe initialization skipped');
    return;
  }

  try {
    console.log('Initializing Stripe schema...');
    await runMigrations({ databaseUrl });
    console.log('✅ Stripe schema ready');

    const stripeSync = await getStripeSync();

    console.log('Setting up managed webhook...');
    const domains = process.env.REPLIT_DOMAINS?.split(',');
    if (domains && domains[0]) {
      const webhookBaseUrl = `https://${domains[0]}`;
      try {
        const result = await stripeSync.findOrCreateManagedWebhook(
          `${webhookBaseUrl}/api/stripe/webhook`
        );
        if (result?.webhook) {
          console.log(`✅ Webhook configured: ${result.webhook.url}`);
        } else {
          console.log('⚠️ Webhook configuration returned empty - may need Stripe dashboard setup');
        }
      } catch (webhookError) {
        console.log('⚠️ Could not configure managed webhook:', webhookError);
      }
    } else {
      console.log('⚠️ REPLIT_DOMAINS not set - webhook not configured');
    }

    // Sync Stripe data in background
    stripeSync.syncBackfill()
      .then(() => console.log('✅ Stripe data synced'))
      .catch((err: Error) => console.error('Error syncing Stripe data:', err));
  } catch (error) {
    console.error('⚠️ Failed to initialize Stripe:', error);
  }
}

// Initialize Stripe in background (non-blocking)
initStripe().catch((err: any) => console.error("⚠️ Stripe init background error:", err));


// Register Stripe webhook BEFORE express.json() middleware
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      if (!Buffer.isBuffer(req.body)) {
        console.error('STRIPE WEBHOOK ERROR: req.body is not a Buffer');
        return res.status(500).json({ error: 'Webhook processing error' });
      }

      await StripeWebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

// Add CORS headers for production domain support
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://totag.network',
    'https://www.totag.network',
    'https://totaggroup.com',
    'https://www.totaggroup.com', 
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Apply JSON middleware AFTER webhook route
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Import seed function
  const { seedMerchantUsers } = await import("./merchant-seed");
  const { seedCateringStaff } = await import("./catering-seed");
  const { seedFarmUsers } = await import("./farm-seed");
  
  // Seed merchant users and demo accounts in background (non-blocking)
  (async () => {
    try {
      await seedMerchantUsers();
      await seedCateringStaff();
      await seedFarmUsers();
    } catch (err) {
      console.warn('⚠️ Startup seeding background note:', err);
    }
  })();

  const server = await registerRoutes(app);


  if (process.env.NODE_ENV === "development" || app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });


  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

