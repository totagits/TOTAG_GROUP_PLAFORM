import { pgTable, text, serial, integer, boolean, timestamp, numeric, varchar, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("employee"), // general_manager, wholesale_head, retail_head, inventory_manager, logistics_manager, sales_team, finance_hr, employee
  department: text("department"), // tgm, farm, management, operations, etc
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Human Resource Management Information System (HRMIS) Tables
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  tenantId: text("tenant_id").notNull(), // CRITICAL: Tenant scoping for multi-tenant security
  employeeId: text("employee_id").notNull().unique(), // TGM001, TGM002, etc
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  email: text("email"), // REMOVED global uniqueness - should be unique per tenant only
  phone: text("phone").notNull(),
  personalPhone: text("personal_phone"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  address: text("address"),
  city: text("city").notNull().default("Monrovia"),
  dateOfBirth: timestamp("date_of_birth"),
  nationalId: text("national_id").unique(),
  passportNumber: text("passport_number"),
  
  // Employment Details
  department: text("department").notNull(), // HR, Finance, Operations, Sales, Warehouse, Delivery, IT, Management
  position: text("position").notNull(),
  jobTitle: text("job_title").notNull(),
  employmentType: text("employment_type").notNull().default("full_time"), // full_time, part_time, contract, internship
  employmentStatus: text("employment_status").notNull().default("active"), // active, on_leave, suspended, terminated
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  
  // Salary & Benefits
  baseSalary: numeric("base_salary", { precision: 10, scale: 2 }).notNull(),
  allowances: numeric("allowances", { precision: 10, scale: 2 }).notNull().default("0"),
  overtimeRate: numeric("overtime_rate", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("LRD"),
  payFrequency: text("pay_frequency").notNull().default("monthly"), // weekly, bi_weekly, monthly
  
  // Additional Info
  education: text("education"),
  certifications: text("certifications"),
  skills: text("skills"),
  bankAccount: text("bank_account"),
  bankName: text("bank_name"),
  taxId: text("tax_id"),
  profilePhoto: text("profile_photo"),
  notes: text("notes"),
  
  // System
  managerId: integer("manager_id").references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantIdIdx: index("employee_tenant_id_idx").on(table.tenantId),
  employeeIdIdx: index("employee_id_idx").on(table.employeeId),
  departmentIdx: index("department_idx").on(table.department),
  statusIdx: index("employment_status_idx").on(table.employmentStatus),
  // CRITICAL: Tenant-scoped email uniqueness constraint for multi-tenant security
  tenantEmailUnique: uniqueIndex("employee_tenant_email_unique").on(table.tenantId, table.email),
}));

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  date: timestamp("date").notNull(),
  clockIn: timestamp("clock_in"),
  clockOut: timestamp("clock_out"),
  breakStart: timestamp("break_start"),
  breakEnd: timestamp("break_end"),
  hoursWorked: numeric("hours_worked", { precision: 4, scale: 2 }),
  overtimeHours: numeric("overtime_hours", { precision: 4, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("present"), // present, absent, late, half_day, sick_leave, vacation, holiday
  notes: text("notes"),
  location: text("location"), // office, warehouse, field, remote
  approvedBy: integer("approved_by").references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  employeeDateIdx: index("employee_date_idx").on(table.employeeId, table.date),
  dateIdx: index("attendance_date_idx").on(table.date),
}));

export const leaveRequests = pgTable("leave_requests", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  leaveType: text("leave_type").notNull(), // annual, sick, maternity, paternity, personal, emergency
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalDays: integer("total_days").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, cancelled
  appliedDate: timestamp("applied_date").defaultNow().notNull(),
  reviewedBy: integer("reviewed_by").references(() => employees.id),
  reviewedDate: timestamp("reviewed_date"),
  reviewComments: text("review_comments"),
  attachmentUrl: text("attachment_url"),
  emergencyContact: text("emergency_contact"),
  coveringEmployee: integer("covering_employee").references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  employeeIdx: index("leave_employee_idx").on(table.employeeId),
  statusIdx: index("leave_status_idx").on(table.status),
  dateRangeIdx: index("leave_date_range_idx").on(table.startDate, table.endDate),
}));

export const payroll = pgTable("payroll", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  payPeriodStart: timestamp("pay_period_start").notNull(),
  payPeriodEnd: timestamp("pay_period_end").notNull(),
  baseSalary: numeric("base_salary", { precision: 10, scale: 2 }).notNull(),
  allowances: numeric("allowances", { precision: 10, scale: 2 }).notNull().default("0"),
  overtimePay: numeric("overtime_pay", { precision: 10, scale: 2 }).notNull().default("0"),
  bonuses: numeric("bonuses", { precision: 10, scale: 2 }).notNull().default("0"),
  grossPay: numeric("gross_pay", { precision: 10, scale: 2 }).notNull(),
  
  // Deductions
  incomeTax: numeric("income_tax", { precision: 10, scale: 2 }).notNull().default("0"),
  socialSecurity: numeric("social_security", { precision: 10, scale: 2 }).notNull().default("0"),
  healthInsurance: numeric("health_insurance", { precision: 10, scale: 2 }).notNull().default("0"),
  otherDeductions: numeric("other_deductions", { precision: 10, scale: 2 }).notNull().default("0"),
  totalDeductions: numeric("total_deductions", { precision: 10, scale: 2 }).notNull(),
  netPay: numeric("net_pay", { precision: 10, scale: 2 }).notNull(),
  
  // Payment Info
  paymentDate: timestamp("payment_date"),
  paymentMethod: text("payment_method").notNull().default("bank_transfer"), // bank_transfer, cash, mobile_money
  paymentReference: text("payment_reference"),
  status: text("status").notNull().default("pending"), // pending, processed, paid, failed
  
  // Hours & Attendance
  regularHours: numeric("regular_hours", { precision: 4, scale: 2 }).notNull().default("0"),
  overtimeHours: numeric("overtime_hours", { precision: 4, scale: 2 }).notNull().default("0"),
  sickDays: integer("sick_days").notNull().default(0),
  vacationDays: integer("vacation_days").notNull().default(0),
  
  processedBy: integer("processed_by").references(() => employees.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  employeeIdx: index("payroll_employee_idx").on(table.employeeId),
  payPeriodIdx: index("payroll_period_idx").on(table.payPeriodStart, table.payPeriodEnd),
  statusIdx: index("payroll_status_idx").on(table.status),
}));

export const performanceReviews = pgTable("performance_reviews", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => employees.id).notNull(),
  reviewPeriod: text("review_period").notNull(), // Q1-2025, Annual-2025, etc
  reviewType: text("review_type").notNull().default("annual"), // annual, quarterly, probationary, project_based
  
  // Performance Metrics (1-5 scale)
  overallRating: integer("overall_rating"), // 1-5
  qualityOfWork: integer("quality_of_work"),
  productivity: integer("productivity"),
  teamwork: integer("teamwork"),
  communication: integer("communication"),
  punctuality: integer("punctuality"),
  leadership: integer("leadership"),
  problemSolving: integer("problem_solving"),
  
  // Text Feedback
  strengths: text("strengths"),
  areasForImprovement: text("areas_for_improvement"),
  goals: text("goals"),
  employeeComments: text("employee_comments"),
  managerComments: text("manager_comments"),
  developmentPlan: text("development_plan"),
  
  // Status & Dates
  status: text("status").notNull().default("draft"), // draft, submitted, reviewed, completed
  reviewDate: timestamp("review_date").notNull(),
  employeeSignedDate: timestamp("employee_signed_date"),
  managerSignedDate: timestamp("manager_signed_date"),
  
  // Follow-up
  nextReviewDate: timestamp("next_review_date"),
  salaryAdjustment: numeric("salary_adjustment", { precision: 10, scale: 2 }),
  promotionRecommended: boolean("promotion_recommended").notNull().default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  employeeIdx: index("review_employee_idx").on(table.employeeId),
  reviewerIdx: index("review_reviewer_idx").on(table.reviewerId),
  periodIdx: index("review_period_idx").on(table.reviewPeriod),
}));

