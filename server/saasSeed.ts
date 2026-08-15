#!/usr/bin/env tsx

/**
 * SaaS Platform Seeding Script
 * Seeds the database with available FIMS and HRMIS modules, and demo tenant/user
 */

import { seedSaasModules } from './saasModuleSeed';
import { db } from './db';
import { tenants, saasUsers } from '@shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

/**
 * Seed demo tenant and users
 */
async function seedDemoTenantAndUsers() {
  console.log('📋 Seeding demo tenant and users...');
  
  const tenantId = 'demo-tenant-001';
  const now = new Date();
  
  // Check if demo tenant already exists
  const existingTenant = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  
  if (existingTenant.length > 0) {
    console.log('  ✓ Demo tenant already exists');
  } else {
    // Create demo tenant
    await db.insert(tenants).values({
      id: tenantId,
      name: 'ACME Corporation',
      slug: 'acme-corp',
      contactEmail: 'admin@acme-corp.com',
      contactPhone: '+231-123-456-789',
      address: '123 Business District, Monrovia',
      country: 'Liberia',
      timezone: 'Africa/Monrovia',
      currency: 'LRD',
      status: 'active',
      onboardedAt: now,
      createdAt: now,
      updatedAt: now,
    });
    console.log('  ✓ Demo tenant "ACME Corporation" created');
  }
  
  // Hash passwords
  const adminPasswordHash = await bcrypt.hash('password123', 12);
  const totagPasswordHash = await bcrypt.hash('Zwedru4gedeh', 12);
  
  // Demo admin user
  const adminUserId = 'demo-admin-001';
  const existingAdmin = await db.select().from(saasUsers).where(eq(saasUsers.id, adminUserId)).limit(1);
  
  if (existingAdmin.length > 0) {
    console.log('  ✓ Demo admin user already exists');
  } else {
    await db.insert(saasUsers).values({
      id: adminUserId,
      tenantId,
      email: 'admin@acme-corp.com',
      password: adminPasswordHash,
      firstName: 'John',
      lastName: 'Admin',
      phone: '+231-123-456-789',
      role: 'admin',
      permissions: ['tenant_admin', 'user_management', 'billing_read', 'billing_write'],
      isActive: true,
      isTenantAdmin: true,
      mustChangePassword: false,
      emailVerifiedAt: now,
      createdAt: now,
      updatedAt: now,
    });
    console.log('  ✓ Demo admin user "admin@acme-corp.com" created (password: password123)');
  }
  
  // TOTAG test user
  const totagUserId = 'totag-user-001';
  const existingTotag = await db.select().from(saasUsers).where(eq(saasUsers.id, totagUserId)).limit(1);
  
  if (existingTotag.length > 0) {
    console.log('  ✓ TOTAG test user already exists');
  } else {
    await db.insert(saasUsers).values({
      id: totagUserId,
      tenantId,
      email: 'totagfarm@gmail.com',
      password: totagPasswordHash,
      firstName: 'TOTAG',
      lastName: 'User',
      phone: '+231-987-654-321',
      role: 'admin',
      permissions: ['tenant_admin', 'user_management', 'billing_read', 'billing_write'],
      isActive: true,
      isTenantAdmin: true,
      mustChangePassword: false,
      emailVerifiedAt: now,
      createdAt: now,
      updatedAt: now,
    });
    console.log('  ✓ TOTAG user "totagfarm@gmail.com" created (password: Zwedru4gedeh)');
  }
  
  console.log('✅ Demo tenant and users seeding completed!');
}

async function runSeeding() {
  console.log('🚀 Starting TOTAG SaaS Platform seeding...\n');
  
  try {
    // Seed the available modules
    await seedSaasModules();
    
    // Seed demo tenant and users
    await seedDemoTenantAndUsers();
    
    console.log('\n✅ SaaS platform seeding completed successfully!');
    console.log('\n🎯 Demo Credentials:');
    console.log('   Email: totagfarm@gmail.com');
    console.log('   Password: Zwedru4gedeh');
    console.log('\n   Alternative:');
    console.log('   Email: admin@acme-corp.com');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding immediately when imported as main module
runSeeding();

export { runSeeding, seedDemoTenantAndUsers };
