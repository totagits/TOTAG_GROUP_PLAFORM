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

export const INITIAL_FARMERS: FarmerProfile[] = [
  {
    id: 'f-101',
    farmerRegistryNumber: 'LDFR-2026-08149',
    firstName: 'Hawa',
    middleName: 'Kollie',
    lastName: 'Flomo',
    preferredName: 'Mama Hawa',
    dateOfBirth: '1984-06-12',
    sex: 'FEMALE',
    nationalIdNumber: 'NIN-LR-88291049',
    primaryPhone: '+231770123456',
    alternativePhone: '+231886123456',
    preferredLanguage: 'English / Kpelle',
    isDisabilityRegistered: false,
    isYouth: false,
    isFemaleHeadedHousehold: true,
    county: 'Lofa',
    district: 'Foya',
    clan: 'Foya Central',
    community: 'Shelltown',
    village: 'Wassakor',
    gpsLatitude: 8.3512,
    gpsLongitude: -10.2245,
    householdSize: 6,
    dependentsCount: 4,
    agriculturalWorkersCount: 3,
    mobileMoneyProvider: 'MTN_MOBILE_MONEY',
    mobileMoneyNumber: '0770123456',
    mobileMoneyAccountName: 'Hawa K. Flomo',
    bankName: 'Liberia Bank for Development & Investment (LBDI)',
    bankAccountNumberMasked: '••••••••4892',
    farmConditions: {
      currentToolsUsed: ['MANUAL_CUTLASS_HOE', 'MOTORIZED_SPRAYER'],
      environmentalMechanizationReadiness: {
        topography: 'FLAT',
        landClearingStatus: 'FULLY_CLEARED',
        waterSourceAvailability: 'SWAMP_LOWLAND',
        drainageFloodRisk: 'SEASONAL_FLOODING'
      },
      farmToMarketRoad: {
        hasRoadAccess: true,
        roadType: 'UNPAVED_GRAVEL',
        distanceToMainRoadKm: 2.5,
        distanceToPrimaryMarketKm: 8.0
      },
      buyerRelationships: {
        hasContractedBuyers: true,
        primaryBuyerType: 'COOPERATIVE',
        buyerOrganizationName: 'Foya Women Rice Farmers Cooperative Society'
      },
      storageFacilities: {
        hasOnFarmStorage: true,
        storageType: 'COMMUNITY_WAREHOUSE',
        hasColdChainAccess: false,
        traceabilityReadiness: 'QR_TAGGED'
      },
      processingFacilities: {
        hasOnFarmProcessing: false,
        nearbyProcessingProximity: 'WITHIN_5KM',
        processingTypeAvailable: ['RICE_MILL', 'CASSAVA_GARI_PRESS']
      }
    },
    verificationStatus: 'APPROVED',
    enumeratorId: 'ENUM-004',
    createdAt: '2026-02-10T09:30:00Z',
    updatedAt: '2026-02-14T14:20:00Z',
    verifiedAt: '2026-02-12T11:00:00Z',
    verifiedBy: 'County Officer Tarkpor',
    notes: 'Verified lowland paddy rice farmer with active female cooperative leadership.',
    isDemoRecord: true
  },
  {
    id: 'f-102',
    farmerRegistryNumber: 'LDFR-2026-09321',
    firstName: 'Emmanuel',
    lastName: 'Dahn',
    preferredName: 'Brother Dahn',
    dateOfBirth: '1995-11-04',
    sex: 'MALE',
    nationalIdNumber: 'NIN-LR-44910283',
    primaryPhone: '+231886987654',
    preferredLanguage: 'English / Mano',
    isDisabilityRegistered: false,
    isYouth: true, // Under 35
    isFemaleHeadedHousehold: false,
    county: 'Nimba',
    district: 'Ganta / Leewehpea',
    clan: 'Ganta City',
    community: 'Gbao Market Community',
    gpsLatitude: 7.0215,
    gpsLongitude: -8.9854,
    householdSize: 4,
    dependentsCount: 2,
    agriculturalWorkersCount: 2,
    mobileMoneyProvider: 'ORANGE_MONEY',
    mobileMoneyNumber: '0886987654',
    mobileMoneyAccountName: 'Emmanuel Dahn',
    farmConditions: {
      currentToolsUsed: ['MANUAL_CUTLASS_HOE', 'POWER_TILLER', 'IRRIGATION_PUMP'],
      environmentalMechanizationReadiness: {
        topography: 'UNDULATING',
        landClearingStatus: 'PARTIALLY_CLEARED',
        waterSourceAvailability: 'RIVER_STREAM',
        drainageFloodRisk: 'LOW_RISK'
      },
      farmToMarketRoad: {
        hasRoadAccess: true,
        roadType: 'ALL_WEATHER_PAVED',
        distanceToMainRoadKm: 0.5,
        distanceToPrimaryMarketKm: 3.2
      },
      buyerRelationships: {
        hasContractedBuyers: true,
        primaryBuyerType: 'COMMERCIAL_OFFTAKER',
        buyerOrganizationName: 'Ganta Fresh Produce Aggregators Ltd'
      },
      storageFacilities: {
        hasOnFarmStorage: true,
        storageType: 'VENTILATED_SHED',
        hasColdChainAccess: true,
        traceabilityReadiness: 'BATCH_CODED'
      },
      processingFacilities: {
        hasOnFarmProcessing: true,
        nearbyProcessingProximity: 'ON_SITE',
        processingTypeAvailable: ['CASSAVA_GARI_PRESS', 'CORN_SHELLER']
      }
    },
    verificationStatus: 'APPROVED',
    enumeratorId: 'ENUM-002',
    createdAt: '2026-02-12T10:15:00Z',
    updatedAt: '2026-02-15T16:00:00Z',
    verifiedAt: '2026-02-14T09:45:00Z',
    verifiedBy: 'County Officer Nimley',
    notes: 'Youth commercial vegetable & cassava producer with solar cold storage.',
    isDemoRecord: true
  },
  {
    id: 'f-103',
    farmerRegistryNumber: 'LDFR-2026-11048',
    firstName: 'Moses',
    middleName: 'Tiah',
    lastName: 'Weah',
    dateOfBirth: '1976-03-22',
    sex: 'MALE',
    nationalIdNumber: 'NIN-LR-10492837',
    primaryPhone: '+231775554321',
    preferredLanguage: 'English / Bassa',
    isDisabilityRegistered: false,
    isYouth: false,
    isFemaleHeadedHousehold: false,
    county: 'Grand Bassa',
    district: 'District #3',
    clan: 'Buchanan City',
    community: 'Owensgrove Feeder',
    gpsLatitude: 5.8821,
    gpsLongitude: -10.0512,
    householdSize: 7,
    dependentsCount: 5,
    agriculturalWorkersCount: 4,
    mobileMoneyProvider: 'MTN_MOBILE_MONEY',
    mobileMoneyNumber: '0775554321',
    mobileMoneyAccountName: 'Moses Tiah Weah',
    farmConditions: {
      currentToolsUsed: ['MANUAL_CUTLASS_HOE'],
      environmentalMechanizationReadiness: {
        topography: 'FLAT',
        landClearingStatus: 'STUMPED_TREES',
        waterSourceAvailability: 'RAINFED_ONLY',
        drainageFloodRisk: 'LOW_RISK'
      },
      farmToMarketRoad: {
        hasRoadAccess: false,
        roadType: 'FOOTPATH_ONLY',
        distanceToMainRoadKm: 7.5,
        distanceToPrimaryMarketKm: 18.0
      },
      buyerRelationships: {
        hasContractedBuyers: false,
        primaryBuyerType: 'LOCAL_SPOT_MARKET'
      },
      storageFacilities: {
        hasOnFarmStorage: false,
        hasColdChainAccess: false,
        traceabilityReadiness: 'NOT_READY'
      },
      processingFacilities: {
        hasOnFarmProcessing: false,
        nearbyProcessingProximity: 'FAR_OVER_20KM',
        processingTypeAvailable: ['OIL_PALM_MILL']
      }
    },
    verificationStatus: 'PENDING_FIELD_VERIFICATION',
    enumeratorId: 'ENUM-007',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
    isDemoRecord: true
  },
  {
    id: 'f-104',
    farmerRegistryNumber: 'LDFR-2026-12904',
    firstName: 'Fatu',
    lastName: 'Kanneh',
    dateOfBirth: '1999-08-19',
    sex: 'FEMALE',
    nationalIdNumber: 'NIN-LR-99201482',
    primaryPhone: '+231778901234',
    preferredLanguage: 'English / Vai',
    isDisabilityRegistered: true, // Disability registered
    isYouth: true,
    isFemaleHeadedHousehold: true,
    county: 'Grand Cape Mount',
    district: 'Garwula',
    clan: 'Sinje',
    community: 'Sinje Junction',
    gpsLatitude: 7.0254,
    gpsLongitude: -11.0125,
    householdSize: 5,
    dependentsCount: 3,
    agriculturalWorkersCount: 1,
    mobileMoneyProvider: 'ORANGE_MONEY',
    mobileMoneyNumber: '0880901234',
    mobileMoneyAccountName: 'Fatu Kanneh',
    farmConditions: {
      currentToolsUsed: ['MANUAL_CUTLASS_HOE'],
      environmentalMechanizationReadiness: {
        topography: 'FLAT',
        landClearingStatus: 'FULLY_CLEARED',
        waterSourceAvailability: 'SWAMP_LOWLAND',
        drainageFloodRisk: 'POOR_DRAINAGE'
      },
      farmToMarketRoad: {
        hasRoadAccess: true,
        roadType: 'UNPAVED_GRAVEL',
        distanceToMainRoadKm: 1.0,
        distanceToPrimaryMarketKm: 4.5
      },
      buyerRelationships: {
        hasContractedBuyers: true,
        primaryBuyerType: 'COOPERATIVE',
        buyerOrganizationName: 'Sinje Inclusive Agricultural Women Union'
      },
      storageFacilities: {
        hasOnFarmStorage: true,
        storageType: 'TRADITIONAL_BARN',
        hasColdChainAccess: false,
        traceabilityReadiness: 'MANUAL_LOG'
      },
      processingFacilities: {
        hasOnFarmProcessing: false,
        nearbyProcessingProximity: 'WITHIN_5KM',
        processingTypeAvailable: ['CASSAVA_GARI_PRESS']
      }
    },
    verificationStatus: 'FIELD_VERIFIED',
    enumeratorId: 'ENUM-004',
    createdAt: '2026-02-20T11:20:00Z',
    updatedAt: '2026-02-22T15:10:00Z',
    verifiedAt: '2026-02-22T15:00:00Z',
    verifiedBy: 'Senior Enumerator Kamara',
    isDemoRecord: true
  }
];