// HR Support Requests for Self-Service Portal
export const hrRequests = pgTable("hr_requests", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  requestType: text("request_type").notNull(), // policy_inquiry, benefits_question, training_request, grievance, document_request, other
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, resolved, closed
  assignedTo: integer("assigned_to").references(() => employees.id),
  assignedDate: timestamp("assigned_date"),
  resolvedDate: timestamp("resolved_date"),
  resolution: text("resolution"),
  attachmentUrl: text("attachment_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  employeeIdx: index("hr_request_employee_idx").on(table.employeeId),
  statusIdx: index("hr_request_status_idx").on(table.status),
  typeIdx: index("hr_request_type_idx").on(table.requestType),
  priorityIdx: index("hr_request_priority_idx").on(table.priority),
}));

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  serviceInterest: text("service_interest"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new, contacted, resolved
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  fullDescription: text("full_description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  tags: text("tags").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// TOTAG FARM specific tables
export const livestock = pgTable("livestock", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // cattle, sheep, goats, pigs, chickens, etc
  breed: text("breed"),
  birthDate: timestamp("birth_date"),
  weight: numeric("weight", { precision: 10, scale: 2 }), // in kg
  gender: text("gender"), // male, female
  tagNumber: text("tag_number").unique(),
  status: text("status").notNull().default("active"), // active, sold, deceased
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  variety: text("variety"),
  plantingDate: timestamp("planting_date"),
  harvestDate: timestamp("harvest_date"),
  location: text("location"), // field location
  area: integer("area"), // in square meters
  status: text("status").notNull().default("planted"), // planted, growing, harvested
  yieldAmount: integer("yield_amount"), // in kg
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// E-commerce and Blockchain Tables
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  minStockLevel: integer("min_stock_level").notNull().default(10),
  imageUrl: text("image_url"),
  specifications: text("specifications"),
  status: text("status").notNull().default("active"), // active, inactive, out_of_stock
  isWholesale: boolean("is_wholesale").notNull().default(false),
  wholeSalePrice: numeric("wholesale_price", { precision: 10, scale: 2 }),
  supplierInfo: jsonb("supplier_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique(),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  country: text("country").notNull().default("Liberia"),
  isWholesalePartner: boolean("is_wholesale_partner").notNull().default(false),
  partnerCompany: text("partner_company"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  orderType: text("order_type").notNull().default("retail"), // retail, wholesale, in_store
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }).notNull().default("0"),
  deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"), // mtn_money, orange_money, cash, bank_transfer
  deliveryOption: text("delivery_option").notNull(), // tgm_delivery, pickup, partner_logistics, in_store_pickup
  deliveryAddress: text("delivery_address"),
  estimatedDelivery: timestamp("estimated_delivery"),
  notes: text("notes"),
  blockchainHash: text("blockchain_hash"), // For transparency tracking
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  paymentMethod: text("payment_method").notNull(), // mtn_money, orange_money, cash, bank_transfer
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed, cancelled
  transactionId: text("transaction_id"),
  phoneNumber: text("phone_number"), // For mobile money
  providerResponse: jsonb("provider_response"),
  blockchainHash: text("blockchain_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  deliveryMethod: text("delivery_method").notNull(), // tgm_delivery, pickup, partner_logistics
  status: text("status").notNull().default("pending"), // pending, in_transit, delivered, failed
  trackingNumber: text("tracking_number").unique(),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  vehicleInfo: text("vehicle_info"),
  currentLocation: text("current_location"),
  coordinates: jsonb("coordinates"), // {lat, lng}
  estimatedArrival: timestamp("estimated_arrival"),
  actualDelivery: timestamp("actual_delivery"),
  deliveryNotes: text("delivery_notes"),
  recipientSignature: text("recipient_signature"),
  blockchainHash: text("blockchain_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blockchainTransactions = pgTable("blockchain_transactions", {
  id: serial("id").primaryKey(),
  transactionType: text("transaction_type").notNull(), // order, payment, delivery, inventory_update
  referenceId: integer("reference_id").notNull(), // ID of related record
  hash: text("hash").notNull().unique(),
  previousHash: text("previous_hash"),
  data: jsonb("data").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  verificationStatus: text("verification_status").notNull().default("pending"), // pending, verified, failed
});

// Credit Management System
export const creditors = pgTable("creditors", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull(),
  productDetails: jsonb("product_details").notNull(), // Array of {name, quantity, unitPrice, totalPrice}
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  downPayment: numeric("down_payment", { precision: 10, scale: 2 }).notNull().default("0"),
  outstandingBalance: numeric("outstanding_balance", { precision: 10, scale: 2 }).notNull(),
  paymentTerms: text("payment_terms").notNull(), // weekly, bi_weekly, monthly, custom
  installmentAmount: numeric("installment_amount", { precision: 10, scale: 2 }),
  nextPaymentDate: timestamp("next_payment_date"),
  finalPaymentDate: timestamp("final_payment_date"),
  status: text("status").notNull().default("active"), // active, paid_off, overdue, suspended
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id), // Sales staff who created the credit
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const creditPayments = pgTable("credit_payments", {
  id: serial("id").primaryKey(),
  creditorId: integer("creditor_id").references(() => creditors.id).notNull(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  paymentAmount: numeric("payment_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // mtn_money, orange_money, bank_transfer, cash
  transactionId: text("transaction_id"),
  phoneNumber: text("phone_number"), // For mobile money
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  remainingBalance: numeric("remaining_balance", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("completed"), // completed, pending, failed
  notes: text("notes"),
  processedBy: integer("processed_by").references(() => users.id), // Staff who processed payment
  blockchainHash: text("blockchain_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shoppingCart = pgTable("shopping_cart", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // tractor, harvester, plow, etc
  model: text("model"),
  purchaseDate: timestamp("purchase_date"),
  condition: text("condition").notNull().default("good"), // excellent, good, fair, poor
  maintenanceDate: timestamp("maintenance_date"),
  status: text("status").notNull().default("available"), // available, in_use, maintenance
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const marketProducts = pgTable("market_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // vegetables, fruits, meat, dairy, grains
  price: integer("price").notNull(), // in cents
  unit: text("unit").notNull(), // kg, lbs, pieces, etc
  stock: integer("stock").notNull().default(0),
  isAvailable: boolean("is_available").notNull().default(true),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const marketOrders = pgTable("market_orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  totalAmount: integer("total_amount").notNull(), // in cents
  status: text("status").notNull().default("pending"), // pending, confirmed, shipped, delivered, cancelled
  orderDate: timestamp("order_date").defaultNow().notNull(),
  deliveryDate: timestamp("delivery_date"),
  notes: text("notes"),
});

export const marketOrderItems = pgTable("market_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(), // in cents
  totalPrice: integer("total_price").notNull(), // in cents
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // livestock, crops, equipment, general
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  assignedTo: integer("assigned_to"), // user id
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // feeding, treatment, planting, harvest, maintenance
  relatedTo: text("related_to"), // livestock, crops, equipment
  relatedId: integer("related_id"), // id of related item
  scheduledDate: timestamp("scheduled_date").notNull(),
  completedDate: timestamp("completed_date"),
  userId: integer("user_id"), // who performed the activity
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // feed, seeds, fertilizer, medicine, etc
  quantity: integer("quantity").notNull().default(0),
  unit: text("unit").notNull(), // kg, bags, liters, etc
  minThreshold: integer("min_threshold").default(0), // minimum stock alert
  supplier: text("supplier"),
  lastRestocked: timestamp("last_restocked"),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// TGM-specific tables for General Merchandise Operations
export const tgmWholesaleOrders = pgTable("tgm_wholesale_orders", {
  id: serial("id").primaryKey(),
  partnerCompany: text("partner_company").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  product: text("product").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }),
  totalValue: numeric("total_value", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  specialInstructions: text("special_instructions"),
  createdBy: integer("created_by").references(() => users.id),
  approvedBy: integer("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tgmRetailSales = pgTable("tgm_retail_sales", {
  id: serial("id").primaryKey(),
  outlet: text("outlet").notNull(),
  product: text("product").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }),
  totalValue: numeric("total_value", { precision: 10, scale: 2 }),
  saleDate: timestamp("sale_date").notNull(),
  cashier: text("cashier"),
  paymentMethod: text("payment_method").notNull().default("cash"), // cash, card, mobile_money
  receiptNumber: text("receipt_number"),
  recordedBy: integer("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tgmInventory = pgTable("tgm_inventory", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  productName: text("product_name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(0),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }),
  reorderLevel: integer("reorder_level").notNull().default(10),
  location: text("location"),
  status: text("status").notNull().default("active"), // active, discontinued, low_stock, out_of_stock
  lastUpdatedBy: integer("last_updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tgmSuppliers = pgTable("tgm_suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  category: text("category"), // food, construction, office, etc
  rating: numeric("rating", { precision: 3, scale: 1 }),
  totalOrders: integer("total_orders").notNull().default(0),
  totalValue: numeric("total_value", { precision: 12, scale: 2 }).notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tgmDeliveries = pgTable("tgm_deliveries", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => tgmWholesaleOrders.id),
  destination: text("destination").notNull(),
  region: text("region"), // liberia, sierra_leone, ghana, etc
  status: text("status").notNull().default("preparing"), // preparing, in_transit, delivered, failed
  driverName: text("driver_name"),
  vehicleNumber: text("vehicle_number"),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  trackingNotes: text("tracking_notes"),
  assignedBy: integer("assigned_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tgmActivityLogs = pgTable("tgm_activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(), // create, update, delete, approve, etc
  entity: text("entity").notNull(), // wholesale_order, retail_sale, inventory, etc
  entityId: text("entity_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const contactInquiriesRelations = relations(contactInquiries, ({ one }) => ({
  service: one(services, {
    fields: [contactInquiries.serviceInterest],
    references: [services.slug],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  inquiries: many(contactInquiries),
}));

// TOTAG FARM Relations
export const tasksRelations = relations(tasks, ({ one }) => ({
  assignedUser: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const marketOrdersRelations = relations(marketOrders, ({ many }) => ({
  items: many(marketOrderItems),
}));

export const marketOrderItemsRelations = relations(marketOrderItems, ({ one }) => ({
  order: one(marketOrders, {
    fields: [marketOrderItems.orderId],
    references: [marketOrders.id],
  }),
  product: one(marketProducts, {
    fields: [marketOrderItems.productId],
    references: [marketProducts.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  activities: many(activities),
  tgmWholesaleOrdersCreated: many(tgmWholesaleOrders, { relationName: "createdBy" }),
  tgmWholesaleOrdersApproved: many(tgmWholesaleOrders, { relationName: "approvedBy" }),
  tgmRetailSales: many(tgmRetailSales),
  tgmInventoryUpdates: many(tgmInventory),
  tgmSuppliers: many(tgmSuppliers),
  tgmDeliveries: many(tgmDeliveries),
  tgmActivityLogs: many(tgmActivityLogs),
}));

// TGM Relations
export const tgmWholesaleOrdersRelations = relations(tgmWholesaleOrders, ({ one, many }) => ({
  creator: one(users, {
    fields: [tgmWholesaleOrders.createdBy],
    references: [users.id],
    relationName: "createdBy"
  }),
  approver: one(users, {
    fields: [tgmWholesaleOrders.approvedBy],
    references: [users.id],
    relationName: "approvedBy"
  }),
  deliveries: many(tgmDeliveries),
}));

export const tgmRetailSalesRelations = relations(tgmRetailSales, ({ one }) => ({
  recorder: one(users, {
    fields: [tgmRetailSales.recordedBy],
    references: [users.id],
  }),
}));

export const tgmInventoryRelations = relations(tgmInventory, ({ one }) => ({
  lastUpdater: one(users, {
    fields: [tgmInventory.lastUpdatedBy],
    references: [users.id],
  }),
}));

export const tgmSuppliersRelations = relations(tgmSuppliers, ({ one }) => ({
  creator: one(users, {
    fields: [tgmSuppliers.createdBy],
    references: [users.id],
  }),
}));

export const tgmDeliveriesRelations = relations(tgmDeliveries, ({ one }) => ({
  order: one(tgmWholesaleOrders, {
    fields: [tgmDeliveries.orderId],
    references: [tgmWholesaleOrders.id],
  }),
  assigner: one(users, {
    fields: [tgmDeliveries.assignedBy],
    references: [users.id],
  }),
}));

export const tgmActivityLogsRelations = relations(tgmActivityLogs, ({ one }) => ({
  user: one(users, {
    fields: [tgmActivityLogs.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  department: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).pick({
  name: true,
  email: true,
  phone: true,
  company: true,
  serviceInterest: true,
  message: true,
});

export const insertProductSchema = createInsertSchema(products);
export const insertCustomerSchema = createInsertSchema(customers);
export const insertOrderSchema = createInsertSchema(orders);
export const insertPaymentSchema = createInsertSchema(payments);
export const insertDeliverySchema = createInsertSchema(deliveries);
export const insertCartItemSchema = createInsertSchema(shoppingCart);

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  slug: true,
  description: true,
  fullDescription: true,
  icon: true,
  color: true,
  tags: true,
  isActive: true,
});

// HRMIS Insert schemas
export const insertEmployeeSchema = createInsertSchema(employees);
export const insertPayrollSchema = createInsertSchema(payroll);
export const insertPerformanceReviewSchema = createInsertSchema(performanceReviews);

// HRMIS Type definitions
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Payroll = typeof payroll.$inferSelect;
export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
export type PerformanceReview = typeof performanceReviews.$inferSelect;
export type InsertPerformanceReview = z.infer<typeof insertPerformanceReviewSchema>;

// TOTAG FARM Insert schemas
export const insertLivestockSchema = createInsertSchema(livestock).pick({
  name: true,
  type: true,
  breed: true,
  birthDate: true,
  weight: true,
  gender: true,
  tagNumber: true,
  status: true,
  notes: true,
});

export const insertCropSchema = createInsertSchema(crops).pick({
  name: true,
  variety: true,
  plantingDate: true,
  harvestDate: true,
  location: true,
  area: true,
  status: true,
  yieldAmount: true,
  notes: true,
});

export const insertEquipmentSchema = createInsertSchema(equipment).pick({
  name: true,
  type: true,
  model: true,
  purchaseDate: true,
  condition: true,
  maintenanceDate: true,
  status: true,
  notes: true,
});

export const insertMarketProductSchema = createInsertSchema(marketProducts).pick({
  name: true,
  description: true,
  category: true,
  price: true,
  unit: true,
  stock: true,
  isAvailable: true,
  imageUrl: true,
});

export const insertMarketOrderSchema = createInsertSchema(marketOrders).pick({
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  totalAmount: true,
  status: true,
  deliveryDate: true,
  notes: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  category: true,
  priority: true,
  status: true,
  assignedTo: true,
  dueDate: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  title: true,
  description: true,
  type: true,
  relatedTo: true,
  relatedId: true,
  scheduledDate: true,
  userId: true,
  notes: true,
});

export const insertInventorySchema = createInsertSchema(inventory).pick({
  name: true,
  category: true,
  quantity: true,
  unit: true,
  minThreshold: true,
  supplier: true,
  lastRestocked: true,
  expiryDate: true,
});

// TGM Insert schemas
export const insertTgmWholesaleOrderSchema = createInsertSchema(tgmWholesaleOrders).pick({
  partnerCompany: true,
  contactPerson: true,
  email: true,
  phone: true,
  address: true,
  product: true,
  quantity: true,
  unitPrice: true,
  totalValue: true,
  specialInstructions: true,
  createdBy: true,
});

export const insertTgmRetailSaleSchema = createInsertSchema(tgmRetailSales).pick({
  outlet: true,
  product: true,
  quantity: true,
  unitPrice: true,
  totalValue: true,
  saleDate: true,
  cashier: true,
  paymentMethod: true,
  receiptNumber: true,
  recordedBy: true,
});

export const insertTgmInventorySchema = createInsertSchema(tgmInventory).pick({
  sku: true,
  productName: true,
  category: true,
  quantity: true,
  unitPrice: true,
  reorderLevel: true,
  location: true,
  status: true,
  lastUpdatedBy: true,
});

export const insertTgmSupplierSchema = createInsertSchema(tgmSuppliers).pick({
  name: true,
  email: true,
  phone: true,
  address: true,
  category: true,
  rating: true,
  createdBy: true,
});

export const insertTgmDeliverySchema = createInsertSchema(tgmDeliveries).pick({
  orderId: true,
  destination: true,
  region: true,
  status: true,
  driverName: true,
  vehicleNumber: true,
  estimatedDelivery: true,
  trackingNotes: true,
  assignedBy: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// TGM Types
export type InsertTgmWholesaleOrder = z.infer<typeof insertTgmWholesaleOrderSchema>;
export type TgmWholesaleOrder = typeof tgmWholesaleOrders.$inferSelect;
export type InsertTgmRetailSale = z.infer<typeof insertTgmRetailSaleSchema>;
export type TgmRetailSale = typeof tgmRetailSales.$inferSelect;
export type InsertTgmInventory = z.infer<typeof insertTgmInventorySchema>;
export type TgmInventory = typeof tgmInventory.$inferSelect;
export type InsertTgmSupplier = z.infer<typeof insertTgmSupplierSchema>;
export type TgmSupplier = typeof tgmSuppliers.$inferSelect;
export type InsertTgmDelivery = z.infer<typeof insertTgmDeliverySchema>;
export type TgmDelivery = typeof tgmDeliveries.$inferSelect;
export type TgmActivityLog = typeof tgmActivityLogs.$inferSelect;

// TOTAG FARM Types
export type InsertLivestock = z.infer<typeof insertLivestockSchema>;
export type Livestock = typeof livestock.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Crop = typeof crops.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;
export type InsertMarketProduct = z.infer<typeof insertMarketProductSchema>;
export type MarketProduct = typeof marketProducts.$inferSelect;
export type InsertMarketOrder = z.infer<typeof insertMarketOrderSchema>;
export type MarketOrder = typeof marketOrders.$inferSelect;
export type MarketOrderItem = typeof marketOrderItems.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Inventory = typeof inventory.$inferSelect;

// Content Management System tables for GM control
export const carouselSlides = pgTable("carousel_slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url").notNull(),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const websiteContent = pgTable("website_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(), // header, hero, about, company_info, etc.
  key: text("key").notNull(), // specific content identifier
  value: text("value").notNull(), // content value
  type: text("type").default("text"), // text, image, json, html
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email system for totaggroup.com domain
export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  toEmail: text("to_email").notNull(),
  fromEmail: text("from_email").notNull(),
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content").notNull().default(""),
  emailType: text("email_type").notNull(), // order_confirmation, contact_inquiry, notification, marketing
  status: text("status").notNull().default("pending"), // pending, sent, failed
  sentAt: timestamp("sent_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subsidiaryEmails = pgTable("subsidiary_emails", {
  id: serial("id").primaryKey(),
  subsidiaryId: text("subsidiary_id").notNull().unique(), // corporate, cargo, farm, petroleum, etc.
  subsidiaryName: text("subsidiary_name").notNull(),
  emailAddress: text("email_address").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: text("created_by"), // admin username who created it
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCarouselSlideSchema = createInsertSchema(carouselSlides);
export const insertWebsiteContentSchema = createInsertSchema(websiteContent);
export const insertEmailSchema = createInsertSchema(emails);
export const insertSubsidiaryEmailSchema = createInsertSchema(subsidiaryEmails);

export type CarouselSlide = typeof carouselSlides.$inferSelect;
export type InsertCarouselSlide = z.infer<typeof insertCarouselSlideSchema>;
export type WebsiteContent = typeof websiteContent.$inferSelect;
export type Email = typeof emails.$inferSelect;
export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type SubsidiaryEmail = typeof subsidiaryEmails.$inferSelect;
export type InsertSubsidiaryEmail = z.infer<typeof insertSubsidiaryEmailSchema>;

// E-commerce types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Delivery = typeof deliveries.$inferSelect;
export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
export type InsertWebsiteContent = z.infer<typeof insertWebsiteContentSchema>;

// Credit Management Insert schemas
export const insertCreditorSchema = createInsertSchema(creditors).pick({
  customerId: true,
  orderId: true,
  customerName: true,
  customerPhone: true,
  customerEmail: true,
  productDetails: true,
  totalAmount: true,
  downPayment: true,
  outstandingBalance: true,
  paymentTerms: true,
  installmentAmount: true,
  nextPaymentDate: true,
  finalPaymentDate: true,
  notes: true,
  createdBy: true,
});

export const insertCreditPaymentSchema = createInsertSchema(creditPayments).pick({
  creditorId: true,
  customerId: true,
  paymentAmount: true,
  paymentMethod: true,
  transactionId: true,
  phoneNumber: true,
  notes: true,
  processedBy: true,
});

// Credit Management Types
export type Creditor = typeof creditors.$inferSelect;
export type InsertCreditor = z.infer<typeof insertCreditorSchema>;
export type CreditPayment = typeof creditPayments.$inferSelect;
export type InsertCreditPayment = z.infer<typeof insertCreditPaymentSchema>;

// ==== ENTERPRISE SAAS MULTI-TENANT ARCHITECTURE ====

// Tenants/Organizations - Core multi-tenancy (TOTAG IT Services Customers)
export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // URL-friendly identifier
  domain: text("domain").unique(), // Custom domain (optional)
  logo: text("logo"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  address: text("address"),
  country: text("country").notNull().default("Liberia"),
  timezone: text("timezone").notNull().default("Africa/Monrovia"),
  currency: text("currency").notNull().default("LRD"),
  status: text("status").notNull().default("active"), // active, suspended, cancelled
  portalType: text("portal_type").default("none"), // none, hr, financial, combined
  subscriptionStatus: text("subscription_status").default("trial"), // trial, active, past_due, cancelled
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  stripeCustomerId: text("stripe_customer_id"), // Stripe customer ID for billing
  stripeSubscriptionId: text("stripe_subscription_id"), // Active Stripe subscription
  // Additional fields can be added later as needed
  onboardedAt: timestamp("onboarded_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("tenant_slug_idx").on(table.slug),
  statusIdx: index("tenant_status_idx").on(table.status),
}));

// Payment Transaction System for Liberian Payment Methods
export const paymentIntents = pgTable("payment_intents", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id),
  amount: integer("amount").notNull(), // Amount in cents (LRD/USD)
  currency: text("currency").notNull().default("LRD"), // LRD or USD
  paymentMethod: text("payment_method").notNull(), // mtn, orange, tipme, bank
  paymentDetails: jsonb("payment_details"), // Masked payment info (no PINs!)
  status: text("status").notNull().default("pending"), // pending, confirmed, failed, cancelled
  externalRef: text("external_ref"), // Gateway reference
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
}, (table) => ({
  tenantIdx: index("payment_intent_tenant_idx").on(table.tenantId),
  statusIdx: index("payment_intent_status_idx").on(table.status),
}));

// Available SaaS Modules
export const modules = pgTable("modules", {
  id: text("id").primaryKey(), // hr_core, hr_recruitment, fims_gl, etc.
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // HRMIS, FIMS
  features: text("features").array().notNull(), // Array of feature descriptions
  monthlyPrice: numeric("monthly_price", { precision: 10, scale: 2 }).notNull(),
  setupFee: numeric("setup_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index("module_category_idx").on(table.category),
  activeIdx: index("module_active_idx").on(table.isActive),
}));

// Tenant Subscriptions (Managed by TOTAG IT Services Billing)
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  status: text("status").notNull().default("active"), // active, suspended, cancelled, past_due
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  billingCycle: text("billing_cycle").notNull().default("monthly"), // monthly, annually
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("LRD"),
  paymentMethod: text("payment_method"), // stripe_card, mobile_money, bank_transfer
  lastPaymentDate: timestamp("last_payment_date"),
  nextPaymentDate: timestamp("next_payment_date").notNull(),
  gracePeriodEnds: timestamp("grace_period_ends"),
  // External billing system integration (TOTAG IT Services)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantIdx: index("subscription_tenant_idx").on(table.tenantId),
  statusIdx: index("subscription_status_idx").on(table.status),
  nextPaymentIdx: index("subscription_next_payment_idx").on(table.nextPaymentDate),
}));

// Tenant Module Subscriptions
export const tenantModules = pgTable("tenant_modules", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  moduleId: text("module_id").references(() => modules.id).notNull(),
  subscriptionId: text("subscription_id").references(() => subscriptions.id).notNull(),
  status: text("status").notNull().default("active"), // active, suspended
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  suspendedAt: timestamp("suspended_at"),
  monthlyPrice: numeric("monthly_price", { precision: 10, scale: 2 }).notNull(),
  setupFee: numeric("setup_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  tenantModuleIdx: index("tenant_module_idx").on(table.tenantId, table.moduleId),
  subscriptionIdx: index("tenant_module_subscription_idx").on(table.subscriptionId),
  statusIdx: index("tenant_module_status_idx").on(table.status),
}));

// SaaS Users (Multi-tenant aware with proper isolation)
export const saasUsers = pgTable("saas_users", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"), // admin, manager, user, viewer, msp_admin
  permissions: text("permissions").array().notNull().default([]), // Module-specific permissions
  isActive: boolean("is_active").notNull().default(true),
  isTenantAdmin: boolean("is_tenant_admin").notNull().default(false),
  mustChangePassword: boolean("must_change_password").notNull().default(false), // Force password change on next login
  lastLoginAt: timestamp("last_login_at"),
  emailVerifiedAt: timestamp("email_verified_at"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  invitedBy: text("invited_by"),
  invitedAt: timestamp("invited_at"),
  acceptedInviteAt: timestamp("accepted_invite_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Composite unique constraint: email must be unique per tenant
  emailTenantUnique: index("saas_user_email_tenant_unique").on(table.email, table.tenantId),
  tenantIdx: index("saas_user_tenant_idx").on(table.tenantId),
  roleIdx: index("saas_user_role_idx").on(table.role),
}));

// Subscription Invoices
export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  subscriptionId: text("subscription_id").references(() => subscriptions.id).notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, paid, overdue, cancelled
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("LRD"),
  issuedDate: timestamp("issued_date").defaultNow().notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  paymentMethod: text("payment_method"), // stripe, mobile_money, bank_transfer
  stripeInvoiceId: text("stripe_invoice_id").unique(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  tenantIdx: index("invoice_tenant_idx").on(table.tenantId),
  statusIdx: index("invoice_status_idx").on(table.status),
  dueDateIdx: index("invoice_due_date_idx").on(table.dueDate),
}));

// ==== FIMS (Financial Information Management System) MODULES ====

// Chart of Accounts
export const chartOfAccounts = pgTable("chart_of_accounts", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  accountCode: text("account_code").notNull(),
  accountName: text("account_name").notNull(),
  accountType: text("account_type").notNull(), // asset, liability, equity, revenue, expense
  parentAccountId: text("parent_account_id"),
  level: integer("level").notNull().default(1),
  isActive: boolean("is_active").notNull().default(true),
  isSystemAccount: boolean("is_system_account").notNull().default(false),
  description: text("description"),
  balanceType: text("balance_type").notNull(), // debit, credit
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantCodeIdx: index("coa_tenant_code_idx").on(table.tenantId, table.accountCode),
  typeIdx: index("coa_type_idx").on(table.accountType),
  parentIdx: index("coa_parent_idx").on(table.parentAccountId),
}));

// General Ledger Entries
export const generalLedgerEntries = pgTable("general_ledger_entries", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  journalId: text("journal_id").notNull(), // Groups related entries
  accountId: text("account_id").references(() => chartOfAccounts.id).notNull(),
  transactionDate: timestamp("transaction_date").notNull(),
  reference: text("reference").notNull(),
  description: text("description").notNull(),
  debitAmount: numeric("debit_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  creditAmount: numeric("credit_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("LRD"),
  exchangeRate: numeric("exchange_rate", { precision: 10, scale: 4 }).notNull().default("1"),
  baseDebitAmount: numeric("base_debit_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  baseCreditAmount: numeric("base_credit_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("draft"), // draft, posted, reversed
  reversalId: text("reversal_id"),
  createdBy: text("created_by").notNull(),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  tenantJournalIdx: index("gle_tenant_journal_idx").on(table.tenantId, table.journalId),
  accountIdx: index("gle_account_idx").on(table.accountId),
  dateIdx: index("gle_date_idx").on(table.transactionDate),
  statusIdx: index("gle_status_idx").on(table.status),
}));

// Accounts Payable
export const accountsPayable = pgTable("accounts_payable", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  vendorId: text("vendor_id").notNull(),
  vendorName: text("vendor_name").notNull(),
  invoiceNumber: text("invoice_number").notNull(),
  invoiceDate: timestamp("invoice_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  paidAmount: numeric("paid_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  outstandingAmount: numeric("outstanding_amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("LRD"),
  status: text("status").notNull().default("unpaid"), // unpaid, partial, paid, overdue
  paymentTerms: text("payment_terms"),
  description: text("description"),
  purchaseOrderNumber: text("purchase_order_number"),
  attachmentUrl: text("attachment_url"),
  glAccountId: text("gl_account_id").references(() => chartOfAccounts.id),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantVendorIdx: index("ap_tenant_vendor_idx").on(table.tenantId, table.vendorId),
  statusIdx: index("ap_status_idx").on(table.status),
  dueDateIdx: index("ap_due_date_idx").on(table.dueDate),
}));

// Accounts Receivable
export const accountsReceivable = pgTable("accounts_receivable", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  customerId: text("customer_id").notNull(),
  customerName: text("customer_name").notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  invoiceDate: timestamp("invoice_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  paidAmount: numeric("paid_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  outstandingAmount: numeric("outstanding_amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("LRD"),
  status: text("status").notNull().default("unpaid"), // unpaid, partial, paid, overdue
  paymentTerms: text("payment_terms"),
  description: text("description"),
  salesOrderNumber: text("sales_order_number"),
  glAccountId: text("gl_account_id").references(() => chartOfAccounts.id),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantCustomerIdx: index("ar_tenant_customer_idx").on(table.tenantId, table.customerId),
  statusIdx: index("ar_status_idx").on(table.status),
  dueDateIdx: index("ar_due_date_idx").on(table.dueDate),
}));

// Budget Management
export const budgets = pgTable("budgets", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  budgetYear: integer("budget_year").notNull(),
  budgetPeriod: text("budget_period").notNull(), // annual, quarterly, monthly
  status: text("status").notNull().default("draft"), // draft, approved, active, closed
  totalBudget: numeric("total_budget", { precision: 15, scale: 2 }).notNull(),
  actualSpent: numeric("actual_spent", { precision: 15, scale: 2 }).notNull().default("0"),
  remainingBudget: numeric("remaining_budget", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("LRD"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantYearIdx: index("budget_tenant_year_idx").on(table.tenantId, table.budgetYear),
  statusIdx: index("budget_status_idx").on(table.status),
}));

// Cash Flow Management
export const cashFlowEntries = pgTable("cash_flow_entries", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  entryDate: timestamp("entry_date").notNull(),
  category: text("category").notNull(), // operating, investing, financing
  subcategory: text("subcategory"),
  description: text("description").notNull(),
  inflow: numeric("inflow", { precision: 15, scale: 2 }).notNull().default("0"),
  outflow: numeric("outflow", { precision: 15, scale: 2 }).notNull().default("0"),
  netAmount: numeric("net_amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("LRD"),
  accountId: text("account_id").references(() => chartOfAccounts.id),
  reference: text("reference"),
  status: text("status").notNull().default("confirmed"), // draft, confirmed
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  tenantDateIdx: index("cf_tenant_date_idx").on(table.tenantId, table.entryDate),
  categoryIdx: index("cf_category_idx").on(table.category),
}));

// Audit Logs for Compliance
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(), // UUID
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  userId: text("user_id"),
  action: text("action").notNull(), // create, update, delete, login, logout
  resourceType: text("resource_type").notNull(), // employee, invoice, transaction
  resourceId: text("resource_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => ({
  tenantUserIdx: index("audit_tenant_user_idx").on(table.tenantId, table.userId),
  actionIdx: index("audit_action_idx").on(table.action),
  timestampIdx: index("audit_timestamp_idx").on(table.timestamp),
}));

// ==== ADDITIONAL HR MODULE TABLES ====

// Departments (Organizational Structure)
export const departments = pgTable("departments", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  parentId: text("parent_id"),
  managerId: text("manager_id"),
  headCount: integer("head_count").notNull().default(0),
  budgetAllocation: numeric("budget_allocation", { precision: 15, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantCodeIdx: index("dept_tenant_code_idx").on(table.tenantId, table.code),
}));

// Documents (Document Management)
export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // policy, contract, form, report, certificate
  fileUrl: text("file_url"),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size"),
  version: integer("version").notNull().default(1),
  status: text("status").notNull().default("active"), // draft, active, archived
  isPublic: boolean("is_public").notNull().default(false),
  departmentId: text("department_id"),
  employeeId: text("employee_id"),
  expiryDate: timestamp("expiry_date"),
  tags: text("tags"),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantCategoryIdx: index("doc_tenant_category_idx").on(table.tenantId, table.category),
}));

// Workflows (Workflow Automation)
export const workflows = pgTable("workflows", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // approval, onboarding, offboarding, leave, expense
  status: text("status").notNull().default("active"), // draft, active, paused, archived
  triggerType: text("trigger_type").notNull(), // manual, automatic, scheduled
  steps: jsonb("steps").notNull().default([]),
  conditions: jsonb("conditions"),
  notifications: jsonb("notifications"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantTypeIdx: index("wf_tenant_type_idx").on(table.tenantId, table.type),
}));

// Workflow Instances (Running Workflows)
export const workflowInstances = pgTable("workflow_instances", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  workflowId: text("workflow_id").references(() => workflows.id).notNull(),
  initiatedBy: text("initiated_by").notNull(),
  currentStep: integer("current_step").notNull().default(0),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, rejected, cancelled
  data: jsonb("data"),
  history: jsonb("history").notNull().default([]),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  tenantStatusIdx: index("wfi_tenant_status_idx").on(table.tenantId, table.status),
}));

// Applicants (Recruitment)
export const applicants = pgTable("applicants", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  resumeUrl: text("resume_url"),
  coverLetterUrl: text("cover_letter_url"),
  positionApplied: text("position_applied").notNull(),
  departmentId: text("department_id"),
  source: text("source"), // linkedin, indeed, referral, website
  status: text("status").notNull().default("new"), // new, screening, interview, offer, hired, rejected
  rating: integer("rating"), // 1-5
  notes: text("notes"),
  interviewDate: timestamp("interview_date"),
  offerAmount: numeric("offer_amount", { precision: 10, scale: 2 }),
  assignedRecruiter: text("assigned_recruiter"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantStatusIdx: index("app_tenant_status_idx").on(table.tenantId, table.status),
}));

// Training Programs
export const trainingPrograms = pgTable("training_programs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // technical, compliance, leadership, onboarding
  duration: integer("duration"), // in hours
  format: text("format").notNull(), // online, classroom, hybrid
  instructor: text("instructor"),
  maxParticipants: integer("max_participants"),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  isMandatory: boolean("is_mandatory").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  tenantCategoryIdx: index("tp_tenant_category_idx").on(table.tenantId, table.category),
}));

// Employee Training Records
export const employeeTraining = pgTable("employee_training", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  employeeId: text("employee_id").notNull(),
  programId: text("program_id").references(() => trainingPrograms.id).notNull(),
  status: text("status").notNull().default("enrolled"), // enrolled, in_progress, completed, failed
  enrollmentDate: timestamp("enrollment_date").defaultNow().notNull(),
  completionDate: timestamp("completion_date"),
  score: integer("score"),
  certificateUrl: text("certificate_url"),
  notes: text("notes"),
}, (table) => ({
  tenantEmployeeIdx: index("et_tenant_employee_idx").on(table.tenantId, table.employeeId),
}));

