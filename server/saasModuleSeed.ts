import { SaasStorage } from './saasStorage';
import { type InsertModule } from '@shared/schema';

const saasStorage = new SaasStorage();

/**
 * Available FIMS and HRMIS modules for the enterprise SaaS platform
 */
const SAAS_MODULES: InsertModule[] = [
  // ==== HRMIS MODULES ====
  {
    id: 'hr_core',
    name: 'Core HR & Admin',
    description: 'Employee database, organizational chart, workflow automation, and secure document management',
    category: 'HRMIS',
    features: [
      'Employee database management',
      'Organizational chart builder',
      'Workflow automation',
      'Document management system',
      'Employee profiles & records',
      'Department & position management'
    ],
    monthlyPrice: '20.00', // USD equivalent pricing
    setupFee: '0.00',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'hr_recruitment',
    name: 'Recruitment & Onboarding',
    description: 'Applicant tracking system, AI resume screening, onboarding portal, and interview scheduling',
    category: 'HRMIS',
    features: [
      'Applicant tracking system (ATS)',
      'AI-powered resume screening',
      'Digital onboarding portal',
      'Interview scheduling & management',
      'Candidate communication tools',
      'Onboarding workflow automation'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'hr_talent',
    name: 'Talent Management',
    description: 'Performance reviews, learning management system, succession planning, and skills matrix',
    category: 'HRMIS',
    features: [
      'Performance review system',
      'Learning management system (LMS)',
      'Succession planning tools',
      'Skills matrix & assessment',
      'Goal setting & tracking',
      'Career development paths'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 3
  },
  {
    id: 'hr_compensation',
    name: 'Compensation & Benefits',
    description: 'Payroll processing with Liberian law compliance, mobile money integration, and benefits administration',
    category: 'HRMIS',
    features: [
      'Payroll processing (Liberian law compliance)',
      'Mobile money payment integration',
      'Benefits administration',
      'Tax calculations & reporting',
      'Salary structure management',
      'Bonus & allowance tracking'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 4
  },
  {
    id: 'hr_self_service',
    name: 'Employee & Manager Self-Service',
    description: 'Mobile-first employee portal, manager dashboard, and leave management system',
    category: 'HRMIS',
    features: [
      'Mobile employee self-service portal',
      'Manager dashboard & tools',
      'Leave request & approval system',
      'Timesheet management',
      'Employee directory',
      'Personal information updates'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 5
  },
  {
    id: 'hr_analytics',
    name: 'Analytics & Reporting',
    description: 'Real-time HR dashboards, predictive analytics, and compliance reporting',
    category: 'HRMIS',
    features: [
      'Real-time HR dashboards',
      'Predictive analytics',
      'Compliance reporting',
      'Custom report builder',
      'Data visualization tools',
      'KPI tracking & alerts'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 6
  },
  {
    id: 'hr_biometrics_attendance',
    name: 'Biometrics & Attendance',
    description: 'Biometric time tracking, attendance monitoring, shift management, and automated timesheet generation',
    category: 'HRMIS',
    features: [
      'Biometric fingerprint & face recognition',
      'Real-time attendance tracking',
      'Shift scheduling & management',
      'Automated timesheet generation',
      'Overtime calculation & alerts',
      'Attendance analytics & reporting'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 7
  },

  // ==== FIMS MODULES ====
  {
    id: 'fims_general_ledger',
    name: 'General Ledger',
    description: 'Unified general ledger, automated journal entries, multi-currency support, and flexible chart of accounts',
    category: 'FIMS',
    features: [
      'Unified general ledger management',
      'Automated journal entries',
      'Multi-currency support',
      'Flexible chart of accounts',
      'Account reconciliation',
      'Journal entry workflow & approval'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 8
  },
  {
    id: 'fims_accounts_payable',
    name: 'Accounts Payable',
    description: 'AI invoice processing, 3-way matching, automated payments, and vendor management',
    category: 'FIMS',
    features: [
      'AI-powered invoice processing',
      '3-way matching (PO, receipt, invoice)',
      'Automated payment processing',
      'Vendor management system',
      'Payment scheduling & approval',
      'Cash flow optimization'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 9
  },
  {
    id: 'fims_accounts_receivable',
    name: 'Accounts Receivable',
    description: 'AR invoicing, online payment portal, automated dunning, and customer credit management',
    category: 'FIMS',
    features: [
      'AR invoicing & billing',
      'Online payment portal',
      'Automated dunning process',
      'Customer credit management',
      'Payment tracking & reminders',
      'Collections management'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 10
  },
  {
    id: 'fims_treasury',
    name: 'Treasury & Cash Management',
    description: 'Real-time cash dashboard, cash flow forecasting, and debt/investment management',
    category: 'FIMS',
    features: [
      'Real-time cash position dashboard',
      'Cash flow forecasting',
      'Bank account management',
      'Debt & investment tracking',
      'Currency risk management',
      'Liquidity planning tools'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 11
  },
  {
    id: 'fims_budgeting',
    name: 'Budgeting & Forecasting',
    description: 'Collaborative budgeting tools, scenario modeling, rolling forecasts, and budget vs. actuals analysis',
    category: 'FIMS',
    features: [
      'Collaborative budgeting tools',
      'Scenario modeling & planning',
      'Rolling forecasts',
      'Budget vs. actuals analysis',
      'Variance reporting',
      'Financial planning workflows'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 12
  },
  {
    id: 'fims_procurement',
    name: 'Procurement & Expense Management',
    description: 'Purchase order management, mobile expense tracking, and asset lifecycle management',
    category: 'FIMS',
    features: [
      'Purchase order management',
      'Mobile expense tracking',
      'Asset lifecycle management',
      'Vendor evaluation & selection',
      'Contract management',
      'Spending analytics'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 13
  },
  {
    id: 'fims_reporting',
    name: 'Financial Reporting & Analytics',
    description: 'Custom financial dashboards, automated financial statements, drill-down analysis, and predictive analytics',
    category: 'FIMS',
    features: [
      'Custom financial dashboards',
      'Automated financial statements',
      'Drill-down analysis & reporting',
      'Predictive financial analytics',
      'Regulatory compliance reports',
      'Executive summary reports'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 14
  },
  {
    id: 'fims_compliance',
    name: 'Security, Compliance & Integration',
    description: 'Role-based access control, audit trails, IFRS compliance, and API integrations',
    category: 'FIMS',
    features: [
      'Role-based access control (RBAC)',
      'Comprehensive audit trails',
      'IFRS compliance tools',
      'API integrations platform',
      'Data security & encryption',
      'Compliance reporting & monitoring'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 15
  },
  {
    id: 'fims_commitment_control',
    name: 'Commitment Control',
    description: 'Budget reservation, funds control, commitment lifecycle management with real-time availability checks',
    category: 'FIMS',
    features: [
      'Budget reservation at requisition/PO',
      'Real-time availability checks',
      'Multi-stage commitment tracking',
      'Overspend prevention controls',
      'Budget vs commitments vs actuals',
      'Approval workflows & overrides'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 16
  },
  {
    id: 'fims_fixed_assets',
    name: 'Fixed Assets Management',
    description: 'Asset register, depreciation, lifecycle tracking, physical verification, and disposal management',
    category: 'FIMS',
    features: [
      'Comprehensive asset register',
      'Multiple depreciation methods',
      'Asset lifecycle tracking',
      'Physical verification & tagging',
      'Disposal & revaluation workflows',
      'Asset location tracking'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 17
  },
  {
    id: 'fims_contracts',
    name: 'Contract Management',
    description: 'Contract registry, milestones, deliverables, variations, performance tracking, and spend analysis',
    category: 'FIMS',
    features: [
      'Contract registry & lifecycle',
      'Milestone & deliverable tracking',
      'Contract variations management',
      'Performance securities & retention',
      'Spend against contract analysis',
      'Expiry alerts & renewal workflows'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 18
  },
  {
    id: 'fims_projects',
    name: 'Project & Grant Accounting',
    description: 'Project budgets, funding sources, donor restrictions, cost allocation, and program reporting',
    category: 'FIMS',
    features: [
      'Project budgets & tracking',
      'Multi-source funding management',
      'Donor restrictions enforcement',
      'Cost allocation rules',
      'Grant compliance reporting',
      'Program financial statements'
    ],
    monthlyPrice: '20.00',
    setupFee: '0.00',
    isActive: true,
    sortOrder: 19
  }
];

/**
 * Seed the modules in the database
 */
export async function seedSaasModules() {
  console.log('🌱 Seeding SaaS modules...');
  
  try {
    for (const moduleData of SAAS_MODULES) {
      // Check if module already exists
      const existingModule = await saasStorage.getModuleById(moduleData.id);
      
      if (!existingModule) {
        await saasStorage.createModule(moduleData);
        console.log(`✅ Created module: ${moduleData.name}`);
      } else {
        console.log(`⚠️ Module already exists: ${moduleData.name}`);
      }
    }
    
    console.log('🎉 SaaS modules seeding completed!');
    
    // Display summary
    const hrModules = SAAS_MODULES.filter(m => m.category === 'HRMIS');
    const fimsModules = SAAS_MODULES.filter(m => m.category === 'FIMS');
    
    console.log(`\n📊 Module Summary:`);
    console.log(`HRMIS Modules: ${hrModules.length}`);
    console.log(`FIMS Modules: ${fimsModules.length}`);
    console.log(`Total Modules: ${SAAS_MODULES.length}`);
    
    // Calculate pricing ranges
    const prices = SAAS_MODULES.map(m => parseFloat(m.monthlyPrice));
    const setupFees = SAAS_MODULES.map(m => parseFloat(m.setupFee));
    
    console.log(`\n💰 Pricing Summary:`);
    console.log(`Monthly Price Range: $${Math.min(...prices)} - $${Math.max(...prices)}`);
    console.log(`Setup Fee Range: $${Math.min(...setupFees)} - $${Math.max(...setupFees)}`);
    console.log(`Total Monthly (All Modules): $${prices.reduce((a, b) => a + b, 0)}`);
    
  } catch (error) {
    console.error('❌ Error seeding SaaS modules:', error);
    throw error;
  }
}

/**
 * Get module recommendations based on business type
 */
export function getModuleRecommendations(businessType: string): string[] {
  const recommendations: Record<string, string[]> = {
    'small_business': ['hr_core', 'hr_self_service', 'fims_general_ledger', 'fims_accounts_payable'],
    'medium_business': ['hr_core', 'hr_self_service', 'hr_compensation', 'fims_general_ledger', 'fims_accounts_payable', 'fims_accounts_receivable', 'fims_budgeting'],
    'large_enterprise': SAAS_MODULES.map(m => m.id), // All modules
    'hr_focused': ['hr_core', 'hr_recruitment', 'hr_talent', 'hr_compensation', 'hr_self_service', 'hr_biometrics_attendance', 'hr_analytics'],
    'finance_focused': ['fims_general_ledger', 'fims_accounts_payable', 'fims_accounts_receivable', 'fims_treasury', 'fims_budgeting', 'fims_reporting', 'fims_compliance']
  };
  
  return recommendations[businessType] || ['hr_core', 'fims_general_ledger'];
}

/**
 * Calculate total pricing for selected modules
 */
export function calculateModulePricing(moduleIds: string[]): {
  totalMonthly: number;
  totalSetup: number;
  modules: Array<{ id: string; name: string; monthlyPrice: number; setupFee: number }>;
} {
  const selectedModules = SAAS_MODULES.filter(m => moduleIds.includes(m.id));
  
  const pricing = {
    totalMonthly: 0,
    totalSetup: 0,
    modules: selectedModules.map(m => ({
      id: m.id,
      name: m.name,
      monthlyPrice: parseFloat(m.monthlyPrice),
      setupFee: parseFloat(m.setupFee)
    }))
  };
  
  pricing.totalMonthly = pricing.modules.reduce((sum, m) => sum + m.monthlyPrice, 0);
  pricing.totalSetup = pricing.modules.reduce((sum, m) => sum + m.setupFee, 0);
  
  return pricing;
}

// Export module data for use in frontend
export { SAAS_MODULES };