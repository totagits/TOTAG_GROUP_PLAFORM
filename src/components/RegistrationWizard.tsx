import React, { useState } from 'react';
import {
  User,
  MapPin,
  Users,
  Wrench,
  Truck,
  Building,
  CreditCard,
  CheckCircle2,
  Save,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { LIBERIA_COUNTIES } from '../data/liberiaGeo';
import type { FarmerProfile, FarmCondition } from '../types';

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

  // Form State
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

  // Location
  const [selectedCountyName, setSelectedCountyName] = useState('Lofa');
  const [selectedDistrictName, setSelectedDistrictName] = useState('Foya');
  const [clan, setClan] = useState('Foya Central');
  const chiefdom = '';
  const [community, setCommunity] = useState('');
  const [village, setVillage] = useState('');
  const [gpsLatitude, setGpsLatitude] = useState(8.3512);
  const [gpsLongitude, setGpsLongitude] = useState(-10.2245);

  // Household
  const [householdSize, setHouseholdSize] = useState(5);
  const [dependentsCount, setDependentsCount] = useState(3);
  const [agriculturalWorkersCount, setAgriculturalWorkersCount] = useState(2);

  // Farm Conditions (Requested by user)
  const [toolsUsed, setToolsUsed] = useState<FarmCondition['currentToolsUsed']>([
    'MANUAL_CUTLASS_HOE'
  ]);
  const [topography, setTopography] = useState<FarmCondition['environmentalMechanizationReadiness']['topography']>('FLAT');
  const [landClearingStatus, setLandClearingStatus] = useState<FarmCondition['environmentalMechanizationReadiness']['landClearingStatus']>('PARTIALLY_CLEARED');
  const [waterSource, setWaterSource] = useState<FarmCondition['environmentalMechanizationReadiness']['waterSourceAvailability']>('SWAMP_LOWLAND');
  const [drainageRisk, setDrainageRisk] = useState<FarmCondition['environmentalMechanizationReadiness']['drainageFloodRisk']>('LOW_RISK');

  const [hasRoadAccess, setHasRoadAccess] = useState(true);
  const [roadType, setRoadType] = useState<FarmCondition['farmToMarketRoad']['roadType']>('UNPAVED_GRAVEL');
  const distanceToMainRoad = 2.0;
  const [distanceToMarket, setDistanceToMarket] = useState(6.0);

  const [hasContractedBuyers, setHasContractedBuyers] = useState(true);
  const [buyerType, setBuyerType] = useState<FarmCondition['buyerRelationships']['primaryBuyerType']>('COOPERATIVE');
  const [buyerOrgName, setBuyerOrgName] = useState('Local Farmers Cooperative');

  const [hasOnFarmStorage, setHasOnFarmStorage] = useState(true);
  const storageType = 'COMMUNITY_WAREHOUSE';
  const [hasColdChainAccess, setHasColdChainAccess] = useState(false);
  const [traceabilityReadiness, setTraceabilityReadiness] = useState<FarmCondition['storageFacilities']['traceabilityReadiness']>('QR_TAGGED');

  const hasOnFarmProcessing = false;
  const [processingProximity, setProcessingProximity] = useState<FarmCondition['processingFacilities']['nearbyProcessingProximity']>('WITHIN_5KM');
  const [processingTypes, setProcessingTypes] = useState<FarmCondition['processingFacilities']['processingTypeAvailable']>([
    'RICE_MILL',
    'CASSAVA_GARI_PRESS'
  ]);

  // Financial
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<'MTN_MOBILE_MONEY' | 'ORANGE_MONEY' | 'OTHER_BANK'>('MTN_MOBILE_MONEY');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [mobileMoneyAccountName, setMobileMoneyAccountName] = useState('');
  const bankName = '';
  const bankAccountNumberMasked = '';

  const currentCounty = LIBERIA_COUNTIES.find((c) => c.name === selectedCountyName) || LIBERIA_COUNTIES[0];

  const handleToolToggle = (tool: FarmCondition['currentToolsUsed'][number]) => {
    if (toolsUsed.includes(tool)) {
      setToolsUsed(toolsUsed.filter((t) => t !== tool));
    } else {
      setToolsUsed([...toolsUsed, tool]);
    }
  };

  const handleProcessingTypeToggle = (proc: FarmCondition['processingFacilities']['processingTypeAvailable'][number]) => {
    if (processingTypes.includes(proc)) {
      setProcessingTypes(processingTypes.filter((p) => p !== proc));
    } else {
      setProcessingTypes([...processingTypes, proc]);
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
          // Fallback center for selected county
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
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Wizard Header */}
      <div className="bg-slate-900 text-white p-6 border-b-4 border-emerald-600">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              National Farmer & Enterprise Enrollment
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Farmer Registration & Farm Profile Wizard
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Supports full farmer journey, 15-county administrative hierarchy, farm condition assessments, and mobile money details.
            </p>
          </div>
          <div className="bg-emerald-950 border border-emerald-700/60 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300">
            Step {step} of 5
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          <button
            onClick={() => setStep(1)}
            className={`py-2 text-center rounded text-xs font-bold transition-all ${
              step === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Identity
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-2 text-center rounded text-xs font-bold transition-all ${
              step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Location
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-2 text-center rounded text-xs font-bold transition-all ${
              step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Household
          </button>
          <button
            onClick={() => setStep(4)}
            className={`py-2 text-center rounded text-xs font-bold transition-all ${
              step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Farm Conditions
          </button>
          <button
            onClick={() => setStep(5)}
            className={`py-2 text-center rounded text-xs font-bold transition-all ${
              step === 5 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            5. Payment & Review
          </button>
        </div>
      </div>

      {successMessage ? (
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Registration Submitted!</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">{successMessage}</p>
          <div className="pt-4">
            <button
              onClick={onCancel}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm px-6 py-2.5 rounded-lg cursor-pointer"
            >
              Return to Registry Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* STEP 1: PERSONAL IDENTITY */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-700" /> Personal Identity & Classification
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

              {/* Inclusion Flags */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Social Inclusion & Vulnerability Classifications
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded border border-slate-200">
                    <input
                      type="checkbox"
                      checked={isFemaleHeadedHousehold}
                      onChange={(e) => setIsFemaleHeadedHousehold(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-800">Female-Headed Household</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded border border-slate-200">
                    <input
                      type="checkbox"
                      checked={isYouth}
                      onChange={(e) => setIsYouth(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-800">Youth Farmer (&lt; 35 years)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded border border-slate-200">
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
          )}

          {/* STEP 2: GEOGRAPHIC LOCATION */}
          {step === 2 && (
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
                      }
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {LIBERIA_COUNTIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name} County ({c.code})
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
                    {currentCounty.districts.map((d, idx) => (
                      <option key={idx} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clan / Chiefdom</label>
                  <input
                    type="text"
                    value={clan}
                    onChange={(e) => setClan(e.target.value)}
                    placeholder="e.g. Foya Central"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Community / Settlement *</label>
                  <input
                    type="text"
                    required
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    placeholder="e.g. Shelltown Community"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village / Landmark</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Wassakor Junction"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* GPS Coordinates */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    GPS Coordinates (Entrance or Central Point)
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchCurrentGps}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Capture Mobile Device GPS
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Latitude (°N)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={gpsLatitude}
                      onChange={(e) => setGpsLatitude(parseFloat(e.target.value))}
                      className="w-full border border-slate-300 rounded p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Longitude (°W)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={gpsLongitude}
                      onChange={(e) => setGpsLongitude(parseFloat(e.target.value))}
                      className="w-full border border-slate-300 rounded p-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: HOUSEHOLD PROFILE */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" /> Household Demographics & Worker Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Household Size</label>
                  <input
                    type="number"
                    min="1"
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(parseInt(e.target.value) || 1)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dependents (Children &amp; Elderly)</label>
                  <input
                    type="number"
                    min="0"
                    value={dependentsCount}
                    onChange={(e) => setDependentsCount(parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Active Agricultural Workers</label>
                  <input
                    type="number"
                    min="1"
                    value={agriculturalWorkersCount}
                    onChange={(e) => setAgriculturalWorkersCount(parseInt(e.target.value) || 1)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DETAILED FARM CONDITIONS (User Requested Requirement) */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-emerald-900 text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider">
                    Detailed Farm Conditions & Infrastructure Assessment
                  </h3>
                  <p className="text-xs text-slate-200 mt-0.5">
                    Captures tools used, environmental readiness for mechanization, road access, buyers, storage, and processing proximity.
                  </p>
                </div>
                <Wrench className="w-6 h-6 text-amber-400 shrink-0" />
              </div>

              {/* 1. Kind of Tools Used at Present */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-700" />
                  1. Kind of Tools &amp; Machinery Used at Present
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'MANUAL_CUTLASS_HOE', label: 'Manual Cutlass, Hoes & Axes' },
                    { id: 'POWER_TILLER', label: 'Power Tiller / Walk-Behind' },
                    { id: 'MOTORIZED_SPRAYER', label: 'Motorized Backpack Sprayer' },
                    { id: 'TRACTOR', label: '4-Wheel Tractor' },
                    { id: 'THRESHER', label: 'Motorized Rice Thresher' },
                    { id: 'IRRIGATION_PUMP', label: 'Water / Irrigation Pump' }
                  ].map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleToolToggle(tool.id as any)}
                      className={`p-2.5 rounded-lg border text-left font-semibold transition-all cursor-pointer ${
                        toolsUsed.includes(tool.id as any)
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
                      }`}
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Environmental Condition for Mechanized Farming */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-700" />
                  2. Environmental Condition &amp; Mechanization Readiness
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Topography & Slope</label>
                    <select
                      value={topography}
                      onChange={(e) => setTopography(e.target.value as any)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="FLAT">Flat Lowland / Valley (Highly Mechanizable)</option>
                      <option value="UNDULATING">Undulating / Gentle Slopes</option>
                      <option value="STEEP_SLOPE">Steep Slope / Hilly Terrain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Land Clearing Status</label>
                    <select
                      value={landClearingStatus}
                      onChange={(e) => setLandClearingStatus(e.target.value as any)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="FULLY_CLEARED">Fully Cleared & Stumped</option>
                      <option value="PARTIALLY_CLEARED">Partially Cleared</option>
                      <option value="STUMPED_TREES">Tree Stumps Present (Needs De-stumping)</option>
                      <option value="VIRGIN_FOREST">Virgin Bush / Secondary Forest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Water Source Availability</label>
                    <select
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value as any)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="SWAMP_LOWLAND">Lowland Inland Valley Swamp (IVS)</option>
                      <option value="RIVER_STREAM">Perennial River / Stream</option>
                      <option value="WELL_BOREHOLE">Shallow Well / Borehole</option>
                      <option value="RAINFED_ONLY">Rainfed Only (No Surface Water)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Drainage & Flood Risk</label>
                    <select
                      value={drainageRisk}
                      onChange={(e) => setDrainageRisk(e.target.value as any)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="LOW_RISK">Low Flood Risk / Good Natural Drainage</option>
                      <option value="SEASONAL_FLOODING">Seasonal Flooding During Rainy Season</option>
                      <option value="POOR_DRAINAGE">Poor Drainage (Waterlogging)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Farm-to-Market Road Access */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  3. Farm-to-Market Road Accessibility
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Connected by Road to Market?</label>
                    <select
                      value={hasRoadAccess ? 'YES' : 'NO'}
                      onChange={(e) => setHasRoadAccess(e.target.value === 'YES')}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="YES">Yes - Connected by Motorable Road</option>
                      <option value="NO">No - Footpath / Waterway Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Road Classification</label>
                    <select
                      value={roadType}
                      onChange={(e) => setRoadType(e.target.value as any)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="ALL_WEATHER_PAVED">All-Weather Paved Highway</option>
                      <option value="UNPAVED_GRAVEL">Unpaved Primary Feeder Road</option>
                      <option value="DRY_SEASON_TRACK">Dry-Season Only Dirt Track</option>
                      <option value="FOOTPATH_ONLY">Bush Footpath Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Distance to Market (Km)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={distanceToMarket}
                      onChange={(e) => setDistanceToMarket(parseFloat(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Buyers & Off-take Agreements */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  4. Buyer Relationships &amp; Off-Take Contracts
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Has Contracted Buyer/Off-Taker?</label>
                    <select
                      value={hasContractedBuyers ? 'YES' : 'NO'}
                      onChange={(e) => setHasContractedBuyers(e.target.value === 'YES')}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="YES">Yes - Contracted / Guaranteed Off-taker</option>
                      <option value="NO">No - Spot Market Sales</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Market Channel</label>
                    <select
                      value={buyerType}
                      onChange={(e) => setBuyerType(e.target.value as any)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="COOPERATIVE">Farmer Cooperative Society</option>
                      <option value="COMMERCIAL_OFFTAKER">Commercial Agri-Business Offtaker</option>
                      <option value="LOCAL_SPOT_MARKET">Local Weekly Open Market</option>
                      <option value="EXPORTER">Export Aggregator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Buyer / Cooperative Name</label>
                    <input
                      type="text"
                      value={buyerOrgName}
                      onChange={(e) => setBuyerOrgName(e.target.value)}
                      placeholder="e.g. Foya Women Farmers Cooperative"
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Storage & Cold Chain Facilities */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-700" />
                  5. Storage, Cold Chain &amp; Traceability
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Storage Access</label>
                    <select
                      value={hasOnFarmStorage ? 'YES' : 'NO'}
                      onChange={(e) => setHasOnFarmStorage(e.target.value === 'YES')}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="YES">Yes - Has Storage Facility</option>
                      <option value="NO">No - Immediate Post-Harvest Sale</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cold Chain Access?</label>
                    <select
                      value={hasColdChainAccess ? 'YES' : 'NO'}
                      onChange={(e) => setHasColdChainAccess(e.target.value === 'YES')}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="YES">Yes - Solar Cold Storage Available</option>
                      <option value="NO">No Cold Storage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Batch Traceability Status</label>
                    <select
                      value={traceabilityReadiness}
                      onChange={(e) => setTraceabilityReadiness(e.target.value as any)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="QR_TAGGED">QR-Code Tagged Bags</option>
                      <option value="BATCH_CODED">Batch Coded Lots</option>
                      <option value="MANUAL_LOG">Manual Logbook</option>
                      <option value="NOT_READY">Not Traceable Yet</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 6. Processing Facility Proximity */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-700" />
                  6. Processing Facility Proximity &amp; Machinery
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nearby Processing Facility Distance</label>
                    <select
                      value={processingProximity}
                      onChange={(e) => setProcessingProximity(e.target.value as any)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                    >
                      <option value="ON_SITE">On-Farm Processing Equipment</option>
                      <option value="WITHIN_5KM">Within 5 Km Proximity</option>
                      <option value="WITHIN_20KM">Within 20 Km Proximity</option>
                      <option value="FAR_OVER_20KM">Far (&gt; 20 Km Distance)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Processing Equipment Types Available</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        { id: 'RICE_MILL', label: 'Commercial Rice Mill' },
                        { id: 'CASSAVA_GARI_PRESS', label: 'Cassava Gari Press' },
                        { id: 'OIL_PALM_MILL', label: 'Oil Palm Mill' },
                        { id: 'COCOA_DRYING_SHED', label: 'Solar Cocoa Shed' }
                      ].map((proc) => (
                        <button
                          key={proc.id}
                          type="button"
                          onClick={() => handleProcessingTypeToggle(proc.id as any)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                            processingTypes.includes(proc.id as any)
                              ? 'bg-emerald-800 text-white border-emerald-900'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          {proc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PAYMENT & FINAL REVIEW */}
          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-700" /> Mobile Money &amp; Financial Inclusion Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Money Provider *</label>
                  <select
                    value={mobileMoneyProvider}
                    onChange={(e) => setMobileMoneyProvider(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white"
                  >
                    <option value="MTN_MOBILE_MONEY">MTN Mobile Money Liberia (Lonestar)</option>
                    <option value="ORANGE_MONEY">Orange Money Liberia</option>
                    <option value="OTHER_BANK">Commercial Bank Account</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Money Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobileMoneyNumber || primaryPhone}
                    onChange={(e) => setMobileMoneyNumber(e.target.value)}
                    placeholder="e.g. 0770123456"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Registered Name *</label>
                  <input
                    type="text"
                    required
                    value={mobileMoneyAccountName || `${firstName} ${lastName}`}
                    onChange={(e) => setMobileMoneyAccountName(e.target.value)}
                    placeholder="e.g. Hawa K. Flomo"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>
              </div>

              {/* Review Summary Box */}
              <div className="bg-slate-900 text-slate-200 p-5 rounded-xl space-y-3 text-xs">
                <div className="font-bold text-amber-400 uppercase tracking-wider">
                  Registration Review Summary
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400">Farmer:</span>{' '}
                    <span className="font-bold text-white">{firstName} {lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span>{' '}
                    <span className="font-bold text-white">{selectedCountyName} / {selectedDistrictName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Tools:</span>{' '}
                    <span className="font-bold text-emerald-300">{toolsUsed.length} Selected</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Road Access:</span>{' '}
                    <span className="font-bold text-emerald-300">{hasRoadAccess ? 'Yes' : 'No'}</span>
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
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="text-slate-500 hover:text-slate-800 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" /> Submit Registration Record
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