// ==== ADDITIONAL FIMS MODULE TABLES ====

// Vendors
export const vendors = pgTable("vendors", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country").notNull().default("Liberia"),
  taxId: text("tax_id"),
  bankAccount: text("bank_account"),
  bankName: text("bank_name"),
  paymentTerms: text("payment_terms").notNull().default("net30"),
  category: text("category"), // supplies, services, equipment
  rating: integer("rating"), // 1-5
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantCodeIdx: index("vendor_tenant_code_idx").on(table.tenantId, table.code),
}));

// Purchase Orders
export const purchaseOrders = pgTable("purchase_orders", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  poNumber: text("po_number").notNull(),
  vendorId: text("vendor_id").references(() => vendors.id).notNull(),
  orderDate: timestamp("order_date").notNull(),
  expectedDelivery: timestamp("expected_delivery"),
  status: text("status").notNull().default("draft"), // draft, pending_approval, approved, ordered, received, cancelled
  subtotal: numeric("subtotal", { precision: 15, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  shippingAmount: numeric("shipping_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  totalAmount: numeric("total_amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("LRD"),
  paymentTerms: text("payment_terms"),
  shippingAddress: text("shipping_address"),
  notes: text("notes"),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantPoIdx: index("po_tenant_number_idx").on(table.tenantId, table.poNumber),
  statusIdx: index("po_status_idx").on(table.status),
}));

// Purchase Order Items
export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: text("id").primaryKey(),
  purchaseOrderId: text("purchase_order_id").references(() => purchaseOrders.id).notNull(),
  itemDescription: text("item_description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 15, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 15, scale: 2 }).notNull(),
  unit: text("unit").notNull().default("each"),
  glAccountId: text("gl_account_id"),
  receivedQuantity: integer("received_quantity").notNull().default(0),
});

