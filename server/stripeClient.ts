import Stripe from 'stripe';

let connectionSettings: any;

async function getCredentials() {
  // 1. Check direct environment variables (Standard VPS / Production)
  if (process.env.STRIPE_SECRET_KEY) {
    return {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_live_totag_placeholder',
      secretKey: process.env.STRIPE_SECRET_KEY,
    };
  }

  // 2. Fallback to Replit Connectors if running inside Replit
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (hostname && xReplitToken) {
    try {
      const connectorName = 'stripe';
      const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
      const targetEnvironment = isProduction ? 'production' : 'development';

      const url = new URL(`https://${hostname}/api/v2/connection`);
      url.searchParams.set('include_secrets', 'true');
      url.searchParams.set('connector_names', connectorName);
      url.searchParams.set('environment', targetEnvironment);

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      });

      const data = await response.json();
      connectionSettings = data.items?.[0];

      if (connectionSettings?.settings?.publishable && connectionSettings?.settings?.secret) {
        return {
          publishableKey: connectionSettings.settings.publishable,
          secretKey: connectionSettings.settings.secret,
        };
      }
    } catch (e: any) {
      console.warn('Replit stripe connector lookup failed:', e.message);
    }
  }

  // 3. Graceful fallback placeholder (non-crashing)
  return {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_totag_placeholder',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_totag_placeholder',
  };
}

// Get fresh Stripe client - never cache
export async function getUncachableStripeClient() {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil' as any,
  });
}

// Get publishable key for frontend
export async function getStripePublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

// Get secret key
export async function getStripeSecretKey() {
  const { secretKey } = await getCredentials();
  return secretKey;
}

// StripeSync singleton for webhook processing and data sync
let stripeSync: any = null;

export async function getStripeSync() {
  if (!stripeSync) {
    try {
      const { StripeSync } = await import('stripe-replit-sync');
      const secretKey = await getStripeSecretKey();

      if (process.env.DATABASE_URL && secretKey && !secretKey.includes('placeholder')) {
        stripeSync = new StripeSync({
          poolConfig: {
            connectionString: process.env.DATABASE_URL!,
            max: 2,
          },
          stripeSecretKey: secretKey,
        });
      }
    } catch (e: any) {
      console.warn('StripeSync initialization skipped:', e.message);
    }
  }
  return stripeSync;
}
