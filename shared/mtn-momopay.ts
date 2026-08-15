/**
 * MTN MOMOPAY Payment Integration for TOTAG SaaS Platform
 * Supports recurring subscriptions, collections, and disbursements for Liberian market
 */

// MTN MoMo configuration
export interface MtnMomoConfig {
  subscriptionKey: string;
  apiUserId: string;
  apiKey: string;
  environment: 'sandbox' | 'production';
  baseUrl: string;
  targetEnvironment: string;
}

// Default MTN MoMo configuration
export const DEFAULT_MTN_MOMO_CONFIG: Omit<MtnMomoConfig, 'subscriptionKey' | 'apiUserId' | 'apiKey'> = {
  environment: 'sandbox', // Change to 'production' for live
  baseUrl: 'https://sandbox.momodeveloper.mtn.com', // Use production URL for live
  targetEnvironment: 'sandbox' // Change to 'mtnliberia' for production
};

// Payment input data for SaaS subscriptions
export interface MtnMomoPaymentInput {
  amount: string;
  currency: 'USD' | 'LRD';
  externalId: string;
  payer: {
    partyIdType: 'MSISDN';
    partyId: string; // Liberian phone number format: 231XXXXXXXX
  };
  payerMessage: string;
  payeeNote: string;
  referenceId: string;
}

// MTN MoMo payment response
export interface MtnMomoPaymentResponse {
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: {
    referenceId?: string;
    status?: string;
    financialTransactionId?: string;
    externalId?: string;
    amount?: string;
    currency?: string;
    payer?: {
      partyIdType: string;
      partyId: string;
    };
    payerMessage?: string;
    payeeNote?: string;
    reason?: string;
  };
}

// Subscription plan structure for MTN MoMo
export interface MtnMomoSubscriptionPlan {
  id: string;
  name: string;
  amount: string;
  currency: 'USD' | 'LRD';
  billingCycle: 'monthly' | 'yearly';
  description: string;
}

// Webhook data structure
export interface MtnMomoWebhook {
  referenceId: string;
  status: string;
  financialTransactionId: string;
  externalId: string;
  amount: string;
  currency: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
}

/**
 * Get access token from MTN MoMo API
 */
export async function getMtnMomoAccessToken(config: MtnMomoConfig): Promise<string> {
  const credentials = Buffer.from(`${config.apiUserId}:${config.apiKey}`).toString('base64');
  
  try {
    const response = await fetch(`${config.baseUrl}/collection/token/`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    } else {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`Access token request failed: ${error}`);
  }
}

/**
 * Initialize a payment request with MTN MoMo
 */
