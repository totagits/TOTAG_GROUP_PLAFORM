import { eq, and, desc, asc, sql, like, inArray } from "drizzle-orm";
import { db } from "./db";
import * as schema from "@shared/schema";
import {
  tenants, saasUsers, modules, subscriptions, tenantModules, invoices,
  chartOfAccounts, generalLedgerEntries, accountsPayable, accountsReceivable,
  budgets, cashFlowEntries, auditLogs,
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

// In-memory storage for procurement records (no schema table needed)
const procurementRecordsStore: Map<string, any> = new Map();

export class SaasStorage {
  // Debug helper method for logging
  private debug(method: string, ...args: any[]) {
    if (process.env.SAAS_DEBUG === 'true') {
      console.log(`📊 SaasStorage.${method}(${args.map(a => typeof a === 'object' ? JSON.stringify(a).slice(0, 50) + '...' : a).join(', ')})`);
    }
  }

  // ==== PROCUREMENT RECORDS (In-Memory) ====
  
  async listProcurementRecords(tenantId: string, recordType?: string, status?: string): Promise<any[]> {
    const records: any[] = [];
    procurementRecordsStore.forEach((record) => {
      if (record.tenantId === tenantId) {
        if (recordType && record.recordType !== recordType) return;
        if (status && record.status !== status) return;
        records.push(record);
      }
    });
    return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createProcurementRecord(data: any): Promise<any> {
    const id = data.id || crypto.randomUUID();
    const record = { ...data, id, createdAt: data.createdAt || new Date().toISOString() };
    procurementRecordsStore.set(id, record);
    return record;
  }

  async updateProcurementRecord(tenantId: string, recordId: string, data: any): Promise<any> {
    const existing = procurementRecordsStore.get(recordId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Procurement record not found');
    }
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    procurementRecordsStore.set(recordId, updated);
    return updated;
  }

  async getProcurementRecord(tenantId: string, recordId: string): Promise<any | null> {
    const record = procurementRecordsStore.get(recordId);
    if (!record || record.tenantId !== tenantId) return null;
    return record;
  }

  // ==== TENANT MANAGEMENT ====
  
  async createTenant(data: InsertTenant): Promise<Tenant> {
    const [tenant] = await db.insert(tenants).values(data).returning();
    return tenant;
  }

  async getTenantById(id: string): Promise<Tenant | null> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant || null;
  }

  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, slug));
    return tenant || null;
  }

  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.domain, domain));
    return tenant || null;
  }

  async updateTenant(id: string, data: Partial<InsertTenant>): Promise<Tenant | null> {
    const [tenant] = await db.update(tenants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return tenant || null;
  }

  async listTenants(status?: string): Promise<Tenant[]> {
    const query = db.select().from(tenants);
    
    if (status) {
      query.where(eq(tenants.status, status));
    }
    
    return await query.orderBy(desc(tenants.createdAt));
  }

  // ==== USER MANAGEMENT ====
  
  async createSaasUser(data: InsertSaasUser): Promise<SaasUser> {
    const [user] = await db.insert(saasUsers).values(data).returning();
    return user;
  }

  async getSaasUserById(id: string): Promise<SaasUser | null> {
    const [user] = await db.select().from(saasUsers).where(eq(saasUsers.id, id));
    return user || null;
  }

  async getSaasUserByEmail(email: string, tenantId: string): Promise<SaasUser | null> {
    const [user] = await db.select().from(saasUsers)
      .where(and(eq(saasUsers.email, email), eq(saasUsers.tenantId, tenantId)));
    return user || null;
  }

  async listAllUsers(): Promise<SaasUser[]> {
    return await db.select().from(saasUsers);
  }

  async updateSaasUser(id: string, data: Partial<InsertSaasUser>): Promise<SaasUser | null> {
    const [user] = await db.update(saasUsers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(saasUsers.id, id))
      .returning();
    return user || null;
  }

  async getTenantUsers(tenantId: string): Promise<SaasUser[]> {
    return await db.select().from(saasUsers)
      .where(eq(saasUsers.tenantId, tenantId))
      .orderBy(asc(saasUsers.firstName), asc(saasUsers.lastName));
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(saasUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(saasUsers.id, id));
  }

  // ==== MODULE MANAGEMENT ====
  
  async createModule(data: InsertModule): Promise<Module> {
    const [module] = await db.insert(modules).values(data).returning();
    return module;
  }

  async getModuleById(id: string): Promise<Module | null> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module || null;
  }

  async listActiveModules(): Promise<Module[]> {
    return await db.select().from(modules)
      .where(eq(modules.isActive, true))
      .orderBy(asc(modules.sortOrder), asc(modules.name));
  }

  async getModulesByCategory(category: string): Promise<Module[]> {
    return await db.select().from(modules)
      .where(and(eq(modules.category, category), eq(modules.isActive, true)))
      .orderBy(asc(modules.sortOrder));
  }

  // ==== SUBSCRIPTION MANAGEMENT ====
  
  async createSubscription(data: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions).values(data).returning();
    return subscription;
  }

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription || null;
  }

  async getTenantSubscription(tenantId: string): Promise<Subscription | null> {
    const [subscription] = await db.select().from(subscriptions)
      .where(eq(subscriptions.tenantId, tenantId))
      .orderBy(desc(subscriptions.createdAt));
    return subscription || null;
  }

  async updateSubscription(id: string, data: Partial<InsertSubscription>): Promise<Subscription | null> {
    const [subscription] = await db.update(subscriptions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription || null;
  }

  // ==== TENANT MODULE MANAGEMENT ====
  
  async addTenantModule(data: InsertTenantModule): Promise<TenantModule> {
    const [tenantModule] = await db.insert(tenantModules).values(data).returning();
    return tenantModule;
  }

  async getTenantModules(tenantId: string): Promise<TenantModule[]> {
    return await db.select().from(tenantModules)
      .where(eq(tenantModules.tenantId, tenantId))
      .orderBy(asc(tenantModules.subscribedAt));
  }

  async getActiveTenantModules(tenantId: string): Promise<TenantModule[]> {
    return await db.select().from(tenantModules)
      .where(and(eq(tenantModules.tenantId, tenantId), eq(tenantModules.status, 'active')))
      .orderBy(asc(tenantModules.subscribedAt));
  }

  async suspendTenantModule(tenantId: string, moduleId: string): Promise<TenantModule | null> {
    const [tenantModule] = await db.update(tenantModules)
      .set({ status: 'suspended', suspendedAt: new Date() })
      .where(and(eq(tenantModules.tenantId, tenantId), eq(tenantModules.moduleId, moduleId)))
      .returning();
    return tenantModule || null;
  }

  async reactivateTenantModule(tenantId: string, moduleId: string): Promise<TenantModule | null> {
    const [tenantModule] = await db.update(tenantModules)
      .set({ status: 'active', suspendedAt: null })
      .where(and(eq(tenantModules.tenantId, tenantId), eq(tenantModules.moduleId, moduleId)))
      .returning();
    return tenantModule || null;
  }

  // ==== INVOICE MANAGEMENT ====
  
  async createInvoice(data: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(data).returning();
    return invoice;
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || null;
  }

  async getTenantInvoices(tenantId: string, status?: string): Promise<Invoice[]> {
    const query = db.select().from(invoices).where(eq(invoices.tenantId, tenantId));
    
    if (status) {
      query.where(and(eq(invoices.tenantId, tenantId), eq(invoices.status, status)));
    }
    
    return await query.orderBy(desc(invoices.issuedDate));
  }

  async updateInvoice(id: string, data: Partial<InsertInvoice>): Promise<Invoice | null> {
    const [invoice] = await db.update(invoices)
      .set(data)
      .where(eq(invoices.id, id))
      .returning();
    return invoice || null;
  }

  // ==== FIMS - CHART OF ACCOUNTS ====
  
  async createChartOfAccount(data: InsertChartOfAccount): Promise<ChartOfAccount> {
    const [account] = await db.insert(chartOfAccounts).values(data).returning();
    return account;
  }

  async getChartOfAccounts(tenantId: string): Promise<ChartOfAccount[]> {
    return await db.select().from(chartOfAccounts)
      .where(eq(chartOfAccounts.tenantId, tenantId))
      .orderBy(asc(chartOfAccounts.accountCode));
  }

  async getAccountById(id: string, tenantId: string): Promise<ChartOfAccount | null> {
    const [account] = await db.select().from(chartOfAccounts)
      .where(and(eq(chartOfAccounts.id, id), eq(chartOfAccounts.tenantId, tenantId)));
    return account || null;
  }

  async getAccountsByType(tenantId: string, accountType: string): Promise<ChartOfAccount[]> {
    return await db.select().from(chartOfAccounts)
      .where(and(eq(chartOfAccounts.tenantId, tenantId), eq(chartOfAccounts.accountType, accountType)))
      .orderBy(asc(chartOfAccounts.accountCode));
  }

  // ==== FIMS - GENERAL LEDGER ====
  
  async createGeneralLedgerEntry(data: InsertGeneralLedgerEntry): Promise<GeneralLedgerEntry> {
    const [entry] = await db.insert(generalLedgerEntries).values(data).returning();
    return entry;
  }

  async getGeneralLedgerEntries(tenantId: string, accountId?: string, status?: string): Promise<GeneralLedgerEntry[]> {
    let query = db.select().from(generalLedgerEntries).where(eq(generalLedgerEntries.tenantId, tenantId));
    
    if (accountId) {
      query = query.where(and(eq(generalLedgerEntries.tenantId, tenantId), eq(generalLedgerEntries.accountId, accountId)));
    }
    
    if (status) {
      query = query.where(and(eq(generalLedgerEntries.tenantId, tenantId), eq(generalLedgerEntries.status, status)));
    }
    
    return await query.orderBy(desc(generalLedgerEntries.transactionDate));
  }

  async updateGeneralLedgerEntry(id: string, tenantId: string, data: Partial<InsertGeneralLedgerEntry>): Promise<GeneralLedgerEntry | null> {
    const [entry] = await db.update(generalLedgerEntries)
      .set(data)
      .where(and(eq(generalLedgerEntries.id, id), eq(generalLedgerEntries.tenantId, tenantId)))
      .returning();
    return entry || null;
  }

  // ==== AUDIT LOGGING ====
  
  async createAuditLog(data: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db.insert(auditLogs).values(data).returning();
    return log;
  }

  async getAuditLogs(tenantId: string, userId?: string, action?: string): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs).where(eq(auditLogs.tenantId, tenantId));
    
    if (userId) {
      query = query.where(and(eq(auditLogs.tenantId, tenantId), eq(auditLogs.userId, userId)));
    }
    
    if (action) {
      query = query.where(and(eq(auditLogs.tenantId, tenantId), eq(auditLogs.action, action)));
    }
    
    return await query.orderBy(desc(auditLogs.timestamp)).limit(1000);
  }

  // ==== UTILITY FUNCTIONS ====
  
  async getTenantStats(tenantId: string): Promise<{
    userCount: number;
    moduleCount: number;
    lastLoginDate: Date | null;
  }> {
    const [userStats] = await db.select({
      count: sql<number>`count(*)::int`,
      lastLogin: sql<Date>`max(last_login_at)`
    }).from(saasUsers).where(eq(saasUsers.tenantId, tenantId));

    const [moduleStats] = await db.select({
      count: sql<number>`count(*)::int`
    }).from(tenantModules).where(and(eq(tenantModules.tenantId, tenantId), eq(tenantModules.status, 'active')));

    return {
      userCount: userStats.count || 0,
      moduleCount: moduleStats.count || 0,
      lastLoginDate: userStats.lastLogin || null
    };
  }

  async searchTenants(searchTerm: string): Promise<Tenant[]> {
    return await db.select().from(tenants)
      .where(
        sql`${tenants.name} ILIKE ${`%${searchTerm}%`} OR 
            ${tenants.contactEmail} ILIKE ${`%${searchTerm}%`} OR 
            ${tenants.slug} ILIKE ${`%${searchTerm}%`}`
      )
      .orderBy(desc(tenants.createdAt))
      .limit(20);
  }

  // ==== LEAVE REQUESTS ====
  async createLeaveRequest(data: any): Promise<any> {
    // TODO: Implement with proper schema when leave_requests table is ready
    console.log('[STUB] createLeaveRequest called with:', data);
    return { id: 'stub-leave-request', ...data, status: 'pending', createdAt: new Date() };
  }

  // ==== HR REQUESTS ====
  async createHrRequest(data: any): Promise<any> {
    // TODO: Implement with proper schema when hr_requests table is ready
    console.log('[STUB] createHrRequest called with:', data);
    return { id: 'stub-hr-request', ...data, status: 'pending', createdAt: new Date() };
  }

  // ==== ATTENDANCE ====
  async createAttendance(data: any): Promise<any> {
    // TODO: Implement with proper schema using attendance table
    console.log('[STUB] createAttendance called with:', data);
    return { id: 'stub-attendance', ...data, createdAt: new Date() };
  }

  // ==== EMPLOYEE PROFILE ====
  async updateEmployeeProfile(employeeId: number, data: any): Promise<any> {
    console.log('[STUB] updateEmployeeProfile called for:', employeeId, 'with:', data);
    return { id: employeeId, ...data, updatedAt: new Date() };
  }

  // ==== EMPLOYEES ====
  async listEmployees(tenantId: string): Promise<any[]> {
    this.debug('listEmployees', tenantId);
    const result = await db.select().from(schema.employees).where(eq(schema.employees.tenantId, tenantId));
    return result;
  }

  async createEmployee(data: any): Promise<any> {
    this.debug('createEmployee', data);
    const [employee] = await db.insert(schema.employees).values(data).returning();
    return employee;
  }

  async updateEmployee(tenantId: string, employeeId: string, data: any): Promise<any> {
    this.debug('updateEmployee', tenantId, employeeId, data);
    const [employee] = await db.update(schema.employees)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(schema.employees.tenantId, tenantId), eq(schema.employees.id, parseInt(employeeId))))
      .returning();
    return employee;
  }

  // ==== DEPARTMENTS ====
  async listDepartments(tenantId: string): Promise<any[]> {
    this.debug('listDepartments', tenantId);
    const result = await db.select().from(schema.departments).where(eq(schema.departments.tenantId, tenantId));
    return result;
  }

  async createDepartment(data: any): Promise<any> {
    this.debug('createDepartment', data);
    const [department] = await db.insert(schema.departments).values(data).returning();
    return department;
  }

  // ==== DOCUMENTS ====
  async listDocuments(tenantId: string, category?: string): Promise<any[]> {
    this.debug('listDocuments', tenantId, category);
    if (category) {
      return db.select().from(schema.documents).where(and(eq(schema.documents.tenantId, tenantId), eq(schema.documents.category, category)));
    }
    return db.select().from(schema.documents).where(eq(schema.documents.tenantId, tenantId));
  }

  async createDocument(data: any): Promise<any> {
    this.debug('createDocument', data);
    const [document] = await db.insert(schema.documents).values(data).returning();
    return document;
  }

  // ==== WORKFLOWS ====
  async listWorkflows(tenantId: string): Promise<any[]> {
    this.debug('listWorkflows', tenantId);
    return db.select().from(schema.workflows).where(eq(schema.workflows.tenantId, tenantId));
  }

  async createWorkflow(data: any): Promise<any> {
    this.debug('createWorkflow', data);
    const [workflow] = await db.insert(schema.workflows).values(data).returning();
    return workflow;
  }

  // ==== APPLICANTS (RECRUITMENT) ====
  async listApplicants(tenantId: string, status?: string): Promise<any[]> {
    this.debug('listApplicants', tenantId, status);
    if (status) {
      return db.select().from(schema.applicants).where(and(eq(schema.applicants.tenantId, tenantId), eq(schema.applicants.status, status)));
    }
    return db.select().from(schema.applicants).where(eq(schema.applicants.tenantId, tenantId));
  }

  async createApplicant(data: any): Promise<any> {
    this.debug('createApplicant', data);
    const [applicant] = await db.insert(schema.applicants).values(data).returning();
    return applicant;
  }

  async updateApplicant(tenantId: string, applicantId: string, data: any): Promise<any> {
    this.debug('updateApplicant', tenantId, applicantId, data);
    const [applicant] = await db.update(schema.applicants)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(schema.applicants.tenantId, tenantId), eq(schema.applicants.id, applicantId)))
      .returning();
    return applicant;
  }

  // ==== TRAINING ====
  async listTrainingPrograms(tenantId: string): Promise<any[]> {
    this.debug('listTrainingPrograms', tenantId);
    return db.select().from(schema.trainingPrograms).where(eq(schema.trainingPrograms.tenantId, tenantId));
  }

  async createTrainingProgram(data: any): Promise<any> {
    this.debug('createTrainingProgram', data);
    const [program] = await db.insert(schema.trainingPrograms).values(data).returning();
    return program;
  }

  // ==== ATTENDANCE ====
  async listAttendance(tenantId: string, date?: string): Promise<any[]> {
    this.debug('listAttendance', tenantId, date);
    const employees = await this.listEmployees(tenantId);
    const employeeIds = employees.map(e => e.id);
    if (employeeIds.length === 0) return [];
    return db.select().from(schema.attendance).where(inArray(schema.attendance.employeeId, employeeIds));
  }

  async recordAttendance(data: any): Promise<any> {
    this.debug('recordAttendance', data);
    const [attendance] = await db.insert(schema.attendance).values(data).returning();
    return attendance;
  }

  // ==== LEAVE REQUESTS ====
  async listLeaveRequests(tenantId: string, status?: string): Promise<any[]> {
    this.debug('listLeaveRequests', tenantId, status);
    const employees = await this.listEmployees(tenantId);
    const employeeIds = employees.map(e => e.id);
    if (employeeIds.length === 0) return [];
    const query = db.select().from(schema.leaveRequests).where(inArray(schema.leaveRequests.employeeId, employeeIds));
    return query;
  }

  async updateLeaveRequest(tenantId: string, requestId: number, data: any): Promise<any> {
    this.debug('updateLeaveRequest', tenantId, requestId, data);
    const [result] = await db.update(schema.leaveRequests).set(data).where(eq(schema.leaveRequests.id, requestId)).returning();
    return result;
  }

  // ==== PAYROLL ====
  async listPayroll(tenantId: string, period?: string): Promise<any[]> {
    this.debug('listPayroll', tenantId, period);
    const employees = await this.listEmployees(tenantId);
    const employeeIds = employees.map(e => e.id);
    if (employeeIds.length === 0) return [];
    return db.select().from(schema.payroll).where(inArray(schema.payroll.employeeId, employeeIds));
  }

  async processPayroll(data: any): Promise<any> {
    this.debug('processPayroll', data);
    const [payroll] = await db.insert(schema.payroll).values(data).returning();
    return payroll;
  }

  // ==== PERFORMANCE REVIEWS ====
  async listPerformanceReviews(tenantId: string): Promise<any[]> {
    this.debug('listPerformanceReviews', tenantId);
    const employees = await this.listEmployees(tenantId);
    const employeeIds = employees.map(e => e.id);
    if (employeeIds.length === 0) return [];
    return db.select().from(schema.performanceReviews).where(inArray(schema.performanceReviews.employeeId, employeeIds));
  }

  async createPerformanceReview(data: any): Promise<any> {
    this.debug('createPerformanceReview', data);
    const [review] = await db.insert(schema.performanceReviews).values(data).returning();
    return review;
  }

  // ==== VENDORS ====
  async listVendors(tenantId: string): Promise<any[]> {
    this.debug('listVendors', tenantId);
    return db.select().from(schema.vendors).where(eq(schema.vendors.tenantId, tenantId));
  }

  async createVendor(data: any): Promise<any> {
    this.debug('createVendor', data);
    const [vendor] = await db.insert(schema.vendors).values(data).returning();
    return vendor;
  }

  // ==== PURCHASE ORDERS ====
  async listPurchaseOrders(tenantId: string, status?: string): Promise<any[]> {
    this.debug('listPurchaseOrders', tenantId, status);
    if (status) {
      return db.select().from(schema.purchaseOrders).where(and(eq(schema.purchaseOrders.tenantId, tenantId), eq(schema.purchaseOrders.status, status)));
    }
    return db.select().from(schema.purchaseOrders).where(eq(schema.purchaseOrders.tenantId, tenantId));
  }

  async createPurchaseOrder(data: any): Promise<any> {
    this.debug('createPurchaseOrder', data);
    const [po] = await db.insert(schema.purchaseOrders).values(data).returning();
    return po;
  }

  async updatePurchaseOrder(tenantId: string, poId: string, data: any): Promise<any> {
    this.debug('updatePurchaseOrder', tenantId, poId, data);
    const [po] = await db.update(schema.purchaseOrders)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(schema.purchaseOrders.tenantId, tenantId), eq(schema.purchaseOrders.id, poId)))
      .returning();
    return po;
  }

  // ==== EXPENSES ====
  async listExpenses(tenantId: string, status?: string, category?: string): Promise<any[]> {
    this.debug('listExpenses', tenantId, status, category);
    let conditions = [eq(schema.expenses.tenantId, tenantId)];
    if (status) conditions.push(eq(schema.expenses.status, status));
    if (category) conditions.push(eq(schema.expenses.category, category));
    return db.select().from(schema.expenses).where(and(...conditions));
  }

  async createExpense(data: any): Promise<any> {
    this.debug('createExpense', data);
    const [expense] = await db.insert(schema.expenses).values(data).returning();
    return expense;
  }

  async updateExpense(tenantId: string, expenseId: string, data: any): Promise<any> {
    this.debug('updateExpense', tenantId, expenseId, data);
    const [expense] = await db.update(schema.expenses)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(schema.expenses.tenantId, tenantId), eq(schema.expenses.id, expenseId)))
      .returning();
    return expense;
  }

  // ==== ASSETS ====
  async listAssets(tenantId: string, category?: string, status?: string): Promise<any[]> {
    this.debug('listAssets', tenantId, category, status);
    let conditions = [eq(schema.assets.tenantId, tenantId)];
    if (category) conditions.push(eq(schema.assets.category, category));
    if (status) conditions.push(eq(schema.assets.status, status));
    return db.select().from(schema.assets).where(and(...conditions));
  }

  async createAsset(data: any): Promise<any> {
    this.debug('createAsset', data);
    const [asset] = await db.insert(schema.assets).values(data).returning();
    return asset;
  }

  async updateAsset(tenantId: string, assetId: string, data: any): Promise<any> {
    this.debug('updateAsset', tenantId, assetId, data);
    const [asset] = await db.update(schema.assets)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(schema.assets.tenantId, tenantId), eq(schema.assets.id, assetId)))
      .returning();
    return asset;
  }

  async createAssetMaintenance(data: any): Promise<any> {
    this.debug('createAssetMaintenance', data);
    const [maintenance] = await db.insert(schema.assetMaintenance).values(data).returning();
    return maintenance;
  }

  // ==== BANK ACCOUNTS (TREASURY) ====
  async listBankAccounts(tenantId: string): Promise<any[]> {
    this.debug('listBankAccounts', tenantId);
    return db.select().from(schema.bankAccounts).where(eq(schema.bankAccounts.tenantId, tenantId));
  }

  async createBankAccount(data: any): Promise<any> {
    this.debug('createBankAccount', data);
    const [account] = await db.insert(schema.bankAccounts).values(data).returning();
    return account;
  }

  async listBankTransactions(tenantId: string, accountId: string): Promise<any[]> {
    this.debug('listBankTransactions', tenantId, accountId);
    return db.select().from(schema.bankTransactions).where(and(eq(schema.bankTransactions.tenantId, tenantId), eq(schema.bankTransactions.bankAccountId, accountId)));
  }

  async createBankTransaction(data: any): Promise<any> {
    this.debug('createBankTransaction', data);
    const [transaction] = await db.insert(schema.bankTransactions).values(data).returning();
    return transaction;
  }

  // ==== GENERAL LEDGER ====
  async listGeneralLedgerEntries(tenantId: string): Promise<any[]> {
    this.debug('listGeneralLedgerEntries', tenantId);
    return db.select().from(schema.generalLedgerEntries).where(eq(schema.generalLedgerEntries.tenantId, tenantId));
  }

  // ==== ACCOUNTS PAYABLE ====
  async listAccountsPayable(tenantId: string, status?: string): Promise<any[]> {
    this.debug('listAccountsPayable', tenantId, status);
    if (status) {
      return db.select().from(schema.accountsPayable).where(and(eq(schema.accountsPayable.tenantId, tenantId), eq(schema.accountsPayable.status, status)));
    }
    return db.select().from(schema.accountsPayable).where(eq(schema.accountsPayable.tenantId, tenantId));
  }

  async createAccountsPayable(data: any): Promise<any> {
    this.debug('createAccountsPayable', data);
    const [payable] = await db.insert(schema.accountsPayable).values(data).returning();
    return payable;
  }

  // ==== ACCOUNTS RECEIVABLE ====
  async listAccountsReceivable(tenantId: string, status?: string): Promise<any[]> {
    this.debug('listAccountsReceivable', tenantId, status);
    if (status) {
      return db.select().from(schema.accountsReceivable).where(and(eq(schema.accountsReceivable.tenantId, tenantId), eq(schema.accountsReceivable.status, status)));
    }
    return db.select().from(schema.accountsReceivable).where(eq(schema.accountsReceivable.tenantId, tenantId));
  }

  async createAccountsReceivable(data: any): Promise<any> {
    this.debug('createAccountsReceivable', data);
    const [receivable] = await db.insert(schema.accountsReceivable).values(data).returning();
    return receivable;
  }

  // ==== BUDGETS ====
  async listBudgets(tenantId: string, year?: number): Promise<any[]> {
    this.debug('listBudgets', tenantId, year);
    if (year) {
      return db.select().from(schema.budgets).where(and(eq(schema.budgets.tenantId, tenantId), eq(schema.budgets.budgetYear, year)));
    }
    return db.select().from(schema.budgets).where(eq(schema.budgets.tenantId, tenantId));
  }

  async createBudget(data: any): Promise<any> {
    this.debug('createBudget', data);
    const [budget] = await db.insert(schema.budgets).values(data).returning();
    return budget;
  }

  // ==== CASH FLOW ====
  async listCashFlowEntries(tenantId: string, category?: string): Promise<any[]> {
    this.debug('listCashFlowEntries', tenantId, category);
    if (category) {
      return db.select().from(schema.cashFlowEntries).where(and(eq(schema.cashFlowEntries.tenantId, tenantId), eq(schema.cashFlowEntries.category, category)));
    }
    return db.select().from(schema.cashFlowEntries).where(eq(schema.cashFlowEntries.tenantId, tenantId));
  }

  async createCashFlowEntry(data: any): Promise<any> {
    this.debug('createCashFlowEntry', data);
    const [entry] = await db.insert(schema.cashFlowEntries).values(data).returning();
    return entry;
  }

  // ==== AUDIT LOGS ====
  async listAuditLogs(tenantId: string, resourceType?: string): Promise<any[]> {
    this.debug('listAuditLogs', tenantId, resourceType);
    if (resourceType) {
      return db.select().from(schema.auditLogs).where(and(eq(schema.auditLogs.tenantId, tenantId), eq(schema.auditLogs.resourceType, resourceType)));
    }
    return db.select().from(schema.auditLogs).where(eq(schema.auditLogs.tenantId, tenantId));
  }
}