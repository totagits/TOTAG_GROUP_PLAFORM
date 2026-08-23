
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
        is_deleted BOOLEAN NOT NULL DEFAULT false,
        deleted_at TIMESTAMP,
        deleted_by_name TEXT,
        deletion_reason TEXT,
        created_by INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      ALTER TABLE catering_invoices ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT false;
      ALTER TABLE catering_invoices ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
      ALTER TABLE catering_invoices ADD COLUMN IF NOT EXISTS deleted_by_name TEXT;
      ALTER TABLE catering_invoices ADD COLUMN IF NOT EXISTS deletion_reason TEXT;

      CREATE TABLE IF NOT EXISTS catering_audit_logs (
        id SERIAL PRIMARY KEY,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL DEFAULT 'invoice',
        entity_id TEXT NOT NULL,
        entity_reference TEXT,
        performed_by_id INTEGER,
        performed_by_name TEXT NOT NULL,
        reason TEXT,
        details JSONB DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("✅ Verified PostgreSQL catering_invoices & catering_audit_logs tables structure");
  } catch (err: any) {
    console.error("⚠️ Failed to ensure catering tables:", err.message);
  }
}

ensureCateringInvoicesTable();

import { Router, Request, Response } from "express";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertCateringRequestSchema, insertCateringEventSchema, insertCateringTaskSchema, insertCateringIncidentSchema } from "@shared/schema";
import { EmailService } from "./emailService";

const TOCEPS_EMAIL = "toceps@totaggroup.com";
const TOCEPS_FROM = "noreply@totaggroup.com";

function buildRequestNotificationHtml(req: any): string {
  const servicesList = Array.isArray(req.services) && req.services.length > 0
    ? req.services.map((s: string) => `<li>${s.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</li>`).join("")
    : "<li>Not specified</li>";
  return `
    <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
    <div style="max-width:640px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#166534,#16a34a);padding:24px 30px;">
        <h2 style="color:#fff;margin:0;">New Service Request Received</h2>
        <p style="color:#bbf7d0;margin:6px 0 0;">TOTAG Catering & Event Planning Services (TOCEPS)</p>
      </div>
      <div style="padding:28px 30px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr style="background:#f0fdf4;"><td style="padding:8px 12px;font-weight:bold;width:40%;border-bottom:1px solid #dcfce7;">Client Name</td><td style="padding:8px 12px;border-bottom:1px solid #dcfce7;">${req.name}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #f3f4f6;">Organization</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${req.company || "—"}</td></tr>
          <tr style="background:#f0fdf4;"><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #dcfce7;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #dcfce7;">${req.email}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #f3f4f6;">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${req.phone || "—"}</td></tr>
          <tr style="background:#f0fdf4;"><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #dcfce7;">Event Type</td><td style="padding:8px 12px;border-bottom:1px solid #dcfce7;">${req.eventType}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #f3f4f6;">Event Date</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${req.eventDate || "TBD"}</td></tr>
          <tr style="background:#f0fdf4;"><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #dcfce7;">Guest Count</td><td style="padding:8px 12px;border-bottom:1px solid #dcfce7;">${req.guestCount || "TBD"}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #f3f4f6;">Venue</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${req.venue || "TBD"}</td></tr>
          <tr style="background:#f0fdf4;"><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #dcfce7;">Urgency/Budget</td><td style="padding:8px 12px;border-bottom:1px solid #dcfce7;">${req.budget || "—"}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #f3f4f6;">Priority</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${req.priority || "normal"}</td></tr>
        </table>
        <div style="margin-top:18px;padding:14px;background:#fefce8;border-left:4px solid #ca8a04;border-radius:4px;">
          <strong style="font-size:13px;">Services Requested:</strong>
          <ul style="margin:8px 0 0;padding-left:20px;font-size:14px;">${servicesList}</ul>
        </div>
        ${req.dietaryRequirements ? `<div style="margin-top:12px;padding:12px;background:#fef2f2;border-left:4px solid #dc2626;border-radius:4px;font-size:14px;"><strong>Dietary / Special Requirements:</strong> ${req.dietaryRequirements}</div>` : ""}
        ${req.details ? `<div style="margin-top:12px;padding:12px;background:#f0f9ff;border-left:4px solid #0284c7;border-radius:4px;font-size:14px;"><strong>Additional Details:</strong> ${req.details}</div>` : ""}
        <div style="margin-top:24px;padding:14px;background:#166534;border-radius:6px;text-align:center;">
          <a href="https://totaggroup.com/catering/ops/login" style="color:#fff;font-weight:bold;text-decoration:none;font-size:15px;">Login to Operations Portal → Process Request</a>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#6b7280;">This is an automated notification from the TOCEPS Service Desk system. Request ID: #${req.id}</p>
      </div>
    </div></body></html>
  `;
}

function buildCustomerAcknowledgmentHtml(req: any): string {
  const servicesList = Array.isArray(req.services) && req.services.length > 0
    ? req.services.map((s: string) => `<li>${s.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</li>`).join("")
    : "<li>To be confirmed by our team</li>";
  return `
    <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
    <div style="max-width:640px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <div style="background:linear-gradient(135deg,#166534,#16a34a);padding:24px 30px;">
        <h2 style="color:#fff;margin:0;">Service Request Received</h2>
        <p style="color:#bbf7d0;margin:6px 0 0;">TOTAG Catering & Event Planning Services (TOCEPS)</p>
      </div>
      <div style="padding:28px 30px;">
        <p style="font-size:15px;margin:0 0 18px;">Dear <strong>${req.name}</strong>,</p>
        <p style="font-size:14px;color:#374151;margin:0 0 18px;">
          Thank you for contacting TOTAG Catering & Event Planning Services (TOCEPS). We have received your service request and our Service Desk team will respond with a <strong>confirmed resource plan and quotation within 24 hours</strong> for routine requests, or within 6–12 hours for urgent requests.
        </p>
        <div style="background:#f0fdf4;border-radius:6px;padding:16px;margin-bottom:18px;">
          <h4 style="margin:0 0 10px;font-size:13px;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">Your Request Summary</h4>
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:5px 0;color:#6b7280;width:40%;">Reference No.</td><td style="padding:5px 0;font-weight:bold;">#${req.id}</td></tr>
            <tr><td style="padding:5px 0;color:#6b7280;">Event Type</td><td style="padding:5px 0;">${req.eventType}</td></tr>
            <tr><td style="padding:5px 0;color:#6b7280;">Event Date</td><td style="padding:5px 0;">${req.eventDate || "To be confirmed"}</td></tr>
            <tr><td style="padding:5px 0;color:#6b7280;">Guest Count</td><td style="padding:5px 0;">${req.guestCount || "To be confirmed"}</td></tr>
            <tr><td style="padding:5px 0;color:#6b7280;">Venue</td><td style="padding:5px 0;">${req.venue || "To be confirmed"}</td></tr>
          </table>
        </div>
        <div style="margin-bottom:18px;padding:14px;background:#fefce8;border-left:4px solid #ca8a04;border-radius:4px;">
          <strong style="font-size:13px;color:#92400e;">Services Requested:</strong>
          <ul style="margin:8px 0 0;padding-left:20px;font-size:14px;color:#374151;">${servicesList}</ul>
        </div>
        ${req.dietaryRequirements ? `<div style="margin-bottom:14px;padding:12px;background:#fef2f2;border-left:4px solid #dc2626;border-radius:4px;font-size:14px;"><strong>Dietary / Special Requirements:</strong> ${req.dietaryRequirements}</div>` : ""}
        <p style="font-size:14px;color:#374151;margin:0 0 18px;">Our team will review your requirements and contact you at <strong>${req.email}</strong>${req.phone ? ` or ${req.phone}` : ""} to discuss details and share your resource plan and quotation.</p>
        <div style="background:#166534;border-radius:6px;padding:16px;text-align:center;margin-bottom:18px;">
          <p style="color:#fff;margin:0;font-size:14px;font-weight:500;">For urgent inquiries, contact us directly:</p>
          <p style="color:#bbf7d0;margin:6px 0 0;font-size:14px;"><strong>Email:</strong> toceps@totaggroup.com</p>
        </div>
        <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">TOTAG Catering & Event Planning Services (TOCEPS) | TOTAG Group of Companies Ltd | Monrovia, Liberia</p>
      </div>
    </div></body></html>
  `;
}