export const INITIAL_PARCELS: Parcel[] = [
  {
    id: 'p-201',
    farmerId: 'f-101',
    farmName: 'Shelltown Lowland Paddy Farm',
    farmRegistryNumber: 'LDFR-PARCEL-LF-001',
    county: 'Lofa',
    district: 'Foya',
    ownershipStatus: 'CUSTOMARY_LAND',
    polygonCoordinates: [
      [8.3512, -10.2245],
      [8.3525, -10.2230],
      [8.3508, -10.2215],
      [8.3495, -10.2235]
    ],
    calculatedAreaHectares: 3.45,
    calculatedAreaAcres: 8.52,
    reportedAreaAcres: 8.5,
    primaryCrop: 'Rice (Lowland Paddy)',
    secondaryCrops: ['Cassava', 'Vegetables (Pepper, Bitter Ball, Okra)'],
    soilType: 'Loamy Clay Lowland',
    irrigationStatus: 'PARTIAL_IRRIGATION',
    verificationStatus: 'APPROVED',
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'p-202',
    farmerId: 'f-102',
    farmName: 'Ganta Commercial Cassava & Solar Park',
    farmRegistryNumber: 'LDFR-PARCEL-NI-088',
    county: 'Nimba',
    district: 'Ganta / Leewehpea',
    ownershipStatus: 'OWNED_TITLE',
    polygonCoordinates: [
      [7.0215, -8.9854],
      [7.0230, -8.9835],
      [7.0210, -8.9820],
      [7.0195, -8.9840]
    ],
    calculatedAreaHectares: 5.80,
    calculatedAreaAcres: 14.33,
    reportedAreaAcres: 14.0,
    primaryCrop: 'Cassava',
    secondaryCrops: ['Corn / Maize', 'Vegetables (Pepper, Bitter Ball, Okra)'],
    soilType: 'Sandy Loam',
    irrigationStatus: 'FULL_IRRIGATION',
    verificationStatus: 'APPROVED',
    createdAt: '2026-02-12T11:00:00Z'
  },
  {
    id: 'p-203',
    farmerId: 'f-103',
    farmName: 'Owensgrove Oil Palm & Upland Plot',
    farmRegistryNumber: 'LDFR-PARCEL-GBA-012',
    county: 'Grand Bassa',
    district: 'District #3',
    ownershipStatus: 'LEASED_RENTED',
    polygonCoordinates: [
      [5.8821, -10.0512],
      [5.8835, -10.0495],
      [5.8810, -10.0480],
      [5.8800, -10.0500]
    ],
    calculatedAreaHectares: 2.10,
    calculatedAreaAcres: 5.18,
    reportedAreaAcres: 5.0,
    primaryCrop: 'Oil Palm',
    secondaryCrops: ['Rice (Upland)'],
    soilType: 'Laterite Red Soil',
    irrigationStatus: 'RAINFED',
    verificationStatus: 'PENDING_FIELD_VERIFICATION',
    createdAt: '2026-03-01T08:30:00Z'
  }
];

export const INITIAL_PROGRAMS: AgriculturalProgram[] = [
  {
    id: 'prg-01',
    code: 'MOA-FAO-RICE-2026',
    name: 'Liberia Emergency Rice Seed & Fertilizer Incentive (LERSFI)',
    sponsor: 'Ministry of Agriculture Liberia & FAO',
    fundingSource: 'Global Agriculture & Food Security Program (GAFSP)',
    targetCounties: ['Lofa', 'Nimba', 'Bong', 'Grand Cape Mount', 'Maryland'],
    budgetUsd: 1500000,
    beneficiaryCeiling: 25000,
    enrolledCount: 14280,
    benefitType: 'INPUT_VOUCHER',
    benefitValueUsd: 150,
    startDate: '2026-01-15',
    endDate: '2026-10-31',
    eligibilityRules: {
      minFarmSizeHa: 0.5,
      maxFarmSizeHa: 10.0,
      targetCrops: ['Rice (Lowland Paddy)', 'Rice (Upland)'],
      requireRoadAccess: false
    },
    status: 'ACTIVE'
  },
  {
    id: 'prg-02',
    code: 'MOA-CASH-YOUTH-2026',
    name: 'National Women & Youth Agri-Tech Cash Grant',
    sponsor: 'Government of Liberia & African Development Bank',
    fundingSource: 'AfDB Inclusive Agri-Development Fund',
    targetCounties: ['Montserrado', 'Margibi', 'Nimba', 'Bong', 'Grand Bassa', 'Sinoe'],
    budgetUsd: 850000,
    beneficiaryCeiling: 5000,
    enrolledCount: 3120,
    benefitType: 'MOBILE_MONEY_CASH',
    benefitValueUsd: 250,
    startDate: '2026-02-01',
    endDate: '2026-12-15',
    eligibilityRules: {
      requireFemaleHeaded: false,
      requireYouth: true
    },
    status: 'ACTIVE'
  },
  {
    id: 'prg-03',
    code: 'MOA-MECH-ROAD-2026',
    name: 'Smallholder Power Tiller & Feeder Road Assistance',
    sponsor: 'Ministry of Agriculture Liberia',
    fundingSource: 'World Bank Liberia Ag-Transformation Project (LATP)',
    targetCounties: ['Lofa', 'Nimba', 'Bong', 'Grand Gedeh'],
    budgetUsd: 2200000,
    beneficiaryCeiling: 1200,
    enrolledCount: 640,
    benefitType: 'EQUIPMENT_SUBSIDY',
    benefitValueUsd: 800,
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    eligibilityRules: {
      minFarmSizeHa: 2.0,
      requireRoadAccess: true
    },
    status: 'ACTIVE'
  }
];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'v-901',
    voucherCode: 'LDFR-VCH-2026-8819',
    qrCodeUrl: 'LDFR-VCH-2026-8819',
    programId: 'prg-01',
    programName: 'Liberia Emergency Rice Seed & Fertilizer Incentive (LERSFI)',
    farmerId: 'f-101',
    farmerName: 'Hawa Kollie Flomo',
    farmerPhone: '+231770123456',
    valueUsd: 150,
    valueLrd: 29250, // 1 USD ~ 195 LRD
    approvedInputs: ['25kg Certified Suakoko Rice Seed', '50kg NPK 15-15-15 Fertilizer', '50kg Urea'],
    status: 'ISSUED',
    issuedDate: '2026-02-15T09:00:00Z'
  },
  {
    id: 'v-902',
    voucherCode: 'LDFR-VCH-2026-9042',
    qrCodeUrl: 'LDFR-VCH-2026-9042',
    programId: 'prg-01',
    programName: 'Liberia Emergency Rice Seed & Fertilizer Incentive (LERSFI)',
    farmerId: 'f-104',
    farmerName: 'Fatu Kanneh',
    farmerPhone: '+231778901234',
    valueUsd: 150,
    valueLrd: 29250,
    approvedInputs: ['25kg Certified Suakoko Rice Seed', '50kg NPK 15-15-15 Fertilizer'],
    vendorId: 'VND-FOYA-01',
    vendorName: 'Liberia Agro-Inputs Center (Foya Branch)',
    status: 'REDEEMED',
    issuedDate: '2026-02-23T10:00:00Z',
    redeemedDate: '2026-02-25T14:30:00Z'
  }
];

