export type UserRole =
  | 'FARMER'
  | 'HOUSEHOLD_REP'
  | 'COOPERATIVE_REP'
  | 'ENUMERATOR'
  | 'SENIOR_ENUMERATOR'
  | 'COUNTY_AGRICULTURAL_OFFICER'
  | 'DISTRICT_AGRICULTURAL_OFFICER'
  | 'EXTENSION_AGENT'
  | 'VERIFICATION_OFFICER'
  | 'PROGRAM_OFFICER'
  | 'VOUCHER_ADMINISTRATOR'
  | 'INPUT_DISTRIBUTION_OFFICER'
  | 'PAYMENT_OFFICER'
  | 'MONITORING_EVALUATION_OFFICER'
  | 'GIS_OFFICER'
  | 'DATA_ANALYST'
  | 'HELPDESK_OFFICER'
  | 'DEVELOPMENT_PARTNER'
  | 'MINISTRY_ADMINISTRATOR'
  | 'SYSTEM_ADMINISTRATOR'
  | 'SECURITY_AUDITOR'
  | 'READONLY_OVERSIGHT'
  | 'INDEPENDENT_AUDITOR';

export interface RoleMetadata {
  code: UserRole;
  title: string;
  category: 'FARMER_COMMUNITY' | 'FIELD_OPS' | 'COUNTY_DISTRICT' | 'PROGRAM_PAYMENT' | 'ANALYTICS_GIS' | 'GOVERNANCE_AUDIT';
  description: string;
  scope: string;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleMetadata> = {
  FARMER: {
    code: 'FARMER',
    title: 'Farmer',
    category: 'FARMER_COMMUNITY',
    description: 'Individual smallholder, commercial farmer, or land manager.',
    scope: 'Self-service profile, own parcels, voucher wallet, extension alerts'
  },
  HOUSEHOLD_REP: {
    code: 'HOUSEHOLD_REP',
    title: 'Farmer Household Representative',
    category: 'FARMER_COMMUNITY',
    description: 'Designated representative managing household farm data.',
    scope: 'Household member updates, assistance applications'
  },
  COOPERATIVE_REP: {
    code: 'COOPERATIVE_REP',
    title: 'Cooperative Representative',
    category: 'FARMER_COMMUNITY',
    description: 'Leader of registered farmers cooperative society.',
    scope: 'Cooperative member roster, collective voucher redemptions'
  },
  ENUMERATOR: {
    code: 'ENUMERATOR',
    title: 'Enumerator',
    category: 'FIELD_OPS',
    description: 'Field officer capturing farmer identity and GPS parcel boundaries.',
    scope: 'Offline enrollment, GPS drawing, draft creation'
  },
  SENIOR_ENUMERATOR: {
    code: 'SENIOR_ENUMERATOR',
    title: 'Senior Enumerator',
    category: 'FIELD_OPS',
    description: 'Supervisor reviewing field enumerator submissions.',
    scope: 'Field verification, quality check, return for correction'
  },
  COUNTY_AGRICULTURAL_OFFICER: {
    code: 'COUNTY_AGRICULTURAL_OFFICER',
    title: 'County Agricultural Officer',
    category: 'COUNTY_DISTRICT',
    description: 'Senior Ministry representative overseeing county agricultural affairs.',
    scope: 'County-wide maker-checker approvals, supervisor review'
  },
  DISTRICT_AGRICULTURAL_OFFICER: {
    code: 'DISTRICT_AGRICULTURAL_OFFICER',
    title: 'District Agricultural Officer',
    category: 'COUNTY_DISTRICT',
    description: 'District lead coordinating extension agents and local registries.',
    scope: 'District verification, local extension routing'
  },
  EXTENSION_AGENT: {
    code: 'EXTENSION_AGENT',
    title: 'Extension Agent',
    category: 'FIELD_OPS',
    description: 'Agricultural extension advisor delivering agronomic advisories.',
    scope: 'Farmer advisory visits, crop disease reporting'
  },
  VERIFICATION_OFFICER: {
    code: 'VERIFICATION_OFFICER',
    title: 'Verification Officer',
    category: 'COUNTY_DISTRICT',
    description: 'Officer assigned to verify identity credentials and land claims.',
    scope: 'Field & remote verification, document validation'
  },
  PROGRAM_OFFICER: {
    code: 'PROGRAM_OFFICER',
    title: 'Program Officer',
    category: 'PROGRAM_PAYMENT',
    description: 'Manager of national agricultural subsidy and resilience programs.',
    scope: 'Program rules setup, eligibility evaluation, beneficiary enrollment'
  },
  VOUCHER_ADMINISTRATOR: {
    code: 'VOUCHER_ADMINISTRATOR',
    title: 'Voucher Administrator',
    category: 'PROGRAM_PAYMENT',
    description: 'Administrator managing digital input voucher campaigns.',
    scope: 'Voucher generation, campaign parameters, vendor allocation'
  },
  INPUT_DISTRIBUTION_OFFICER: {
    code: 'INPUT_DISTRIBUTION_OFFICER',
    title: 'Input-Distribution Officer',
    category: 'PROGRAM_PAYMENT',
    description: 'Agro-dealer or warehouse officer managing physical seed/fertilizer stock.',
    scope: 'QR voucher scanning, input release, inventory deduction'
  },
  PAYMENT_OFFICER: {
    code: 'PAYMENT_OFFICER',
    title: 'Payment Officer',
    category: 'PROGRAM_PAYMENT',
    description: 'Financial officer executing mobile money and bank transfers.',
    scope: 'Payout batch creation, MTN/Orange Money authorization'
  },
  MONITORING_EVALUATION_OFFICER: {
    code: 'MONITORING_EVALUATION_OFFICER',
    title: 'Monitoring and Evaluation Officer',
    category: 'ANALYTICS_GIS',
    description: 'M&E specialist assessing program outcomes and indicator progress.',
    scope: 'Indicator dashboards, impact evaluation, survey data'
  },
  GIS_OFFICER: {
    code: 'GIS_OFFICER',
    title: 'GIS Officer',
    category: 'ANALYTICS_GIS',
    description: 'Remote sensing and cadastre specialist managing spatial data.',
    scope: 'Satellite layers, spatial overlap analysis, GeoJSON exports'
  },
  DATA_ANALYST: {
    code: 'DATA_ANALYST',
    title: 'Data Analyst',
    category: 'ANALYTICS_GIS',
    description: 'Agricultural statistician analyzing production trends.',
    scope: 'Demographic reports, yield forecasts, CSV/PDF exports'
  },
  HELPDESK_OFFICER: {
    code: 'HELPDESK_OFFICER',
    title: 'Help-Desk Officer',
    category: 'GOVERNANCE_AUDIT',
    description: 'Customer service agent addressing grievances and correction tickets.',
    scope: 'Support tickets, tracking code search, SLA resolution'
  },
  DEVELOPMENT_PARTNER: {
    code: 'DEVELOPMENT_PARTNER',
    title: 'Development-Partner User',
    category: 'GOVERNANCE_AUDIT',
    description: 'Authorized FAO, World Bank, or donor organization representative.',
    scope: 'Anonymized oversight analytics, program monitoring'
  },
  MINISTRY_ADMINISTRATOR: {
    code: 'MINISTRY_ADMINISTRATOR',
    title: 'Ministry Administrator',
    category: 'GOVERNANCE_AUDIT',
    description: 'Senior MoA executive managing platform parameters.',
    scope: 'National configuration, master tables, policy governance'
  },
  SYSTEM_ADMINISTRATOR: {
    code: 'SYSTEM_ADMINISTRATOR',
    title: 'System Administrator',
    category: 'GOVERNANCE_AUDIT',
    description: 'IT infrastructure administrator managing access controls.',
    scope: 'Role assignment, system configuration, maintenance'
  },
  SECURITY_AUDITOR: {
    code: 'SECURITY_AUDITOR',
    title: 'Security Auditor',
    category: 'GOVERNANCE_AUDIT',
    description: 'Cybersecurity specialist reviewing system integrity and logs.',
    scope: 'Audit trail inspection, access log analysis, security alerts'
  },
  READONLY_OVERSIGHT: {
    code: 'READONLY_OVERSIGHT',
    title: 'Read-Only Oversight User',
    category: 'GOVERNANCE_AUDIT',
    description: 'Government oversight officer with view-only privileges.',
    scope: 'Read-only access to dashboards and non-sensitive registries'
  },
  INDEPENDENT_AUDITOR: {
    code: 'INDEPENDENT_AUDITOR',
    title: 'Independent Audit User',
    category: 'GOVERNANCE_AUDIT',
    description: 'External auditor verifying program compliance and expenditure.',
    scope: 'Independent audit logs, financial reconciliation reports'
  }
};

export type VerificationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING_FIELD_VERIFICATION'
  | 'FIELD_VERIFIED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'RETURNED_FOR_CORRECTION'
  | 'REJECTED'
  | 'SUSPENDED';

export type Gender = 'FEMALE' | 'MALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type MobileMoneyProvider = 'MTN_MOBILE_MONEY' | 'ORANGE_MONEY' | 'OTHER_BANK';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'REVERSED';
export type VoucherStatus = 'ISSUED' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED';

// Farm Infrastructure & Conditions requested by user
export interface FarmCondition {
  currentToolsUsed: Array<
    'MANUAL_CUTLASS_HOE' | 'POWER_TILLER' | 'MOTORIZED_SPRAYER' | 'TRACTOR' | 'THRESHER' | 'IRRIGATION_PUMP'
  >;
  environmentalMechanizationReadiness: {
    topography: 'FLAT' | 'UNDULATING' | 'STEEP_SLOPE';
    landClearingStatus: 'FULLY_CLEARED' | 'PARTIALLY_CLEARED' | 'STUMPED_TREES' | 'VIRGIN_FOREST';
    waterSourceAvailability: 'RIVER_STREAM' | 'SWAMP_LOWLAND' | 'WELL_BOREHOLE' | 'RAINFED_ONLY';
    drainageFloodRisk: 'LOW_RISK' | 'SEASONAL_FLOODING' | 'POOR_DRAINAGE';
  };
  farmToMarketRoad: {
    hasRoadAccess: boolean;
    roadType: 'ALL_WEATHER_PAVED' | 'UNPAVED_GRAVEL' | 'DRY_SEASON_TRACK' | 'FOOTPATH_ONLY';
    distanceToMainRoadKm: number;
    distanceToPrimaryMarketKm: number;
  };
  buyerRelationships: {
    hasContractedBuyers: boolean;
    primaryBuyerType: 'COOPERATIVE' | 'COMMERCIAL_OFFTAKER' | 'LOCAL_SPOT_MARKET' | 'EXPORTER' | 'NONE';
    buyerOrganizationName?: string;
  };
  storageFacilities: {
    hasOnFarmStorage: boolean;
    storageType?: 'TRADITIONAL_BARN' | 'COMMUNITY_WAREHOUSE' | 'VENTILATED_SHED' | 'GRAIN_SILO';
    hasColdChainAccess: boolean;
    traceabilityReadiness: 'BATCH_CODED' | 'QR_TAGGED' | 'MANUAL_LOG' | 'NOT_READY';
  };
  processingFacilities: {
    hasOnFarmProcessing: boolean;
    nearbyProcessingProximity: 'ON_SITE' | 'WITHIN_5KM' | 'WITHIN_20KM' | 'FAR_OVER_20KM';
    processingTypeAvailable: Array<
      'RICE_MILL' | 'CASSAVA_GARI_PRESS' | 'OIL_PALM_MILL' | 'COCOA_DRYING_SHED' | 'CORN_SHELLER'
    >;
  };
}

export interface FarmerProfile {
  id: string;
  farmerRegistryNumber: string; // e.g. LDFR-2026-88392
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  sex: Gender;
  nationalIdNumber: string;
  photoUrl?: string;
  primaryPhone: string;
  alternativePhone?: string;
  email?: string;
  preferredLanguage: string;
  isDisabilityRegistered: boolean;
  isYouth: boolean; // Under 35 years
  isFemaleHeadedHousehold: boolean;
  