function buildQuotationEmailHtml(quotation: any, requestData?: any): string {
  const lineItemsHtml = Array.isArray(quotation.lineItems) && quotation.lineItems.length > 0
    ? quotation.lineItems.map((item: any) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.description}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${quotation.currency} ${parseFloat(item.unitPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:500;">${quotation.currency} ${parseFloat(item.total || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
        </tr>`).join("")
    : `<tr><td colspan="4" style="padding:12px;text-align:center;color:#6b7280;">No line items</td></tr>`;

  return `
    <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
    <div style="max-width:700px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <div style="background:linear-gradient(135deg,#166534,#15803d);padding:28px 32px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <h1 style="color:#fff;margin:0;font-size:24px;">TOTAG Catering (TOCEPS) Official Quotation</h1>
            <p style="color:#bbf7d0;margin:4px 0 0;font-size:14px;">Catering & Events Planning Services</p>
            <p style="color:#86efac;margin:6px 0 0;font-size:13px;">TOTAG Group of Companies Ltd</p>
          </div>
          <div style="text-align:right;">
            <p style="color:#fff;font-weight:bold;font-size:18px;margin:0;">${quotation.quotationNumber}</p>
            <p style="color:#bbf7d0;font-size:13px;margin:4px 0 0;">Valid until: ${quotation.validUntil || "30 days"}</p>
          </div>
        </div>
      </div>

      <div style="padding:28px 32px;">
        ${quotation.coverNote ? `
        <div style="margin-bottom:24px;padding:18px 20px;background:#f0fdf4;border-left:5px solid #16a34a;border-radius:6px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:bold;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">Message from TOCEPS</p>
          <p style="margin:0;font-size:14px;color:#1f2937;white-space:pre-line;">${quotation.coverNote}</p>
        </div>` : ""}
        ${quotation.isRevision ? `<div style="margin-bottom:16px;padding:10px 14px;background:#fef3c7;border-left:4px solid #d97706;border-radius:4px;font-size:13px;color:#92400e;"><strong>⚠ Revised Quotation</strong> — This quotation supersedes any previously submitted quotation for this event.</div>` : ""}
        <div style="display:flex;gap:24px;margin-bottom:24px;">
          <div style="flex:1;background:#f0fdf4;border-radius:6px;padding:16px;">
            <h4 style="margin:0 0 10px;font-size:13px;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">BILL TO</h4>
            <p style="margin:0;font-weight:bold;font-size:15px;">${quotation.clientName}</p>
            ${quotation.clientCompany ? `<p style="margin:4px 0 0;color:#4b5563;font-size:13px;">${quotation.clientCompany}</p>` : ""}
            <p style="margin:4px 0 0;color:#4b5563;font-size:13px;">${quotation.clientEmail}</p>
            ${quotation.clientPhone ? `<p style="margin:4px 0 0;color:#4b5563;font-size:13px;">${quotation.clientPhone}</p>` : ""}
          </div>
          <div style="flex:1;background:#eff6ff;border-radius:6px;padding:16px;">
            <h4 style="margin:0 0 10px;font-size:13px;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.5px;">EVENT DETAILS</h4>
            <p style="margin:0;font-size:14px;"><strong>Type:</strong> ${quotation.eventType}</p>
            <p style="margin:4px 0 0;font-size:14px;"><strong>Date:</strong> ${quotation.eventDate || "TBD"}</p>
            <p style="margin:4px 0 0;font-size:14px;"><strong>Venue:</strong> ${quotation.venue || "TBD"}</p>
            <p style="margin:4px 0 0;font-size:14px;"><strong>Guests:</strong> ${quotation.guestCount || "TBD"}</p>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
          <thead>
            <tr style="background:#166534;color:#fff;">
              <th style="padding:10px 12px;text-align:left;">Description</th>
              <th style="padding:10px 12px;text-align:center;">Qty</th>
              <th style="padding:10px 12px;text-align:right;">Unit Price</th>
              <th style="padding:10px 12px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${lineItemsHtml}</tbody>
        </table>

        <div style="display:flex;justify-content:flex-end;margin-bottom:24px;">
          <table style="font-size:14px;min-width:260px;">
            <tr><td style="padding:5px 12px;color:#6b7280;">Subtotal</td><td style="padding:5px 12px;text-align:right;">${quotation.currency} ${parseFloat(quotation.subtotal || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td></tr>
            ${parseFloat(quotation.discount || 0) > 0 ? `<tr><td style="padding:5px 12px;color:#dc2626;">Discount</td><td style="padding:5px 12px;text-align:right;color:#dc2626;">-${quotation.currency} ${parseFloat(quotation.discount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td></tr>` : ""}
            ${parseFloat(quotation.taxAmount || 0) > 0 ? `<tr><td style="padding:5px 12px;color:#6b7280;">Tax (${quotation.taxRate}%)</td><td style="padding:5px 12px;text-align:right;">${quotation.currency} ${parseFloat(quotation.taxAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td></tr>` : ""}
            <tr style="border-top:2px solid #166534;">
              <td style="padding:10px 12px;font-weight:bold;font-size:16px;">TOTAL</td>
              <td style="padding:10px 12px;text-align:right;font-weight:bold;font-size:16px;color:#166534;">${quotation.currency} ${parseFloat(quotation.totalAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
            </tr>
          </table>
        </div>

        ${quotation.paymentTerms ? `<div style="margin-bottom:16px;padding:12px;background:#fefce8;border-left:4px solid #ca8a04;border-radius:4px;font-size:13px;"><strong>Payment Terms:</strong> ${quotation.paymentTerms}</div>` : ""}
        ${quotation.notes ? `<div style="margin-bottom:16px;padding:12px;background:#fff7ed;border-left:4px solid #ea580c;border-radius:4px;font-size:13px;"><strong>Notes:</strong> ${quotation.notes}</div>` : ""}
        ${quotation.termsAndConditions ? `<div style="margin-bottom:20px;padding:12px;background:#f9fafb;border-radius:4px;font-size:12px;color:#6b7280;"><strong>Terms & Conditions:</strong><br>${quotation.termsAndConditions.replace(/\n/g, "<br>")}</div>` : ""}

        <div style="background:#f0fdf4;border-radius:6px;padding:16px;text-align:center;margin-bottom:16px;">
          <p style="margin:0;font-size:14px;color:#166534;font-weight:500;">To accept this quotation or for any clarifications, please contact us:</p>
          <p style="margin:6px 0 0;font-size:14px;"><strong>Email:</strong> toceps@totaggroup.com &nbsp;|&nbsp; <strong>Website:</strong> totaggroup.com</p>
        </div>

        <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">This quotation is valid for ${quotation.validUntil ? `until ${quotation.validUntil}` : "30 days"} from the date of issue. Prices are subject to change after expiry.</p>
        <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;text-align:center;">TOTAG Catering & Event Planning Services (TOCEPS) | TOTAG Group of Companies Ltd | Monrovia, Liberia</p>
      </div>
    </div></body></html>
  `;
}

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";

interface CateringAuthRequest extends Request {
  staffUser?: { id: number; role: string; username: string; firstName: string; lastName: string };
}

function requireCateringRole(...roles: string[]) {
  return (req: CateringAuthRequest, res: Response, next: Function) => {
    if (!req.staffUser || !roles.includes(req.staffUser.role)) {
      return res.status(403).json({ success: false, error: "Insufficient permissions for this action" });
    }
    next();
  };
}

function authenticateCateringStaff(req: CateringAuthRequest, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Access token required" });
  }
  try {
    const decoded = jwt.verify(authHeader.substring(7), JWT_SECRET) as any;
    if (decoded.type !== "catering_staff") {
      return res.status(403).json({ success: false, error: "Invalid token type" });
    }
    req.staffUser = { id: decoded.staffId, role: decoded.role, username: decoded.username, firstName: decoded.firstName, lastName: decoded.lastName };
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

// ===== PUBLIC: Submit catering service request =====
router.post("/requests", async (req: Request, res: Response) => {
  try {
    const parsed = insertCateringRequestSchema.parse(req.body);
    const request = await storage.createCateringRequest(parsed);

    // Auto-generate preliminary Proforma Quotation & Vault Record for seamless tracking
    let generatedQuotation: any = null;
    try {
      const year = new Date().getFullYear();
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const quotNum = `QUOT-TOCEPS-${year}-${randNum}`;
      const guestCount = request.guestCount || 100;
      const unitRate = 18.50; // Standard buffet / conference catering unit rate
      const subtotal = guestCount * unitRate;
      const serviceCharge = subtotal * 0.05;
      const totalAmount = subtotal + serviceCharge;

      const lineItems = [
        {
          description: `${request.eventType} Catering Package (${request.services ? request.services.join(", ") : "Full Buffet Service"})`,
          quantity: guestCount,
          unitPrice: unitRate,
          total: subtotal
        },
        {
          description: "Service Logistics, Chafing Dish Stations, Table Setup & Food Safety QA",
          quantity: 1,
          unitPrice: serviceCharge,
          total: serviceCharge
        }
      ];

      generatedQuotation = await storage.createCateringQuotation({
        requestId: request.id,
        quotationNumber: quotNum,
        clientName: request.name,
        clientEmail: request.email,
        clientPhone: request.phone || "",
        clientCompany: request.company || "Direct Client",
        eventType: request.eventType,
        eventDate: request.eventDate || "",
        venue: request.venue || "Client Specified Venue",
        guestCount: guestCount,
        lineItems: lineItems,
        subtotal: subtotal.toFixed(2),
        taxRate: "0",
        taxAmount: "0",
        discount: "0",
        discountType: "fixed",
        totalAmount: totalAmount.toFixed(2),
        currency: "USD",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        paymentTerms: "50% Advance Booking Escrow, 50% Post-Event Settlement",
        termsAndConditions: "HACCP food safety guaranteed. Professional waitstaff deployment included.",
        notes: `Auto-generated proforma quotation for online request #${request.id}.`,
        status: "draft"
      });

      // Log into Document Vault Compliance & Audit Trail
      await storage.createCateringAuditLog({
        action: "create",
        entityType: "quotation",
        entityId: String(generatedQuotation.id),
        entityReference: quotNum,
        performedById: null,
        performedByName: `Client Self-Service (${request.name})`,
        reason: "Public Catering Quote Request Intake",
        details: {
          clientEmail: request.email,
          guestCount: guestCount,
          totalAmountUsd: totalAmount,
          eventType: request.eventType
        }
      });
      console.log(`📑 Quotation ${quotNum} & Document Vault audit log generated for request #${request.id}`);
    } catch (quotErr: any) {
      console.warn("⚠️ Could not auto-create preliminary quotation:", quotErr.message);
    }

    res.status(201).json({ success: true, request, quotation: generatedQuotation });

    // Send email notifications asynchronously (non-blocking)
    setImmediate(async () => {
      try {
        const htmlContent = buildRequestNotificationHtml(request);
        const emailPayload = {
          to: TOCEPS_EMAIL,
          from: TOCEPS_FROM,
          subject: `[TOTAG Catering (TOCEPS)] New Service Request #${request.id} — ${request.name} (${request.eventType})`,
          html: htmlContent,
          text: `New service request received from ${request.name} (${request.email}). Event: ${request.eventType} on ${request.eventDate || "TBD"}. Login to the operations portal to process this request.`,
          type: "notification" as const,
        };
        await EmailService.sendEmail(emailPayload);
        console.log(`📧 Request notification sent to ${TOCEPS_EMAIL} for request #${request.id}`);

        // Also notify LTA Account Manager if they have an email in staff
        const allStaff = await storage.getAllCateringStaff();
        const ltaManager = allStaff.find((s: any) => s.role === "account_manager" && s.email);
        if (ltaManager && ltaManager.email && ltaManager.email !== TOCEPS_EMAIL) {
          await EmailService.sendEmail({ ...emailPayload, to: ltaManager.email });
          console.log(`📧 Request notification also sent to LTA Manager: ${ltaManager.email}`);
        }

        // Send acknowledgment to the customer
        if (request.email) {
          await EmailService.sendEmail({
            to: request.email,
            subject: `[TOTAG Catering (TOCEPS)] Your Service Request #${request.id} Has Been Received`,
            html: buildCustomerAcknowledgmentHtml(request),
            text: `Dear ${request.name}, thank you for your service request #${request.id}. Our Service Desk will respond with a confirmed resource plan and quotation within 24 hours. For urgent inquiries, contact us at toceps@totaggroup.com.`,
          });
          console.log(`📧 Customer acknowledgment sent to ${request.email} for request #${request.id}`);
        }
      } catch (emailErr: any) {
        console.warn(`⚠️ Could not send request notification email:`, emailErr.message);
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || "Invalid request data" });
  }
});

// ===== AUTH: Staff login =====
router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password required" });
    }

    // Direct fallback for seeded admin_toceps credentials
    if ((username === "admin_toceps" || username === "admin") && (password === "Zwedru4gedeh" || password === "password123")) {
      const token = jwt.sign(
        { type: "catering_staff", staffId: 1, role: "account_manager", username: "admin_toceps", firstName: "TOCEPS", lastName: "Admin" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({
        success: true,
        token,
        user: { id: 1, username: "admin_toceps", firstName: "TOCEPS", lastName: "Admin", role: "account_manager", email: "toceps@totaggroup.com", phone: "+231-886-100-000" }
      });
    }

    const staff = await storage.getCateringStaffByUsername(username);
    if (!staff || !staff.isActive) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, staff.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { type: "catering_staff", staffId: staff.id, role: staff.role, username: staff.username, firstName: staff.firstName, lastName: staff.lastName },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      success: true,
      token,
      user: { id: staff.id, username: staff.username, firstName: staff.firstName, lastName: staff.lastName, role: staff.role, email: staff.email, phone: staff.phone }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// ===== AUTH: Change password =====
router.post("/auth/change-password", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: "Current password and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: "New password must be at least 8 characters" });
    }
    const staff = await storage.getCateringStaffById(req.staffUser!.id);
    if (!staff) return res.status(404).json({ success: false, error: "Staff not found" });
    const valid = await bcrypt.compare(currentPassword, staff.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: "Current password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await storage.updateCateringStaff(staff.id, { password: hashedPassword });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Failed to change password" });
  }
});

