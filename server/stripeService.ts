import { getUncachableStripeClient } from './stripeClient';
import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * StripeService: Handles Stripe API operations for SaaS subscriptions
 */
export class StripeService {
  // Create customer in Stripe
  async createCustomer(email: string, tenantId: string, tenantName: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
      name: tenantName,
      metadata: { 
        tenantId,
        platform: 'totag-saas'
      },
    });
  }

  // Create checkout session for SaaS subscription
  async createCheckoutSession(
    customerId: string,
    priceIds: string[],
    successUrl: string,
    cancelUrl: string,
    tenantId: string,
    selectedModuleIds: string[]
  ) {
    const stripe = await getUncachableStripeClient();
    
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: priceIds.map(priceId => ({ price: priceId, quantity: 1 })),
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tenantId,
        moduleIds: selectedModuleIds.join(','),
        platform: 'totag-saas'
      },
      subscription_data: {
        metadata: {
          tenantId,
          moduleIds: selectedModuleIds.join(','),
        }
      }
    });
  }

  // Create customer portal session for managing subscription
  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  // Get subscription from Stripe schema
  async getSubscription(subscriptionId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`
    );
    return result.rows[0] || null;
  }

  // Get customer from Stripe schema
  async getCustomer(customerId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.customers WHERE id = ${customerId}`
    );
    return result.rows[0] || null;
  }

  // List all SaaS products from Stripe
  async listProducts() {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE active = true ORDER BY name`
    );
    return result.rows;
  }

  // Get prices for SaaS modules
  async listPrices() {
    const result = await db.execute(
      sql`SELECT * FROM stripe.prices WHERE active = true ORDER BY unit_amount`
    );
    return result.rows;
  }

  // Get products with their prices
  async listProductsWithPrices() {
    const result = await db.execute(
      sql`
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.active as product_active,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring,
          pr.active as price_active
        FROM stripe.products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.active = true
        ORDER BY p.name, pr.unit_amount
      `
    );
    return result.rows;
  }

  // Get price by module ID (stored in product metadata)
  async getPriceForModule(moduleId: string) {
    const result = await db.execute(
      sql`
        SELECT pr.* 
        FROM stripe.prices pr
        JOIN stripe.products p ON pr.product = p.id
        WHERE p.active = true 
          AND pr.active = true
          AND p.metadata->>'moduleId' = ${moduleId}
        LIMIT 1
      `
    );
    return result.rows[0] || null;
  }

  // Get price by portal ID (stored in product metadata)
  async getPriceForPortal(portalId: string) {
    const result = await db.execute(
      sql`
        SELECT pr.* 
        FROM stripe.prices pr
        JOIN stripe.products p ON pr.product = p.id
        WHERE p.active = true 
          AND pr.active = true
          AND p.metadata->>'portalId' = ${portalId}
        LIMIT 1
      `
    );
    return result.rows[0] || null;
  }

  // Get all portal products with prices
  async getPortalProducts() {
    const result = await db.execute(
      sql`
        SELECT 
          p.id as product_id,
          p.name,
          p.description,
          p.metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring
        FROM stripe.products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.active = true AND p.metadata->>'platform' = 'totag-saas'
        ORDER BY pr.unit_amount
      `
    );
    return result.rows;
  }

  // Create checkout session for portal subscription
  // First payment: $125 one-time (setup + first month)
  // Recurring: starts after 30-day trial at $20 or $37/month
  async createPortalCheckoutSession(
    customerId: string,
    firstMonthPriceId: string | null,
    subscriptionPriceId: string,
    successUrl: string,
    cancelUrl: string,
    tenantId: string,
    portalType: 'hr' | 'financial' | 'combined'
  ) {
    const stripe = await getUncachableStripeClient();
    
    const lineItems: Array<{ price: string; quantity: number }> = [];
    
    // Add first month payment ($125 one-time) if provided
    if (firstMonthPriceId) {
      lineItems.push({ price: firstMonthPriceId, quantity: 1 });
    }
    
    // Add recurring subscription price
    lineItems.push({ price: subscriptionPriceId, quantity: 1 });
    
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tenantId,
        portalType,
        platform: 'totag-saas'
      },
      subscription_data: {
        // 30-day trial so recurring charge starts from month 2
        trial_period_days: 30,
        metadata: {
          tenantId,
          portalType,
        }
      }
    });
  }
}

export const stripeService = new StripeService();
