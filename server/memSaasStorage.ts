import { v4 as uuidv4 } from 'uuid';
import {
  type Tenant, type InsertTenant,
  type SaasUser, type InsertSaasUser,
  type Module, type InsertModule,
  type Subscription, type InsertSubscription,
  type TenantModule, type InsertTenantModule,
  type Invoice, type InsertInvoice,
  type ChartOfAccount, type InsertChartOfAccount,
  type GeneralLedgerEntry, type InsertGeneralLedgerEntry,
  type AccountsPayable, type InsertAccountsPayable,
  type AccountsReceivable, type InsertAccountsReceivable,
  type Budget, type InsertBudget,
  type CashFlowEntry, type InsertCashFlowEntry,
  type AuditLog, type InsertAuditLog
} from "@shared/schema";

/**
 * In-memory storage implementation for SaaS platform
 * Provides the same interface as SaasStorage for development without database dependency
 */
export class MemSaasStorage {
  private tenants = new Map<string, Tenant>();
  private saasUsers = new Map<string, SaasUser>();
  private modules = new Map<string, Module>();
  private subscriptions = new Map<string, Subscription>();
  private tenantModules = new Map<string, TenantModule>();
  private invoices = new Map<string, Invoice>();
  private chartOfAccounts = new Map<string, ChartOfAccount>();
  private generalLedgerEntries = new Map<string, GeneralLedgerEntry>();
  private accountsPayable = new Map<string, AccountsPayable>();
  private accountsReceivable = new Map<string, AccountsReceivable>();
  private budgets = new Map<string, Budget>();
  private cashFlowEntries = new Map<string, CashFlowEntry>();
  private auditLogs = new Map<string, AuditLog>();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize modules with the 14 FIMS/HRMIS modules
    this.initializeModules();
    