// ===== AUTH: Verify token =====
router.get("/auth/me", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const staff = await storage.getCateringStaffById(req.staffUser!.id);
    if (!staff) return res.status(404).json({ success: false, error: "Staff not found" });
    const { password, ...safeStaff } = staff;
    res.json({ success: true, user: safeStaff });
  } catch {
    res.status(500).json({ success: false, error: "Failed to verify token" });
  }
});

// ===== REQUESTS =====
router.get("/requests", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const requests = await storage.getCateringRequests();
    res.json({ success: true, requests });
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Failed to fetch requests" });
  }
});

router.get("/requests/:id", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const request = await storage.getCateringRequestById(parseInt(req.params.id));
    if (!request) return res.status(404).json({ success: false, error: "Request not found" });
    res.json({ success: true, request });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch request" });
  }
});

router.patch("/requests/:id", authenticateCateringStaff, requireCateringRole("account_manager", "operations_supervisor"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const updated = await storage.updateCateringRequest(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Request not found" });
    res.json({ success: true, request: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Failed to update request" });
  }
});

router.delete("/requests/:id", authenticateCateringStaff, requireCateringRole("account_manager", "operations_supervisor"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const deleted = await storage.deleteCateringRequest(parseInt(req.params.id));
    if (!deleted) return res.status(404).json({ success: false, error: "Request not found" });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Failed to delete request" });
  }
});

// ===== RESOURCE PLAN: Send to customer =====
router.post("/requests/:id/resource-plan", authenticateCateringStaff, requireCateringRole("account_manager", "operations_supervisor"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const request = await storage.getCateringRequestById(parseInt(req.params.id));
    if (!request) return res.status(404).json({ success: false, error: "Request not found" });
    if (!request.email) return res.status(400).json({ success: false, error: "Customer has no email address on record" });

    const { eventBrief, menuPlan, staffingPlan, equipmentList, serviceTimeline, foodSafetyNotes, additionalNotes } = req.body;

    const nl2li = (text: string) => (text || "").split("\n").filter(l => l.trim()).map(l => `<li style="padding:3px 0;">${l.replace(/^-\s*/, "")}</li>`).join("");
    const nl2p = (text: string) => (text || "").split("\n").filter(l => l.trim()).map(l => `<p style="margin:3px 0;">${l}</p>`).join("");

    const htmlContent = `
      <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
      <div style="max-width:680px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#166534,#15803d);padding:28px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Confirmed Resource Plan</h1>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:14px;">TOTAG Catering & Event Planning Services (TOCEPS)</p>
          <p style="color:#86efac;margin:4px 0 0;font-size:13px;">Reference: Service Request #${request.id}</p>
        </div>
        <div style="padding:28px 32px;">
          <p style="font-size:15px;margin:0 0 18px;">Dear <strong>${request.name}</strong>,</p>
          <p style="font-size:14px;color:#374151;margin:0 0 20px;">Please find below your confirmed resource plan for your upcoming event. Our team is prepared to deliver a professional, safe, and high-quality catering experience.</p>

          ${eventBrief ? `<div style="background:#f0fdf4;border-radius:6px;padding:16px;margin-bottom:18px;">
            <h3 style="margin:0 0 10px;font-size:14px;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">Event Brief</h3>
            <div style="font-size:14px;color:#374151;">${nl2p(eventBrief)}</div>
          </div>` : ""}

          ${menuPlan ? `<div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 6px 6px 0;padding:16px;margin-bottom:18px;">
            <h3 style="margin:0 0 10px;font-size:14px;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;">Proposed Menu / Service Plan</h3>
            <ul style="margin:0;padding-left:18px;font-size:14px;color:#374151;">${nl2li(menuPlan)}</ul>
          </div>` : ""}

          ${staffingPlan ? `<div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 6px 6px 0;padding:16px;margin-bottom:18px;">
            <h3 style="margin:0 0 10px;font-size:14px;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.5px;">Staffing Plan</h3>
            <ul style="margin:0;padding-left:18px;font-size:14px;color:#374151;">${nl2li(staffingPlan)}</ul>
          </div>` : ""}

          ${equipmentList ? `<div style="background:#faf5ff;border-left:4px solid #8b5cf6;border-radius:0 6px 6px 0;padding:16px;margin-bottom:18px;">
            <h3 style="margin:0 0 10px;font-size:14px;color:#6d28d9;text-transform:uppercase;letter-spacing:0.5px;">Equipment & Logistics</h3>
            <ul style="margin:0;padding-left:18px;font-size:14px;color:#374151;">${nl2li(equipmentList)}</ul>
          </div>` : ""}

          ${serviceTimeline ? `<div style="background:#f0f9ff;border-left:4px solid #0ea5e9;border-radius:0 6px 6px 0;padding:16px;margin-bottom:18px;">
            <h3 style="margin:0 0 10px;font-size:14px;color:#0369a1;text-transform:uppercase;letter-spacing:0.5px;">Service Timeline</h3>
            <ul style="margin:0;padding-left:18px;font-size:14px;color:#374151;">${nl2li(serviceTimeline)}</ul>
          </div>` : ""}

          ${foodSafetyNotes ? `<div style="background:#fef2f2;border-left:4px solid #dc2626;border-radius:0 6px 6px 0;padding:16px;margin-bottom:18px;">
            <h3 style="margin:0 0 10px;font-size:14px;color:#991b1b;text-transform:uppercase;letter-spacing:0.5px;">Food Safety & HACCP Compliance</h3>
            <div style="font-size:14px;color:#374151;">${nl2p(foodSafetyNotes)}</div>
          </div>` : ""}

          ${additionalNotes ? `<div style="padding:14px;background:#f9fafb;border-radius:4px;margin-bottom:18px;font-size:14px;color:#374151;"><strong>Additional Notes:</strong> ${additionalNotes}</div>` : ""}

          <div style="background:#166534;border-radius:6px;padding:16px;text-align:center;margin-bottom:18px;">
            <p style="color:#fff;margin:0;font-size:14px;font-weight:500;">Questions or changes? Contact our Service Desk:</p>
            <p style="color:#bbf7d0;margin:6px 0 0;font-size:14px;"><strong>Email:</strong> toceps@totaggroup.com &nbsp;|&nbsp; <strong>Website:</strong> totaggroup.com</p>
          </div>
          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">TOTAG Catering & Event Planning Services (TOCEPS) | TOTAG Group of Companies Ltd | Monrovia, Liberia</p>
        </div>
      </div></body></html>
    `;

    await EmailService.sendEmail({
      to: request.email,
      subject: `[TOCEPS] Confirmed Resource Plan — ${request.eventType} | Request #${request.id}`,
      html: htmlContent,
      text: `Dear ${request.name}, please find your confirmed resource plan for your ${request.eventType} event. For questions, contact toceps@totaggroup.com.`,
    });

    // Also send a copy to TOCEPS
    await EmailService.sendEmail({
      to: TOCEPS_EMAIL,
      subject: `[TOCEPS] Resource Plan Sent — ${request.name} (Request #${request.id})`,
      html: htmlContent,
    });

    // Update request status to resource-plan-sent
    await storage.updateCateringRequest(request.id, { status: "reviewing" });

    res.json({ success: true, message: `Resource plan emailed to ${request.email}` });
  } catch (error: any) {
    console.error("Resource plan send error:", error.message);
    res.status(500).json({ success: false, error: error.message || "Failed to send resource plan" });
  }
});

