import re

routes_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\server\cateringRoutes.ts"

with open(routes_path, "r", encoding="utf-8") as f:
    code = f.read()

invoice_routes_code = '''
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
      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:32px;color:#ffffff;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h1 style="margin:0;font-size:24px;letter-spacing:-0.5px;color:#ffffff;">OFFICIAL INVOICE</h1>
          <p style="color:#38bdf8;margin:6px 0 0;font-size:13px;font-weight:bold;">TOTAG Group of Companies Ltd — TOCEPS Division</p>
          <p style="color:#94a3b8;margin:4px 0 0;font-size:12px;">Monrovia, Liberia | Email: toceps@totaggroup.com</p>
        </div>
        <div style="text-align:right;">
          <span style="display:inline-block;background:#22c55e;color:#ffffff;font-size:12px;font-weight:bold;padding:4px 12px;border-radius:20px;text-transform:uppercase;">OFFICIAL BILLING</span>
          <p style="margin:8px 0 0;font-size:16px;font-family:monospace;font-weight:bold;color:#f8fafc;">${invoice.invoiceNumber}</p>
        </div>
      </div>

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
          <p style="margin:0;font-size:12px;color:#64748b;font-weight:bold;">TOTAG Group of Companies Ltd | TOCEPS Catering & Events Services</p>
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
      createdBy: req.staffUser!.id,
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
      text: `Dear ${invoice.clientName},\n\nPlease find official Invoice ${invoice.invoiceNumber} from TOTAG Group of Companies Ltd (TOCEPS Division).\n\nTotal Amount Due: ${invoice.currency} ${invoice.totalAmount}\nPayment Due Date: ${invoice.dueDate}\n\nThank you for choosing TOTAG Group.\n\nBest regards,\nTOCEPS Finance & Billing Desk`,
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
'''

# Append invoice_routes_code right before export default router;
if "export default router;" in code:
    updated_code = code.replace("export default router;", invoice_routes_code + "\nexport default router;")
    with open(routes_path, "w", encoding="utf-8") as f:
        f.write(updated_code)
    print("Successfully added Invoice Endpoints & Email Vault dispatch to server/cateringRoutes.ts!")
else:
    print("Could not find export default router!")
