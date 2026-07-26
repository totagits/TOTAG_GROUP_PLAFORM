import React, { useState } from 'react';
import {
  User,
  MapPin,
  Users,
  Wrench,
  Building,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award,
  DollarSign,
  Briefcase,
  Layers,
  Sprout,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { LIBERIA_COUNTIES } from '../data/liberiaGeo';
import type {
  FarmerProfile,
  FarmCondition,
  EntityRegistrationType,
  AgricultureType,
  FinancialAssistanceType,
  AssistingEntity
} from '../types';

interface RegistrationWizardProps {
  onSaveFarmer: (newFarmer: FarmerProfile) => void;
  onCancel: () => void;
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({
  onSaveFarmer,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // STEP 1: Entity & Personal Identity
  const [entityRegistrationType, setEntityRegistrationType] = useState<EntityRegistrationType>('SMALLHOLDER_SUBSISTENCE');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const preferredName = '';
  const [dateOfBirth, setDateOfBirth] = useState('1990-01-01');
  const [sex, setSex] = useState<'FEMALE' | 'MALE' | 'OTHER'>('FEMALE');
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [alternativePhone, setAlternativePhone] = useState('');
  const preferredLanguage = 'English / Kpelle';
  const [isDisabilityRegistered, setIsDisabilityRegistered] = useState(false);
  const [isYouth, setIsYouth] = useState(false);
  const [isFemaleHeadedHousehold, setIsFemaleHeadedHousehold] = useState(false);

  // STEP 2: Value-Chain Classification & MoA Accreditation
  const [agricultureTypes, setAgricultureTypes] = useState<AgricultureType[]>(['CROP_FARMING']);
  const [primaryCropsList, setPrimaryCropsList] = useState<string[]>(['Lowland Paddy Rice', 'Cassava']);
  const [exactVegetablesList, setExactVegetablesList] = useState<string[]>(['Scotch Bonnet Pepper', 'Bitterball']);
  const [exactTreeCropsList, setExactTreeCropsList] = useState<string[]>(['Cocoa (Criollo/Forastero)', 'Oil Palm']);
  const [customCommodity, setCustomCommodity] = useState('');
  const [isMoaAccredited, setIsMoaAccredited] = useState(false);
  const [moaAccreditationNumber, setMoaAccreditationNumber] = useState('');

  // STEP 3: Location
  const [selectedCountyName, setSelectedCountyName] = useState('Lofa');
  const [selectedDistrictName, setSelectedDistrictName] = useState('Foya');
  const [clan, setClan] = useState('Foya Central');
  const chiefdom = '';
  const [community, setCommunity] = useState('');
  const [village, setVillage] = useState('');
  const [gpsLatitude, setGpsLatitude] = useState(8.3512);
  const [gpsLongitude, setGpsLongitude] = useState(-10.2245);

  // STEP 4: Intervention-Tools & Financial-Grant/Loan & Farm Conditions
  const [interventionTools, setInterventionTools] = useState<string[]>([
    'Cutlasses & Hoes',
    'Motorized Knapsack Sprayer'
  ]);
  const [hasReceivedFinancialAssistance, setHasReceivedFinancialAssistance] = useState<FinancialAssistanceType>('GRANT_ONLY');
  const [assistingEntities, setAssistingEntities] = useState<AssistingEntity[]>(['FAO', 'MOA_STARP_REDISP']);
  const [otherEntityName, setOtherEntityName] = useState('');
  const [totalAssistanceAmountUsd, setTotalAssistanceAmountUsd] = useState(1500);
  const [disbursementYear, setDisbursementYear] = useState('2025');

  // Farm Conditions
  const toolsUsed: FarmCondition['currentToolsUsed'] = ['MANUAL_CUTLASS_HOE'];
  const [topography, setTopography] = useState<FarmCondition['environmentalMechanizationReadiness']['topography']>('FLAT');
  const landClearingStatus: FarmCondition['environmentalMechanizationReadiness']['landClearingStatus'] = 'PARTIALLY_CLEARED';
  const [waterSource, setWaterSource] = useState<FarmCondition['environmentalMechanizationReadiness']['waterSourceAvailability']>('SWAMP_LOWLAND');
  const drainageRisk: FarmCondition['environmentalMechanizationReadiness']['drainageFloodRisk'] = 'LOW_RISK';

  const hasRoadAccess = true;
  const [roadType, setRoadType] = useState<FarmCondition['farmToMarketRoad']['roadType']>('UNPAVED_GRAVEL');
  const distanceToMainRoad = 2.0;
  const distanceToMarket = 6.0;

  const hasContractedBuyers = true;
  const buyerType: FarmCondition['buyerRelationships']['primaryBuyerType'] = 'COOPERATIVE';
  const buyerOrgName = 'Lofa Smallholders Farmers Cooperative';

  const hasOnFarmStorage = true;
  const storageType = 'COMMUNITY_WAREHOUSE';
  const hasColdChainAccess = false;
  const traceabilityReadiness: FarmCondition['storageFacilities']['traceabilityReadiness'] = 'QR_TAGGED';

  const hasOnFarmProcessing = false;
  const processingProximity: FarmCondition['processingFacilities']['nearbyProcessingProximity'] = 'WITHIN_5KM';
  const processingTypes: FarmCondition['processingFacilities']['processingTypeAvailable'] = [
    'RICE_MILL',
    'CASSAVA_GARI_PRESS'
  ];

  // STEP 5: Household
  const [householdSize, setHouseholdSize] = useState(5);
  const [dependentsCount, setDependentsCount] = useState(3);
  const [agriculturalWorkersCount, setAgriculturalWorkersCount] = useState(2);

  // STEP 6: Financial Mobile Money
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<'MTN_MOBILE_MONEY' | 'ORANGE_MONEY' | 'OTHER_BANK'>('MTN_MOBILE_MONEY');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [mobileMoneyAccountName, setMobileMoneyAccountName] = useState('');
  const bankName = '';
  const bankAccountNumberMasked = '';

  const currentCounty = LIBERIA_COUNTIES.find((c) => c.name === selectedCountyName) || LIBERIA_COUNTIES[0];

  // Helper multi-select toggles
  const handleAgricultureTypeToggle = (type: AgricultureType) => {
    if (agricultureTypes.includes(type)) {
      setAgricultureTypes(agricultureTypes.filter((t) => t !== type));
    } else {
      setAgricultureTypes([...agricultureTypes, type]);
    }
  };

  const handlePrimaryCropToggle = (crop: string) => {
    if (primaryCropsList.includes(crop)) {
      setPrimaryCropsList(primaryCropsList.filter((c) => c !== crop));
    } else {
      setPrimaryCropsList([...primaryCropsList, crop]);
    }
  };

  const handleVegetableToggle = (veg: string) => {
    if (exactVegetablesList.includes(veg)) {
      setExactVegetablesList(exactVegetablesList.filter((v) => v !== veg));
    } else {
      setExactVegetablesList([...exactVegetablesList, veg]);
    }
  };

  const handleTreeCropToggle = (tree: string) => {
    if (exactTreeCropsList.includes(tree)) {
      setExactTreeCropsList(exactTreeCropsList.filter((t) => t !== tree));
    } else {
      setExactTreeCropsList([...exactTreeCropsList, tree]);
    }
  };

  const handleEntityToggle = (entity: AssistingEntity) => {
    if (assistingEntities.includes(entity)) {
      setAssistingEntities(assistingEntities.filter((e) => e !== entity));
    } else {
      setAssistingEntities([...assistingEntities, entity]);
    }
  };

  const handleInterventionToolToggle = (tool: string) => {
    if (interventionTools.includes(tool)) {
      setInterventionTools(interventionTools.filter((t) => t !== tool));
    } else {
      setInterventionTools([...interventionTools, tool]);
    }
  };

  const handleFetchCurrentGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLatitude(Number(pos.coords.latitude.toFixed(4)));
          setGpsLongitude(Number(pos.coords.longitude.toFixed(4)));
        },
        () => {
          setGpsLatitude(currentCounty.center[0]);
          setGpsLongitude(currentCounty.center[1]);
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !primaryPhone) {
      alert('Please fill in required fields (First Name, Last Name, Primary Phone).');
      return;
    }

    const newFarmer: FarmerProfile = {
      id: `f-${Date.now()}`,
      farmerRegistryNumber: `LDFR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      firstName,
      middleName,
      lastName,
      preferredName,
      dateOfBirth,
      sex,
      nationalIdNumber: nationalIdNumber || `NIN-LR-${Math.floor(10000000 + Math.random() * 90000000)}`,
      primaryPhone,
      alternativePhone,
      preferredLanguage,
      isDisabilityRegistered,
      isYouth,
      isFemaleHeadedHousehold,
      county: selectedCountyName,
      district: selectedDistrictName,
      clan,
      chiefdom,
      community: community || `${selectedCountyName} Community`,
      village,
      gpsLatitude,
      gpsLongitude,
      householdSize,
      dependentsCount,
      agriculturalWorkersCount,
      mobileMoneyProvider,
      mobileMoneyNumber: mobileMoneyNumber || primaryPhone,
      mobileMoneyAccountName: mobileMoneyAccountName || `${firstName} ${lastName}`,
      bankName,
      bankAccountNumberMasked,
      entityRegistrationType,
      valueChainClassification: {
        agricultureTypes,
        primaryCropsList,
        exactVegetablesList,
        exactTreeCropsList,
        customSpecialtyCommodity: customCommodity,
        isMoaAccredited,
        moaAccreditationNumber: isMoaAccredited ? (moaAccreditationNumber || `MOA-ACC-2026-${Math.floor(1000 + Math.random() * 9000)}`) : undefined
      },
      interventionAndFinance: {
        hasReceivedFinancialAssistance,
        assistingEntities,
        otherEntityName: assistingEntities.includes('OTHER') ? otherEntityName : undefined,
        totalAssistanceAmountUsd: hasReceivedFinancialAssistance !== 'NO_ASSISTANCE' ? Number(totalAssistanceAmountUsd) : 0,
        disbursementYear: hasReceivedFinancialAssistance !== 'NO_ASSISTANCE' ? disbursementYear : undefined,
        interventionToolsReceived: interventionTools
      },
      farmConditions: {
        currentToolsUsed: toolsUsed,
        environmentalMechanizationReadiness: {
          topography,
          landClearingStatus,
          waterSourceAvailability: waterSource,
          drainageFloodRisk: drainageRisk
        },
        farmToMarketRoad: {
          hasRoadAccess,
          roadType,
          distanceToMainRoadKm: Number(distanceToMainRoad),
          distanceToPrimaryMarketKm: Number(distanceToMarket)
        },
        buyerRelationships: {
          hasContractedBuyers,
          primaryBuyerType: buyerType,
          buyerOrganizationName: buyerOrgName
        },
        storageFacilities: {
          hasOnFarmStorage,
          storageType,
          hasColdChainAccess,
          traceabilityReadiness
        },
        processingFacilities: {
          hasOnFarmProcessing,
          nearbyProcessingProximity: processingProximity,
          processingTypeAvailable: processingTypes
        }
      },
      verificationStatus: 'SUBMITTED',
      enumeratorId: 'ENUM-CURRENT-USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemoRecord: false
    };

    onSaveFarmer(newFarmer);
    setSuccessMessage(`Farmer Profile successfully created with Registry ID [${newFarmer.farmerRegistryNumber}]! Status: SUBMITTED for County Officer Verification.`);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden my-6">
      {/* Wizard Header */}
      <div className="bg-slate-900 text-white p-6 border-b-4 border-emerald-600">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              National Farmer &amp; Enterprise Enrollment
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Farmer Registration &amp; Farm Profile Wizard
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Supports full farmer classification, value-chain commodities, MoA accreditation, intervention tools, grant/loan history, and 15-county GIS mapping.
            </p>
          </div>
          <div className="bg-emerald-950 border border-emerald-700/60 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300">
            Step {step} of 6
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-6 text-xs font-bold">
          <button
            onClick={() => setStep(1)}
            className={`py-2 text-center rounded transition-all ${
              step === 1 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Entity &amp; Identity
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-2 text-center rounded transition-all ${
              step === 2 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Value-Chain &amp; MoA
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-2 text-center rounded transition-all ${
              step === 3 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Location
          </button>
          <button
            onClick={() => setStep(4)}
            className={`py-2 text-center rounded transition-all ${
              step === 4 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Tools &amp; Financials
          </button>
          <button
            onClick={() => setStep(5)}
            className={`py-2 text-center rounded transition-all ${
              step === 5 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            5. Household
          </button>
          <button
            onClick={() => setStep(6)}
            className={`py-2 text-center rounded transition-all ${
              step === 6 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            6. Payment &amp; Review
          </button>
        </div>
      </div>

      {successMessage ? (
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Registration Submitted!</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">{successMessage}</p>
          <div className="pt-4">
            <button
              onClick={onCancel}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-xs cursor-pointer"
            >
              Return to Registry Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
          {/* STEP 1: ENTITY SCALE & PERSONAL IDENTITY */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Producer Entity Scale Selector */}
              <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  Producer Entity &amp; Scale Classification *
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { type: 'INDIVIDUAL_FARMER', label: 'Individual Farmer', desc: 'Independent producer', icon: User },
                    { type: 'SMALLHOLDER_SUBSISTENCE', label: 'Smallholder / Subsistence', desc: 'Family farm < 2 Ha', icon: Sprout },
                    { type: 'COOPERATIVE', label: 'Cooperative Society', desc: 'Registered Farmers Org', icon: Users },
                    { type: 'SEMI_COMMERCIAL_MEDIUM', label: 'Semi-Commercial', desc: 'Medium scale (5-50 Ha)', icon: Wrench },
                    { type: 'PLANTATION_FARMER', label: 'Commercial Plantation', desc: 'Large scale > 50 Ha', icon: Building }
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isSelected = entityRegistrationType === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setEntityRegistrationType(item.type as EntityRegistrationType)}
                        className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <IconComp className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                            {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </span>
                        </div>
                        <div>
                          <div className="font-extrabold text-xs">{item.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Identity Details */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-700" /> Personal Identity Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Hawa"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="e.g. Kollie"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Flomo"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sex</label>
                    <select
                      value={sex}
                      onChange={(e) => setSex(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="OTHER">Other / Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">National ID (NIN / Voter ID)</label>
                    <input
                      type="text"
                      value={nationalIdNumber}
                      onChange={(e) => setNationalIdNumber(e.target.value)}
                      placeholder="e.g. NIN-LR-88291049"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Telephone *</label>
                    <input
                      type="tel"
                      required
                      value={primaryPhone}
                      onChange={(e) => setPrimaryPhone(e.target.value)}
                      placeholder="e.g. +231770123456"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Alternative Phone</label>
                    <input
                      type="tel"
                      value={alternativePhone}
                      onChange={(e) => setAlternativePhone(e.target.value)}
                      placeholder="e.g. +231886123456"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Social Inclusion Flags */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Social Inclusion &amp; Vulnerability Classifications
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
                      <input
                        type="checkbox"
                        checked={isFemaleHeadedHousehold}
                        onChange={(e) => setIsFemaleHeadedHousehold(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-slate-800">Female-Headed Household</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
                      <input
                        type="checkbox"
                        checked={isYouth}
                        onChange={(e) => setIsYouth(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-slate-800">Youth Farmer (&lt; 35 years)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
                      <input
                        type="checkbox"
                        checked={isDisabilityRegistered}
                        onChange={(e) => setIsDisabilityRegistered(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-slate-800">Persons with Disability</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VALUE-CHAIN CLASSIFICATION & MOA ACCREDITATION */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Type of Agriculture */}
              <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  Type of Agriculture (Select All That Apply) *
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'CROP_FARMING', label: 'Crop Farming', desc: 'Cereals, roots & tubers' },
                    { id: 'LIVESTOCK', label: 'Livestock', desc: 'Poultry, swine, cattle' },
                    { id: 'AQUACULTURE', label: 'Aquaculture', desc: 'Fish ponds & fisheries' },
                    { id: 'AGRO_FORESTRY', label: 'Agro-Forestry', desc: 'Tree crops & cocoa' },
                    { id: 'MIXED_FARMING', label: 'Mixed Farming', desc: 'Crops & livestock combo' }
                  ].map((ag) => {
                    const isChecked = agricultureTypes.includes(ag.id as AgricultureType);
                    return (
                      <button
                        key={ag.id}
                        type="button"
                        onClick={() => handleAgricultureTypeToggle(ag.id as AgricultureType)}
                        className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          isChecked
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <div className="font-extrabold text-xs">{ag.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{ag.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Staples & Value Chains */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Primary Staple &amp; Commodity Value Chains
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    'Lowland Paddy Rice',
                    'Upland Seed Rice',
                    'Cassava',
                    'Cocoa',
                    'Coffee',
                    'Oil Palm',
                    'Rubber',
                    'Vegetables & Horticulture',
                    'Tree Crops',
                    'Livestock & Poultry'
                  ].map((crop) => (
                    <label
                      key={crop}
                      className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                        primaryCropsList.includes(crop)
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={primaryCropsList.includes(crop)}
                        onChange={() => handlePrimaryCropToggle(crop)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{crop}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Granular Vegetables List (Specify Exact) */}
              <div className="space-y-2.5 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" /> Vegetables &amp; Horticulture (Specify Exact Crops)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    'Scotch Bonnet Pepper',
                    'Bitterball',
                    'Okra',
                    'Tomato',
                    'Eggplant',
                    'Cucumber',
                    'Cabbage',
                    'Watermelon',
                    'Leafy Greens (Plassas)',
                    'Sweet Pepper'
                  ].map((veg) => (
                    <label
                      key={veg}
                      className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer text-[11px] ${
                        exactVegetablesList.includes(veg)
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={exactVegetablesList.includes(veg)}
                        onChange={() => handleVegetableToggle(veg)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{veg}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Granular Tree Crops List (Be Specific) */}
              <div className="space-y-2.5 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-700" /> Tree Crops (Be Specific)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Cocoa (Criollo/Forastero)',
                    'Coffee (Robusta)',
                    'Coffee (Liberica)',
                    'Oil Palm (Tenera)',
                    'Rubber',
                    'Coconut',
                    'Cashew Nut',
                    'Citrus (Orange/Grapefruit)'
                  ].map((tree) => (
                    <label
                      key={tree}
                      className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer text-[11px] ${
                        exactTreeCropsList.includes(tree)
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={exactTreeCropsList.includes(tree)}
                        onChange={() => handleTreeCropToggle(tree)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{tree}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other Specialty Commodity Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Other Specialty Commodity / Custom Crop Specification
                </label>
                <input
                  type="text"
                  value={customCommodity}
                  onChange={(e) => setCustomCommodity(e.target.value)}
                  placeholder="e.g. Organic Honey Bee Keeping / Ginger / Soya Beans"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Ministry of Agriculture (MoA) Accreditation */}
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl space-y-3">
                <div className="font-extrabold text-sky-950 text-xs uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-sky-700" /> Ministry of Agriculture (MoA Liberia) Accreditation Status
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Is the Farmer / Farm Accredited by MoA Liberia?
                    </label>
                    <div className="flex items-center gap-4 pt-1">
                      <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="moaAccredited"
                          checked={isMoaAccredited}
                          onChange={() => setIsMoaAccredited(true)}
                          className="text-sky-600 focus:ring-sky-500"
                        />
                        <span>Yes (Accredited)</span>
                      </label>

                      <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="moaAccredited"
                          checked={!isMoaAccredited}
                          onChange={() => setIsMoaAccredited(false)}
                          className="text-sky-600 focus:ring-sky-500"
                        />
                        <span>No / Pending Accreditation</span>
                      </label>
                    </div>
                  </div>

                  {isMoaAccredited && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        MoA License / Accreditation Registry Number
                      </label>
                      <input
                        type="text"
                        value={moaAccreditationNumber}
                        onChange={(e) => setMoaAccreditationNumber(e.target.value)}
                        placeholder="e.g. MOA-ACC-2026-9932"
                        className="w-full border border-sky-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GEOGRAPHIC LOCATION */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" /> Geographic Location (15 Liberian Counties)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">County *</label>
                  <select
                    value={selectedCountyName}
                    onChange={(e) => {
                      setSelectedCountyName(e.target.value);
                      const c = LIBERIA_COUNTIES.find((cnt) => cnt.name === e.target.value);
                      if (c && c.districts.length > 0) {
                        setSelectedDistrictName(c.districts[0].name);
                        setClan(c.districts[0].clans[0] || 'Central Clan');
                      }
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {LIBERIA_COUNTIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name} County
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District *</label>
                  <select
                    value={selectedDistrictName}
                    onChange={(e) => setSelectedDistrictName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {currentCounty.districts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clan / Township</label>
                  <input
                    type="text"
                    value={clan}
                    onChange={(e) => setClan(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Community / City</label>
                  <input
                    type="text"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    placeholder="e.g. Foya City"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village / Local Settlement</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Keselee Village"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* GPS Coordinates */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-extrabold text-slate-800 text-xs">GPS Centroid Coordinates</div>
                  <button
                    type="button"
                    onClick={handleFetchCurrentGps}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Capture Current GPS Location
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Latitude (°N)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={gpsLatitude}
                      onChange={(e) => setGpsLatitude(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Longitude (°W)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={gpsLongitude}
                      onChange={(e) => setGpsLongitude(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: INTERVENTION TOOLS & FINANCIAL GRANT/LOAN HISTORY */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Financial Assistance (Grant / Loan) Section */}
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl space-y-4">
                <div className="font-extrabold text-emerald-950 text-sm flex items-center gap-2 border-b border-emerald-200 pb-2">
                  <DollarSign className="w-5 h-5 text-emerald-700" />
                  Intervention-Tools &amp; Financial-Grant/Loan History
                </div>

                {/* Has Received Financial Assistance */}
                <div>
                  <label className="block text-xs font-extrabold text-emerald-900 mb-2">
                    Has Received Financial Assistance (Grants / Loans)? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'GRANT_ONLY', label: 'Grant Only' },
                      { id: 'LOAN_ONLY', label: 'Loan Only' },
                      { id: 'BOTH_GRANT_AND_LOAN', label: 'Both Grant and Loan' },
                      { id: 'NO_ASSISTANCE', label: 'No Assistance' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setHasReceivedFinancialAssistance(opt.id as FinancialAssistanceType)}
                        className={`p-2.5 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                          hasReceivedFinancialAssistance === opt.id
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assisting Entities Multi-Select */}
                {hasReceivedFinancialAssistance !== 'NO_ASSISTANCE' && (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-extrabold text-emerald-900">
                      Assisting Entities (Select All Entities that Provided Support)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'FAO', label: 'Food and Agriculture Organization (FAO)' },
                        { id: 'MOA_STARP_REDISP', label: 'Ministry of Agriculture (MoA STAR-P/REDISP)' },
                        { id: 'WORLD_BANK_IFAD', label: 'World Bank / IFAD' },
                        { id: 'USAID_FEED_THE_FUTURE', label: 'USAID / Feed the Future' },
                        { id: 'AFDB', label: 'African Development Bank (AfDB)' },
                        { id: 'CBL_LBDI_BANK', label: 'CBL / LBDI Bank (Central Bank / LBDI)' },
                        { id: 'COMMERCIAL_BANKS_MFIS', label: 'Commercial Banks / Microfinance (MFIs)' },
                        { id: 'COOPERATIVES_NGOS', label: 'Cooperatives & NGO Partners' },
                        { id: 'OTHER', label: 'Other Assisting Entity' }
                      ].map((entity) => (
                        <label
                          key={entity.id}
                          className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                            assistingEntities.includes(entity.id as AssistingEntity)
                              ? 'border-emerald-700 bg-white text-emerald-950 font-bold shadow-xs'
                              : 'border-emerald-200/80 bg-white/60 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={assistingEntities.includes(entity.id as AssistingEntity)}
                            onChange={() => handleEntityToggle(entity.id as AssistingEntity)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-[11px]">{entity.label}</span>
                        </label>
                      ))}
                    </div>

                    {assistingEntities.includes('OTHER') && (
                      <div className="pt-2">
                        <label className="block text-xs font-bold text-emerald-900 mb-1">
                          Specify Other Assisting Entity Name
                        </label>
                        <input
                          type="text"
                          value={otherEntityName}
                          onChange={(e) => setOtherEntityName(e.target.value)}
                          placeholder="e.g. BRAC Liberia / GIZ / World Vision"
                          className="w-full border border-emerald-300 rounded-lg p-2.5 text-xs bg-white"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-emerald-900 mb-1">
                          Total Assistance Amount (USD)
                        </label>
                        <input
                          type="number"
                          value={totalAssistanceAmountUsd}
                          onChange={(e) => setTotalAssistanceAmountUsd(Number(e.target.value))}
                          placeholder="e.g. 1500"
                          className="w-full border border-emerald-300 rounded-lg p-2.5 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emerald-900 mb-1">
                          Disbursement Year
                        </label>
                        <input
                          type="text"
                          value={disbursementYear}
                          onChange={(e) => setDisbursementYear(e.target.value)}
                          placeholder="e.g. 2025"
                          className="w-full border border-emerald-300 rounded-lg p-2.5 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Intervention Tools Received */}
              <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-emerald-700" /> Intervention Tools &amp; Mechanization Equipment Received
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Cutlasses & Hoes',
                    'Motorized Knapsack Sprayer',
                    'Power Tiller',
                    'Tractor',
                    'Grain Thresher',
                    'Solar Irrigation Pump',
                    'Rice Mill',
                    'Cassava Gari Press'
                  ].map((tool) => (
                    <label
                      key={tool}
                      className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer text-[11px] ${
                        interventionTools.includes(tool)
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={interventionTools.includes(tool)}
                        onChange={() => handleInterventionToolToggle(tool)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{tool}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Farm Conditions: Topography, Water Source & Road Access */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase border-b pb-1">
                  Environmental Readiness &amp; Road Connection
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Farm Topography</label>
                    <select
                      value={topography}
                      onChange={(e) => setTopography(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                    >
                      <option value="FLAT">Flat Lowland / Valley</option>
                      <option value="UNDULATING">Undulating Hillside</option>
                      <option value="STEEP_SLOPE">Steep Mountainous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Water Source</label>
                    <select
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                    >
                      <option value="SWAMP_LOWLAND">Swamp Lowland / Inland Valley</option>
                      <option value="RIVER_STREAM">River / Perennial Stream</option>
                      <option value="WELL_BOREHOLE">Borehole / Well</option>
                      <option value="RAINFED_ONLY">Rainfed Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Farm-to-Market Road Access</label>
                    <select
                      value={roadType}
                      onChange={(e) => setRoadType(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                    >
                      <option value="ALL_WEATHER_PAVED">All-Weather Paved Road</option>
                      <option value="UNPAVED_GRAVEL">Unpaved Feeder Gravel Road</option>
                      <option value="DRY_SEASON_TRACK">Dry Season Track</option>
                      <option value="FOOTPATH_ONLY">Footpath Only (No Vehicles)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: HOUSEHOLD & LABOR FORCE */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" /> Household Demographics &amp; Farm Labor
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Household Size</label>
                  <input
                    type="number"
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dependents Count</label>
                  <input
                    type="number"
                    value={dependentsCount}
                    onChange={(e) => setDependentsCount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Active Agricultural Workers</label>
                  <input
                    type="number"
                    value={agriculturalWorkersCount}
                    onChange={(e) => setAgriculturalWorkersCount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PAYMENT & FINAL REVIEW */}
          {step === 6 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-700" /> Mobile Money Account &amp; Final Review
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Money Provider *</label>
                  <select
                    value={mobileMoneyProvider}
                    onChange={(e) => setMobileMoneyProvider(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold"
                  >
                    <option value="MTN_MOBILE_MONEY">MTN Mobile Money (Liberia)</option>
                    <option value="ORANGE_MONEY">Orange Money (Liberia)</option>
                    <option value="OTHER_BANK">Commercial Bank Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Money Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobileMoneyNumber || primaryPhone}
                    onChange={(e) => setMobileMoneyNumber(e.target.value)}
                    placeholder="e.g. +231770123456"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Holder Name *</label>
                  <input
                    type="text"
                    required
                    value={mobileMoneyAccountName || `${firstName} ${lastName}`}
                    onChange={(e) => setMobileMoneyAccountName(e.target.value)}
                    placeholder="e.g. Hawa Flomo"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
                <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                  Registration Profile Summary &amp; Verification Preview
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-slate-800 pt-3">
                  <div>
                    <div className="text-slate-400 text-[10px]">Entity Scale</div>
                    <div className="font-bold text-white">{entityRegistrationType.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Farmer Name</div>
                    <div className="font-bold text-white">{firstName} {lastName}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Location</div>
                    <div className="font-bold text-emerald-400">{selectedCountyName} ({selectedDistrictName})</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">MoA Accredited</div>
                    <div className="font-bold text-sky-300">{isMoaAccredited ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Previous Step
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                Submit Official Registration
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
