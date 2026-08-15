import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedMerchantUsers() {
  console.log("Seeding merchant users...");

  const demoUsers = [
    {
      username: "admin",
      password: "admin123",
      email: "admin@tgm.com",
      firstName: "John",
      lastName: "Admin",
      role: "General Manager",
      department: "Management",
      isActive: true
    },
    {
      username: "warehouse1", 
      password: "warehouse123",
      email: "warehouse@tgm.com",
      firstName: "Sarah",
      lastName: "Warehouse",
      role: "Warehouse Staff",
      department: "Operations",
      isActive: true
    },
    {
      username: "delivery1",
      password: "delivery123", 
      email: "delivery@tgm.com",
      firstName: "Michael",
      lastName: "Driver",
      role: "Delivery Staff",
      department: "Logistics",
      isActive: true
    },
    {
      username: "sales1",
      password: "sales123",
      email: "sales@tgm.com", 
      firstName: "Emily",
      lastName: "Sales",
      role: "Sales Team",
      department: "Sales",
      isActive: true
    }
  ];

  for (const userData of demoUsers) {
    try {
      // Check if user already exists
      const [existingUser] = await db.select().from(users).where(eq(users.username, userData.username));
      
      if (!existingUser) {
        // Create the user
        const [newUser] = await db.insert(users).values(userData).returning();
        console.log(`Created user: ${newUser.username} (${newUser.role})`);
      } else {
        // Update existing user
        const [updatedUser] = await db
          .update(users)
          .set(userData)
          .where(eq(users.username, userData.username))
          .returning();
        console.log(`Updated user: ${updatedUser.username} (${updatedUser.role})`);
      }
    } catch (error) {
      console.error(`Error creating user ${userData.username}:`, error);
    }
  }

  console.log("Merchant users seeding completed!");
}