export async function initializeMtnMomoPayment(
  input: MtnMomoPaymentInput,
  config: MtnMomoConfig
): Promise<MtnMomoPaymentResponse> {
  try {
    const accessToken = await getMtnMomoAccessToken(config);
    
    const payload = {
      amount: input.amount,
      currency: input.currency,
      externalId: input.externalId,
      payer: input.payer,
      payerMessage: input.payerMessage,
      payeeNote: input.payeeNote
    };

    const response = await fetch(`${config.baseUrl}/collection/v1_0/requesttopay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Reference-Id': input.referenceId,
        'X-Target-Environment': config.targetEnvironment,
        'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return {
        status: 'success',
        message: 'Payment request initiated successfully',
        data: {
          referenceId: input.referenceId,
          status: 'PENDING',
          externalId: input.externalId,
          amount: input.amount,
          currency: input.currency
        }
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: 'error',
        message: errorData.message || `Payment request failed: ${response.statusText}`
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
 * Check payment status
 */
export async function checkMtnMomoPaymentStatus(
  referenceId: string,
  config: MtnMomoConfig
): Promise<MtnMomoPaymentResponse> {
  try {
    const accessToken = await getMtnMomoAccessToken(config);

    const response = await fetch(`${config.baseUrl}/collection/v1_0/requesttopay/${referenceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Target-Environment': config.targetEnvironment,
        'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        status: data.status === 'SUCCESSFUL' ? 'success' : 
               data.status === 'FAILED' ? 'error' : 'pending',
        message: `Payment status: ${data.status}`,
        data: data
      };
    } else {
      return {
        status: 'error',
        message: `Failed to check payment status: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Payment status check failed: ${error}`
    };
  }
}

/**
 * Create a recurring subscription payment
 */
export async function createMtnMomoSubscription(
  plan: MtnMomoSubscriptionPlan,
  customerPhone: string,
  config: MtnMomoConfig
): Promise<MtnMomoPaymentResponse> {
  const referenceId = generateReferenceId();
  
  const paymentInput: MtnMomoPaymentInput = {
    amount: plan.amount,
    currency: plan.currency,
    externalId: `SUB_${plan.id}_${Date.now()}`,
    payer: {
      partyIdType: 'MSISDN',
      partyId: customerPhone
    },
    payerMessage: `TOTAG SaaS Subscription: ${plan.name}`,
    payeeNote: `Monthly subscription payment for ${plan.name}`,
    referenceId: referenceId
  };

  return initializeMtnMomoPayment(paymentInput, config);
}

/**
 * Generate a unique reference ID
 */
export function generateReferenceId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validate Liberian phone number format
 */
export function validateLiberianPhone(phone: string): boolean {
  // Liberian phone format: +231XXXXXXXX or 231XXXXXXXX
  const phoneRegex = /^(\+?231)[0-9]{8}$/;
  return phoneRegex.test(phone);
}

/**
 * Format phone number for MTN MoMo API
 */
export function formatPhoneForMtnMomo(phone: string): string {
  // Remove any non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Add country code if missing
  if (cleaned.startsWith('0')) {
    cleaned = '231' + cleaned.substring(1);
  } else if (!cleaned.startsWith('231') && !cleaned.startsWith('+231')) {
    cleaned = '231' + cleaned;
  }
  
  // Remove + if present
  cleaned = cleaned.replace('+', '');
  
  return cleaned;
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
 * Get currency exchange rate (USD to LRD)
 * Note: In production, this should fetch from a real exchange rate API
 */
export function getUsdToLrdRate(): number {
  // Current approximate rate (should be updated from live API)
  return 190; // 1 USD = ~190 LRD as of 2025
}

/**
 * Convert amount between USD and LRD
 */
export function convertCurrency(amount: number, fromCurrency: 'USD' | 'LRD', toCurrency: 'USD' | 'LRD'): number {
  if (fromCurrency === toCurrency) return amount;
  
  const rate = getUsdToLrdRate();
  
  if (fromCurrency === 'USD' && toCurrency === 'LRD') {
    return amount * rate;
  } else if (fromCurrency === 'LRD' && toCurrency === 'USD') {
    return amount / rate;
  }
  
  return amount;
}

/**
 * Get available payment options for MTN MoMo
 */
export function getMtnMomoPaymentMethods(): Array<{
  id: string;
  name: string;
  description: string;
  icon: string;
  supported: boolean;
  currencies: string[];
}> {
  return [
    {
      id: 'mtn_momo',
      name: 'MTN Mobile Money',
      description: 'Pay with your MTN Mobile Money wallet',
      icon: '📱',
      supported: true,
      currencies: ['USD', 'LRD']
    }
  ];
}

/**
 * Create subscription plans for TOTAG SaaS
 */
export function createMtnMomoSubscriptionPlans(modules: any[], currency: 'USD' | 'LRD'): MtnMomoSubscriptionPlan[] {
  const plans: MtnMomoSubscriptionPlan[] = [];
  
  // Calculate total for selected modules
  const totalAmount = modules.reduce((sum, module) => {
    const price = parseFloat(module.monthlyPrice);
    return sum + (currency === 'LRD' ? convertCurrency(price, 'USD', 'LRD') : price);
  }, 0);
  
  // Apply discount if all modules
  const isAllModules = modules.length >= 14; // Assuming 14 total modules
  const finalAmount = isAllModules ? totalAmount * 0.9 : totalAmount;
  
  plans.push({
    id: `custom_${modules.length}_modules`,
    name: `TOTAG SaaS - ${modules.length} Modules`,
    amount: finalAmount.toFixed(2),
    currency: currency,
    billingCycle: 'monthly',
    description: `Monthly subscription for ${modules.length} modules${isAllModules ? ' (10% discount applied)' : ''}`
  });
  
  return plans;
}

/**
 * Generate payment summary report
 */
export function generateMtnMomoPaymentReport(payment: MtnMomoPaymentResponse): string {
  if (!payment.data) return 'No payment data available';
  
  return `
=== MTN MOMOPAY PAYMENT SUMMARY ===
Reference ID: ${payment.data.referenceId}
External ID: ${payment.data.externalId}
Amount: ${formatLiberianCurrency(parseFloat(payment.data.amount || '0'), payment.data.currency as 'USD' | 'LRD')}
Currency: ${payment.data.currency}
Status: ${payment.data.status}
Payer: ${payment.data.payer?.partyId}
Message: ${payment.data.payerMessage}
Note: ${payment.data.payeeNote}
Date: ${new Date().toLocaleDateString('en-LR')}

Payment processed via MTN Mobile Money
For support, contact MTN Liberia customer service.
`;
}