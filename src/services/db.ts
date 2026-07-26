import Dexie, { type Table } from 'dexie';
import type {
  FarmerProfile,
  Parcel,
  AgriculturalProgram,
  Voucher,
  PaymentBatch,
  DuplicateAlert,
  GrievanceTicket,
  AuditEvent
} from '../types';
import {
  INITIAL_FARMERS,
  INITIAL_PARCELS,
  INITIAL_PROGRAMS,
  INITIAL_VOUCHERS,
  INITIAL_PAYMENTS,
  INITIAL_DUPLICATES,
  INITIAL_GRIEVANCES,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

export class LDFRDatabase extends Dexie {
  farmers!: Table<FarmerProfile, string>;
  parcels!: Table<Parcel, string>;
  programs!: Table<AgriculturalProgram, string>;
  vouchers!: Table<Voucher, string>;
  payments!: Table<PaymentBatch, string>;
  duplicates!: Table<DuplicateAlert, string>;
  grievances!: Table<GrievanceTicket, string>;
  auditLogs!: Table<AuditEvent, string>;
  offlineQueue!: Table<{ id: string; type: string; payload: any; timestamp: string }, string>;

  constructor() {
    super('LDFRDatabase');
    this.version(1).stores({
      farmers: 'id, farmerRegistryNumber, nationalIdNumber, primaryPhone, county, district, verificationStatus',
      parcels: 'id, farmerId, farmRegistryNumber, county, primaryCrop, verificationStatus',
      programs: 'id, code, name, status',
      vouchers: 'id, voucherCode, programId, farmerId, status',
      payments: 'id, batchReference, programId, status',
      duplicates: 'id, primaryFarmerId, secondaryFarmerId, status',
      grievances: 'id, trackingCode, status',
      auditLogs: 'id, timestamp, actorName, action',
      offlineQueue: 'id, type, timestamp'
    });
  }
}

export const db = new LDFRDatabase();

// Seed database safely
export async function initializeDatabase() {
  try {
    await db.farmers.bulkPut(INITIAL_FARMERS);
    await db.parcels.bulkPut(INITIAL_PARCELS);
    await db.programs.bulkPut(INITIAL_PROGRAMS);
    await db.vouchers.bulkPut(INITIAL_VOUCHERS);
    await db.payments.bulkPut(INITIAL_PAYMENTS);
    await db.duplicates.bulkPut(INITIAL_DUPLICATES);
    await db.grievances.bulkPut(INITIAL_GRIEVANCES);
    await db.auditLogs.bulkPut(INITIAL_AUDIT_LOGS);
    console.log('LDFR IndexedDB populated with initial seed data.');
  } catch (err) {
    console.warn('IndexedDB seed notification:', err);
  }
}

// Log audit event helper
export async function logAuditEvent(
  actorName: string,
  actorRole: any,
  action: string,
  entityType: string,
  entityId: string,
  details: string
) {
  const log: AuditEvent = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actorName,
    actorRole,
    action,
    entityType,
    entityId,
    details,
    ipAddress: '197.231.22.10'
  };
  await db.auditLogs.add(log);
}
