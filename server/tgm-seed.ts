import { db } from "./db";
import { users, tgmWholesaleOrders, tgmRetailSales, tgmInventory, tgmSuppliers, tgmDeliveries } from "@shared/schema";

async function seedTGMData() {
  console.log("🌱 Seeding TGM Enterprise data...");

  try {
    // Create demo users for each role
    const demoUsers = [
      {
        username: "gm_admin",
        password: "demo123",
        email: "gm@totag.com",
        firstName: "Maria",
        lastName: "Johnson",
        role: "general_manager",
        department: "Management"
      },
      {
        username: "wholesale_head", 
        password: "demo123",
        email: "wholesale@totag.com",
        firstName: "David",
        lastName: "Thompson",
        role: "wholesale_head",
        department: "Wholesale Operations"
      },
      {
        username: "retail_head",
        password: "demo123", 
        email: "retail@totag.com",
        firstName: "Sarah",
        lastName: "Williams",
        role: "retail_head",
        department: "Retail & Merchandising"
      },
      {
        username: "inventory_mgr",
        password: "demo123",
        email: "inventory@totag.com", 
        firstName: "Michael",
        lastName: "Davis",
        role: "inventory_manager",
        department: "Inventory & Procurement"
      },
      {
        username: "logistics_mgr",
        password: "demo123",
        email: "logistics@totag.com",
        firstName: "Jennifer",
        lastName: "Brown", 
        role: "logistics_manager",
        department: "Logistics & Distribution"
      },
      {
        username: "sales_team",
        password: "demo123",
        email: "sales@totag.com",
        firstName: "Robert",
        lastName: "Wilson",
        role: "sales_team",
        department: "Sales & Customer Relations"
      },
      {
        username: "finance_hr",
        password: "demo123",
        email: "finance@totag.com",
        firstName: "Lisa",
        lastName: "Anderson",
        role: "finance_hr",
        department: "Finance, HR & Administration"
      }
    ];

    console.log("Creating demo users...");
    const createdUsers = await db.insert(users).values(demoUsers).returning();
    console.log(`✅ Created ${createdUsers.length} demo users`);

    // Create sample inventory items
    const inventoryItems = [
      {
        sku: "RICE-001",
        productName: "Premium Jasmine Rice",
        category: "Food & Beverages",
        quantity: 500,
        unitPrice: "25.50",
        reorderLevel: 50,
        location: "Warehouse A",
        status: "active",
        lastUpdatedBy: createdUsers[3].id // inventory manager
      },
      {
        sku: "STEEL-002", 
        productName: "Construction Steel Bars",
        category: "Construction Materials",
        quantity: 200,
        unitPrice: "450.00",
        reorderLevel: 20,
        location: "Warehouse B",
        status: "active",
        lastUpdatedBy: createdUsers[3].id
      },
      {
        sku: "PAPER-003",
        productName: "Office Paper A4",
        category: "Office Supplies",
        quantity: 15,
        unitPrice: "12.75",
        reorderLevel: 25,
        location: "Warehouse A",
        status: "low_stock",
        lastUpdatedBy: createdUsers[3].id
      },
      {
        sku: "OIL-004",
        productName: "Cooking Oil 5L",
        category: "Food & Beverages", 
        quantity: 300,
        unitPrice: "18.50",
        reorderLevel: 40,
        location: "Warehouse A",
        status: "active",
        lastUpdatedBy: createdUsers[3].id
      },
      {
        sku: "CEMENT-005",
        productName: "Portland Cement 50kg",
        category: "Construction Materials",
        quantity: 800,
        unitPrice: "8.75",
        reorderLevel: 100,
        location: "Warehouse B", 
        status: "active",
        lastUpdatedBy: createdUsers[3].id
      }
    ];

    console.log("Creating inventory items...");
    const createdInventory = await db.insert(tgmInventory).values(inventoryItems).returning();
    console.log(`✅ Created ${createdInventory.length} inventory items`);

    // Create sample suppliers
    const suppliers = [
      {
        name: "West Africa Rice Mills",
        email: "orders@waricemills.com",
        phone: "+231-555-0101",
        address: "Industrial Zone, Monrovia, Liberia",
        category: "Food & Beverages",
        rating: "4.8",
        totalOrders: 25,
        totalValue: "125000.00",
        isActive: true,
        createdBy: createdUsers[3].id
      },
      {
        name: "Atlantic Steel Corporation",
        email: "sales@atlanticsteel.com", 
        phone: "+231-555-0102",
        address: "Port Area, Monrovia, Liberia",
        category: "Construction Materials",
        rating: "4.5",
        totalOrders: 18,
        totalValue: "450000.00",
        isActive: true,
        createdBy: createdUsers[3].id
      },
      {
        name: "Premium Office Supplies Ltd",
        email: "info@premiumoffice.com",
        phone: "+231-555-0103", 
        address: "Central Business District, Monrovia",
        category: "Office Supplies",
        rating: "4.2",
        totalOrders: 42,
        totalValue: "85000.00",
        isActive: true,
        createdBy: createdUsers[3].id
      }
    ];

    console.log("Creating suppliers...");
    const createdSuppliers = await db.insert(tgmSuppliers).values(suppliers).returning();
    console.log(`✅ Created ${createdSuppliers.length} suppliers`);

    // Create sample wholesale orders
    const wholesaleOrders = [
      {
        partnerCompany: "Sahara Trading Company",
        contactPerson: "Ahmed Hassan",
        email: "ahmed@saharatrading.com",
        phone: "+233-555-0201",
        address: "Accra Commercial District, Ghana",
        product: "Premium Jasmine Rice",
        quantity: 100,
        unitPrice: "25.50",
        totalValue: "2550.00",
        status: "pending",
        specialInstructions: "Delivery required by end of month",
        createdBy: createdUsers[1].id // wholesale head
      },
      {
        partnerCompany: "Sierra Leone Distributors",
        contactPerson: "Fatima Koroma",
        email: "fatima@sldistributors.com", 
        phone: "+232-555-0202",
        address: "Freetown Central, Sierra Leone",
        product: "Construction Steel Bars",
        quantity: 50,
        unitPrice: "450.00",
        totalValue: "22500.00",
        status: "processing",
        specialInstructions: "Heavy duty packaging required",
        createdBy: createdUsers[1].id,
        approvedBy: createdUsers[0].id // general manager
      },
      {
        partnerCompany: "Gold Coast Imports",
        contactPerson: "Kwame Asante",
        email: "kwame@goldcoastimports.com",
        phone: "+233-555-0203", 
        address: "Tema Industrial Area, Ghana",
        product: "Cooking Oil 5L",
        quantity: 200,
        unitPrice: "18.50",
        totalValue: "3700.00",
        status: "shipped",
        specialInstructions: "Temperature controlled transport",
        createdBy: createdUsers[5].id, // sales team
        approvedBy: createdUsers[0].id
      }
    ];

    console.log("Creating wholesale orders...");
    const createdOrders = await db.insert(tgmWholesaleOrders).values(wholesaleOrders).returning();
    console.log(`✅ Created ${createdOrders.length} wholesale orders`);

    // Create sample retail sales
    const retailSales = [
      {
        outlet: "TGM Monrovia Central",
        product: "Office Paper A4",
        quantity: 25,
        unitPrice: "12.75",
        totalValue: "318.75",
        saleDate: new Date("2025-01-24T10:30:00Z"),
        cashier: "Grace Togba",
        paymentMethod: "card",
        receiptNumber: "RCT-2025-001",
        recordedBy: createdUsers[2].id // retail head
      },
      {
        outlet: "TGM Paynesville Branch",
        product: "Cooking Oil 5L", 
        quantity: 12,
        unitPrice: "18.50",
        totalValue: "222.00",
        saleDate: new Date("2025-01-24T14:15:00Z"),
        cashier: "John Pewu",
        paymentMethod: "cash",
        receiptNumber: "RCT-2025-002",
        recordedBy: createdUsers[2].id
      },
      {
        outlet: "TGM Sinkor Store",
        product: "Premium Jasmine Rice",
        quantity: 8,
        unitPrice: "25.50", 
        totalValue: "204.00",
        saleDate: new Date("2025-01-24T16:45:00Z"),
        cashier: "Mary Jallah",
        paymentMethod: "mobile_money",
        receiptNumber: "RCT-2025-003", 
        recordedBy: createdUsers[5].id // sales team
      }
    ];

    console.log("Creating retail sales...");
    const createdSales = await db.insert(tgmRetailSales).values(retailSales).returning();
    console.log(`✅ Created ${createdSales.length} retail sales`);

    // Create sample deliveries
    const deliveries = [
      {
        orderId: createdOrders[1].id, // Sierra Leone order
        destination: "Freetown Central, Sierra Leone",
        region: "sierra_leone",
        status: "in_transit",
        driverName: "Joseph Kamara",
        vehicleNumber: "TGM-001",
        estimatedDelivery: new Date("2025-01-26T12:00:00Z"),
        trackingNotes: "Departed Monrovia port, estimated arrival tomorrow",
        assignedBy: createdUsers[4].id // logistics manager
      },
      {
        orderId: createdOrders[2].id, // Ghana order
        destination: "Tema Industrial Area, Ghana",
        region: "ghana",
        status: "delivered",
        driverName: "Emmanuel Asiedu",
        vehicleNumber: "TGM-002",
        estimatedDelivery: new Date("2025-01-23T15:00:00Z"),
        actualDelivery: new Date("2025-01-23T14:30:00Z"),
        trackingNotes: "Delivered successfully, customer satisfied",
        assignedBy: createdUsers[4].id
      }
    ];

    console.log("Creating deliveries...");
    const createdDeliveries = await db.insert(tgmDeliveries).values(deliveries).returning();
    console.log(`✅ Created ${createdDeliveries.length} deliveries`);

    console.log("🎉 TGM Enterprise seed data completed successfully!");
    console.log("\nDemo login credentials:");
    console.log("Username: Any role username (e.g., gm_admin, wholesale_head, etc.)");
    console.log("Password: demo123");

  } catch (error) {
    console.error("❌ Error seeding TGM data:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTGMData()
    .then(() => {
      console.log("Seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedTGMData };