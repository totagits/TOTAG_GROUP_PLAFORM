import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const FARM_USERS = [
  { username: "manager", password: "password123", role: "manager", firstName: "Farm", lastName: "Manager", department: "farm" },
  { username: "staff",   password: "password123", role: "staff",   firstName: "Farm", lastName: "Staff",   department: "farm" },
  { username: "admin",   password: "password123", role: "admin",   firstName: "Farm", lastName: "Admin",   department: "farm" },
];

export async function seedFarmUsers() {
  console.log("Seeding farm demo users...");
  for (const u of FARM_USERS) {
    const [existing] = await db.select().from(users).where(eq(users.username, u.username));
    if (!existing) {
      await db.insert(users).values({ ...u, isActive: true });
      console.log(`  Created farm user: ${u.username}`);
    } else if (existing.password !== u.password || existing.department !== "farm" || existing.role !== u.role) {
      await db.update(users).set({ password: u.password, role: u.role, department: "farm", isActive: true }).where(eq(users.username, u.username));
      console.log(`  Updated farm user: ${u.username}`);
    } else {
      console.log(`  Farm user ${u.username} already correct, skipping`);
    }
  }
  console.log("Farm demo users ready!");
}
