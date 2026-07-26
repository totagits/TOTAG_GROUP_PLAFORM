import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { AgriculturalProgram, FarmerProfile, Parcel } from '../types';
import { evaluateEligibility } from '../services/eligibilityEngine';

interface ProgramsModuleProps {
  programs: AgriculturalProgram[];
  farmers: FarmerProfile[];
  parcels: Parcel[];
  onEnrollFarmer: (programId: string, farmerId: string) => void;
}

export const ProgramsModule: React.FC<ProgramsModuleProps> = ({
  programs,
  farmers,
  parcels,
  onEnrollFarmer
}) => {
  const [selectedProgram, setSelectedProgram] = useState<AgriculturalProgram>(programs[0]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || '');

  const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];
  const eligibility = farmer ? evaluateEligibility(farmer, parcels, selectedProgram) : null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-amber-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              Assistance Targeting &amp; Subsidy Management
            </div>
            <h2 className="text-2xl font-extrabold text-white">Agricultural Programs &amp; Rules Engine</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Configurable eligibility rules engine evaluates farmer credentials, farm size, road access, crop types, and vulnerability criteria with transparent scoring.
            </p>
          </div>

          <div className="bg-amber-950 border border-amber-600/60 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-amber-400">{programs.length}</div>
            <div className="text-[10px] text-amber-200 font-bold uppercase">Active Programs</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Program List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-900 text-sm">
            National Agricultural Support Programs ({programs.length})
          </div>

          <div className="divide-y divide-slate-200">
            {programs.map((prg) => (
              <div
                key={prg.id}
                onClick={() => setSelectedProgram(prg)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedProgram.id === prg.id ? 'bg-emerald-50 border-l-4 border-emerald-700' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-extrabold text-slate-900 text-xs">{prg.name}</div>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded">
                    ${prg.benefitValueUsd} USD
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mt-1">
                  Sponsor: <b className="text-slate-800">{prg.sponsor}</b>
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5">
                  Counties: <b>{prg.targetCounties.join(', ')}</b>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Beneficiaries Enrolled:</span>
                  <span className="font-bold text-emerald-700">
                    {prg.enrolledCount} / {prg.beneficiaryCeiling}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Eligibility Evaluation Workbench */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b pb-4">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Automated Eligibility Assessor
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{selectedProgram.name}</h3>
            <div className="text-xs text-slate-500 mt-0.5">
              Code: <span className="font-mono font-bold text-slate-800">{selectedProgram.code}</span> • Funding:{' '}
              <span className="font-semibold">{selectedProgram.fundingSource}</span>
            </div>
          </div>

          {/* Farmer Selection Dropdown */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Select Farmer Profile to Evaluate Eligibility Rules
            </label>
            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white font-semibold"
            >
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.firstName} {f.lastName} ({f.county} County / {f.district}) - {f.verificationStatus}
                </option>
              ))}
            </select>
          </div>

          {/* Eligibility Results Breakdown */}
          {eligibility && farmer && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  eligibility.isEligible
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  {eligibility.isEligible ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <div className="font-extrabold text-base">
                      {eligibility.isEligible ? 'ELIGIBLE FOR ENROLLMENT' : 'NOT ELIGIBLE FOR THIS PROGRAM'}
                    </div>
                    <div className="text-xs opacity-90">
                      Automated Rules Score: <b>{eligibility.scorePercentage}% Compliance</b>
                    </div>
                  </div>
                </div>

                {eligibility.isEligible && (
                  <button
                    onClick={() => {
                      onEnrollFarmer(selectedProgram.id, farmer.id);
                      alert(`Farmer ${farmer.firstName} ${farmer.lastName} successfully enrolled in ${selectedProgram.name}!`);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs cursor-pointer"
                  >
                    Enroll &amp; Issue Voucher
                  </button>
                )}
              </div>

              {/* Criteria Met */}
              {eligibility.reasons.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Criteria Satisfied ({eligibility.reasons.length})
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {eligibility.reasons.map((r, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Criteria */}
              {eligibility.missingCriteria.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Missing / Non-Compliant Rules ({eligibility.missingCriteria.length})
                  </div>
                  <ul className="space-y-1 text-xs text-slate-800">
                    {eligibility.missingCriteria.map((m, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