// Expenses
export const expenses = pgTable("expenses", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  expenseNumber: text("expense_number").notNull(),
  employeeId: text("employee_id").notNull(),
  category: text("category").notNull(), // travel, meals, supplies, entertainment, other
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("LRD"),
  expenseDate: timestamp("expense_date").notNull(),
  vendorName: text("vendor_name"),
  receiptUrl: text("receipt_url"),
  status: text("status").notNull().default("draft"), // draft, submitted, pending_approval, approved, rejected, reimbursed
  departmentId: text("department_id"),
  projectId: text("project_id"),
  glAccountId: text("gl_account_id"),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  reimbursedAt: timestamp("reimbursed_at"),
  paymentMethod: text("payment_method"), // cash, credit_card, personal_funds
  notes: text("notes"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantCategoryIdx: index("exp_tenant_category_idx").on(table.tenantId, table.category),
  statusIdx: index("exp_status_idx").on(table.status),
}));

// Assets (Asset Lifecycle Management)
export const assets = pgTable("assets", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  assetTag: text("asset_tag").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // equipment, furniture, vehicle, technology, other
  serialNumber: text("serial_number"),
  manufacturer: text("manufacturer"),
  model: text("model"),
  purchaseDate: timestamp("purchase_date"),
  purchasePrice: numeric("purchase_price", { precision: 15, scale: 2 }),
  currentValue: numeric("current_value", { precision: 15, scale: 2 }),
  depreciationRate: numeric("depreciation_rate", { precision: 5, scale: 2 }),
  usefulLife: integer("useful_life"), // in months
  status: text("status").notNull().default("active"), // active, maintenance, retired, disposed
  condition: text("condition").notNull().default("good"), // excellent, good, fair, poor
  location: text("location"),
  departmentId: text("department_id"),
  assignedTo: text("assigned_to"),
  warrantyExpiry: timestamp("warranty_expiry"),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantTagIdx: index("asset_tenant_tag_idx").on(table.tenantId, table.assetTag),
  categoryIdx: index("asset_category_idx").on(table.category),
  statusIdx: index("asset_status_idx").on(table.status),
}));