export const INITIAL_PAYMENTS: PaymentBatch[] = [
  {
    id: 'pay-701',
    batchReference: 'MOA-PAY-2026-0041',
    programId: 'prg-02',
    programName: 'National Women & Youth Agri-Tech Cash Grant',
    totalBeneficiaries: 120,
    totalAmountUsd: 30000,
    provider: 'MTN_MOBILE_MONEY',
    status: 'DISBURSED',
    createdBy: 'Payment Officer Sackie',
    approvedBy: 'Financial Director Sherman',
    createdAt: '2026-02-18T10:00:00Z',
    disbursedAt: '2026-02-18T16:45:00Z'
  },
  {
    id: 'pay-702',
    batchReference: 'MOA-PAY-2026-0058',
    programId: 'prg-02',
    programName: 'National Women & Youth Agri-Tech Cash Grant',
    totalBeneficiaries: 85,
    totalAmountUsd: 21250,
    provider: 'ORANGE_MONEY',
    status: 'PENDING_APPROVAL',
    createdBy: 'Payment Officer Sackie',
    createdAt: '2026-03-02T11:00:00Z'
  }
];

export const INITIAL_DUPLICATES: DuplicateAlert[] = [
  {
    id: 'dup-001',
    primaryFarmerId: 'f-101',
    primaryFarmerName: 'Hawa Kollie Flomo',
    secondaryFarmerId: 'f-104',
    secondaryFarmerName: 'Fatu Kanneh',
    overallMatchScore: 68,
    matchingReasons: [
      'Same County & District (Lofa / Foya)',
      'Similar Mobile Money provider prefix',
      'Overlapping parcel boundary bounding box (< 50m distance)'
    ],
    riskLevel: 'MEDIUM',
    status: 'UNRESOLVED',
    createdAt: '2026-02-24T08:15:00Z'
  }
];