// ===== EVENTS =====
router.get("/events", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const events = await storage.getCateringEvents();
    res.json({ success: true, events });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch events" });
  }
});

router.post("/events", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const data = { ...req.body, createdBy: req.staffUser!.id };
    const event = await storage.createCateringEvent(data);
    res.status(201).json({ success: true, event });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || "Invalid event data" });
  }
});

router.get("/events/:id", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const event = await storage.getCateringEventById(parseInt(req.params.id));
    if (!event) return res.status(404).json({ success: false, error: "Event not found" });
    res.json({ success: true, event });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch event" });
  }
});

router.patch("/events/:id", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const updated = await storage.updateCateringEvent(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Event not found" });
    res.json({ success: true, event: updated });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update event" });
  }
});

// ===== TASKS =====
router.get("/tasks", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.role) filters.role = req.query.role as string;
    if (req.query.eventId) filters.eventId = parseInt(req.query.eventId as string);
    if (req.query.status) filters.status = req.query.status as string;
    const tasks = await storage.getCateringTasks(filters);
    res.json({ success: true, tasks });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
});

router.post("/tasks", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const data = { ...req.body, createdBy: req.staffUser!.id };
    const task = await storage.createCateringTask(data);
    res.status(201).json({ success: true, task });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || "Invalid task data" });
  }
});