// Asset Maintenance Records
export const assetMaintenance = pgTable("asset_maintenance", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  assetId: text("asset_id").references(() => assets.id).notNull(),
  maintenanceType: text("maintenance_type").notNull(), // preventive, corrective, emergency
  description: text("description").notNull(),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  cost: numeric("cost", { precision: 15, scale: 2 }),
  vendor: text("vendor"),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled
  performedBy: text("performed_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  tenantAssetIdx: index("am_tenant_asset_idx").on(table.tenantId, table.assetId),
}));

// Bank Accounts (Treasury Management)
export const bankAccounts = pgTable("bank_accounts", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  accountName: text("account_name").notNull(),
  accountNumber: text("account_number").notNull(),
  bankName: text("bank_name").notNull(),
  bankBranch: text("bank_branch"),
  accountType: text("account_type").notNull(), // checking, savings, money_market
  currency: text("currency").notNull().default("LRD"),
  currentBalance: numeric("current_balance", { precision: 15, scale: 2 }).notNull().default("0"),
  availableBalance: numeric("available_balance", { precision: 15, scale: 2 }).notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  isPrimary: boolean("is_primary").notNull().default(false),
  glAccountId: text("gl_account_id"),
  lastReconciled: timestamp("last_reconciled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tenantAccountIdx: index("ba_tenant_account_idx").on(table.tenantId, table.accountNumber),
}));

