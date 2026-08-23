import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { EmailService } from "./emailService";
import saasRoutes from "./saasRoutes";
import cateringRoutes from "./cateringRoutes";
import { getSaasStorage } from "./saasStorageFactory";
import { 
  insertContactInquirySchema, 
  insertServiceSchema,
  insertTgmWholesaleOrderSchema,
  insertTgmRetailSaleSchema,
  insertTgmInventorySchema,
  insertTgmSupplierSchema,
  insertTgmDeliverySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // DEVELOPMENT ONLY: Credential retrieval endpoint 
  if (process.env.NODE_ENV === 'development') {
    app.get('/api/dev/credentials/:email', async (req, res) => {
      try {
        const { email } = req.params;
        const saasStorage = getSaasStorage();
        
        // Get all users to find the one with this email
        const users = await saasStorage.listAllUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        // Get tenant info
        const tenant = await saasStorage.getTenantById(user.tenantId);
        
        res.json({
          message: 'Development credentials (this endpoint only works in dev mode)',
          email: user.email,
          temporaryPasswordNote: 'Password was generated and hashed - use password reset function',
          tenant: tenant?.name,
          tenantSlug: tenant?.slug,
          userRole: user.role,
          mustChangePassword: user.mustChangePassword,
          userInfo: {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve credentials' });
      }
    });
  }

  // Mount SaaS routes
  app.use("/api/saas", saasRoutes);
  app.use("/api/catering", cateringRoutes);

  // Cargo Operations Endpoints
  app.get("/api/cargo/shipments", async (req, res) => {
    try {
      const shipments = await storage.getCargoShipments();
      res.json(shipments);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/cargo/track/:trackingNumber", async (req, res) => {
    try {
      const shipment = await storage.getCargoShipmentByTracking(req.params.trackingNumber);
      if (!shipment) return res.status(404).json({ error: "Shipment not found" });
      res.json(shipment);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

    // Cargo Clearing Contract Execution & Customer Onboarding Email Dispatch
  
  // In-Memory / File Persistent Cargo Contracts Vault
  const CARGO_CONTRACTS_VAULT: any[] = [
    {
      contractId: "TOTAG-POA-2026-2798",
      companyName: "Jutu Enterprise Ltd",
      email: "rtalk4348@gmail.com",
      phone: "+231-777-666-876",
      tinNumber: "LRA-TIN-9940218",
      billOfLading: "TOTAG BL 9921",
      containerType: "40ft High Cube (40' HQ)",
      cargoCategory: "Standard Dry General Cargo",
      containersCount: 2,
      portOfDischarge: "Freeport of Monrovia (Berth 2)",
      authorizedSignatory: "James Doe/CEO",
      isExistingAccount: false,
      status: "ACTIVE_VERIFIED",
      executedAt: "2026-08-22 20:47:20",
      responses: [
        {
          sender: "system",
          name: "TOTAG Cargo Onboarding Desk",
          message: "Contract executed. Customs Clearing Power of Attorney filed with Liberia Revenue Authority (LRA ASYCUDA) and National Port Authority (NPA).",
          timestamp: "2026-08-22 20:47:22"
        }
      ]
    }
  ];

  // GET /api/cargo/contracts - List all vault contracts
  app.get("/api/cargo/contracts", (req, res) => {
    const email = req.query.email as string;
    if (email) {
      const filtered = CARGO_CONTRACTS_VAULT.filter(c => c.email.toLowerCase() === email.toLowerCase());
      return res.json(filtered);
    }
    res.json(CARGO_CONTRACTS_VAULT);
  });

  // POST /api/cargo/contracts/:id/response - Customer or Broker response
  app.post("/api/cargo/contracts/:id/response", async (req, res) => {
    try {
      const { id } = req.params;
      const { sender, name, message } = req.body;
      const contract = CARGO_CONTRACTS_VAULT.find(c => c.contractId === id);
      if (!contract) return res.status(404).json({ error: "Contract not found in vault" });

      const newResponse = {
        sender: sender || "customer",
        name: name || "Customer Representative",
        message: message || "",
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19)
      };

      if (!contract.responses) contract.responses = [];
      contract.responses.push(newResponse);

      // Notify Cargo Desk
      await EmailService.sendEmail({
        to: "cargo@totaggroup.com",
        subject: `[CONTRACT RESPONSE] #${id} from ${contract.companyName}`,
        html: `<p>New customer response logged on Contract #${id}:</p><p><strong>${newResponse.name}:</strong> ${newResponse.message}</p>`,
        text: `New customer response logged on Contract #${id} by ${newResponse.name}: ${newResponse.message}`,
        type: "notification"
      });

      res.json({ success: true, contract });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/cargo/contracts", async (req, res) => {
    try {
      const {
        companyName,
        email,
        phone,
        tinNumber,
        billOfLading,
        containerType,
        cargoCategory,
        containersCount,
        portOfDischarge,
        authorizedSignatory,
        isExistingAccount,
        tempPassword,
        contractId
      } = req.body;

      if (!email || !companyName) {
        return res.status(400).json({ error: "Missing required fields: email and companyName" });
      }

      const generatedContractId = contractId || `TOTAG-POA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const generatedTempPass = tempPassword || `TOTAG-Pass#${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate HTML Email
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TOTAG Cargo Clearing Authorization Contract & Onboarding</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
          
          <!-- Slate Gray Header matching Website Navbar -->
          <tr>
            <td style="background-color:#1e293b;padding:22px 28px;border-bottom:3px solid #10b981;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="64" style="vertical-align:middle;">
                    <img src="cid:totag-logo" alt="TOTAG Group" width="56" height="56" style="height:52px;width:auto;background:#ffffff;padding:4px;border-radius:10px;display:block;border:1px solid #334155;" />
                  </td>
                  <td style="vertical-align:middle;padding-left:14px;">
                    <div style="font-size:19px;font-weight:900;color:#ffffff;line-height:1.2;letter-spacing:-0.3px;">
                      <span style="color:#34d399;">TOTAG</span> <span style="color:#38bdf8;">Group</span> <span style="color:#fbbf24;font-size:13px;font-weight:700;">of Companies Ltd</span>
                    </div>
                    <div style="font-size:11px;color:#cbd5e1;margin-top:2px;font-weight:500;">
                      Innovating Tomorrow, Empowering Today
                    </div>
                    <div style="font-size:12px;color:#34d399;font-weight:bold;margin-top:4px;">
                      TOTAG Cargo Handling & Logistics Services
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="background:rgba(16,185,129,0.18);color:#34d399;font-size:11px;font-weight:bold;padding:5px 12px;border-radius:20px;border:1px solid rgba(52,211,153,0.4);display:inline-block;">
                      ${isExistingAccount ? "CONTRACT CONFIRMATION" : "NEW ONBOARDING"}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:32px 28px;">
              <h2 style="color:#0f172a;font-size:18px;margin:0 0 16px;font-weight:800;">
                ${isExistingAccount ? "C&F Clearing Service Contract Executed" : "Welcome to TOTAG Cargo Enterprise Platform"}
              </h2>

              <p style="font-size:14px;color:#334155;line-height:1.6;margin:0 0 16px;">
                Dear <strong>${authorizedSignatory || "Valued Enterprise Shipper"}</strong> (${companyName}),
              </p>

              <p style="font-size:14px;color:#334155;line-height:1.6;margin:0 0 20px;">
                Thank you for executing your <strong>Customs Clearing & Forwarding (C&F) Service Contract & Power of Attorney (PoA)</strong> with TOTAG Group of Companies Ltd. Your clearing authorization is now active with the <strong>Liberia Revenue Authority (LRA ASYCUDA)</strong>, <strong>National Port Authority (NPA)</strong>, and <strong>APM Terminals</strong>.
              </p>

              ${!isExistingAccount ? `
              <!-- Automated Credentials Box -->
              <div style="background-color:#f8fafc;border:2px solid #38bdf8;border-radius:10px;padding:20px;margin-bottom:24px;">
                <div style="font-size:12px;font-weight:bold;color:#0369a1;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                  🔑 YOUR AUTOMATICALLY PROVISIONED CUSTOMER PORTAL CREDENTIALS
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
                  <tr>
                    <td style="padding:6px 0;color:#64748b;width:38%;">USERNAME / EMAIL:</td>
                    <td style="padding:6px 0;font-weight:bold;color:#0f172a;font-family:monospace;font-size:14px;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;">TEMPORARY PASSWORD:</td>
                    <td style="padding:6px 0;font-weight:bold;color:#059669;font-family:monospace;font-size:15px;background:#ecfdf5;padding-left:8px;border-radius:4px;">${generatedTempPass}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;">PORTAL ACCESS URL:</td>
                    <td style="padding:6px 0;"><a href="https://totaggroup.com/cargo/dashboard" style="color:#0284c7;font-weight:bold;text-decoration:underline;">https://totaggroup.com/cargo/dashboard</a></td>
                  </tr>
                </table>
                <div style="margin-top:14px;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:10px;">
                  * Please log in to your account and set a permanent password under your profile settings.
                </div>
              </div>` : ""}

              <!-- Contract & Cargo Specifications Summary -->
              <div style="background-color:#f0fdf4;border-left:4px solid #10b981;border-radius:6px;padding:18px;margin-bottom:24px;">
                <div style="font-size:12px;font-weight:bold;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                  📋 EXECUTED CONTRACT & CLEARING SPECIFICATIONS
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;border-collapse:collapse;">
                  <tr>
                    <td style="padding:6px 0;color:#64748b;width:40%;">Contract Reference No:</td>
                    <td style="padding:6px 0;font-weight:bold;color:#0f172a;font-family:monospace;">${generatedContractId}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;">Company / Shipper:</td>
                    <td style="padding:6px 0;font-weight:bold;color:#0f172a;">${companyName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;">Bill of Lading / AWB:</td>
                    <td style="padding:6px 0;font-weight:bold;color:#0f172a;">${billOfLading || "B/L Submitted on File"}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;">Container Specification:</td>
                    <td style="padding:6px 0;color:#334155;">${containerType || "Standard Dry Container"} (${containersCount || 1} TEU/Units)</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;">Cargo Category:</td>
                    <td style="padding:6px 0;color:#334155;">${cargoCategory || "General Commercial Merchandise"}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;">Port of Discharge & Clearance:</td>
                    <td style="padding:6px 0;color:#334155;">${portOfDischarge || "Freeport of Monrovia (Berth 2)"}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;">Authorized Signatory:</td>
                    <td style="padding:6px 0;color:#334155;">${authorizedSignatory || companyName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;">Execution Date & Status:</td>
                    <td style="padding:6px 0;font-weight:bold;color:#059669;">${new Date().toISOString().slice(0, 10)} • ACTIVE & VERIFIED</td>
                  </tr>
                </table>
              </div>

              <!-- Power of Attorney Statement -->
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 18px;margin-bottom:24px;font-size:12px;color:#64748b;line-height:1.5;">
                <strong style="color:#334155;">Legal Authorization Notice:</strong> By submitting your digital contract, you have authorized TOTAG Group of Companies Ltd to act as your appointed licensed Customs Broker with LRA, NPA, and APM Terminals to process ASYCUDA entries, pay official duties, conduct terminal examinations, and deliver cargo.
              </div>

              <!-- Action Link -->
              <div style="text-align:center;margin-bottom:24px;">
                <a href="https://totaggroup.com/cargo/dashboard/dashboard" style="background:#0f172a;color:#34d399;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;display:inline-block;border:1px solid #334155;">
                  Go to Customer Cargo Dashboard →
                </a>
              </div>

              <!-- Navy Blue Footer matching Website Footer -->
              <div style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:16px 20px;text-align:center;">
                <p style="color:#e2e8f0;margin:0;font-size:13px;font-weight:600;">For cargo status updates or container dispatch inquiries:</p>
                <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;">
                  <strong style="color:#ffffff;">Email:</strong> 
                  <a href="mailto:cargo@totaggroup.com" style="color:#38bdf8;font-weight:bold;text-decoration:underline;">cargo@totaggroup.com</a>
                  <span style="color:#64748b;margin:0 8px;">|</span>
                  <strong style="color:#ffffff;">Portal:</strong> 
                  <a href="https://totaggroup.com/cargo/dashboard" style="color:#34d399;font-weight:bold;text-decoration:underline;">totaggroup.com/cargo</a>
                </p>
              </div>

              <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;text-align:center;">
                TOTAG Cargo Handling & Logistics | TOTAG Group of Companies Ltd | Freeport of Monrovia Berth 2, Liberia
              </p>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      // Send to customer
      await EmailService.sendEmail({
        to: email,
        subject: `Welcome to TOTAG Cargo Platform - Clearing Contract #${generatedContractId} Executed`,
        html: emailHtml,
        text: `Dear ${authorizedSignatory || companyName},\n\nThank you for executing your C&F Clearing Service Contract #${generatedContractId} with TOTAG Cargo Handling & Logistics.\n\nYour Account Credentials:\nUsername: ${email}\nTemporary Password: ${generatedTempPass}\nLogin at: https://totaggroup.com/cargo/dashboard/dashboard\n\nBest regards,\nTOTAG Cargo Operations Desk\nTOTAG Group of Companies Ltd`,
        type: "notification"
      });
      console.log(`📧 Cargo onboarding email dispatched to customer: ${email}`);

      // Also send notification to Cargo Operations Desk
      await EmailService.sendEmail({
        to: "cargo@totaggroup.com",
        subject: `[NEW C&F CONTRACT] #${generatedContractId} — ${companyName} (${billOfLading || "B/L Pending"})`,
        html: emailHtml,
        text: `New C&F Clearing Contract #${generatedContractId} signed by ${companyName} (${authorizedSignatory}). Contact: ${email} / ${phone}. Bill of Lading: ${billOfLading}. Containers: ${containersCount} (${containerType}). Port: ${portOfDischarge}.`,
        type: "notification"
      });
      console.log(`📧 Cargo contract notification sent to cargo operations desk`);

            const contractRecord = {
        contractId: generatedContractId,
        companyName,
        email,
        phone,
        tinNumber,
        billOfLading,
        containerType,
        cargoCategory,
        containersCount,
        portOfDischarge,
        authorizedSignatory,
        isExistingAccount,
        status: "ACTIVE_VERIFIED",
        executedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
        responses: [
          {
            sender: "system",
            name: "TOTAG Cargo Onboarding Desk",
            message: `Contract executed. Clearing authorization activated for ${companyName} (${billOfLading || "B/L Submitted"}).`,
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19)
          }
        ]
      };
      CARGO_CONTRACTS_VAULT.unshift(contractRecord);

      res.status(201).json({
        success: true,
        contractId: generatedContractId,
        tempPassword: generatedTempPass,
        message: `Contract #${generatedContractId} executed successfully and onboarding email sent to ${email}.`
      });
    } catch (error: any) {
      console.error("Error processing cargo contract:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to process contract" });
    }
  });

  app.post("/api/cargo/shipments", async (req, res) => {
    try {
      const shipment = await storage.createCargoShipment(req.body);
      res.status(201).json(shipment);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Petroleum Operations Endpoints
  app.get("/api/petroleum/orders", async (req, res) => {
    try {
      const orders = await storage.getPetroleumOrders();
      res.json(orders);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/petroleum/orders", async (req, res) => {
    try {
      const order = await storage.createPetroleumOrder(req.body);
      res.status(201).json(order);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Heavy Equipment Rental Endpoints
  app.get("/api/equipment/rentals", async (req, res) => {
    try {
      const rentals = await storage.getEquipmentRentals();
      res.json(rentals);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/equipment/rentals", async (req, res) => {
    try {
      const rental = await storage.createEquipmentRental(req.body);
      res.status(201).json(rental);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Stationery Procurement Endpoints
  app.get("/api/stationery/orders", async (req, res) => {
    try {
      const orders = await storage.getStationeryOrders();
      res.json(orders);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/stationery/orders", async (req, res) => {
    try {
      const order = await storage.createStationeryOrder(req.body);
      res.status(201).json(order);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Solar & Smart Power Audit Endpoints
  app.get("/api/solar/audits", async (req, res) => {
    try {
      const audits = await storage.getSolarAudits();
      res.json(audits);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/solar/audits", async (req, res) => {
    try {
      const audit = await storage.createSolarAudit(req.body);
      res.status(201).json(audit);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Institutional Services Endpoints
  app.get("/api/institutional/contracts", async (req, res) => {
    try {
      const contracts = await storage.getInstitutionalContracts();
      res.json(contracts);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/institutional/contracts", async (req, res) => {
    try {
      const contract = await storage.createInstitutionalContract(req.body);
      res.status(201).json(contract);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Group CRM Party Master Endpoints
  app.get("/api/party-master", async (req, res) => {
    try {
      const parties = await storage.getParties();
      res.json(parties);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/party-master", async (req, res) => {
    try {
      const party = await storage.createParty(req.body);
      res.status(201).json(party);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Enterprise Event Bus Endpoints
  app.get("/api/enterprise/events", async (req, res) => {
    try {
      const events = await storage.getEnterpriseEvents();
      res.json(events);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/enterprise/events", async (req, res) => {
    try {
      const event = await storage.publishEnterpriseEvent(req.body);
      res.status(201).json(event);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Executive Control Tower Combined Metrics Endpoint
  app.get("/api/executive/metrics", async (req, res) => {
    try {
      const shipments = await storage.getCargoShipments();
      const fuelOrders = await storage.getPetroleumOrders();
      const equipmentRentals = await storage.getEquipmentRentals();
      const stationeryOrders = await storage.getStationeryOrders();
      const contracts = await storage.getInstitutionalContracts();
      const solarAudits = await storage.getSolarAudits();

      res.json({
        groupRevenueUsd: 1428500,
        grossMarginPercentage: 38.4,
        cashPositionUsd: 840200,
        receivablesUsd: 312000,
        activeContractsCount: contracts.length || 14,
        activeCargoJobsCount: shipments.length || 8,
        activePetroleumDeliveriesCount: fuelOrders.length || 6,
        activeConstructionRentalsCount: equipmentRentals.length || 11,
        activeStationeryOrdersCount: stationeryOrders.length || 18,
        subsidiariesPerformance: [
          { name: "TOTAG Cargo Handling", revenueUsd: 320000, margin: 42.1, status: "Optimal" },
          { name: "TOTAG Petroleum Services", revenueUsd: 410000, margin: 28.5, status: "Optimal" },
          { name: "TOTAG General Construction", revenueUsd: 280000, margin: 34.0, status: "Optimal" },
          { name: "TOTAG IT Services & SaaS", revenueUsd: 195000, margin: 68.2, status: "Optimal" },
          { name: "TOTAG General Merchandise", revenueUsd: 140000, margin: 31.4, status: "Optimal" },
          { name: "TOTAG Catering (TCEPS)", revenueUsd: 85000, margin: 36.8, status: "Optimal" },
          { name: "TOTAG FARM", revenueUsd: 62000, margin: 45.0, status: "Optimal" },
          { name: "TOTAG Stationery Supplies", revenueUsd: 48000, margin: 29.0, status: "Optimal" },
          { name: "TOTAG Solar Energy", revenueUsd: 88000, margin: 41.5, status: "Optimal" },
        ]
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });


  // Contact inquiries routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      const inquiry = await storage.createContactInquiry(validatedData);
      res.json({ success: true, inquiry });
    } catch (error) {
      console.error("Contact inquiry error:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid request data" 
      });
    }
  });

  app.get("/api/contact-inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getContactInquiries();
      res.json({ success: true, inquiries });
    } catch (error) {
      console.error("Get inquiries error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch inquiries" });
    }
  });

  app.patch("/api/contact-inquiries/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["new", "contacted", "resolved"].includes(status)) {
        return res.status(400).json({ success: false, error: "Invalid status" });
      }

      const inquiry = await storage.updateContactInquiryStatus(id, status);
      if (!inquiry) {
        return res.status(404).json({ success: false, error: "Inquiry not found" });
      }

      res.json({ success: true, inquiry });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({ success: false, error: "Failed to update status" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      console.log("Login attempt for username:", username);
      
      const user = await storage.validateLogin(username, password);

      if (!user) {
        console.log("Login failed for username:", username);
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Create session (simplified - in production use proper session management)
      const sessionData = {
        id: user.id,
        username: user.username,
        role: user.role,
        department: user.department,
        firstName: user.firstName,
        lastName: user.lastName
      };

      res.json({ 
        success: true, 
        user: sessionData,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      res.json({ success: true, message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      res.json({ success: true, services });
    } catch (error) {
      console.error("Get services error:", error);
      // Fallback to TOTAG Group services when database is unavailable
      const totagServices = [
        {
          id: 'totag-cargo',
          title: 'TOTAG Cargo Handling',
          description: 'Port management, logistics, demurrage calculator, and waybill tracking.',
          icon: 'Truck',
          color: 'blue',
          tags: ['Port Management', 'Logistics', 'Demurrage Calculator'],
          slug: 'cargo'
        },
        {
          id: 'totag-farm',
          title: 'TOTAG FARM',
          description: 'AgriTech ERP, batch traceability, and produce marketplace.',
          icon: 'Wheat',
          color: 'green',
          tags: ['Agriculture', 'AgriTech ERP', 'Traceability'],
          slug: 'farm'
        },
        {
          id: 'totag-petroleum',
          title: 'TOTAG Petroleum Services',
          description: 'Fuel distribution, storage tank telemetry, and tanker dispatch.',
          icon: 'Fuel',
          color: 'orange',
          tags: ['Fuel Distribution', 'Telemetry', 'Tanker Dispatch'],
          slug: 'petroleum'
        },
        {
          id: 'totag-construction',
          title: 'TOTAG General Construction',
          description: 'Heavy fleet leasing, BOQ estimator, and project WBS controls.',
          icon: 'HardHat',
          color: 'yellow',
          tags: ['Heavy Fleet', 'BOQ Estimator', 'WBS Controls'],
          slug: 'construction'
        },
        {
          id: 'totag-general-merchandise',
          title: 'TOTAG General Merchandise',
          description: 'Wholesale, retail POS, multi-warehouse inventory, and B2B credit.',
          icon: 'ShoppingBag',
          color: 'purple',
          tags: ['Wholesale', 'Retail POS', 'Inventory'],
          slug: 'general-merchandise'
        },
        {
          id: 'totag-catering',
          title: 'TOTAG Catering & Events (TCEPS)',
          description: 'Menu recipe BOM, HACCP safety logs, and event quotes.',
          icon: 'ChefHat',
          color: 'red',
          tags: ['Recipe BOM', 'HACCP Safety', 'Event Quotes'],
          slug: 'catering'
        },
        {
          id: 'totag-it-services',
          title: 'TOTAG IT Services & SaaS',
          description: 'Managed IT helpdesk and FIMS / HRMIS SaaS multitenant core.',
          icon: 'Laptop',
          color: 'cyan',
          tags: ['IT Helpdesk', 'FIMS SaaS', 'HRMIS Core'],
          slug: 'it-services'
        },
        {
          id: 'totag-stationery',
          title: 'TOTAG Stationery Supplies',
          description: 'Office bundles, custom printing approvals, and replenishment.',
          icon: 'FileText',
          color: 'blue',
          tags: ['Office Supplies', 'Printing Approvals', 'Replenishment'],
          slug: 'stationery'
        },
        {
          id: 'totag-solar',
          title: 'TOTAG Solar Energy & Smart Power',
          description: 'Solar EPC, energy audit, NOC remote monitoring, and tailored design engine.',
          icon: 'Zap',
          color: 'amber',
          tags: ['Solar EPC', 'Energy Audit', 'NOC Telemetry'],
          slug: 'solar'
        },
        {
          id: 'totag-institutional',
          title: 'TOTAG Institutional Services',
          description: 'UN and donor agency work package and contract operations platform.',
          icon: 'Building2',
          color: 'purple',
          tags: ['UN Contracts', 'Donor Operations', 'NGO Logistics'],
          slug: 'institutional-services'
        }
      ];
      res.json({ success: true, services: totagServices });
    }
  });


  app.get("/api/services/:slug", async (req, res) => {
    try {
      const service = await storage.getServiceBySlug(req.params.slug);
      if (!service) {
        return res.status(404).json({ success: false, error: "Service not found" });
      }
      res.json({ success: true, service });
    } catch (error) {
      console.error("Get service error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch service" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.json({ success: true, service });
    } catch (error) {
      console.error("Create service error:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid service data" 
      });
    }
  });

  // TOTAG FARM API Routes
  
  // Market Products (Public Routes)
  app.get("/api/farm/market/products", async (req, res) => {
    try {
      const products = await storage.getAvailableMarketProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching market products:", error);
      res.status(500).json({ message: "Failed to fetch market products" });
    }
  });

  app.get("/api/farm/market/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getMarketProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Farm Management Routes (Staff Only - placeholder for auth)
  app.get("/api/farm/livestock", async (req, res) => {
    try {
      const livestock = await storage.getLivestock();
      res.json(livestock);
    } catch (error) {
      console.error("Error fetching livestock:", error);
      res.status(500).json({ message: "Failed to fetch livestock" });
    }
  });

  app.get("/api/farm/crops", async (req, res) => {
    try {
      const crops = await storage.getCrops();
      res.json(crops);
    } catch (error) {
      console.error("Error fetching crops:", error);
      res.status(500).json({ message: "Failed to fetch crops" });
    }
  });

  app.get("/api/farm/equipment", async (req, res) => {
    try {
      const equipment = await storage.getEquipment();
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  app.get("/api/farm/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/farm/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/farm/inventory", async (req, res) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  // TGM Enterprise API Routes - Role-based access control
  
  // Wholesale Operations (General Manager, Wholesale Head, Sales Team)
  app.get("/api/tgm/wholesale-orders", async (req, res) => {
    try {
      const orders = await storage.getTgmWholesaleOrders();
      res.json({ success: true, orders });
    } catch (error) {
      console.error("Error fetching wholesale orders:", error);
      res.status(500).json({ success: false, error: "Failed to fetch wholesale orders" });
    }
  });

  app.post("/api/tgm/wholesale-orders", async (req, res) => {
    try {
      const validatedData = insertTgmWholesaleOrderSchema.parse(req.body);
      const order = await storage.createTgmWholesaleOrder(validatedData);
      
      // Log activity
      if (validatedData.createdBy) {
        await storage.logTgmActivity({
          userId: validatedData.createdBy,
          action: "create",
          entity: "wholesale_order",
          entityId: order.id.toString(),
          details: `Created wholesale order for ${order.partnerCompany}`
        });
      }
      
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error creating wholesale order:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid order data" 
      });
    }
  });

  app.patch("/api/tgm/wholesale-orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, approvedBy } = req.body;
      
      if (!status || !["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
        return res.status(400).json({ success: false, error: "Invalid status" });
      }

      const order = await storage.updateTgmWholesaleOrderStatus(id, status, approvedBy);
      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }

      // Log activity
      if (approvedBy) {
        await storage.logTgmActivity({
          userId: approvedBy,
          action: "update",
          entity: "wholesale_order",
          entityId: id.toString(),
          details: `Updated order status to ${status}`
        });
      }

      res.json({ success: true, order });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ success: false, error: "Failed to update order status" });
    }
  });

  // Retail Sales Operations (General Manager, Retail Head, Sales Team)
  app.get("/api/tgm/retail-sales", async (req, res) => {
    try {
      const { outlet } = req.query;
      
      const sales = outlet 
        ? await storage.getTgmRetailSalesByOutlet(outlet as string)
        : await storage.getTgmRetailSales();
        
      res.json({ success: true, sales });
    } catch (error) {
      console.error("Error fetching retail sales:", error);
      res.status(500).json({ success: false, error: "Failed to fetch retail sales" });
    }
  });

  app.post("/api/tgm/retail-sales", async (req, res) => {
    try {
      const validatedData = insertTgmRetailSaleSchema.parse(req.body);
      const sale = await storage.createTgmRetailSale(validatedData);
      
      // Log activity
      if (validatedData.recordedBy) {
        await storage.logTgmActivity({
          userId: validatedData.recordedBy,
          action: "create",
          entity: "retail_sale",
          entityId: sale.id.toString(),
          details: `Recorded retail sale of ${sale.product} at ${sale.outlet}`
        });
      }
      
      res.json({ success: true, sale });
    } catch (error) {
      console.error("Error creating retail sale:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid sale data" 
      });
    }
  });

  // Inventory Management (General Manager, Inventory Manager)
  app.get("/api/tgm/inventory", async (req, res) => {
    try {
      const inventory = await storage.getTgmInventory();
      res.json({ success: true, inventory });
    } catch (error) {
      console.error("Error fetching TGM inventory:", error);
      res.status(500).json({ success: false, error: "Failed to fetch inventory" });
    }
  });

  app.get("/api/tgm/inventory/low-stock", async (req, res) => {
    try {
      const lowStockItems = await storage.getLowStockItems();
      res.json({ success: true, items: lowStockItems });
    } catch (error) {
      console.error("Error fetching low stock items:", error);
      res.status(500).json({ success: false, error: "Failed to fetch low stock items" });
    }
  });

  app.post("/api/tgm/inventory", async (req, res) => {
    try {
      const validatedData = insertTgmInventorySchema.parse(req.body);
      const item = await storage.createTgmInventoryItem(validatedData);
      
      // Log activity
      if (validatedData.lastUpdatedBy) {
        await storage.logTgmActivity({
          userId: validatedData.lastUpdatedBy,
          action: "create",
          entity: "inventory",
          entityId: item.id.toString(),
          details: `Added new inventory item: ${item.productName}`
        });
      }
      
      res.json({ success: true, item });
    } catch (error) {
      console.error("Error creating inventory item:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid inventory data" 
      });
    }
  });

  app.patch("/api/tgm/inventory/:id/quantity", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity, updatedBy } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ success: false, error: "Invalid quantity" });
      }

      const item = await storage.updateTgmInventoryQuantity(id, quantity, updatedBy);
      if (!item) {
        return res.status(404).json({ success: false, error: "Inventory item not found" });
      }

      // Log activity
      if (updatedBy) {
        await storage.logTgmActivity({
          userId: updatedBy,
          action: "update",
          entity: "inventory",
          entityId: id.toString(),
          details: `Updated quantity for ${item.productName} to ${quantity}`
        });
      }

      res.json({ success: true, item });
    } catch (error) {
      console.error("Error updating inventory quantity:", error);
      res.status(500).json({ success: false, error: "Failed to update inventory quantity" });
    }
  });

  // Supplier Management (General Manager, Inventory Manager)
  app.get("/api/tgm/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getTgmSuppliers();
      res.json({ success: true, suppliers });
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ success: false, error: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/tgm/suppliers", async (req, res) => {
    try {
      const validatedData = insertTgmSupplierSchema.parse(req.body);
      const supplier = await storage.createTgmSupplier(validatedData);
      
      // Log activity
      if (validatedData.createdBy) {
        await storage.logTgmActivity({
          userId: validatedData.createdBy,
          action: "create",
          entity: "supplier",
          entityId: supplier.id.toString(),
          details: `Added new supplier: ${supplier.name}`
        });
      }
      
      res.json({ success: true, supplier });
    } catch (error) {
      console.error("Error creating supplier:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid supplier data" 
      });
    }
  });

  app.patch("/api/tgm/suppliers/:id/rating", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { rating } = req.body;
      
      if (typeof rating !== 'number' || rating < 0 || rating > 5) {
        return res.status(400).json({ success: false, error: "Rating must be between 0 and 5" });
      }

      const supplier = await storage.updateTgmSupplierRating(id, rating);
      if (!supplier) {
        return res.status(404).json({ success: false, error: "Supplier not found" });
      }

      res.json({ success: true, supplier });
    } catch (error) {
      console.error("Error updating supplier rating:", error);
      res.status(500).json({ success: false, error: "Failed to update supplier rating" });
    }
  });

  // Logistics & Delivery (General Manager, Logistics Manager)
  app.get("/api/tgm/deliveries", async (req, res) => {
    try {
      const deliveries = await storage.getTgmDeliveries();
      res.json({ success: true, deliveries });
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      res.status(500).json({ success: false, error: "Failed to fetch deliveries" });
    }
  });

  app.post("/api/tgm/deliveries", async (req, res) => {
    try {
      const validatedData = insertTgmDeliverySchema.parse(req.body);
      const delivery = await storage.createTgmDelivery(validatedData);
      
      // Log activity
      if (validatedData.assignedBy) {
        await storage.logTgmActivity({
          userId: validatedData.assignedBy,
          action: "create",
          entity: "delivery",
          entityId: delivery.id.toString(),
          details: `Created delivery to ${delivery.destination}`
        });
      }
      
      res.json({ success: true, delivery });
    } catch (error) {
      console.error("Error creating delivery:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid delivery data" 
      });
    }
  });

  app.patch("/api/tgm/deliveries/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, notes } = req.body;
      
      if (!status || !["preparing", "in_transit", "delivered", "failed"].includes(status)) {
        return res.status(400).json({ success: false, error: "Invalid status" });
      }

      const delivery = await storage.updateTgmDeliveryStatus(id, status, notes);
      if (!delivery) {
        return res.status(404).json({ success: false, error: "Delivery not found" });
      }

      res.json({ success: true, delivery });
    } catch (error) {
      console.error("Error updating delivery status:", error);
      res.status(500).json({ success: false, error: "Failed to update delivery status" });
    }
  });

  // Activity Logs (All roles)
  app.get("/api/tgm/activity-logs", async (req, res) => {
    try {
      const { userId } = req.query;
      
      const logs = userId 
        ? await storage.getTgmActivityLogs(parseInt(userId as string))
        : await storage.getTgmActivityLogs();
        
      res.json({ success: true, logs });
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ success: false, error: "Failed to fetch activity logs" });
    }
  });

  // Order tracking and e-commerce APIs
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      console.log("Creating order with data:", orderData);
      
      const result = await storage.createOrder(orderData);
      
      res.json({ 
        success: true, 
        orderNumber: result.orderNumber,
        trackingNumber: result.trackingNumber,
        order: result.order,
        delivery: result.delivery
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to create order" 
      });
    }
  });

  app.get("/api/orders/:orderNumber", async (req, res) => {
    try {
      const { orderNumber } = req.params;
      
      const result = await storage.getOrderByNumber(orderNumber);
      
      if (!result) {
        return res.status(404).json({ 
          success: false, 
          error: "Order not found" 
        });
      }
      
      res.json({ 
        success: true, 
        order: result.order,
        delivery: result.delivery
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch order" 
      });
    }
  });

  app.patch("/api/deliveries/:trackingNumber/status", async (req, res) => {
    try {
      const { trackingNumber } = req.params;
      const { status, location } = req.body;
      
      const delivery = await storage.updateDeliveryStatus(trackingNumber, status, location);
      
      res.json({ 
        success: true, 
        delivery 
      });
    } catch (error) {
      console.error("Error updating delivery status:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to update delivery status" 
      });
    }
  });

  // Merchant dashboard API routes
  
  // Get all orders (for merchant dashboard)
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json({ success: true, orders });
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch orders" 
      });
    }
  });

  // Get all deliveries (for merchant dashboard)
  app.get("/api/deliveries", async (req, res) => {
    try {
      const deliveries = await storage.getAllDeliveries();
      res.json({ success: true, deliveries });
    } catch (error: any) {
      console.error("Error fetching deliveries:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch deliveries" 
      });
    }
  });

  // Create delivery (initiate delivery for order)
  app.post("/api/deliveries", async (req, res) => {
    try {
      const deliveryData = {
        orderId: req.body.orderId,
        driverName: req.body.driverName,
        driverPhone: req.body.driverPhone,
        vehicleInfo: req.body.vehicleInfo,
        estimatedArrival: req.body.estimatedArrival,
        notes: req.body.notes || "",
        status: "confirmed",
        currentLocation: "TGM Warehouse, Monrovia",
        trackingNumber: `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        deliveryMethod: "tgm_delivery",
        coordinates: JSON.stringify({ lat: 6.3106, lng: -10.8048 }),
        blockchainHash: `delivery_${Date.now()}_${Math.random().toString(16).substr(2, 12)}`
      };
      
      const delivery = await storage.createDelivery(deliveryData);
      res.json({ success: true, delivery });
    } catch (error: any) {
      console.error("Error creating delivery:", error);
      res.status(400).json({ 
        success: false, 
        error: error.message || "Failed to create delivery" 
      });
    }
  });

  // Update delivery status
  app.patch("/api/deliveries/:id", async (req, res) => {
    try {
      const deliveryId = parseInt(req.params.id);
      const updateData = {
        status: req.body.status,
        currentLocation: req.body.currentLocation || "",
        actualDelivery: req.body.status === "delivered" ? new Date().toISOString() : null
      };
      
      const delivery = await storage.updateDelivery(deliveryId, updateData);
      if (!delivery) {
        return res.status(404).json({ 
          success: false, 
          error: "Delivery not found" 
        });
      }
      
      res.json({ success: true, delivery });
    } catch (error: any) {
      console.error("Error updating delivery:", error);
      res.status(400).json({ 
        success: false, 
        error: error.message || "Failed to update delivery" 
      });
    }
  });

  // Content Management System APIs for GM - Full website control
  app.get("/api/carousel-slides", async (req, res) => {
    try {
      const slides = await storage.getCarouselSlides();
      res.json({ success: true, slides });
    } catch (error) {
      console.error("Error fetching carousel slides:", error);
      res.status(500).json({ success: false, message: "Failed to fetch carousel slides" });
    }
  });

  app.post("/api/carousel-slides", async (req, res) => {
    try {
      const slideData = req.body;
      const slide = await storage.createCarouselSlide(slideData);
      res.json({ success: true, slide });
    } catch (error) {
      console.error("Error creating carousel slide:", error);
      res.status(500).json({ success: false, message: "Failed to create carousel slide" });
    }
  });

  app.put("/api/carousel-slides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const slideData = req.body;
      const slide = await storage.updateCarouselSlide(parseInt(id), slideData);
      res.json({ success: true, slide });
    } catch (error) {
      console.error("Error updating carousel slide:", error);
      res.status(500).json({ success: false, message: "Failed to update carousel slide" });
    }
  });

  app.delete("/api/carousel-slides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCarouselSlide(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting carousel slide:", error);
      res.status(500).json({ success: false, message: "Failed to delete carousel slide" });
    }
  });

  // Website content management for complete control
  app.get("/api/website-content", async (req, res) => {
    try {
      const content = await storage.getWebsiteContent();
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error fetching website content:", error);
      res.status(500).json({ success: false, message: "Failed to fetch website content" });
    }
  });

  app.put("/api/website-content", async (req, res) => {
    try {
      const contentData = req.body;
      const content = await storage.updateWebsiteContent(contentData);
      res.json({ success: true, content });
    } catch (error) {
      console.error("Error updating website content:", error);
      res.status(500).json({ success: false, message: "Failed to update website content" });
    }
  });

  // Product management for complete catalog control
  app.get("/api/admin/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json({ success: true, products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
  });

  app.post("/api/admin/products", async (req, res) => {
    try {
      const productData = req.body;
      
      // Sanitize price field - remove any non-numeric characters except decimal point
      if (productData.price !== undefined) {
        let cleanPrice = productData.price.toString().replace(/[^\d.]/g, '');
        // Handle empty string
        if (cleanPrice === '' || cleanPrice === '.') {
          cleanPrice = '0';
        }
        productData.price = cleanPrice;
      }
      
      // Handle wholesale price field (can be null)
      if (productData.wholeSalePrice !== undefined) {
        if (productData.wholeSalePrice === '' || productData.wholeSalePrice === null) {
          productData.wholeSalePrice = null;
        } else {
          let cleanWholesalePrice = productData.wholeSalePrice.toString().replace(/[^\d.]/g, '');
          if (cleanWholesalePrice === '' || cleanWholesalePrice === '.') {
            productData.wholeSalePrice = null;
          } else {
            productData.wholeSalePrice = cleanWholesalePrice;
          }
        }
      }
      
      // Ensure numeric fields are properly formatted
      if (productData.stockQuantity !== undefined) {
        productData.stockQuantity = parseInt(productData.stockQuantity) || 0;
      }
      if (productData.minStockLevel !== undefined) {
        productData.minStockLevel = parseInt(productData.minStockLevel) || 0;
      }
      
      const product = await storage.createProduct(productData);
      res.json({ success: true, product });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ success: false, message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      // Sanitize price field - remove any non-numeric characters except decimal point
      if (productData.price !== undefined) {
        let cleanPrice = productData.price.toString().replace(/[^\d.]/g, '');
        // Handle empty string
        if (cleanPrice === '' || cleanPrice === '.') {
          cleanPrice = '0';
        }
        productData.price = cleanPrice;
      }
      
      // Handle wholesale price field (can be null)
      if (productData.wholeSalePrice !== undefined) {
        if (productData.wholeSalePrice === '' || productData.wholeSalePrice === null) {
          productData.wholeSalePrice = null;
        } else {
          let cleanWholesalePrice = productData.wholeSalePrice.toString().replace(/[^\d.]/g, '');
          if (cleanWholesalePrice === '' || cleanWholesalePrice === '.') {
            productData.wholeSalePrice = null;
          } else {
            productData.wholeSalePrice = cleanWholesalePrice;
          }
        }
      }
      
      // Ensure numeric fields are properly formatted
      if (productData.stockQuantity !== undefined) {
        productData.stockQuantity = parseInt(productData.stockQuantity) || 0;
      }
      if (productData.minStockLevel !== undefined) {
        productData.minStockLevel = parseInt(productData.minStockLevel) || 0;
      }
      
      const product = await storage.updateProduct(parseInt(id), productData);
      res.json({ success: true, product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ success: false, message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProduct(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ success: false, message: "Failed to delete product" });
    }
  });

  // Credit Management API Routes
  app.get("/api/creditors", async (req, res) => {
    try {
      const creditors = await storage.getAllCreditors();
      res.json({ success: true, creditors });
    } catch (error: any) {
      console.error("Error fetching creditors:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch creditors" 
      });
    }
  });

  app.get("/api/creditors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const creditor = await storage.getCreditorById(id);
      if (!creditor) {
        return res.status(404).json({ success: false, error: "Creditor not found" });
      }
      res.json({ success: true, creditor });
    } catch (error: any) {
      console.error("Error fetching creditor:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch creditor" 
      });
    }
  });

  app.get("/api/creditors/:id/payments", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const payments = await storage.getCreditPaymentsByCreditor(id);
      res.json({ success: true, payments });
    } catch (error: any) {
      console.error("Error fetching credit payments:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch credit payments" 
      });
    }
  });

  app.post("/api/creditors/:id/payment", async (req, res) => {
    try {
      const creditorId = parseInt(req.params.id);
      const { paymentAmount, paymentMethod, transactionId, processedBy } = req.body;
      
      const result = await storage.processCustomerPayment(
        creditorId, 
        parseFloat(paymentAmount), 
        paymentMethod, 
        transactionId, 
        processedBy
      );
      
      res.json({ 
        success: true, 
        payment: result.payment,
        updatedCreditor: result.updatedCreditor,
        message: "Payment processed successfully"
      });
    } catch (error: any) {
      console.error("Error processing payment:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to process payment" 
      });
    }
  });

  // Customer login - get credit accounts by phone and name
  app.post("/api/customer/login", async (req, res) => {
    try {
      const { customerPhone, customerName } = req.body;
      
      if (!customerPhone || !customerName) {
        return res.status(400).json({ 
          success: false, 
          error: "Phone number and name are required" 
        });
      }

      const creditAccounts = await storage.getCreditorsByCustomer(customerPhone, customerName);
      
      if (creditAccounts.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: "No credit accounts found for this customer" 
        });
      }

      // Return customer info and their credit accounts
      const customer = {
        customerName: creditAccounts[0].customerName,
        customerPhone: creditAccounts[0].customerPhone,
        customerEmail: creditAccounts[0].customerEmail
      };

      res.json({ 
        success: true, 
        customer,
        creditAccounts 
      });
    } catch (error: any) {
      console.error("Error during customer login:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get customer previous orders
  app.get("/api/customer/orders", async (req, res) => {
    try {
      const { phone, name } = req.query;
      
      if (!phone || !name) {
        return res.status(400).json({ 
          success: false, 
          error: "Phone number and name are required" 
        });
      }

      const orders = await storage.getOrdersByCustomer(phone as string, name as string);
      
      res.json({ 
        success: true, 
        orders 
      });
    } catch (error: any) {
      console.error("Error fetching customer orders:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update product inventory (for Warehouse Staff)
  app.patch("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const product = await storage.updateProduct(parseInt(id), updateData);
      res.json({ success: true, product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ success: false, message: "Failed to update product" });
    }
  });

  // Update order status (for Sales Team and General Manager)
  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const order = await storage.updateOrderStatus(parseInt(id), updateData);
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ success: false, message: "Failed to update order" });
    }
  });

  // Update delivery status (for Delivery Staff and General Manager)
  app.patch("/api/deliveries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const delivery = await storage.updateDeliveryById(parseInt(id), updateData);
      res.json({ success: true, delivery });
    } catch (error) {
      console.error("Error updating delivery:", error);
      res.status(500).json({ success: false, message: "Failed to update delivery" });
    }
  });

  // Email API routes
  app.post("/api/emails/send", async (req, res) => {
    try {
      const { 
        to, 
        subject, 
        message, 
        type = 'notification',
        subsidiary = 'corporate',
        fromEmail = 'info@totaggroup.com',
        fromName = 'TOTAG Group Corporate'
      } = req.body;
      
      if (!to || !subject || !message) {
        return res.status(400).json({ 
          success: false, 
          error: "To, subject, and message are required" 
        });
      }

      const emailData = EmailService.generateSubsidiaryEmail(
        to, 
        subject, 
        message, 
        type,
        fromEmail,
        fromName,
        subsidiary
      );
      const success = await EmailService.sendEmail(emailData);
      
      res.json({ 
        success, 
        message: success ? `Email sent successfully from ${fromName}` : "Failed to send email" 
      });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  });

  app.get("/api/emails/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const emails = await EmailService.getEmailHistory(limit);
      res.json({ success: true, emails });
    } catch (error) {
      console.error("Email history error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch email history" });
    }
  });

  // Send order confirmation email
  app.post("/api/emails/order-confirmation", async (req, res) => {
    try {
      const { order, customer } = req.body;
      
      if (!order || !customer) {
        return res.status(400).json({ 
          success: false, 
          error: "Order and customer data are required" 
        });
      }

      const emailData = EmailService.generateOrderConfirmationEmail(order, customer);
      const success = await EmailService.sendEmail(emailData);
      
      res.json({ 
        success, 
        message: success ? "Order confirmation email sent" : "Failed to send confirmation email" 
      });
    } catch (error) {
      console.error("Order confirmation email error:", error);
      res.status(500).json({ success: false, error: "Failed to send order confirmation" });
    }
  });

  // Send contact inquiry notification
  app.post("/api/emails/contact-inquiry", async (req, res) => {
    try {
      const inquiry = req.body;
      
      if (!inquiry.name || !inquiry.email || !inquiry.message) {
        return res.status(400).json({ 
          success: false, 
          error: "Name, email, and message are required" 
        });
      }

      const emailData = EmailService.generateContactInquiryEmail(inquiry);
      const success = await EmailService.sendEmail(emailData);
      
      res.json({ 
        success, 
        message: success ? "Contact inquiry notification sent" : "Failed to send notification" 
      });
    } catch (error) {
      console.error("Contact inquiry email error:", error);
      res.status(500).json({ success: false, error: "Failed to send contact inquiry notification" });
    }
  });

  // Subsidiary Email Management API Routes
  app.get("/api/subsidiary-emails", async (req, res) => {
    try {
      const subsidiaryEmails = await storage.getSubsidiaryEmails();
      res.json({ success: true, subsidiaryEmails });
    } catch (error: any) {
      console.error("Error fetching subsidiary emails:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch subsidiary emails" 
      });
    }
  });

  app.post("/api/subsidiary-emails", async (req, res) => {
    try {
      const emailData = req.body;
      const subsidiaryEmail = await storage.createSubsidiaryEmail(emailData);
      res.json({ success: true, subsidiaryEmail });
    } catch (error: any) {
      console.error("Error creating subsidiary email:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to create subsidiary email" 
      });
    }
  });

  app.put("/api/subsidiary-emails/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const emailData = req.body;
      const subsidiaryEmail = await storage.updateSubsidiaryEmail(id, emailData);
      res.json({ success: true, subsidiaryEmail });
    } catch (error: any) {
      console.error("Error updating subsidiary email:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to update subsidiary email"  
      });
    }
  });

  app.delete("/api/subsidiary-emails/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSubsidiaryEmail(id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting subsidiary email:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to delete subsidiary email" 
      });
    }
  });

  // Send test email via subsidiary email system
  app.post('/api/send-test-email', async (req, res) => {
    try {
      const { fromEmail, toEmail, subject, message, subsidiaryName } = req.body;
      
      // Generate professional email using subsidiary template
      const emailData = EmailService.generateSubsidiaryEmail(
        toEmail,
        subject,
        message,
        'notification',
        fromEmail,
        subsidiaryName || 'TOTAG Group Corporate',
        'corporate'
      );

      const success = await EmailService.sendEmail(emailData);
      
      if (success) {
        res.json({ 
          success: true, 
          message: 'Test email sent successfully',
          details: {
            from: fromEmail,
            to: toEmail,
            subject: emailData.subject
          }
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send test email' 
        });
      }
    } catch (error: any) {
      console.error('Error sending test email:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error sending test email',
        error: error.message 
      });
    }
  });

  // HRMIS (Human Resource Management Information System) API Routes
  
  // Employee Management Routes
  app.get("/api/hrmis/employees", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json({ success: true, employees });
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch employees" 
      });
    }
  });

  app.get("/api/hrmis/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await storage.getEmployeeById(id);
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      res.json({ success: true, employee });
    } catch (error: any) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch employee" 
      });
    }
  });

  app.get("/api/hrmis/employees/active", async (req, res) => {
    try {
      const employees = await storage.getActiveEmployees();
      res.json({ success: true, employees });
    } catch (error: any) {
      console.error("Error fetching active employees:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch active employees" 
      });
    }
  });

  app.get("/api/hrmis/employees/department/:department", async (req, res) => {
    try {
      const { department } = req.params;
      const employees = await storage.getEmployeesByDepartment(department);
      res.json({ success: true, employees });
    } catch (error: any) {
      console.error("Error fetching employees by department:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch employees by department" 
      });
    }
  });

  app.post("/api/hrmis/employees", async (req, res) => {
    try {
      const employeeData = req.body;
      const employee = await storage.createEmployee(employeeData);
      res.json({ success: true, employee });
    } catch (error: any) {
      console.error("Error creating employee:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to create employee" 
      });
    }
  });

  app.put("/api/hrmis/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const employee = await storage.updateEmployee(id, updates);
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      res.json({ success: true, employee });
    } catch (error: any) {
      console.error("Error updating employee:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to update employee" 
      });
    }
  });

  app.delete("/api/hrmis/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEmployee(id);
      if (!success) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to delete employee" 
      });
    }
  });

  // Attendance Management Routes
  app.get("/api/hrmis/attendance", async (req, res) => {
    try {
      const { date } = req.query;
      const attendanceDate = date ? new Date(date as string) : undefined;
      const attendance = await storage.getAllAttendance(attendanceDate);
      res.json({ success: true, attendance });
    } catch (error: any) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch attendance" 
      });
    }
  });

  app.get("/api/hrmis/attendance/employee/:employeeId", async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      const attendance = await storage.getAttendanceByEmployee(employeeId, start, end);
      res.json({ success: true, attendance });
    } catch (error: any) {
      console.error("Error fetching employee attendance:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch employee attendance" 
      });
    }
  });

  app.post("/api/hrmis/attendance", async (req, res) => {
    try {
      const attendanceData = req.body;
      const attendance = await storage.createAttendance(attendanceData);
      res.json({ success: true, attendance });
    } catch (error: any) {
      console.error("Error creating attendance record:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to create attendance record" 
      });
    }
  });

  app.put("/api/hrmis/attendance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const attendance = await storage.updateAttendance(id, updates);
      if (!attendance) {
        return res.status(404).json({ success: false, error: "Attendance record not found" });
      }
      res.json({ success: true, attendance });
    } catch (error: any) {
      console.error("Error updating attendance:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to update attendance" 
      });
    }
  });

  // Leave Request Management Routes
  app.get("/api/hrmis/leave-requests", async (req, res) => {
    try {
      const leaveRequests = await storage.getAllLeaveRequests();
      res.json({ success: true, leaveRequests });
    } catch (error: any) {
      console.error("Error fetching leave requests:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch leave requests" 
      });
    }
  });

  app.get("/api/hrmis/leave-requests/pending", async (req, res) => {
    try {
      const pendingRequests = await storage.getPendingLeaveRequests();
      res.json({ success: true, leaveRequests: pendingRequests });
    } catch (error: any) {
      console.error("Error fetching pending leave requests:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch pending leave requests" 
      });
    }
  });

  app.get("/api/hrmis/leave-requests/employee/:employeeId", async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const leaveRequests = await storage.getLeaveRequestsByEmployee(employeeId);
      res.json({ success: true, leaveRequests });
    } catch (error: any) {
      console.error("Error fetching employee leave requests:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch employee leave requests" 
      });
    }
  });

  app.post("/api/hrmis/leave-requests", async (req, res) => {
    try {
      const leaveData = req.body;
      const leaveRequest = await storage.createLeaveRequest(leaveData);
      res.json({ success: true, leaveRequest });
    } catch (error: any) {
      console.error("Error creating leave request:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to create leave request" 
      });
    }
  });

  app.put("/api/hrmis/leave-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const leaveRequest = await storage.updateLeaveRequest(id, updates);
      if (!leaveRequest) {
        return res.status(404).json({ success: false, error: "Leave request not found" });
      }
      res.json({ success: true, leaveRequest });
    } catch (error: any) {
      console.error("Error updating leave request:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to update leave request" 
      });
    }
  });

  // Payroll Management Routes
  app.get("/api/hrmis/payroll", async (req, res) => {
    try {
      const payroll = await storage.getAllPayroll();
      res.json({ success: true, payroll });
    } catch (error: any) {
      console.error("Error fetching payroll:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch payroll" 
      });
    }
  });

  app.get("/api/hrmis/payroll/employee/:employeeId", async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const payroll = await storage.getPayrollByEmployee(employeeId);
      res.json({ success: true, payroll });
    } catch (error: any) {
      console.error("Error fetching employee payroll:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch employee payroll" 
      });
    }
  });

  app.post("/api/hrmis/payroll", async (req, res) => {
    try {
      const payrollData = req.body;
      const payroll = await storage.createPayroll(payrollData);
      res.json({ success: true, payroll });
    } catch (error: any) {
      console.error("Error creating payroll record:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to create payroll record" 
      });
    }
  });

  app.put("/api/hrmis/payroll/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const payroll = await storage.updatePayroll(id, updates);
      if (!payroll) {
        return res.status(404).json({ success: false, error: "Payroll record not found" });
      }
      res.json({ success: true, payroll });
    } catch (error: any) {
      console.error("Error updating payroll:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to update payroll" 
      });
    }
  });

  // Performance Review Management Routes
  app.get("/api/hrmis/performance-reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllPerformanceReviews();
      res.json({ success: true, reviews });
    } catch (error: any) {
      console.error("Error fetching performance reviews:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch performance reviews" 
      });
    }
  });

  app.get("/api/hrmis/performance-reviews/employee/:employeeId", async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const reviews = await storage.getPerformanceReviewsByEmployee(employeeId);
      res.json({ success: true, reviews });
    } catch (error: any) {
      console.error("Error fetching employee performance reviews:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch employee performance reviews" 
      });
    }
  });

  app.get("/api/hrmis/performance-reviews/reviewer/:reviewerId", async (req, res) => {
    try {
      const reviewerId = parseInt(req.params.reviewerId);
      const reviews = await storage.getPerformanceReviewsByReviewer(reviewerId);
      res.json({ success: true, reviews });
    } catch (error: any) {
      console.error("Error fetching reviewer performance reviews:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch reviewer performance reviews" 
      });
    }
  });

  app.post("/api/hrmis/performance-reviews", async (req, res) => {
    try {
      const reviewData = req.body;
      const review = await storage.createPerformanceReview(reviewData);
      res.json({ success: true, review });
    } catch (error: any) {
      console.error("Error creating performance review:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to create performance review" 
      });
    }
  });

  app.put("/api/hrmis/performance-reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const review = await storage.updatePerformanceReview(id, updates);
      if (!review) {
        return res.status(404).json({ success: false, error: "Performance review not found" });
      }
      res.json({ success: true, review });
    } catch (error: any) {
      console.error("Error updating performance review:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to update performance review" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