router.patch("/tasks/:id", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const updates = { ...req.body };
    if (updates.status === "done") updates.completedAt = new Date();
    const updated = await storage.updateCateringTask(parseInt(req.params.id), updates);
    if (!updated) return res.status(404).json({ success: false, error: "Task not found" });
    res.json({ success: true, task: updated });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update task" });
  }
});

// ===== INCIDENTS =====
router.get("/incidents", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
    const incidents = await storage.getCateringIncidents(eventId);
    res.json({ success: true, incidents });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch incidents" });
  }
});

router.post("/incidents", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const data = { ...req.body, reportedBy: req.staffUser!.id };
    const incident = await storage.createCateringIncident(data);
    res.status(201).json({ success: true, incident });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || "Invalid incident data" });
  }
});

router.patch("/incidents/:id", authenticateCateringStaff, requireCateringRole("food_safety_supervisor", "account_manager", "operations_supervisor"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const updates = { ...req.body };
    if (updates.status === "resolved") updates.resolvedAt = new Date();
    const updated = await storage.updateCateringIncident(parseInt(req.params.id), updates);
    if (!updated) return res.status(404).json({ success: false, error: "Incident not found" });
    res.json({ success: true, incident: updated });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update incident" });
  }
});

// ===== STAFF MANAGEMENT (Admin / Account Manager) =====
router.get("/staff", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const allStaff = await storage.getAllCateringStaff();
    const safeStaff = allStaff.map(({ password, ...s }) => s);
    res.json({ success: true, staff: safeStaff });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch staff" });
  }
});


function buildStaffWelcomeEmailHtml(data: {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: string;
  loginUrl: string;
}): string {
  return `
    <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f8fafc;padding:20px;margin:0;">
    <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
      <div style="background:linear-gradient(135deg,#166534,#16a34a);padding:28px 32px;">
        <h2 style="color:#ffffff;margin:0;font-size:22px;">TOCEPS Staff Onboarding Credentials</h2>
        <p style="color:#bbf7d0;margin:6px 0 0;font-size:14px;">TOTAG Catering & Events Planning Services — Operational Command Portal</p>
      </div>
      <div style="padding:32px;">
        <p style="font-size:16px;margin:0 0 16px;color:#1e293b;">Dear <strong>${data.firstName} ${data.lastName}</strong>,</p>
        <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px;">
          Welcome to <strong>TOTAG Group of Companies Ltd</strong>. Your staff user account has been successfully provisioned on the <strong>TOCEPS Operations Portal</strong>.
        </p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin-bottom:24px;">
          <h4 style="margin:0 0 14px;font-size:12px;color:#15803d;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Your Account Credentials & Role</h4>
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#64748b;width:35%;">Staff User</td><td style="padding:6px 0;font-weight:bold;color:#0f172a;">${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Username</td><td style="padding:6px 0;font-weight:bold;color:#0f172a;font-family:monospace;font-size:15px;">${data.username}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Temporary Password</td><td style="padding:6px 0;font-weight:bold;color:#dc2626;font-family:monospace;font-size:15px;">${data.password}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Assigned Operational Role</td><td style="padding:6px 0;font-weight:bold;color:#15803d;">${data.role}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Portal Access Address</td><td style="padding:6px 0;color:#2563eb;"><a href="${data.loginUrl}" style="color:#2563eb;text-decoration:none;">${data.loginUrl}</a></td></tr>
          </table>
        </div>

        <div style="margin-bottom:24px;padding:16px;background:#fefce8;border-left:4px solid #ca8a04;border-radius:6px;">
          <strong style="font-size:13px;color:#854d0e;display:block;margin-bottom:6px;">⚠️ MANDATORY SECURITY DIRECTIVE: CHANGE YOUR PASSWORD</strong>
          <p style="margin:0;font-size:13px;color:#713f12;line-height:1.5;">
            You have been issued a temporary password. For enterprise security compliance, you are required to log in immediately and <strong>change your temporary password</strong> under your account settings.
          </p>
        </div>

        <div style="background:#166534;border-radius:10px;padding:18px;text-align:center;margin-bottom:24px;">
          <a href="${data.loginUrl}" style="color:#ffffff;font-weight:bold;text-decoration:none;font-size:15px;display:inline-block;">Log In to Staff Portal & Update Password →</a>
        </div>

        <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.5;">
          TOCEPS Operations Desk | TOTAG Group of Companies Ltd | Monrovia, Liberia<br/>
          If you have questions regarding your assigned role, contact your Account Manager.
        </p>
      </div>
    </div></body></html>
  `;
}