// Bank Transactions
export const bankTransactions = pgTable("bank_transactions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  bankAccountId: text("bank_account_id").references(() => bankAccounts.id).notNull(),
  transactionDate: timestamp("transaction_date").notNull(),
  type: text("type").notNull(), // deposit, withdrawal, transfer, fee
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  runningBalance: numeric("running_balance", { precision: 15, scale: 2 }),
  reference: text("reference"),
  category: text("category"),
  isReconciled: boolean("is_reconciled").notNull().default(false),
  reconciledAt: timestamp("reconciled_at"),
  glEntryId: text("gl_entry_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  tenantDateIdx: index("bt_tenant_date_idx").on(table.tenantId, table.transactionDate),
}));

// SaaS Insert Schemas and Types
export const insertTenantSchema = createInsertSchema(tenants);
export const insertModuleSchema = createInsertSchema(modules);
export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const insertTenantModuleSchema = createInsertSchema(tenantModules);
export const insertSaasUserSchema = createInsertSchema(saasUsers);
export const insertInvoiceSchema = createInsertSchema(invoices);
export const insertChartOfAccountsSchema = createInsertSchema(chartOfAccounts);
export const insertGeneralLedgerEntrySchema = createInsertSchema(generalLedgerEntries);
export const insertAccountsPayableSchema = createInsertSchema(accountsPayable);
export const insertAccountsReceivableSchema = createInsertSchema(accountsReceivable);
export const insertBudgetSchema = createInsertSchema(budgets);
export const insertCashFlowEntrySchema = createInsertSchema(cashFlowEntries);
export const insertAuditLogSchema = createInsertSchema(auditLogs);
export const insertPaymentIntentSchema = createInsertSchema(paymentIntents);
export const insertDepartmentSchema = createInsertSchema(departments);
export const insertDocumentSchema = createInsertSchema(documents);
export const insertWorkflowSchema = createInsertSchema(workflows);
export const insertWorkflowInstanceSchema = createInsertSchema(workflowInstances);
export const insertApplicantSchema = createInsertSchema(applicants);
export const insertTrainingProgramSchema = createInsertSchema(trainingPrograms);
export const insertEmployeeTrainingSchema = createInsertSchema(employeeTraining);
export const insertVendorSchema = createInsertSchema(vendors);
export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders);
export const insertPurchaseOrderItemSchema = createInsertSchema(purchaseOrderItems);
export const insertExpenseSchema = createInsertSchema(expenses);
export const insertAssetSchema = createInsertSchema(assets);
export const insertAssetMaintenanceSchema = createInsertSchema(assetMaintenance);
export const insertBankAccountSchema = createInsertSchema(bankAccounts);
export const insertBankTransactionSchema = createInsertSchema(bankTransactions);

