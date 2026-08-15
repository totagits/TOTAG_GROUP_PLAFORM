import { db } from "./db";
import { 
  users, 
  services, 
  marketProducts,
  livestock,
  crops,
  equipment,
  tasks,
  activities,
  inventory
} from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Seed users
    console.log("👥 Seeding users...");
    await db.insert(users).values([
      {
        id: 1,
        username: "admin",
        password: "admin123",
        role: "admin"
      },
      {
        id: 2,
        username: "farmmanager",
        password: "manager123", 
        role: "manager"
      },
      {
        id: 3,
        username: "staff1",
        password: "staff123",
        role: "staff"
      }
    ]).onConflictDoNothing();

    // Seed services (All 9 TOTAG Group specialized subsidiaries)
    console.log("🏢 Seeding 9 specialized subsidiaries...");
    await db.insert(services).values([
      {
        id: 1,
        name: "TOTAG Cargo Handling & Maritime Logistics",
        description: "Port management, cargo handling, container shipping, and international logistics services",
        icon: "Truck",
        color: "blue",
        tags: "logistics, cargo, maritime, shipping",
        slug: "cargo",
        isActive: true
      },
      {
        id: 2,
        name: "TOTAG Farm & Agribusiness",
        description: "Integrated agricultural operations, livestock management, crop farming, and fresh produce market",
        icon: "Wheat",
        color: "green",
        tags: "agriculture, farming, livestock, organic",
        slug: "farm",
        isActive: true
      },
      {
        id: 3,
        name: "TOTAG Petroleum & Energy Services",
        description: "Bulk fuel distribution, petroleum storage facilities, energy logistics, and lubricant supply",
        icon: "Briefcase",
        color: "orange",
        tags: "petroleum, fuel, energy, oil",
        slug: "petroleum",
        isActive: true
      },
      {
        id: 4,
        name: "TOTAG General Construction & Infrastructure",
        description: "Civil engineering works, infrastructure development, heavy equipment fleet, and structural building",
        icon: "HardHat",
        color: "yellow",
        tags: "construction, infrastructure, engineering",
        slug: "construction",
        isActive: true
      },
      {
        id: 5,
        name: "TOTAG General Merchandise & Supply Chain",
        description: "Wholesale distribution, retail outlets, merchant network, and e-commerce supply chain",
        icon: "ShoppingBag",
        color: "purple",
        tags: "retail, wholesale, merchandise, commerce",
        slug: "general-merchandise",
        isActive: true
      },
      {
        id: 6,
        name: "TOTAG IT Services & Enterprise SaaS",
        description: "Managed IT services, cloud infrastructure, cybersecurity, and enterprise FIMS & HRMIS software",
        icon: "Laptop",
        color: "cyan",
        tags: "technology, IT, SaaS, enterprise",
        slug: "it-services",
        isActive: true
      },
      {
        id: 7,
        name: "TOTAG Catering & Hospitality Services",
        description: "Institutional and corporate catering, event planning, hall rentals, and HACCP-certified food safety",
        icon: "ChefHat",
        color: "red",
        tags: "catering, food, events, hospitality",
        slug: "catering",
        isActive: true
      },
      {
        id: 8,
        name: "TOTAG Real Estate & Property Management",
        description: "Commercial and residential property management, land development, facility management, and leasing",
        icon: "Briefcase",
        color: "green",
        tags: "real-estate, property, leasing, facilities",
        slug: "real-estate",
        isActive: true
      },
      {
        id: 9,
        name: "TOTAG Consulting & Financial Advisory Services",
        description: "Corporate management consulting, financial audit advisory, business process optimization, and strategy",
        icon: "Briefcase",
        color: "blue",
        tags: "consulting, advisory, finance, strategy",
        slug: "consulting",
        isActive: true
      }
    ]).onConflictDoNothing();


    // Seed market products
    console.log("🛒 Seeding market products...");
    await db.insert(marketProducts).values([
      {
        id: 1,
        name: "Fresh Tomatoes",
        description: "Organic, locally grown tomatoes. Perfect for salads, cooking, and sauces.",
        category: "vegetables",
        price: 2500,
        unit: "kg",
        stock: 150,
        isAvailable: true
      },
      {
        id: 2,
        name: "Organic Lettuce",
        description: "Crisp, fresh lettuce heads grown without chemicals. Ideal for salads.",
        category: "vegetables",
        price: 1800,
        unit: "bunch",
        stock: 80,
        isAvailable: true
      },
      {
        id: 3,
        name: "Sweet Corn",
        description: "Fresh sweet corn on the cob, harvested daily for maximum sweetness.",
        category: "vegetables",
        price: 3200,
        unit: "kg",
        stock: 120,
        isAvailable: true
      },
      {
        id: 4,
        name: "Farm Fresh Eggs",
        description: "Free-range chicken eggs from our farm. Rich in protein and nutrients.",
        category: "dairy",
        price: 3000,
        unit: "dozen",
        stock: 200,
        isAvailable: true
      },
      {
        id: 5,
        name: "Red Apples",
        description: "Crisp, juicy red apples. Perfect for snacking or baking.",
        category: "fruits",
        price: 4500,
        unit: "kg",
        stock: 100,
        isAvailable: true
      },
      {
        id: 6,
        name: "Bananas",
        description: "Sweet, ripe bananas rich in potassium and natural sugars.",
        category: "fruits",
        price: 2800,
        unit: "kg",
        stock: 180,
        isAvailable: true
      },
      {
        id: 7,
        name: "White Rice",
        description: "Premium quality white rice, locally processed and packaged.",
        category: "grains",
        price: 5500,
        unit: "kg",
        stock: 300,
        isAvailable: true
      },
      {
        id: 8,
        name: "Fresh Beef",
        description: "Premium quality beef from grass-fed cattle, locally sourced.",
        category: "meat",
        price: 8500,
        unit: "kg",
        stock: 50,
        isAvailable: true
      },
      {
        id: 9,
        name: "Chicken Breast",
        description: "Fresh, tender chicken breast meat, perfect for grilling or roasting.",
        category: "meat",
        price: 6800,
        unit: "kg",
        stock: 75,
        isAvailable: true
      },
      {
        id: 10,
        name: "Fresh Milk",
        description: "Pure, fresh milk from our dairy cows, pasteurized for safety.",
        category: "dairy",
        price: 2200,
        unit: "liter",
        stock: 120,
        isAvailable: true
      }
    ]).onConflictDoNothing();

    // Seed livestock
    console.log("🐄 Seeding livestock...");
    await db.insert(livestock).values([
      {
        id: 1,
        name: "Bessie",
        type: "cattle",
        breed: "Holstein",
        tagNumber: "H-001",
        birthDate: new Date("2022-03-15"),
        gender: "female",
        status: "active",
        weight: "450.5",
        notes: "Healthy Holstein cow, good milk production"
      },
      {
        id: 2,
        name: "Thunder",
        type: "cattle",
        breed: "Angus",
        tagNumber: "A-002",
        birthDate: new Date("2021-11-22"),
        gender: "male",
        status: "active",
        weight: "520.0",
        notes: "Prime breeding bull"
      },
      {
        id: 3,
        name: "Henrietta",
        type: "chicken",
        breed: "Rhode Island Red",
        tagNumber: "C-003",
        birthDate: new Date("2023-05-10"),
        gender: "female",
        status: "active",
        weight: "2.3",
        notes: "Good egg layer"
      }
    ]).onConflictDoNothing();

    // Seed crops
    console.log("🌱 Seeding crops...");
    await db.insert(crops).values([
      {
        id: 1,
        name: "Tomatoes",
        variety: "Roma",
        location: "Field A",
        plantingDate: new Date("2024-01-15"),
        harvestDate: new Date("2024-04-18"),
        status: "harvested",
        area: 25000, // in square meters
        yieldAmount: 4800,
        notes: "Good yield, excellent quality tomatoes"
      },
      {
        id: 2,
        name: "Corn",
        variety: "Sweet Corn", 
        location: "Field B",
        plantingDate: new Date("2024-02-01"),
        status: "growing",
        area: 30000,
        notes: "Expected harvest in June"
      }
    ]).onConflictDoNothing();

    // Seed equipment
    console.log("🚜 Seeding equipment...");
    await db.insert(equipment).values([
      {
        id: 1,
        name: "John Deere Tractor",
        type: "tractor",
        model: "6M-Series",
        status: "available",
        condition: "excellent",
        notes: "Primary field tractor, well maintained"
      },
      {
        id: 2,
        name: "Irrigation System",
        type: "irrigation",
        model: "Sprinkler Pro 3000",
        status: "in_use",
        condition: "good",
        notes: "Currently watering Field A"
      }
    ]).onConflictDoNothing();

    // Seed tasks
    console.log("✅ Seeding tasks...");
    await db.insert(tasks).values([
      {
        id: 1,
        title: "Feed cattle in Sector A",
        description: "Provide morning feed for Holstein cattle",
        category: "livestock",
        status: "completed",
        priority: "medium",
        dueDate: new Date("2024-07-13"),
        assignedTo: 3,
        userId: 2
      },
      {
        id: 2,
        title: "Inspect irrigation system",
        description: "Check sprinkler heads for proper operation",
        category: "maintenance",
        status: "pending",
        priority: "high",
        dueDate: new Date("2024-07-14"),
        assignedTo: 3,
        userId: 2
      }
    ]).onConflictDoNothing();

    // Seed activities
    console.log("📋 Seeding activities...");
    await db.insert(activities).values([
      {
        id: 1,
        activityType: "feeding",
        description: "Fed Holstein cattle in Sector A - 50kg grain feed",
        date: new Date("2024-07-13"),
        duration: 45,
        relatedUserId: 3
      },
      {
        id: 2,
        activityType: "maintenance", 
        description: "Cleaned and serviced tractor engine",
        date: new Date("2024-07-12"),
        duration: 120,
        relatedUserId: 2
      }
    ]).onConflictDoNothing();

    // Seed inventory
    console.log("📦 Seeding inventory...");
    await db.insert(inventory).values([
      {
        id: 1,
        itemName: "Cattle Feed",
        category: "feed",
        quantity: 2500,
        unit: "kg",
        minThreshold: 500,
        location: "Feed Storage A",
        supplier: "AgriSupply Ltd",
        costPerUnit: 150,
        managedByUserId: 2
      },
      {
        id: 2,
        itemName: "Fertilizer NPK",
        category: "fertilizer",
        quantity: 150,
        unit: "bags",
        minThreshold: 20,
        location: "Chemical Storage",
        supplier: "FarmChem Co",
        costPerUnit: 2500,
        managedByUserId: 2
      }
    ]).onConflictDoNothing();

    console.log("✅ Database seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if called directly  
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}