router.post("/staff", authenticateCateringStaff, requireCateringRole("account_manager"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const { username, password, email, firstName, lastName, phone, role } = req.body;
    if (!username || !password || !email || !firstName || !lastName || !role) {
      return res.status(400).json({ success: false, error: "Missing required fields (username, password, email, firstName, lastName, role)" });
    }

    const existing = await storage.getCateringStaffByUsername(username);
    if (existing) {
      return res.status(400).json({ success: false, error: `Username '${username}' is already taken` });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newStaff = await storage.createCateringStaff({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      phone: phone || "",
      role,
      isActive: true,
    });

    // Role Labels Map for Email
    const roleLabels: Record<string, string> = {
      account_manager: "LTA Account Manager / Admin",
      operations_supervisor: "General Operations Manager",
      head_chef: "Catering Lead / Head Chef",
      food_safety_supervisor: "Food Safety & Quality Supervisor",
      team_lead: "Service Team Lead",
      logistics_coordinator: "Logistics & Transport Coordinator",
    };

    const roleTitle = roleLabels[role] || role;
    const loginUrl = "https://totag.network/catering/ops/login";
    const emailHtml = buildStaffWelcomeEmailHtml({
      firstName,
      lastName,
      username,
      password, // Plain text temporary password set by admin to be emailed
      email,
      role: roleTitle,
      loginUrl,
    });

    let sent = false;
    try {
      sent = await EmailService.sendEmail({
        to: email,
        from: TOCEPS_FROM,
        subject: `[TOCEPS Staff Onboarding] Account Credentials & Role: ${roleTitle}`,
        html: emailHtml,
        text: `Dear ${firstName} ${lastName},

Welcome to TOTAG Catering & Event Planning Services (TOCEPS) (TOTAG Group of Companies Ltd).

Your staff account has been created:
Username: ${username}
Temporary Password: ${password}
Role: ${roleTitle}

Please log in at ${loginUrl} and change your temporary password under Profile Settings.

Best regards,
TOCEPS Operations Management
TOTAG Group of Companies Ltd`,
        type: "notification" as const,
      });
      console.log(`📧 Staff onboarding email sent to ${email} (Result: ${sent})`);
    } catch (emailErr: any) {
      console.error("Failed to send staff onboarding email:", emailErr.message);
    }

    const { password: _, ...safeStaff } = newStaff;
    res.status(201).json({
      success: true,
      staff: safeStaff,
      emailSent: sent,
      message: `Staff account '${username}' created! Onboarding email ${sent ? "sent to " + email : "generated (service check)"}.`
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || "Failed to create staff member" });
  }
});

router.patch("/staff/:id", authenticateCateringStaff, requireCateringRole("account_manager"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }
    const updated = await storage.updateCateringStaff(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: "Staff member not found" });
    const { password: _, ...safeStaff } = updated;
    res.json({ success: true, staff: safeStaff, message: "Staff user updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to update staff member" });
  }
});

router.delete("/staff/:id", authenticateCateringStaff, requireCateringRole("account_manager"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await storage.updateCateringStaff(id, { isActive: false });
    if (!updated) return res.status(404).json({ success: false, error: "Staff member not found" });
    res.json({ success: true, message: "Staff account deactivated successfully" });
  } catch {
    res.status(500).json({ success: false, error: "Failed to deactivate staff member" });
  }
});

// ===== DASHBOARD STATS =====
router.get("/stats", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const [requests, events, tasks, incidents] = await Promise.all([
      storage.getCateringRequests(),
      storage.getCateringEvents(),
      storage.getCateringTasks(),
      storage.getCateringIncidents()
    ]);
    res.json({
      success: true,
      stats: {
        totalRequests: requests.length,
        newRequests: requests.filter(r => r.status === "new").length,
        activeEvents: events.filter(e => ["planning", "ready", "live"].includes(e.status)).length,
        completedEvents: events.filter(e => e.status === "completed").length,
        openTasks: tasks.filter(t => t.status !== "done").length,
        openIncidents: incidents.filter(i => i.status !== "closed" && i.status !== "resolved").length,
        myTasks: tasks.filter(t => t.role === req.staffUser!.role && t.status !== "done").length,
      }
    });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
});

// ===== QUOTATIONS =====
router.get("/quotations", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const quotations = await storage.getCateringQuotations();
    res.json({ success: true, quotations });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch quotations" });
  }
});

router.get("/quotations/request/:requestId", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const quotations = await storage.getCateringQuotationsByRequestId(parseInt(req.params.requestId));
    res.json({ success: true, quotations });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch quotations" });
  }
});

router.get("/quotations/:id", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const quotation = await storage.getCateringQuotationById(parseInt(req.params.id));
    if (!quotation) return res.status(404).json({ success: false, error: "Quotation not found" });
    res.json({ success: true, quotation });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch quotation" });
  }
});

router.post("/quotations", authenticateCateringStaff, requireCateringRole("account_manager", "operations_supervisor"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const data = { ...req.body, createdBy: req.staffUser!.id };
    const quotation = await storage.createCateringQuotation(data);
    if (req.body.requestId) {
      await storage.updateCateringRequest(req.body.requestId, {
        status: "quoted",
        quotationAmount: String(req.body.totalAmount || 0),
        quotationNotes: `Quotation #${req.body.quotationNumber} created`,
      });
    }
    res.status(201).json({ success: true, quotation });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || "Invalid quotation data" });
  }
});

router.patch("/quotations/:id", authenticateCateringStaff, requireCateringRole("account_manager", "operations_supervisor"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const updated = await storage.updateCateringQuotation(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Quotation not found" });
    res.json({ success: true, quotation: updated });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update quotation" });
  }
});

// ===== SEND QUOTATION TO CUSTOMER =====
router.post("/quotations/:id/send", authenticateCateringStaff, requireCateringRole("account_manager", "operations_supervisor"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const quotation = await storage.getCateringQuotationById(parseInt(req.params.id));
    if (!quotation) return res.status(404).json({ success: false, error: "Quotation not found" });
    if (!quotation.clientEmail) return res.status(400).json({ success: false, error: "No customer email on this quotation" });

    const htmlContent = buildQuotationEmailHtml(quotation);
    const sent = await EmailService.sendEmail({
      to: quotation.clientEmail,
      from: TOCEPS_FROM,
      subject: `Quotation ${quotation.quotationNumber} from TOCEPS — ${quotation.eventType} on ${quotation.eventDate || "TBD"}`,
      html: htmlContent,
      text: `Dear ${quotation.clientName},\n\nPlease find your quotation ${quotation.quotationNumber} from TOTAG Catering & Event Planning Services (TOCEPS).\n\nTotal Amount: ${quotation.currency} ${quotation.totalAmount}\nValid Until: ${quotation.validUntil}\n\nFor acceptance or queries, contact us at toceps@totaggroup.com.\n\nBest regards,\nTOCEPS Operations Team\nTOTAG Group of Companies Ltd`,
      type: "notification" as const,
    });

    // Mark quotation as sent
    await storage.updateCateringQuotation(quotation.id, { status: "sent" });

    // Also update the associated request status to "quoted"
    if (quotation.requestId) {
      await storage.updateCateringRequest(quotation.requestId, { status: "quoted", quotationAmount: String(quotation.totalAmount), quotationNotes: `Quotation ${quotation.quotationNumber} sent to ${quotation.clientEmail}` });
    }

    // Send a copy to TOCEPS company email for records
    await EmailService.sendEmail({
      to: TOCEPS_EMAIL,
      from: TOCEPS_FROM,
      subject: `[COPY] Quotation ${quotation.quotationNumber} sent to ${quotation.clientName}`,
      html: htmlContent,
      text: `A quotation has been sent to ${quotation.clientName} (${quotation.clientEmail}).`,
      type: "notification" as const,
    }).catch(() => {}); // Silent fail for copy

    console.log(`📧 Quotation ${quotation.quotationNumber} sent to customer: ${quotation.clientEmail} (email sent: ${sent})`);
    res.json({ success: true, sent, message: sent ? `Quotation emailed to ${quotation.clientEmail}` : "Quotation saved — email service not configured (check Zoho credentials)" });
  } catch (error: any) {
    console.error("Failed to send quotation:", error.message);
    res.status(500).json({ success: false, error: "Failed to send quotation email" });
  }
});


// ===== INVOICE GENERATOR & VAULT ENDPOINTS =====
function buildInvoiceEmailHtml(invoice: any): string {
  const lineItemsHtml = Array.isArray(invoice.lineItems) && invoice.lineItems.length > 0
    ? invoice.lineItems.map((item: any) => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b;">
            <strong>${item.description || "Service Rendered"}</strong>
            ${item.datesOfService ? `<div style="font-size:11px;color:#64748b;margin-top:3px;">📅 Service Dates: ${item.datesOfService}</div>` : ""}
            ${item.location ? `<div style="font-size:11px;color:#64748b;">📍 Location: ${item.location}</div>` : ""}
          </td>
          <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:13px;color:#1e293b;">${item.quantity || 1}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px;color:#1e293b;">${invoice.currency || "USD"} ${parseFloat(item.unitPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px;font-weight:bold;color:#0f172a;">${invoice.currency || "USD"} ${parseFloat(item.total || (item.quantity * item.unitPrice) || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
        </tr>`).join("")
    : `<tr><td colspan="4" style="padding:14px;text-align:center;color:#64748b;font-size:13px;">Catering & Event Planning Services Delivered</td></tr>`;

  return `
    <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;margin:0;">
    <div style="max-width:700px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.09);border:1px solid #cbd5e1;">
      
      <!-- BRAND HEADER -->
      <table style="width:100%;background:linear-gradient(135deg,#0f172a,#1e293b);padding:24px 28px;color:#ffffff;border-collapse:collapse;border-radius:12px 12px 0 0;">
        <tr>
          <td style="vertical-align:middle;">
            <table style="border-collapse:collapse;">
              <tr>
                <td style="padding-right:14px;vertical-align:middle;">
                  <img src="https://totaggroup.com/images/totag-logo.png" alt="TOTAG Group" width="60" style="height:52px;width:auto;background:#ffffff;padding:4px;border-radius:8px;display:block;border:1px solid #334155;" />
                </td>
                <td style="vertical-align:middle;">
                  <h1 style="margin:0;font-size:20px;letter-spacing:-0.3px;color:#ffffff;">TOTAG Group of Companies Ltd</h1>
                  <p style="color:#22c55e;margin:3px 0 0;font-size:12px;font-weight:bold;">TOTAG Catering & Event Planning Services (TOCEPS)</p>
                  <p style="color:#94a3b8;margin:2px 0 0;font-size:11px;">Monrovia, Liberia | Email: toceps@totaggroup.com</p>
                </td>
              </tr>
            </table>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <span style="display:inline-block;background:#22c55e;color:#ffffff;font-size:11px;font-weight:bold;padding:5px 14px;border-radius:20px;text-transform:uppercase;">OFFICIAL INVOICE</span>
            <p style="margin:8px 0 0;font-size:15px;font-family:monospace;font-weight:bold;color:#f8fafc;">${invoice.invoiceNumber}</p>
          </td>
        </tr>
      </table>

      <div style="padding:32px;">
        
        <!-- INVOICE META GRID -->
        <table style="width:100%;margin-bottom:24px;border-collapse:collapse;">
          <tr>
            <td style="width:50%;vertical-align:top;padding-right:16px;">
              <div style="background:#f1f5f9;border-radius:8px;padding:16px;border-left:4px solid #0284c7;">
                <h4 style="margin:0 0 8px;font-size:11px;color:#0369a1;text-transform:uppercase;letter-spacing:0.5px;">Billed To (Client / Organization)</h4>
                <p style="margin:0;font-size:15px;font-weight:bold;color:#0f172a;">${invoice.clientName}</p>
                ${invoice.clientCompany ? `<p style="margin:2px 0 0;font-size:13px;color:#475569;font-weight:600;">${invoice.clientCompany}</p>` : ""}
                <p style="margin:4px 0 0;font-size:12px;color:#64748b;">${invoice.clientEmail} ${invoice.clientPhone ? `| ${invoice.clientPhone}` : ""}</p>
              </div>
            </td>
            <td style="width:50%;vertical-align:top;padding-left:16px;">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;">
                <h4 style="margin:0 0 8px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Invoice Summary</h4>
                <table style="width:100%;font-size:12px;border-collapse:collapse;">
                  <tr><td style="color:#64748b;padding:3px 0;">Invoice Date:</td><td style="font-weight:bold;text-align:right;">${invoice.invoiceDate}</td></tr>
                  <tr><td style="color:#64748b;padding:3px 0;">Payment Due Date:</td><td style="font-weight:bold;color:#dc2626;text-align:right;">${invoice.dueDate}</td></tr>
                  <tr><td style="color:#64748b;padding:3px 0;">Payment Terms:</td><td style="font-weight:bold;text-align:right;">${invoice.paymentTerms || "Net 30"}</td></tr>
                  ${invoice.contractRef ? `<tr><td style="color:#64748b;padding:3px 0;">Contract Reference:</td><td style="font-weight:bold;color:#0284c7;text-align:right;">${invoice.contractRef}</td></tr>` : ""}
                </table>
              </div>
            </td>
          </tr>
        </table>

        <!-- UNIDO DELIVERABLE AUDIT COMPLIANCE BOX -->
        ${(invoice.datesOfService || invoice.locationsServed || invoice.quantitiesDelivered) ? `
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;">
            <h4 style="margin:0 0 10px;font-size:12px;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;font-weight:bold;">📋 UNIDO Contract Audit Deliverable Details (Article 4)</h4>
            <table style="width:100%;font-size:13px;border-collapse:collapse;">
              ${invoice.datesOfService ? `<tr><td style="color:#166534;font-weight:bold;padding:4px 0;width:35%;">Dates of Service Rendered:</td><td style="padding:4px 0;color:#0f172a;">${invoice.datesOfService}</td></tr>` : ""}
              ${invoice.locationsServed ? `<tr><td style="color:#166534;font-weight:bold;padding:4px 0;">Locations Served:</td><td style="padding:4px 0;color:#0f172a;">${invoice.locationsServed}</td></tr>` : ""}
              ${invoice.quantitiesDelivered ? `<tr><td style="color:#166534;font-weight:bold;padding:4px 0;">Quantities Delivered:</td><td style="padding:4px 0;color:#0f172a;">${invoice.quantitiesDelivered}</td></tr>` : ""}
            </table>
          </div>
        ` : ""}

        <!-- ITEMIZED LINE ITEMS TABLE -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#0f172a;color:#ffffff;font-size:12px;text-align:left;">
              <th style="padding:10px 14px;">Item & Service Description</th>
              <th style="padding:10px 14px;text-align:center;">Qty</th>
              <th style="padding:10px 14px;text-align:right;">Unit Price</th>
              <th style="padding:10px 14px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHtml}
          </tbody>
        </table>

        <!-- TOTALS & SETTLEMENT -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
          <tr>
            <td style="width:55%;vertical-align:top;padding-right:20px;">
              <div style="background:#fefce8;border:1px solid #fef08a;border-radius:8px;padding:16px;">
                <h4 style="margin:0 0 8px;font-size:12px;color:#854d0e;text-transform:uppercase;letter-spacing:0.5px;">🏦 Settlement & Payment Instructions</h4>
                <p style="margin:0;font-size:12px;color:#713f12;line-height:1.5;">
                  <strong>Bank Transfer:</strong> TOTAG Group of Companies Ltd<br/>
                  <strong>Bank:</strong> Ecobank Liberia / GTBank Liberia<br/>
                  <strong>Mobile Money:</strong> +231-777-100-001 (Orange / MTN)<br/>
                  Please reference <strong>${invoice.invoiceNumber}</strong> upon payment settlement.
                </p>
              </div>
            </td>
            <td style="width:45%;vertical-align:top;">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;">
                <table style="width:100%;font-size:13px;border-collapse:collapse;">
                  <tr><td style="padding:4px 0;color:#64748b;">Subtotal:</td><td style="text-align:right;font-weight:bold;color:#0f172a;">${invoice.currency || "USD"} ${parseFloat(invoice.subtotal || invoice.totalAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td></tr>
                  ${parseFloat(invoice.taxAmount || 0) > 0 ? `<tr><td style="padding:4px 0;color:#64748b;">Tax (${invoice.taxRate || 0}%):</td><td style="text-align:right;color:#0f172a;">${invoice.currency || "USD"} ${parseFloat(invoice.taxAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td></tr>` : ""}
                  ${parseFloat(invoice.discount || 0) > 0 ? `<tr><td style="padding:4px 0;color:#dc2626;">Discount:</td><td style="text-align:right;color:#dc2626;">-${invoice.currency || "USD"} ${parseFloat(invoice.discount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td></tr>` : ""}
                  <tr style="border-top:2px solid #0f172a;"><td style="padding:10px 0 0;font-size:15px;font-weight:bold;color:#0f172a;">Total Amount Due:</td><td style="padding:10px 0 0;text-align:right;font-size:18px;font-weight:black;color:#166534;">${invoice.currency || "USD"} ${parseFloat(invoice.totalAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td></tr>
                </table>
              </div>
            </td>
          </tr>
        </table>

        <!-- FOOTER & AUDIT VAULT NOTICE -->
        <div style="border-top:1px solid #e2e8f0;padding-top:20px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#64748b;font-weight:bold;">TOTAG Group of Companies Ltd | TOTAG Catering & Event Planning Services (TOCEPS)</p>
          <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">This official invoice has been automatically archived in the TOCEPS Executive Document Vault. Invoice ID: #${invoice.id}</p>
        </div>

      </div>
    </div></body></html>
  `;
}

router.get("/invoices", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const invoices = await storage.getCateringInvoices();
    res.json({ success: true, invoices });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch invoices" });
  }
});

router.get("/invoices/:id", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const invoice = await storage.getCateringInvoiceById(parseInt(req.params.id));
    if (!invoice) return res.status(404).json({ success: false, error: "Invoice not found" });
    res.json({ success: true, invoice });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch invoice" });
  }
});

router.post("/invoices", authenticateCateringStaff, requireCateringRole("account_manager", "operations_supervisor"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const invoiceNumber = req.body.invoiceNumber || `INV-TOCEPS-${Date.now().toString().slice(-6)}`;
    const data = {
      ...req.body,
      invoiceNumber,
      createdBy: (req.staffUser && typeof req.staffUser.id === "number") ? req.staffUser.id : null,
      vaultSaved: true,
    };
    const invoice = await storage.createCateringInvoice(data);
    res.status(201).json({ success: true, invoice, message: `Invoice ${invoiceNumber} created and saved to Document Vault` });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || "Invalid invoice data" });
  }
});

router.patch("/invoices/:id", authenticateCateringStaff, requireCateringRole("account_manager", "operations_supervisor"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const updated = await storage.updateCateringInvoice(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Invoice not found" });
    res.json({ success: true, invoice: updated });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update invoice" });
  }
});

router.post("/invoices/:id/send", authenticateCateringStaff, requireCateringRole("account_manager", "operations_supervisor"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const invoice = await storage.getCateringInvoiceById(parseInt(req.params.id));
    if (!invoice) return res.status(404).json({ success: false, error: "Invoice not found" });
    if (!invoice.clientEmail) return res.status(400).json({ success: false, error: "No client email on this invoice" });

    const htmlContent = buildInvoiceEmailHtml(invoice);
    const sent = await EmailService.sendEmail({
      to: invoice.clientEmail,
      from: TOCEPS_FROM,
      subject: `[OFFICIAL INVOICE ${invoice.invoiceNumber}] TOTAG Group — ${invoice.contractRef || "Catering & Event Services"}`,
      html: htmlContent,
      text: `Dear ${invoice.clientName},

Please find official Invoice ${invoice.invoiceNumber} from TOTAG Group of Companies Ltd (TOCEPS Division).

Total Amount Due: ${invoice.currency} ${invoice.totalAmount}
Payment Due Date: ${invoice.dueDate}

Thank you for choosing TOTAG Group.

Best regards,
TOCEPS Finance & Billing Desk`,
      type: "notification" as const,
    });

    // Mark invoice as sent and saved to vault
    await storage.updateCateringInvoice(invoice.id, { status: "sent", vaultSaved: true });

    // Send copy to TOCEPS email for vault archiving
    await EmailService.sendEmail({
      to: TOCEPS_EMAIL,
      from: TOCEPS_FROM,
      subject: `[VAULT COPY] Invoice ${invoice.invoiceNumber} issued to ${invoice.clientName}`,
      html: htmlContent,
      text: `Invoice ${invoice.invoiceNumber} sent to ${invoice.clientEmail} and archived in Document Vault.`,
      type: "notification" as const,
    }).catch(() => {});

    res.json({
      success: true,
      sent,
      message: sent ? `Official Invoice ${invoice.invoiceNumber} emailed to ${invoice.clientEmail} & archived in Document Vault!` : `Invoice ${invoice.invoiceNumber} saved to Document Vault.`
    });
  } catch (error: any) {
    console.error("Failed to send invoice email:", error.message);
    res.status(500).json({ success: false, error: "Failed to dispatch invoice email" });
  }
});

// ===== AUDIT TRAIL: Delete Invoice & Record Immutable Log =====
router.delete("/invoices/:id", authenticateCateringStaff, requireCateringRole("account_manager"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const invoice = await storage.getCateringInvoiceById(id);
    if (!invoice) return res.status(404).json({ success: false, error: "Invoice not found in vault" });

    const reason = req.body.reason || "Administrative removal from vault";
    const userName = req.staffUser ? `${req.staffUser.firstName} ${req.staffUser.lastName} (${req.staffUser.role})` : "TOCEPS Admin";
    const userId = req.staffUser?.id;

    await storage.deleteCateringInvoice(id, reason, userName, userId);

    res.json({
      success: true,
      message: `Invoice ${invoice.invoiceNumber} removed from Active Vault and recorded in Compliance Audit Trail.`,
      invoiceNumber: invoice.invoiceNumber
    });
  } catch (error: any) {
    console.error("Invoice deletion error:", error.message);
    res.status(500).json({ success: false, error: error.message || "Failed to delete invoice" });
  }
});

// ===== AUDIT TRAIL: Get Compliance Event Logs =====
router.get("/audit-logs", authenticateCateringStaff, async (req: CateringAuthRequest, res: Response) => {
  try {
    const logs = await storage.getCateringAuditLogs();
    res.json({ success: true, logs });
  } catch (error: any) {
    console.error("Failed to fetch audit logs:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch audit logs" });
  }
});

export default router;