export const INITIAL_GRIEVANCES: GrievanceTicket[] = [
  {
    id: 'grv-301',
    trackingCode: 'LDFR-GRV-2026-8832',
    farmerName: 'Moses Tiah Weah',
    farmerPhone: '+231775554321',
    county: 'Grand Bassa',
    category: 'REGISTRATION_ISSUE',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    description: 'Enumerator captured incorrect road access information. Farm is accessible via feeder road during dry season.',
    assignedOfficer: 'Helpdesk Officer Mulbah',
    createdAt: '2026-03-02T09:00:00Z',
    updatedAt: '2026-03-02T11:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-001',
    timestamp: '2026-03-02T11:00:00Z',
    actorName: 'System Administrator',
    actorRole: 'SYSTEM_ADMINISTRATOR',
    action: 'INITIALIZE_PLATFORM_DEMO',
    entityType: 'SYSTEM',
    entityId: 'LDFR-SYS-MAIN',
    details: 'Initialized Liberia Digital Farmer Registry with 15 Liberian county definitions and seed demonstration records.',
    ipAddress: '197.231.22.4'
  },
  {
    id: 'aud-002',
    timestamp: '2026-03-02T09:00:00Z',
    actorName: 'Moses Tiah Weah',
    actorRole: 'FARMER',
    action: 'SUBMIT_GRIEVANCE',
    entityType: 'GRIEVANCE',
    entityId: 'grv-301',
    details: 'Submitted registration correction grievance LDFR-GRV-2026-8832.',
    ipAddress: '197.231.18.99'
  }
];
