import re

routes_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\server\cateringRoutes.ts"
dashboard_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\dashboard.tsx"

with open(routes_path, "r", encoding="utf-8") as f:
    routes_code = f.read()

# Auto-table creation script for catering_invoices
init_table_sql = '''
// Ensure catering_invoices table exists in Postgres
import { pool } from "./db";

async function ensureCateringInvoicesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS catering_invoices (
        id SERIAL PRIMARY KEY,
        invoice_number TEXT NOT NULL,
        request_id INTEGER,
        quotation_id INTEGER,
        client_name TEXT NOT NULL,
        client_email TEXT NOT NULL,
        client_phone TEXT,
        client_company TEXT,
        contract_ref TEXT,
        invoice_date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        payment_terms TEXT NOT NULL DEFAULT 'Net 30',
        currency TEXT NOT NULL DEFAULT 'USD',
        dates_of_service TEXT,
        locations_served TEXT,
        quantities_delivered TEXT,
        line_items JSONB NOT NULL DEFAULT '[]',
        subtotal NUMERIC(12, 2) NOT NULL DEFAULT '0',
        tax_rate NUMERIC(5, 2) NOT NULL DEFAULT '0',
        tax_amount NUMERIC(12, 2) NOT NULL DEFAULT '0',
        discount NUMERIC(12, 2) NOT NULL DEFAULT '0',
        total_amount NUMERIC(12, 2) NOT NULL DEFAULT '0',
        amount_paid NUMERIC(12, 2) NOT NULL DEFAULT '0',
        payment_details TEXT,
        terms_and_conditions TEXT,
        notes TEXT,
        vault_saved BOOLEAN NOT NULL DEFAULT true,
        status TEXT NOT NULL DEFAULT 'issued',
        created_by INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("✅ Verified PostgreSQL catering_invoices table structure");
  } catch (err: any) {
    console.error("⚠️ Failed to ensure catering_invoices table:", err.message);
  }
}

ensureCateringInvoicesTable();
'''

if "async function ensureCateringInvoicesTable()" not in routes_code:
    routes_code = init_table_sql + "\n" + routes_code
    print("Added auto-table creation SQL helper to server/cateringRoutes.ts!")

# Fix createdBy in POST /api/catering/invoices
old_post_inv = 'createdBy: req.staffUser!.id,'
new_post_inv = 'createdBy: (req.staffUser && typeof req.staffUser.id === "number") ? req.staffUser.id : null,'
routes_code = routes_code.replace(old_post_inv, new_post_inv)

with open(routes_path, "w", encoding="utf-8") as f:
    f.write(routes_code)
print("Updated POST /invoices route in server/cateringRoutes.ts!")

# Update catch block in client/src/pages/catering/ops/dashboard.tsx
with open(dashboard_path, "r", encoding="utf-8") as f:
    dash_code = f.read()

dash_code = dash_code.replace(
    'toast({ title: "Error", description: "Connection error", variant: "destructive" });',
    'toast({ title: "Failed to Create Invoice", description: (err && err.message) ? err.message : "Error creating invoice", variant: "destructive" });'
)

dash_code = dash_code.replace(
    'catch {',
    'catch (err: any) {'
)

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(dash_code)
print("Updated catch block in client/src/pages/catering/ops/dashboard.tsx!")
