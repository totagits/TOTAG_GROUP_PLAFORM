import { getUncachableStripeClient } from './stripeClient';

// Portal-based pricing structure
// $125 covers setup + first month, then recurring monthly starts from month 2
const PORTAL_PRODUCTS = [
  {
    id: 'first_month_payment',
    name: 'TOTAG SaaS Subscription + First Month',
    description: 'Initial payment covering platform setup, configuration, and first month access',
    priceType: 'one_time',
    priceCents: 12500, // $125.00 (flat rate for all portal types)
  },
  {
    id: 'hr_portal',
    name: 'HR Management Portal',
    description: 'Complete Human Resource Management Information System (HRMIS) with 7 integrated modules: Core HR & Admin, Recruitment & Onboarding, Talent Management, Compensation & Benefits, Employee Self-Service, Analytics & Reporting, and Biometrics & Attendance',
    priceType: 'recurring',
    priceCents: 2000, // $20.00/month (starts from month 2)
  },
  {
    id: 'financial_portal',
    name: 'Financial Management Portal',
    description: 'Complete Financial Information Management System (FIMS) with 8 integrated modules: General Ledger, Accounts Payable, Accounts Receivable, Treasury & Cash Management, Budgeting & Forecasting, Procurement & Expense Management, Financial Reporting & Analytics, and Security & Compliance',
    priceType: 'recurring',
    priceCents: 2000, // $20.00/month (starts from month 2)
  },
  {
    id: 'combined_portals',
    name: 'Combined HR & Financial Portals',
    description: 'Full enterprise suite combining both HR Management (7 modules) and Financial Management (8 modules) portals - 15 total modules at a discounted rate',
    priceType: 'recurring',
    priceCents: 3700, // $37.00/month (starts from month 2)
  }
];

export async function seedStripePortalProducts() {
  console.log('🌱 Seeding Stripe products for TOTAG SaaS portals...\n');
  
  try {
    const stripe = await getUncachableStripeClient();
    
    for (const portal of PORTAL_PRODUCTS) {
      // Check if product already exists
      const existingProducts = await stripe.products.search({
        query: `metadata['portalId']:'${portal.id}'`
      });

      if (existingProducts.data.length > 0) {
        console.log(`⚠️ Product already exists: ${portal.name}`);
        continue;
      }

      // Create product
      const product = await stripe.products.create({
        name: portal.name,
        description: portal.description,
        metadata: {
          portalId: portal.id,
          platform: 'totag-saas'
        }
      });

      // Create price based on type
      if (portal.priceType === 'one_time') {
        await stripe.prices.create({
          product: product.id,
          unit_amount: portal.priceCents,
          currency: 'usd',
          metadata: {
            portalId: portal.id,
            type: 'setup'
          }
        });
        console.log(`✅ Created product & price: ${portal.name} ($${portal.priceCents / 100} one-time)`);
      } else {
        await stripe.prices.create({
          product: product.id,
          unit_amount: portal.priceCents,
          currency: 'usd',
          recurring: {
            interval: 'month'
          },
          metadata: {
            portalId: portal.id,
            type: 'monthly'
          }
        });
        console.log(`✅ Created product & price: ${portal.name} ($${portal.priceCents / 100}/month)`);
      }
    }

    console.log('\n🎉 Stripe portal products seeding completed!');
    console.log(`\n📊 Pricing Summary:`);
    console.log(`- Setup + First Month: $125.00 (one-time)`);
    console.log(`- HR Management Portal: $20.00/month`);
    console.log(`- Financial Management Portal: $20.00/month`);
    console.log(`- Combined Portals (HR + Financial): $37.00/month`);

  } catch (error) {
    console.error('❌ Error seeding Stripe products:', error);
    throw error;
  }
}

// Keep backward compatibility - also seed old module-based products
const SAAS_MODULES = [
  { id: 'hr_core', name: 'Core HR & Admin', category: 'HRMIS', description: 'Employee database, organizational chart, workflow automation, and secure document management' },
  { id: 'hr_recruitment', name: 'Recruitment & Onboarding', category: 'HRMIS', description: 'Applicant tracking system, AI resume screening, onboarding portal, and interview scheduling' },
  { id: 'hr_talent', name: 'Talent Management', category: 'HRMIS', description: 'Performance reviews, learning management system, succession planning, and skills matrix' },
  { id: 'hr_compensation', name: 'Compensation & Benefits', category: 'HRMIS', description: 'Payroll processing with Liberian law compliance, mobile money integration, and benefits administration' },
  { id: 'hr_self_service', name: 'Employee & Manager Self-Service', category: 'HRMIS', description: 'Mobile-first employee portal, manager dashboard, and leave management system' },
  { id: 'hr_analytics', name: 'Analytics & Reporting', category: 'HRMIS', description: 'Real-time HR dashboards, predictive analytics, and compliance reporting' },
  { id: 'hr_biometrics_attendance', name: 'Biometrics & Attendance', category: 'HRMIS', description: 'Biometric time tracking, attendance monitoring, shift management, and automated timesheet generation' },
  { id: 'fims_general_ledger', name: 'General Ledger', category: 'FIMS', description: 'Unified general ledger, automated journal entries, multi-currency support, and flexible chart of accounts' },
  { id: 'fims_accounts_payable', name: 'Accounts Payable', category: 'FIMS', description: 'AI invoice processing, 3-way matching, automated payments, and vendor management' },
  { id: 'fims_accounts_receivable', name: 'Accounts Receivable', category: 'FIMS', description: 'AR invoicing, online payment portal, automated dunning, and customer credit management' },
  { id: 'fims_treasury', name: 'Treasury & Cash Management', category: 'FIMS', description: 'Real-time cash dashboard, cash flow forecasting, and debt/investment management' },
  { id: 'fims_budgeting', name: 'Budgeting & Forecasting', category: 'FIMS', description: 'Collaborative budgeting tools, scenario modeling, rolling forecasts, and budget vs. actuals analysis' },
  { id: 'fims_procurement', name: 'Procurement & Expense Management', category: 'FIMS', description: 'Purchase order management, mobile expense tracking, and asset lifecycle management' },
  { id: 'fims_reporting', name: 'Financial Reporting & Analytics', category: 'FIMS', description: 'Custom financial dashboards, automated financial statements, drill-down analysis, and predictive analytics' },
  { id: 'fims_compliance', name: 'Security, Compliance & Integration', category: 'FIMS', description: 'Role-based access control, audit trails, IFRS compliance, and API integrations' }
];

export async function seedStripeProducts() {
  // Seed new portal-based products
  await seedStripePortalProducts();
}

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedStripeProducts()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