// Self-Service Insert Schemas for HRMIS 
export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({ id: true, appliedDate: true, createdAt: true });
export const insertHrRequestSchema = createInsertSchema(hrRequests).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true, createdAt: true });

// Self-Service Types
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type HrRequest = typeof hrRequests.$inferSelect;
export type InsertHrRequest = z.infer<typeof insertHrRequestSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

// ===== CATERING OPERATIONS MANAGEMENT SYSTEM =====

export const cateringStaff = pgTable("catering_staff", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull(), // account_manager, operations_supervisor, head_chef, food_safety_supervisor, team_lead, logistics_coordinator
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cateringRequests = pgTable("catering_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  eventType: text("event_type").notNull(), // conference, workshop, corporate, wedding, social, emergency
  eventDate: text("event_date"),
  guestCount: integer("guest_count"),
  venue: text("venue"),
  services: text("services").array(),
  budget: text("budget"),
  dietaryRequirements: text("dietary_requirements"),
  details: text("details"),
  durationDays: integer("duration_days").default(1),
  status: text("status").notNull().default("new"), // new, reviewing, quoted, confirmed, in_progress, completed, closed
  assignedTo: integer("assigned_to").references(() => cateringStaff.id),
  quotationAmount: text("quotation_amount"),
  quotationNotes: text("quotation_notes"),
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("catering_req_status_idx").on(table.status),
  assignedIdx: index("catering_req_assigned_idx").on(table.assignedTo),
}));

