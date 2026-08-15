CREATE TABLE "accounts_payable" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"vendor_id" text NOT NULL,
	"vendor_name" text NOT NULL,
	"invoice_number" text NOT NULL,
	"invoice_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"paid_amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"outstanding_amount" numeric(15, 2) NOT NULL,
	"currency" text DEFAULT 'LRD' NOT NULL,
	"status" text DEFAULT 'unpaid' NOT NULL,
	"payment_terms" text,
	"description" text,
	"purchase_order_number" text,
	"attachment_url" text,
	"gl_account_id" text,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts_receivable" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"customer_name" text NOT NULL,
	"invoice_number" text NOT NULL,
	"invoice_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"paid_amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"outstanding_amount" numeric(15, 2) NOT NULL,
	"currency" text DEFAULT 'LRD' NOT NULL,
	"status" text DEFAULT 'unpaid' NOT NULL,
	"payment_terms" text,
	"description" text,
	"sales_order_number" text,
	"gl_account_id" text,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_receivable_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"related_to" text,
	"related_id" integer,
	"scheduled_date" timestamp NOT NULL,
	"completed_date" timestamp,
	"user_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"clock_in" timestamp,
	"clock_out" timestamp,
	"break_start" timestamp,
	"break_end" timestamp,
	"hours_worked" numeric(4, 2),
	"overtime_hours" numeric(4, 2) DEFAULT '0' NOT NULL,
	"status" text DEFAULT 'present' NOT NULL,
	"notes" text,
	"location" text,
	"approved_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"user_id" text,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" text,
	"user_agent" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blockchain_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_type" text NOT NULL,
	"reference_id" integer NOT NULL,
	"hash" text NOT NULL,
	"previous_hash" text,
	"data" jsonb NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"verification_status" text DEFAULT 'pending' NOT NULL,
	CONSTRAINT "blockchain_transactions_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"budget_year" integer NOT NULL,
	"budget_period" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"total_budget" numeric(15, 2) NOT NULL,
	"actual_spent" numeric(15, 2) DEFAULT '0' NOT NULL,
	"remaining_budget" numeric(15, 2) NOT NULL,
	"currency" text DEFAULT 'LRD' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"approved_by" text,
	"approved_at" timestamp,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carousel_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"image_url" text NOT NULL,
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cash_flow_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"entry_date" timestamp NOT NULL,
	"category" text NOT NULL,
	"subcategory" text,
	"description" text NOT NULL,
	"inflow" numeric(15, 2) DEFAULT '0' NOT NULL,
	"outflow" numeric(15, 2) DEFAULT '0' NOT NULL,
	"net_amount" numeric(15, 2) NOT NULL,
	"currency" text DEFAULT 'LRD' NOT NULL,
	"account_id" text,
	"reference" text,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chart_of_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"account_code" text NOT NULL,
	"account_name" text NOT NULL,
	"account_type" text NOT NULL,
	"parent_account_id" text,
	"level" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_system_account" boolean DEFAULT false NOT NULL,
	"description" text,
	"balance_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"service_interest" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"creditor_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"payment_amount" numeric(10, 2) NOT NULL,
	"payment_method" text NOT NULL,
	"transaction_id" text,
	"phone_number" text,
	"payment_date" timestamp DEFAULT now() NOT NULL,
	"remaining_balance" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"notes" text,
	"processed_by" integer,
	"blockchain_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creditors" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"order_id" integer NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text NOT NULL,
	"product_details" jsonb NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"down_payment" numeric(10, 2) DEFAULT '0' NOT NULL,
	"outstanding_balance" numeric(10, 2) NOT NULL,
	"payment_terms" text NOT NULL,
	"installment_amount" numeric(10, 2),
	"next_payment_date" timestamp,
	"final_payment_date" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crops" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"variety" text,
	"planting_date" timestamp,
	"harvest_date" timestamp,
	"location" text,
	"area" integer,
	"status" text DEFAULT 'planted' NOT NULL,
	"yield_amount" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text NOT NULL,
	"address" text,
	"city" text,
	"country" text DEFAULT 'Liberia' NOT NULL,
	"is_wholesale_partner" boolean DEFAULT false NOT NULL,
	"partner_company" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"delivery_method" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"tracking_number" text,
	"driver_name" text,
	"driver_phone" text,
	"vehicle_info" text,
	"current_location" text,
	"coordinates" jsonb,
	"estimated_arrival" timestamp,
	"actual_delivery" timestamp,
	"delivery_notes" text,
	"recipient_signature" text,
	"blockchain_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "deliveries_tracking_number_unique" UNIQUE("tracking_number")
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"to_email" text NOT NULL,
	"from_email" text NOT NULL,
	"subject" text NOT NULL,
	"html_content" text NOT NULL,
	"text_content" text DEFAULT '' NOT NULL,
	"email_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"employee_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"middle_name" text,
	"email" text,
	"phone" text NOT NULL,
	"personal_phone" text,
	"emergency_contact" text,
	"emergency_phone" text,
	"address" text,
	"city" text DEFAULT 'Monrovia' NOT NULL,
	"date_of_birth" timestamp,
	"national_id" text,
	"passport_number" text,
	"department" text NOT NULL,
	"position" text NOT NULL,
	"job_title" text NOT NULL,
	"employment_type" text DEFAULT 'full_time' NOT NULL,
	"employment_status" text DEFAULT 'active' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"base_salary" numeric(10, 2) NOT NULL,
	"allowances" numeric(10, 2) DEFAULT '0' NOT NULL,
	"overtime_rate" numeric(10, 2) DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'LRD' NOT NULL,
	"pay_frequency" text DEFAULT 'monthly' NOT NULL,
	"education" text,
	"certifications" text,
	"skills" text,
	"bank_account" text,
	"bank_name" text,
	"tax_id" text,
	"profile_photo" text,
	"notes" text,
	"manager_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employees_employee_id_unique" UNIQUE("employee_id"),
	CONSTRAINT "employees_national_id_unique" UNIQUE("national_id")
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"model" text,
	"purchase_date" timestamp,
	"condition" text DEFAULT 'good' NOT NULL,
	"maintenance_date" timestamp,
	"status" text DEFAULT 'available' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "general_ledger_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"journal_id" text NOT NULL,
	"account_id" text NOT NULL,
	"transaction_date" timestamp NOT NULL,
	"reference" text NOT NULL,
	"description" text NOT NULL,
	"debit_amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"credit_amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'LRD' NOT NULL,
	"exchange_rate" numeric(10, 4) DEFAULT '1' NOT NULL,
	"base_debit_amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"base_credit_amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"reversal_id" text,
	"created_by" text NOT NULL,
	"approved_by" text,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hr_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"request_type" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"subject" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"assigned_to" integer,
	"assigned_date" timestamp,
	"resolved_date" timestamp,
	"resolution" text,
	"attachment_url" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"unit" text NOT NULL,
	"min_threshold" integer DEFAULT 0,
	"supplier" text,
	"last_restocked" timestamp,
	"expiry_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	"invoice_number" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'LRD' NOT NULL,
	"issued_date" timestamp DEFAULT now() NOT NULL,
	"due_date" timestamp NOT NULL,
	"paid_date" timestamp,
	"payment_method" text,
	"stripe_invoice_id" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number"),
	CONSTRAINT "invoices_stripe_invoice_id_unique" UNIQUE("stripe_invoice_id")
);
--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"leave_type" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"total_days" integer NOT NULL,
	"reason" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"applied_date" timestamp DEFAULT now() NOT NULL,
	"reviewed_by" integer,
	"reviewed_date" timestamp,
	"review_comments" text,
	"attachment_url" text,
	"emergency_contact" text,
	"covering_employee" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "livestock" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"breed" text,
	"birth_date" timestamp,
	"weight" numeric(10, 2),
	"gender" text,
	"tag_number" text,
	"status" text DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "livestock_tag_number_unique" UNIQUE("tag_number")
);
--> statement-breakpoint
CREATE TABLE "market_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" integer NOT NULL,
	"total_price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text,
	"total_amount" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"order_date" timestamp DEFAULT now() NOT NULL,
	"delivery_date" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "market_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"price" integer NOT NULL,
	"unit" text NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"features" text[] NOT NULL,
	"monthly_price" numeric(10, 2) NOT NULL,
	"setup_fee" numeric(10, 2) DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"customer_name" text,
	"customer_phone" text,
	"customer_email" text,
	"order_number" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"order_type" text DEFAULT 'retail' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) DEFAULT '0' NOT NULL,
	"delivery_fee" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"payment_method" text,
	"delivery_option" text NOT NULL,
	"delivery_address" text,
	"estimated_delivery" timestamp,
	"notes" text,
	"blockchain_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"payment_method" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"transaction_id" text,
	"phone_number" text,
	"provider_response" jsonb,
	"blockchain_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"pay_period_start" timestamp NOT NULL,
	"pay_period_end" timestamp NOT NULL,
	"base_salary" numeric(10, 2) NOT NULL,
	"allowances" numeric(10, 2) DEFAULT '0' NOT NULL,
	"overtime_pay" numeric(10, 2) DEFAULT '0' NOT NULL,
	"bonuses" numeric(10, 2) DEFAULT '0' NOT NULL,
	"gross_pay" numeric(10, 2) NOT NULL,
	"income_tax" numeric(10, 2) DEFAULT '0' NOT NULL,
	"social_security" numeric(10, 2) DEFAULT '0' NOT NULL,
	"health_insurance" numeric(10, 2) DEFAULT '0' NOT NULL,
	"other_deductions" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total_deductions" numeric(10, 2) NOT NULL,
	"net_pay" numeric(10, 2) NOT NULL,
	"payment_date" timestamp,
	"payment_method" text DEFAULT 'bank_transfer' NOT NULL,
	"payment_reference" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"regular_hours" numeric(4, 2) DEFAULT '0' NOT NULL,
	"overtime_hours" numeric(4, 2) DEFAULT '0' NOT NULL,
	"sick_days" integer DEFAULT 0 NOT NULL,
	"vacation_days" integer DEFAULT 0 NOT NULL,
	"processed_by" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "performance_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"reviewer_id" integer NOT NULL,
	"review_period" text NOT NULL,
	"review_type" text DEFAULT 'annual' NOT NULL,
	"overall_rating" integer,
	"quality_of_work" integer,
	"productivity" integer,
	"teamwork" integer,
	"communication" integer,
	"punctuality" integer,
	"leadership" integer,
	"problem_solving" integer,
	"strengths" text,
	"areas_for_improvement" text,
	"goals" text,
	"employee_comments" text,
	"manager_comments" text,
	"development_plan" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"review_date" timestamp NOT NULL,
	"employee_signed_date" timestamp,
	"manager_signed_date" timestamp,
	"next_review_date" timestamp,
	"salary_adjustment" numeric(10, 2),
	"promotion_recommended" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"min_stock_level" integer DEFAULT 10 NOT NULL,
	"image_url" text,
	"specifications" text,
	"status" text DEFAULT 'active' NOT NULL,
	"is_wholesale" boolean DEFAULT false NOT NULL,
	"wholesale_price" numeric(10, 2),
	"supplier_info" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "saas_users" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"avatar" text,
	"role" text DEFAULT 'user' NOT NULL,
	"permissions" text[] DEFAULT '{}' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_tenant_admin" boolean DEFAULT false NOT NULL,
	"msp_managed" boolean DEFAULT false NOT NULL,
	"must_change_password" boolean DEFAULT false NOT NULL,
	"last_login_at" timestamp,
	"email_verified_at" timestamp,
	"password_reset_token" text,
	"password_reset_expires" timestamp,
	"invited_by" text,
	"invited_at" timestamp,
	"accepted_invite_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"full_description" text,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"tags" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "shopping_cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"billing_cycle" text DEFAULT 'monthly' NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'LRD' NOT NULL,
	"payment_method" text,
	"last_payment_date" timestamp,
	"next_payment_date" timestamp NOT NULL,
	"grace_period_ends" timestamp,
	"external_subscription_id" text,
	"external_provider" text DEFAULT 'totag_billing' NOT NULL,
	"billing_account_id" text,
	"managed_by_external" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_external_subscription_id_unique" UNIQUE("external_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "subsidiary_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"subsidiary_id" text NOT NULL,
	"subsidiary_name" text NOT NULL,
	"email_address" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subsidiary_emails_subsidiary_id_unique" UNIQUE("subsidiary_id"),
	CONSTRAINT "subsidiary_emails_email_address_unique" UNIQUE("email_address")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"assigned_to" integer,
	"due_date" timestamp,
	"completed_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_modules" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"module_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"suspended_at" timestamp,
	"monthly_price" numeric(10, 2) NOT NULL,
	"setup_fee" numeric(10, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"domain" text,
	"logo" text,
	"contact_email" text NOT NULL,
	"contact_phone" text,
	"address" text,
	"country" text DEFAULT 'Liberia' NOT NULL,
	"timezone" text DEFAULT 'Africa/Monrovia' NOT NULL,
	"currency" text DEFAULT 'LRD' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"provisioning_source" text DEFAULT 'totag_it_services' NOT NULL,
	"sla_tier" text DEFAULT 'standard' NOT NULL,
	"account_manager_id" text,
	"parent_tenant_id" text,
	"onboarded_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug"),
	CONSTRAINT "tenants_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "tgm_activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"details" text,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tgm_deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"destination" text NOT NULL,
	"region" text,
	"status" text DEFAULT 'preparing' NOT NULL,
	"driver_name" text,
	"vehicle_number" text,
	"estimated_delivery" timestamp,
	"actual_delivery" timestamp,
	"tracking_notes" text,
	"assigned_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tgm_inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"product_name" text NOT NULL,
	"category" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"unit_price" numeric(10, 2),
	"reorder_level" integer DEFAULT 10 NOT NULL,
	"location" text,
	"status" text DEFAULT 'active' NOT NULL,
	"last_updated_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tgm_inventory_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "tgm_retail_sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"outlet" text NOT NULL,
	"product" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2),
	"total_value" numeric(10, 2),
	"sale_date" timestamp NOT NULL,
	"cashier" text,
	"payment_method" text DEFAULT 'cash' NOT NULL,
	"receipt_number" text,
	"recorded_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tgm_suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"address" text,
	"category" text,
	"rating" numeric(3, 1),
	"total_orders" integer DEFAULT 0 NOT NULL,
	"total_value" numeric(12, 2) DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tgm_wholesale_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_company" text NOT NULL,
	"contact_person" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"product" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2),
	"total_value" numeric(10, 2),
	"status" text DEFAULT 'pending' NOT NULL,
	"special_instructions" text,
	"created_by" integer,
	"approved_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text,
	"first_name" text,
	"last_name" text,
	"role" text DEFAULT 'employee' NOT NULL,
	"department" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "website_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"type" text DEFAULT 'text',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "accounts_payable" ADD CONSTRAINT "accounts_payable_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts_payable" ADD CONSTRAINT "accounts_payable_gl_account_id_chart_of_accounts_id_fk" FOREIGN KEY ("gl_account_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ADD CONSTRAINT "accounts_receivable_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts_receivable" ADD CONSTRAINT "accounts_receivable_gl_account_id_chart_of_accounts_id_fk" FOREIGN KEY ("gl_account_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_approved_by_employees_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_flow_entries" ADD CONSTRAINT "cash_flow_entries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_flow_entries" ADD CONSTRAINT "cash_flow_entries_account_id_chart_of_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_payments" ADD CONSTRAINT "credit_payments_creditor_id_creditors_id_fk" FOREIGN KEY ("creditor_id") REFERENCES "public"."creditors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_payments" ADD CONSTRAINT "credit_payments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_payments" ADD CONSTRAINT "credit_payments_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creditors" ADD CONSTRAINT "creditors_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creditors" ADD CONSTRAINT "creditors_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creditors" ADD CONSTRAINT "creditors_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_manager_id_employees_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "general_ledger_entries" ADD CONSTRAINT "general_ledger_entries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "general_ledger_entries" ADD CONSTRAINT "general_ledger_entries_account_id_chart_of_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hr_requests" ADD CONSTRAINT "hr_requests_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hr_requests" ADD CONSTRAINT "hr_requests_assigned_to_employees_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_reviewed_by_employees_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_covering_employee_employees_id_fk" FOREIGN KEY ("covering_employee") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll" ADD CONSTRAINT "payroll_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll" ADD CONSTRAINT "payroll_processed_by_employees_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_reviewer_id_employees_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_users" ADD CONSTRAINT "saas_users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_modules" ADD CONSTRAINT "tenant_modules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_modules" ADD CONSTRAINT "tenant_modules_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_modules" ADD CONSTRAINT "tenant_modules_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tgm_activity_logs" ADD CONSTRAINT "tgm_activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tgm_deliveries" ADD CONSTRAINT "tgm_deliveries_order_id_tgm_wholesale_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."tgm_wholesale_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tgm_deliveries" ADD CONSTRAINT "tgm_deliveries_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tgm_inventory" ADD CONSTRAINT "tgm_inventory_last_updated_by_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tgm_retail_sales" ADD CONSTRAINT "tgm_retail_sales_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tgm_suppliers" ADD CONSTRAINT "tgm_suppliers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tgm_wholesale_orders" ADD CONSTRAINT "tgm_wholesale_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tgm_wholesale_orders" ADD CONSTRAINT "tgm_wholesale_orders_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ap_tenant_vendor_idx" ON "accounts_payable" USING btree ("tenant_id","vendor_id");--> statement-breakpoint
CREATE INDEX "ap_status_idx" ON "accounts_payable" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ap_due_date_idx" ON "accounts_payable" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "ar_tenant_customer_idx" ON "accounts_receivable" USING btree ("tenant_id","customer_id");--> statement-breakpoint
CREATE INDEX "ar_status_idx" ON "accounts_receivable" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ar_due_date_idx" ON "accounts_receivable" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "employee_date_idx" ON "attendance" USING btree ("employee_id","date");--> statement-breakpoint
CREATE INDEX "attendance_date_idx" ON "attendance" USING btree ("date");--> statement-breakpoint
CREATE INDEX "audit_tenant_user_idx" ON "audit_logs" USING btree ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX "audit_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_timestamp_idx" ON "audit_logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "budget_tenant_year_idx" ON "budgets" USING btree ("tenant_id","budget_year");--> statement-breakpoint
CREATE INDEX "budget_status_idx" ON "budgets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cf_tenant_date_idx" ON "cash_flow_entries" USING btree ("tenant_id","entry_date");--> statement-breakpoint
CREATE INDEX "cf_category_idx" ON "cash_flow_entries" USING btree ("category");--> statement-breakpoint
CREATE INDEX "coa_tenant_code_idx" ON "chart_of_accounts" USING btree ("tenant_id","account_code");--> statement-breakpoint
CREATE INDEX "coa_type_idx" ON "chart_of_accounts" USING btree ("account_type");--> statement-breakpoint
CREATE INDEX "coa_parent_idx" ON "chart_of_accounts" USING btree ("parent_account_id");--> statement-breakpoint
CREATE INDEX "employee_tenant_id_idx" ON "employees" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "employee_id_idx" ON "employees" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "department_idx" ON "employees" USING btree ("department");--> statement-breakpoint
CREATE INDEX "employment_status_idx" ON "employees" USING btree ("employment_status");--> statement-breakpoint
CREATE UNIQUE INDEX "employee_tenant_email_unique" ON "employees" USING btree ("tenant_id","email");--> statement-breakpoint
CREATE INDEX "gle_tenant_journal_idx" ON "general_ledger_entries" USING btree ("tenant_id","journal_id");--> statement-breakpoint
CREATE INDEX "gle_account_idx" ON "general_ledger_entries" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "gle_date_idx" ON "general_ledger_entries" USING btree ("transaction_date");--> statement-breakpoint
CREATE INDEX "gle_status_idx" ON "general_ledger_entries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hr_request_employee_idx" ON "hr_requests" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "hr_request_status_idx" ON "hr_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hr_request_type_idx" ON "hr_requests" USING btree ("request_type");--> statement-breakpoint
CREATE INDEX "hr_request_priority_idx" ON "hr_requests" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "invoice_tenant_idx" ON "invoices" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "invoice_status_idx" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invoice_due_date_idx" ON "invoices" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "leave_employee_idx" ON "leave_requests" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "leave_status_idx" ON "leave_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leave_date_range_idx" ON "leave_requests" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE INDEX "module_category_idx" ON "modules" USING btree ("category");--> statement-breakpoint
CREATE INDEX "module_active_idx" ON "modules" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "payroll_employee_idx" ON "payroll" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "payroll_period_idx" ON "payroll" USING btree ("pay_period_start","pay_period_end");--> statement-breakpoint
CREATE INDEX "payroll_status_idx" ON "payroll" USING btree ("status");--> statement-breakpoint
CREATE INDEX "review_employee_idx" ON "performance_reviews" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "review_reviewer_idx" ON "performance_reviews" USING btree ("reviewer_id");--> statement-breakpoint
CREATE INDEX "review_period_idx" ON "performance_reviews" USING btree ("review_period");--> statement-breakpoint
CREATE INDEX "saas_user_email_tenant_unique" ON "saas_users" USING btree ("email","tenant_id");--> statement-breakpoint
CREATE INDEX "saas_user_tenant_idx" ON "saas_users" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "saas_user_role_idx" ON "saas_users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "subscription_tenant_idx" ON "subscriptions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "subscription_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "subscription_next_payment_idx" ON "subscriptions" USING btree ("next_payment_date");--> statement-breakpoint
CREATE INDEX "subscription_external_idx" ON "subscriptions" USING btree ("external_subscription_id");--> statement-breakpoint
CREATE INDEX "tenant_module_idx" ON "tenant_modules" USING btree ("tenant_id","module_id");--> statement-breakpoint
CREATE INDEX "tenant_module_subscription_idx" ON "tenant_modules" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "tenant_module_status_idx" ON "tenant_modules" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tenant_customer_idx" ON "tenants" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "tenant_slug_idx" ON "tenants" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tenant_status_idx" ON "tenants" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tenant_parent_idx" ON "tenants" USING btree ("parent_tenant_id");