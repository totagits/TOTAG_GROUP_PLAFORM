/**
 * Flutterwave Payment Integration for TOTAG SaaS Platform
 * Supports recurring subscriptions, cards, bank transfers, and mobile money for Liberian market
 */

// Flutterwave configuration
export interface FlutterwaveConfig {
  publicKey: string;
  secretKey: string;
  encryptionKey: string;
  environment: 'sandbox' | 'production';
  baseUrl: string;
}

// Default Flutterwave configuration
export const DEFAULT_FLUTTERWAVE_CONFIG: Omit<FlutterwaveConfig, 'publicKey' | 'secretKey' | 'encryptionKey'> = {
  environment: 'sandbox', // Change to 'production' for live
  baseUrl: 'https://api.flutterwave.com/v3'
};

// Payment input data for SaaS subscriptions
export interface FlutterwavePaymentInput {
  email: string;
  phoneNumber?: string;
  fullName: string;
  amount: number;
  currency: 'USD' | 'LRD' | 'NGN';
  planId?: string; // For recurring payments
  paymentMethod: 'card' | 'banktransfer' | 'mobilemoney' | 'ussd';
  redirectUrl: string;
  reference: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  customer?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  meta?: Record<string, any>;
}

// Flutterwave payment response
export interface FlutterwavePaymentResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    link?: string;
    id?: number;
    tx_ref?: string;
    flw_ref?: string;
    redirect_url?: string;
    meta?: {
      authorization?: {
        redirect?: string;
      };
    };
  };
}

// Subscription plan structure
export interface FlutterwaveSubscriptionPlan {
  id?: string;
  name: string;
  amount: number;
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  duration?: number; // Number of intervals
  currency: 'USD' | 'LRD' | 'NGN';
}

// Webhook verification
export interface FlutterwaveWebhook {
  event: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: string;
    created_at: string;
    account_id: number;
    customer: {
      id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: string;
    };
  };
}

/**
 * Initialize a payment with Flutterwave
 */
export async function initializeFlutterwavePayment(
  input: FlutterwavePaymentInput,
  config: FlutterwaveConfig
): Promise<FlutterwavePaymentResponse> {
  const payload = {
    tx_ref: input.reference,
    amount: input.amount,
    currency: input.currency,
    redirect_url: input.redirectUrl,
    payment_options: input.paymentMethod,
    customer: {
      email: input.email,
      phonenumber: input.phoneNumber,
      name: input.fullName
    },
    customizations: {
      title: input.customization?.title || 'TOTAG SaaS Subscription',
      description: input.customization?.description || 'Monthly SaaS subscription payment',
      logo: input.customization?.logo || ''
    },
    meta: input.meta || {}
  };

  try {
    const response = await fetch(`${config.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (result.status === 'success') {
      return {
        status: 'success',
        message: 'Payment initialized successfully',
        data: result.data
      };
    } else {
      return {
        status: 'error',
        message: result.message || 'Failed to initialize payment'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Payment initialization failed: ${error}`
    };
  }
}

/**
 * Create a subscription plan
 */
export async function createFlutterwaveSubscriptionPlan(
  plan: FlutterwaveSubscriptionPlan,
  config: FlutterwaveConfig
): Promise<FlutterwavePaymentResponse> {
  const payload = {
    amount: plan.amount,
    name: plan.name,
    interval: plan.interval,
    duration: plan.duration || 0, // 0 means unlimited
    currency: plan.currency
  };

  try {
    const response = await fetch(`${config.baseUrl}/payment-plans`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      status: 'error',
      message: `Plan creation failed: ${error}`
    };
  }
}

/**
 * Verify a payment transaction
 */
export async function verifyFlutterwavePayment(
  transactionId: string,
  config: FlutterwaveConfig
): Promise<FlutterwavePaymentResponse> {
  try {
    const response = await fetch(`${config.baseUrl}/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      status: 'error',
      message: `Payment verification failed: ${error}`
    };
  }
}

/**
 * Create a subscription for a customer
 */
export async function createFlutterwaveSubscription(
  customerId: string,
  planId: string,
  config: FlutterwaveConfig
): Promise<FlutterwavePaymentResponse> {
  const payload = {
    customer: customerId,
    payment_plan: planId
  };

  try {
    const response = await fetch(`${config.baseUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      status: 'error',
      message: `Subscription creation failed: ${error}`
    };
  }
}

/**
 * Cancel a subscription
 */
export async function cancelFlutterwaveSubscription(
  subscriptionId: string,
  config: FlutterwaveConfig
): Promise<FlutterwavePaymentResponse> {
  try {
    const response = await fetch(`${config.baseUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      status: 'error',
      message: `Subscription cancellation failed: ${error}`
    };
  }
}

/**
 * Verify webhook signature for security
 */
export function verifyFlutterwaveWebhook(
  payload: string,
  signature: string,
  secretHash: string
): boolean {
  // Flutterwave uses the secret hash to verify webhooks
  return signature === secretHash;
}

/**
 * Format currency amount for Liberian market
 */
export function formatLiberianCurrency(amount: number, currency: 'USD' | 'LRD' = 'USD'): string {
  return new Intl.NumberFormat('en-LR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Get available payment methods for Liberian customers
 */
export function getLiberianPaymentMethods(): Array<{
  id: string;
  name: string;
  description: string;
  icon: string;
  supported: boolean;
}> {
  return [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Verve',
      icon: '💳',
      supported: true
    },
    {
      id: 'banktransfer',
      name: 'Bank Transfer',
      description: 'UBA, Ecobank, Access Bank',
      icon: '🏦',
      supported: true
    },
    {
      id: 'mobilemoney',
      name: 'Mobile Money',
      description: 'Orange Money, MTN Money',
      icon: '📱',
      supported: true
    },
    {
      id: 'ussd',
      name: 'USSD',
      description: 'Dial *code# to pay',
      icon: '📞',
      supported: true
    }
  ];
}