export const cateringEvents = pgTable("catering_events", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => cateringRequests.id),
  title: text("title").notNull(),
  eventDate: text("event_date").notNull(),
  venue: text("venue").notNull(),
  guestCount: integer("guest_count").notNull(),
  menuPlan: text("menu_plan"),
  setupPlan: text("setup_plan"),
  staffRoster: text("staff_roster"),
  equipmentList: text("equipment_list"),
  transportPlan: text("transport_plan"),
  status: text("status").notNull().default("planning"), // planning, ready, live, completed, cancelled
  opsNotes: text("ops_notes"),
  createdBy: integer("created_by").references(() => cateringStaff.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("catering_event_status_idx").on(table.status),
  requestIdx: index("catering_event_request_idx").on(table.requestId),
}));

export const cateringTasks = pgTable("catering_tasks", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => cateringEvents.id),
  role: text("role").notNull(), // account_manager, operations_supervisor, head_chef, food_safety_supervisor, team_lead, logistics_coordinator
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("open"), // open, in_progress, done
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  dueDate: text("due_date"),
  assignedTo: integer("assigned_to").references(() => cateringStaff.id),
  completedAt: timestamp("completed_at"),
  createdBy: integer("created_by").references(() => cateringStaff.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  roleIdx: index("catering_task_role_idx").on(table.role),
  statusIdx: index("catering_task_status_idx").on(table.status),
  eventIdx: index("catering_task_event_idx").on(table.eventId),
}));

export const cateringIncidents = pgTable("catering_incidents", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => cateringEvents.id),
  reportedBy: integer("reported_by").references(() => cateringStaff.id),
  type: text("type").notNull(), // food_safety, hygiene, equipment, staff, client_complaint, other
  severity: text("severity").notNull().default("low"), // low, medium, high, critical
  description: text("description").notNull(),
  actionTaken: text("action_taken"),
  status: text("status").notNull().default("open"), // open, investigating, resolved, closed
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  eventIdx: index("catering_incident_event_idx").on(table.eventId),
  statusIdx: index("catering_incident_status_idx").on(table.status),
}));

export const cateringQuotations = pgTable("catering_quotations", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => cateringRequests.id).notNull(),
  quotationNumber: text("quotation_number").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  clientCompany: text("client_company"),
  eventType: text("event_type").notNull(),
  eventDate: text("event_date"),
  venue: text("venue"),
  guestCount: integer("guest_count"),
  lineItems: jsonb("line_items").notNull().default('[]'),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  discount: numeric("discount", { precision: 12, scale: 2 }).notNull().default("0"),
  discountType: text("discount_type").notNull().default("fixed"),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  validUntil: text("valid_until"),
  paymentTerms: text("payment_terms"),
  termsAndConditions: text("terms_and_conditions"),
  notes: text("notes"),
  coverNote: text("cover_note"),
  isRevision: integer("is_revision").default(0),
  status: text("status").notNull().default("draft"),
  createdBy: integer("created_by").references(() => cateringStaff.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  requestIdx: index("catering_quot_request_idx").on(table.requestId),
  statusIdx: index("catering_quot_status_idx").on(table.status),
}));

export const insertCateringStaffSchema = createInsertSchema(cateringStaff).omit({ id: true, createdAt: true });
export const insertCateringRequestSchema = createInsertSchema(cateringRequests).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCateringEventSchema = createInsertSchema(cateringEvents).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCateringTaskSchema = createInsertSchema(cateringTasks).omit({ id: true, createdAt: true });
export const insertCateringIncidentSchema = createInsertSchema(cateringIncidents).omit({ id: true, createdAt: true });
export const insertCateringQuotationSchema = createInsertSchema(cateringQuotations).omit({ id: true, createdAt: true, updatedAt: true });

export type CateringStaff = typeof cateringStaff.$inferSelect;
export type InsertCateringStaff = z.infer<typeof insertCateringStaffSchema>;
export type CateringRequest = typeof cateringRequests.$inferSelect;
export type InsertCateringRequest = z.infer<typeof insertCateringRequestSchema>;
export type CateringEvent = typeof cateringEvents.$inferSelect;
export type InsertCateringEvent = z.infer<typeof insertCateringEventSchema>;
export type CateringTask = typeof cateringTasks.$inferSelect;
export type InsertCateringTask = z.infer<typeof insertCateringTaskSchema>;
export type CateringIncident = typeof cateringIncidents.$inferSelect;
export type InsertCateringIncident = z.infer<typeof insertCateringIncidentSchema>;
export type CateringQuotation = typeof cateringQuotations.$inferSelect;
export type InsertCateringQuotation = z.infer<typeof insertCateringQuotationSchema>;

// SaaS Types
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type TenantModule = typeof tenantModules.$inferSelect;
export type InsertTenantModule = z.infer<typeof insertTenantModuleSchema>;
export type SaasUser = typeof saasUsers.$inferSelect;
export type InsertSaasUser = z.infer<typeof insertSaasUserSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type ChartOfAccount = typeof chartOfAccounts.$inferSelect;
export type InsertChartOfAccount = z.infer<typeof insertChartOfAccountsSchema>;
export type GeneralLedgerEntry = typeof generalLedgerEntries.$inferSelect;
export type InsertGeneralLedgerEntry = z.infer<typeof insertGeneralLedgerEntrySchema>;
export type AccountsPayable = typeof accountsPayable.$inferSelect;
export type InsertAccountsPayable = z.infer<typeof insertAccountsPayableSchema>;
export type AccountsReceivable = typeof accountsReceivable.$inferSelect;
export type InsertAccountsReceivable = z.infer<typeof insertAccountsReceivableSchema>;
export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type CashFlowEntry = typeof cashFlowEntries.$inferSelect;
export type InsertCashFlowEntry = z.infer<typeof insertCashFlowEntrySchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type PaymentIntent = typeof paymentIntents.$inferSelect;
export type InsertPaymentIntent = z.infer<typeof insertPaymentIntentSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type WorkflowInstance = typeof workflowInstances.$inferSelect;
export type InsertWorkflowInstance = z.infer<typeof insertWorkflowInstanceSchema>;
export type Applicant = typeof applicants.$inferSelect;
export type InsertApplicant = z.infer<typeof insertApplicantSchema>;
export type TrainingProgram = typeof trainingPrograms.$inferSelect;
export type InsertTrainingProgram = z.infer<typeof insertTrainingProgramSchema>;
export type EmployeeTrainingRecord = typeof employeeTraining.$inferSelect;
export type InsertEmployeeTraining = z.infer<typeof insertEmployeeTrainingSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type InsertPurchaseOrderItem = z.infer<typeof insertPurchaseOrderItemSchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type AssetMaintenanceRecord = typeof assetMaintenance.$inferSelect;
export type InsertAssetMaintenance = z.infer<typeof insertAssetMaintenanceSchema>;
export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;
export type BankTransaction = typeof bankTransactions.$inferSelect;
export type InsertBankTransaction = z.infer<typeof insertBankTransactionSchema>;