  // Location
  county: string;
  district: string;
  clan: string;
  chiefdom?: string;
  community: string;
  village?: string;
  gpsLatitude: number;
  gpsLongitude: number;
  
  // Household
  householdSize: number;
  dependentsCount: number;
  agriculturalWorkersCount: number;

  // Financial
  mobileMoneyProvider: MobileMoneyProvider;
  mobileMoneyNumber: string;
  mobileMoneyAccountName: string;
  bankName?: string;
  bankAccountNumberMasked?: string;
  
  // Farm & Conditions
  farmConditions: FarmCondition;
  
  // Status & Audit
  verificationStatus: VerificationStatus;
  enumeratorId: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
  isDemoRecord: boolean;
}

export interface Parcel {
  id: string;
  farmerId: string;
  farmName: string;
  farmRegistryNumber: string;
  county: string;
  district: string;
  ownershipStatus: 'OWNED_TITLE' | 'CUSTOMARY_LAND' | 'LEASED_RENTED' | 'SHARECROPPING';
  polygonCoordinates: Array<[number, number]>; // Array of [lat, lng]
  calculatedAreaHectares: number;
  calculatedAreaAcres: number;
  reportedAreaAcres: number;
  primaryCrop: string;
  secondaryCrops?: string[];
  soilType?: string;
  irrigationStatus: 'RAINFED' | 'PARTIAL_IRRIGATION' | 'FULL_IRRIGATION';
  verificationStatus: VerificationStatus;
  createdAt: string;
}

export interface AgriculturalProgram {
  id: string;
  code: string;
  name: string;
  sponsor: string;
  fundingSource: string;
  targetCounties: string[];
  budgetUsd: number;
  beneficiaryCeiling: number;
  enrolledCount: number;
  benefitType: 'INPUT_VOUCHER' | 'MOBILE_MONEY_CASH' | 'EQUIPMENT_SUBSIDY' | 'EXTENSION_TRAINING';
  benefitValueUsd: number;
  startDate: string;
  endDate: string;
  eligibilityRules: {
    minFarmSizeHa?: number;
    maxFarmSizeHa?: number;
    targetCrops?: string[];
    requireFemaleHeaded?: boolean;
    requireYouth?: boolean;
    requireRoadAccess?: boolean;
  };
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

export interface Voucher {
  id: string;
  voucherCode: string;
  qrCodeUrl: string;
  programId: string;
  programName: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  valueUsd: number;
  valueLrd: number;
  approvedInputs: string[];
  vendorId?: string;
  vendorName?: string;
  status: VoucherStatus;
  issuedDate: string;
  redeemedDate?: string;
}

export interface PaymentBatch {
  id: string;
  batchReference: string;
  programId: string;
  programName: string;
  totalBeneficiaries: number;
  totalAmountUsd: number;
  provider: MobileMoneyProvider;
  status: 'DRAFT_BATCH' | 'PENDING_APPROVAL' | 'APPROVED' | 'DISBURSED' | 'FAILED';
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  disbursedAt?: string;
}

export interface DuplicateAlert {
  id: string;
  primaryFarmerId: string;
  primaryFarmerName: string;
  secondaryFarmerId: string;
  secondaryFarmerName: string;
  overallMatchScore: number; // 0 to 100%
  matchingReasons: string[];
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'UNRESOLVED' | 'MERGED' | 'CONFIRMED_UNIQUE' | 'REJECTED';
  createdAt: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface GrievanceTicket {
  id: string;
  trackingCode: string;
  farmerName: string;
  farmerPhone: string;
  county: string;
  category: 'REGISTRATION_ISSUE' | 'ELIGIBILITY_APPEAL' | 'MISSING_PAYMENT' | 'VOUCHER_REDEMPTION' | 'DATA_CORRECTION';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  description: string;
  assignedOfficer?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
}