    // Initialize sample tenant and users
    this.initializeSampleTenant();
  }

  private initializeModules() {
    const SAAS_MODULES: Module[] = [
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
        monthlyPrice: '45.00',
        setupFee: '50.00',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date()
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
        monthlyPrice: '55.00',
        setupFee: '75.00',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date()
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
        monthlyPrice: '65.00',
        setupFee: '100.00',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date()
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
        monthlyPrice: '75.00',
        setupFee: '150.00',
        isActive: true,
        sortOrder: 4,
        createdAt: new Date()
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
        monthlyPrice: '35.00',
        setupFee: '25.00',
        isActive: true,
        sortOrder: 5,
        createdAt: new Date()
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
        monthlyPrice: '50.00',
        setupFee: '50.00',
        isActive: true,
        sortOrder: 6,
        createdAt: new Date()
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
        sortOrder: 7,
        createdAt: new Date()
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
        monthlyPrice: '60.00',
        setupFee: '100.00',
        isActive: true,
        sortOrder: 7,
        createdAt: new Date()
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
        monthlyPrice: '55.00',
        setupFee: '75.00',
        isActive: true,
        sortOrder: 8,
        createdAt: new Date()
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
        monthlyPrice: '55.00',
        setupFee: '75.00',
        isActive: true,
        sortOrder: 9,
        createdAt: new Date()
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
        monthlyPrice: '70.00',
        setupFee: '125.00',
        isActive: true,
        sortOrder: 10,
        createdAt: new Date()
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
        monthlyPrice: '65.00',
        setupFee: '100.00',
        isActive: true,
        sortOrder: 11,
        createdAt: new Date()
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
        monthlyPrice: '50.00',
        setupFee: '75.00',
        isActive: true,
        sortOrder: 12,
        createdAt: new Date()
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
        monthlyPrice: '60.00',
        setupFee: '100.00',
        isActive: true,
        sortOrder: 13,
        createdAt: new Date()
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
        monthlyPrice: '45.00',
        setupFee: '75.00',
        isActive: true,
        sortOrder: 14,
        createdAt: new Date()
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
        monthlyPrice: '55.00',
        setupFee: '100.00',
        isActive: true,
        sortOrder: 15,
        createdAt: new Date()
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
        monthlyPrice: '50.00',
        setupFee: '100.00',
        isActive: true,
        sortOrder: 16,
        createdAt: new Date()
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
        monthlyPrice: '55.00',
        setupFee: '100.00',
        isActive: true,
        sortOrder: 17,
        createdAt: new Date()
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
        monthlyPrice: '60.00',
        setupFee: '100.00',
        isActive: true,
        sortOrder: 18,
        createdAt: new Date()
      }
    ];

    // Store modules in memory
    SAAS_MODULES.forEach(module => {
      this.modules.set(module.id, module);
    });

    console.log('✅ MemSaasStorage initialized with', SAAS_MODULES.length, 'modules');
  }

  private initializeSampleTenant() {
    // Sample tenant
    const tenantId = 'demo-tenant-001';
    const customerId = 'customer-001';
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);

    const tenant: Tenant = {
      id: tenantId,
      customerId,
      name: 'Acme Corporation',
      slug: 'acme-corp',
      domain: null,
      logo: null,
      contactEmail: 'admin@acme-corp.com',
      contactPhone: '+231-123-456-789',
      address: '123 Business District, Monrovia',
      country: 'Liberia',
      timezone: 'Africa/Monrovia',
      currency: 'LRD',
      status: 'active',
      provisioningSource: 'totag_it_services',
      slaTier: 'standard',
      createdAt: now,
      updatedAt: now
    };

    this.tenants.set(tenantId, tenant);

    // Sample admin user
    const adminUserId = 'admin-user-001';
    const adminUser: SaasUser = {
      id: adminUserId,
      tenantId,
      email: 'admin@acme-corp.com',
      password: '$2b$12$plpFRnFLofBMbyfwFqdxE.rKqhFR5Pq.8oMTAG3D2bARGSvhMvMe6', // hashed: "password123" - corrected hash
      firstName: 'John',
      lastName: 'Admin',
      phone: '+231-123-456-789',
      avatar: null,
      role: 'admin',
      permissions: ['tenant_admin', 'user_management', 'billing_read', 'billing_write'],
      isActive: true,
      isTenantAdmin: true,
      mspManaged: false,
      lastLoginAt: null,
      emailVerifiedAt: now,
      createdAt: now,
      updatedAt: now
    };

    this.saasUsers.set(adminUserId, adminUser);

    // Create TOTAG user for the actual user
    const totagUserId = 'totag-user-001';
    const totagUser: SaasUser = {
      id: totagUserId,
      tenantId,
      email: 'totagfarm@gmail.com',
      password: '$2b$12$rAnCTz8VQfT.VMevwri4NOMh8Wr7jb30Vh0zqEwGN7y4mVu285Ebu', // hashed: "Zwedru4gedeh"
      firstName: 'TOTAG',
      lastName: 'User',
      phone: '+231-987-654-321',
      avatar: null,
      role: 'admin',
      permissions: ['tenant_admin', 'user_management', 'billing_read', 'billing_write'],
      isActive: true,
      isTenantAdmin: true,
      mspManaged: false,
      lastLoginAt: null,
      emailVerifiedAt: now,
      createdAt: now,
      updatedAt: now
    };

    this.saasUsers.set(totagUserId, totagUser);

    // Sample subscription with core modules
    const subscriptionId = 'subscription-001';
    const subscription: Subscription = {
      id: subscriptionId,
      tenantId,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: futureDate,
      billingCycle: 'monthly',
      totalAmount: '240.00', // hr_core (45) + hr_self_service (35) + fims_general_ledger (60) + fims_accounts_payable (55) + fims_reporting (60) = 255, but using 240 for round number
      currency: 'LRD',
      paymentMethod: 'mobile_money',
      lastPaymentDate: now,
      nextPaymentDate: futureDate,
      gracePeriodEnds: null,
      externalSubscriptionId: 'totag-sub-001',
      externalProvider: 'totag_billing',
      createdAt: now,
      updatedAt: now
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Sample tenant modules (starter pack)
    const starterModules = ['hr_core', 'hr_self_service', 'fims_general_ledger', 'fims_accounts_payable', 'fims_reporting'];
    
    starterModules.forEach(moduleId => {
      const module = this.modules.get(moduleId);
      if (module) {
        const tenantModuleId = uuidv4();
        const tenantModule: TenantModule = {
          id: tenantModuleId,
          tenantId,
          moduleId,
          subscriptionId,
          status: 'active',
          subscribedAt: now,
          suspendedAt: null,
          monthlyPrice: module.monthlyPrice,
          setupFee: module.setupFee,
          createdAt: now
        };
        this.tenantModules.set(tenantModuleId, tenantModule);
      }
    });

    // Sample invoice
    const invoiceId = 'invoice-001';
    const invoice: Invoice = {
      id: invoiceId,
      tenantId,
      subscriptionId,
      invoiceNumber: 'INV-2024-001',
      status: 'paid',
      subtotal: '240.00',
      taxAmount: '0.00',
      total: '240.00',
      currency: 'LRD',
      issuedDate: now,
      dueDate: futureDate,
      paidDate: now,
      paymentMethod: 'mobile_money',
      stripeInvoiceId: null,
      notes: 'First month subscription payment',
      externalInvoiceId: 'totag-inv-001',
      createdAt: now
    };

    this.invoices.set(invoiceId, invoice);

    console.log('✅ MemSaasStorage initialized with demo tenant:', tenant.name);
  }

  // ==== TENANT MANAGEMENT ====
  
  async createTenant(data: InsertTenant): Promise<Tenant> {
    const id = data.id || uuidv4();
    const now = new Date();
    const tenant: Tenant = {
      ...data,
      id,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  async getTenantById(id: string): Promise<Tenant | null> {
    return this.tenants.get(id) || null;
  }

  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    for (const tenant of this.tenants.values()) {
      if (tenant.slug === slug) return tenant;
    }
    return null;
  }

  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    for (const tenant of this.tenants.values()) {
      if (tenant.domain === domain) return tenant;
    }
    return null;
  }

  async updateTenant(id: string, data: Partial<InsertTenant>): Promise<Tenant | null> {
    const tenant = this.tenants.get(id);
    if (!tenant) return null;

    const updatedTenant: Tenant = {
      ...tenant,
      ...data,
      updatedAt: new Date()
    };
    this.tenants.set(id, updatedTenant);
    return updatedTenant;
  }

  async listTenants(status?: string): Promise<Tenant[]> {
    const tenants = Array.from(this.tenants.values());
    
    if (status) {
      return tenants
        .filter(t => t.status === status)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    return tenants.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ==== USER MANAGEMENT ====
  
  async createSaasUser(data: InsertSaasUser): Promise<SaasUser> {
    const id = data.id || uuidv4();
    const now = new Date();
    const user: SaasUser = {
      ...data,
      id,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };
    this.saasUsers.set(id, user);
    return user;
  }

  async getSaasUserById(id: string): Promise<SaasUser | null> {
    return this.saasUsers.get(id) || null;
  }

  async getSaasUserByEmail(email: string, tenantId: string): Promise<SaasUser | null> {
    for (const user of this.saasUsers.values()) {
      if (user.email === email && user.tenantId === tenantId) return user;
    }
    return null;
  }

  async listAllUsers(): Promise<SaasUser[]> {
    return Array.from(this.saasUsers.values());
  }

  async updateSaasUser(id: string, data: Partial<InsertSaasUser>): Promise<SaasUser | null> {
    const user = this.saasUsers.get(id);
    if (!user) return null;

    const updatedUser: SaasUser = {
      ...user,
      ...data,
      updatedAt: new Date()
    };
    this.saasUsers.set(id, updatedUser);
    return updatedUser;
  }

  async getTenantUsers(tenantId: string): Promise<SaasUser[]> {
    return Array.from(this.saasUsers.values())
      .filter(u => u.tenantId === tenantId)
      .sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`;
        const nameB = `${b.firstName} ${b.lastName}`;
        return nameA.localeCompare(nameB);
      });
  }

  async updateUserLastLogin(id: string): Promise<void> {
    const user = this.saasUsers.get(id);
    if (user) {
      const updatedUser: SaasUser = {
        ...user,
        lastLoginAt: new Date()
      };
      this.saasUsers.set(id, updatedUser);
    }
  }

  // ==== MODULE MANAGEMENT ====
  
  async createModule(data: InsertModule): Promise<Module> {
    const id = data.id;
    const now = new Date();
    const module: Module = {
      ...data,
      createdAt: data.createdAt || now
    };
    this.modules.set(id, module);
    return module;
  }

  async getModuleById(id: string): Promise<Module | null> {
    return this.modules.get(id) || null;
  }

  async listActiveModules(): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter(m => m.isActive)
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.name.localeCompare(b.name);
      });
  }

  async getModulesByCategory(category: string): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter(m => m.category === category && m.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // ==== SUBSCRIPTION MANAGEMENT ====
  
  async createSubscription(data: InsertSubscription): Promise<Subscription> {
    const id = data.id || uuidv4();
    const now = new Date();
    const subscription: Subscription = {
      ...data,
      id,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    return this.subscriptions.get(id) || null;
  }

  async getTenantSubscription(tenantId: string): Promise<Subscription | null> {
    const subscriptions = Array.from(this.subscriptions.values())
      .filter(s => s.tenantId === tenantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return subscriptions[0] || null;
  }

  async updateSubscription(id: string, data: Partial<InsertSubscription>): Promise<Subscription | null> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return null;

    const updatedSubscription: Subscription = {
      ...subscription,
      ...data,
      updatedAt: new Date()
    };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  // ==== TENANT MODULE MANAGEMENT ====
  
  async addTenantModule(data: InsertTenantModule): Promise<TenantModule> {
    const id = data.id || uuidv4();
    const now = new Date();
    const tenantModule: TenantModule = {
      ...data,
      id,
      subscribedAt: data.subscribedAt || now,
      createdAt: data.createdAt || now
    };
    this.tenantModules.set(id, tenantModule);
    return tenantModule;
  }

  async getTenantModules(tenantId: string): Promise<TenantModule[]> {
    return Array.from(this.tenantModules.values())
      .filter(tm => tm.tenantId === tenantId)
      .sort((a, b) => a.subscribedAt.getTime() - b.subscribedAt.getTime());
  }

  async getActiveTenantModules(tenantId: string): Promise<TenantModule[]> {
    return Array.from(this.tenantModules.values())
      .filter(tm => tm.tenantId === tenantId && tm.status === 'active')
      .sort((a, b) => a.subscribedAt.getTime() - b.subscribedAt.getTime());
  }

  async suspendTenantModule(tenantId: string, moduleId: string): Promise<TenantModule | null> {
    for (const [id, tenantModule] of this.tenantModules.entries()) {
      if (tenantModule.tenantId === tenantId && tenantModule.moduleId === moduleId) {
        const updatedTenantModule: TenantModule = {
          ...tenantModule,
          status: 'suspended',
          suspendedAt: new Date()
        };
        this.tenantModules.set(id, updatedTenantModule);
        return updatedTenantModule;
      }
    }
    return null;
  }

  async reactivateTenantModule(tenantId: string, moduleId: string): Promise<TenantModule | null> {
    for (const [id, tenantModule] of this.tenantModules.entries()) {
      if (tenantModule.tenantId === tenantId && tenantModule.moduleId === moduleId) {
        const updatedTenantModule: TenantModule = {
          ...tenantModule,
          status: 'active',
          suspendedAt: null
        };
        this.tenantModules.set(id, updatedTenantModule);
        return updatedTenantModule;
      }
    }
    return null;
  }

  // ==== INVOICE MANAGEMENT ====
  
  async createInvoice(data: InsertInvoice): Promise<Invoice> {
    const id = data.id || uuidv4();
    const now = new Date();
    const invoice: Invoice = {
      ...data,
      id,
      createdAt: data.createdAt || now
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return this.invoices.get(id) || null;
  }

  async getTenantInvoices(tenantId: string, status?: string): Promise<Invoice[]> {
    const invoices = Array.from(this.invoices.values())
      .filter(i => i.tenantId === tenantId);
    
    if (status) {
      return invoices
        .filter(i => i.status === status)
        .sort((a, b) => b.issuedDate.getTime() - a.issuedDate.getTime());
    }
    
    return invoices.sort((a, b) => b.issuedDate.getTime() - a.issuedDate.getTime());
  }

  async updateInvoice(id: string, data: Partial<InsertInvoice>): Promise<Invoice | null> {
    const invoice = this.invoices.get(id);
    if (!invoice) return null;

    const updatedInvoice: Invoice = {
      ...invoice,
      ...data
    };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  // ==== FIMS - CHART OF ACCOUNTS ====
  
  async createChartOfAccount(data: InsertChartOfAccount): Promise<ChartOfAccount> {
    const id = data.id || uuidv4();
    const now = new Date();
    const account: ChartOfAccount = {
      ...data,
      id,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };
    this.chartOfAccounts.set(id, account);
    return account;
  }

  async getChartOfAccounts(tenantId: string): Promise<ChartOfAccount[]> {
    return Array.from(this.chartOfAccounts.values())
      .filter(a => a.tenantId === tenantId)
      .sort((a, b) => a.accountCode.localeCompare(b.accountCode));
  }

  async getAccountById(id: string, tenantId: string): Promise<ChartOfAccount | null> {
    const account = this.chartOfAccounts.get(id);
    return (account && account.tenantId === tenantId) ? account : null;
  }

  async getAccountsByType(tenantId: string, accountType: string): Promise<ChartOfAccount[]> {
    return Array.from(this.chartOfAccounts.values())
      .filter(a => a.tenantId === tenantId && a.accountType === accountType)
      .sort((a, b) => a.accountCode.localeCompare(b.accountCode));
  }

  // ==== FIMS - GENERAL LEDGER ====
  
  async createGeneralLedgerEntry(data: InsertGeneralLedgerEntry): Promise<GeneralLedgerEntry> {
    const id = data.id || uuidv4();
    const now = new Date();
    const entry: GeneralLedgerEntry = {
      ...data,
      id,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };
    this.generalLedgerEntries.set(id, entry);
    return entry;
  }

  async getGeneralLedgerEntries(tenantId: string, accountId?: string, status?: string): Promise<GeneralLedgerEntry[]> {
    let entries = Array.from(this.generalLedgerEntries.values())
      .filter(e => e.tenantId === tenantId);
    
    if (accountId) {
      entries = entries.filter(e => e.accountId === accountId);
    }
    
    if (status) {
      entries = entries.filter(e => e.status === status);
    }
    
    return entries.sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());
  }

  async updateGeneralLedgerEntry(id: string, tenantId: string, data: Partial<InsertGeneralLedgerEntry>): Promise<GeneralLedgerEntry | null> {
    const entry = this.generalLedgerEntries.get(id);
    if (!entry || entry.tenantId !== tenantId) return null;

    const updatedEntry: GeneralLedgerEntry = {
      ...entry,
      ...data,
      updatedAt: new Date()
    };
    this.generalLedgerEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  // ==== AUDIT LOGGING ====
  
  async createAuditLog(data: InsertAuditLog): Promise<AuditLog> {
    const id = data.id || uuidv4();
    const now = new Date();
    const log: AuditLog = {
      ...data,
      id,
      timestamp: data.timestamp || now
    };
    this.auditLogs.set(id, log);
    return log;
  }

  async getAuditLogs(tenantId: string, userId?: string, action?: string): Promise<AuditLog[]> {
    let logs = Array.from(this.auditLogs.values())
      .filter(l => l.tenantId === tenantId);
    
    if (userId) {
      logs = logs.filter(l => l.userId === userId);
    }
    
    if (action) {
      logs = logs.filter(l => l.action === action);
    }
    
    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 1000);
  }

  // ==== UTILITY FUNCTIONS ====
  
  async getTenantStats(tenantId: string): Promise<{
    userCount: number;
    moduleCount: number;
    lastLoginDate: Date | null;
  }> {
    const users = Array.from(this.saasUsers.values()).filter(u => u.tenantId === tenantId);
    const modules = Array.from(this.tenantModules.values()).filter(tm => tm.tenantId === tenantId && tm.status === 'active');
    
    const lastLogins = users.map(u => u.lastLoginAt).filter(Boolean) as Date[];
    const lastLoginDate = lastLogins.length > 0 ? new Date(Math.max(...lastLogins.map(d => d.getTime()))) : null;

    return {
      userCount: users.length,
      moduleCount: modules.length,
      lastLoginDate
    };
  }

  async searchTenants(searchTerm: string): Promise<Tenant[]> {
    const term = searchTerm.toLowerCase();
    return Array.from(this.tenants.values())
      .filter(t => 
        t.name.toLowerCase().includes(term) ||
        t.contactEmail.toLowerCase().includes(term) ||
        t.slug.toLowerCase().includes(term)
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 20);
  }

  // ==== LEAVE REQUESTS ====
  async createLeaveRequest(data: any): Promise<any> {
    const id = `leave-${Date.now()}`;
    const request = { id, ...data, status: 'pending', createdAt: new Date() };
    return request;
  }

  // ==== HR REQUESTS ====
  async createHrRequest(data: any): Promise<any> {
    const id = `hr-req-${Date.now()}`;
    const request = { id, ...data, status: 'pending', createdAt: new Date() };
    return request;
  }

  // ==== ATTENDANCE ====
  async createAttendance(data: any): Promise<any> {
    const id = `attendance-${Date.now()}`;
    const record = { id, ...data, createdAt: new Date() };
    return record;
  }

  // ==== EMPLOYEE PROFILE ====
  async updateEmployeeProfile(employeeId: number, data: any): Promise<any> {
    return { id: employeeId, ...data, updatedAt: new Date() };
  }
}