import { storage } from "./storage";
import bcrypt from "bcrypt";

const DEFAULT_PASSWORD = "Zwedru4gedeh";

const defaultStaff = [
  { username: "admin_toceps", password: DEFAULT_PASSWORD, email: "admin.toceps@totaggroup.com", firstName: "TOCEPS", lastName: "Admin", phone: "+231-886-100-000", role: "account_manager" },
  { username: "lta.manager", password: DEFAULT_PASSWORD, email: "lta.manager@totaggroup.com", firstName: "James", lastName: "Kollie", phone: "+231-777-100-001", role: "account_manager" },
  { username: "ops.supervisor", password: DEFAULT_PASSWORD, email: "ops.supervisor@totaggroup.com", firstName: "Martha", lastName: "Weah", phone: "+231-777-100-002", role: "operations_supervisor" },
  { username: "head.chef", password: DEFAULT_PASSWORD, email: "head.chef@totaggroup.com", firstName: "Emmanuel", lastName: "Doe", phone: "+231-777-100-003", role: "head_chef" },
  { username: "food.safety", password: DEFAULT_PASSWORD, email: "food.safety@totaggroup.com", firstName: "Patience", lastName: "Johnson", phone: "+231-777-100-004", role: "food_safety_supervisor" },
  { username: "team.lead", password: DEFAULT_PASSWORD, email: "team.lead@totaggroup.com", firstName: "Samuel", lastName: "Flomo", phone: "+231-777-100-005", role: "team_lead" },
  { username: "logistics.coord", password: DEFAULT_PASSWORD, email: "logistics@totaggroup.com", firstName: "Grace", lastName: "Gbowee", phone: "+231-777-100-006", role: "logistics_coordinator" },
];

export async function seedCateringStaff() {
  console.log("Seeding catering staff accounts...");
  for (const staff of defaultStaff) {
    try {
      const existing = await storage.getCateringStaffByUsername(staff.username);
      if (existing) {
        console.log(`  Staff ${staff.username} already exists, skipping`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(staff.password, 12);
      await storage.createCateringStaff({ ...staff, password: hashedPassword, isActive: true });
      console.log(`  Created staff: ${staff.username} (${staff.role})`);
    } catch (error: any) {
      console.error(`  Failed to create ${staff.username}:`, error.message);
    }
  }
  console.log("Catering staff seeding completed!");
}
