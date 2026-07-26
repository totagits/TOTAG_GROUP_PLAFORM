import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Wrench, Eye, EyeOff } from 'lucide-react';
import type { FarmerProfile, VerificationStatus } from '../types';
import { maskNationalID, maskPhone, maskMobileMoneyNumber } from '../services/securityEngine';

interface VerificationModuleProps {
  farmers: FarmerProfile[];
  onUpdateStatus: (farmerId: string, newStatus: VerificationStatus, notes: string) => void;
}

export const VerificationModule: React.FC<VerificationModuleProps> = ({
  farmers,
  onUpdateStatus
}) => {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || '');
  const [reviewNotes, setReviewNotes] = useState('');
  const [showPII, setShowPII] = useState(false);

  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId) || null;

  const pendingQueue = farmers.filter(
    (f) => f.verificationStatus !== 'APPROVED' && f.verificationStatus !== 'REJECTED'
  );

  const handleDecision = (status: VerificationStatus) => {
    if (!selectedFarmer) return;
    onUpdateStatus(selectedFarmer.id, status, reviewNotes || 'Verification review decision completed.');
    alert(`Status for farmer [${selectedFarmer.firstName} ${selectedFarmer.lastName}] updated to: ${status}`);
    setSelectedFarmerId('');
    setReviewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-emerald-600">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              Maker-Checker Verification &amp; Institutional Approval
            </div>
            <h2 className="text-2xl font-extrabold text-white">County Agricultural Officer Verification Desk</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Enforces separation of duties. Submissions from field enumerators must be verified and approved before program enrollment or cash disbursement.
            </p>
          </div>
          <div className="bg-emerald-950 border border-emerald-700/60 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-emerald-400">{pendingQueue.length}</div>
            <div className="text-[10px] text-emerald-200 font-bold uppercase">Pending Verifications</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Review Queue */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-900 text-sm">
            Submissions Review Queue ({farmers.length})
          </div>

          <div className="divide-y divide-slate-200 max-h-[520px] overflow-y-auto">
            {farmers.map((farmer) => (
              <div
                key={farmer.id}
                onClick={() => setSelectedFarmerId(farmer.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedFarmer?.id === farmer.id ? 'bg-emerald-50 border-l-4 border-emerald-700' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-bold text-slate-900 text-xs">
                    {farmer.firstName} {farmer.lastName}
                  </div>
                  <span
                    className={`font-extrabold text-[10px] px-2 py-0.5 rounded ${
                      farmer.verificationStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : farmer.verificationStatus === 'SUBMITTED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {farmer.verificationStatus}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mt-1">
                  Registry Code: <b className="font-mono text-slate-800">{farmer.farmerRegistryNumber}</b>
                </div>

                <div className="text-[11px] text-slate-500">
                  Location: <b>{farmer.county} County / {farmer.district}</b>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Inspector & Approval Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          {selectedFarmer ? (
            <>
              <div className="border-b pb-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Registration Record Verification Inspector
                    </div>
                    <button
                      onClick={() => setShowPII(!showPII)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    >
                      {showPII ? <EyeOff className="w-3 h-3 text-red-600" /> : <Eye className="w-3 h-3 text-emerald-700" />}
                      {showPII ? 'Mask Sensitive PII' : 'Unmask PII (Authorized)'}
                    </button>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {selectedFarmer.firstName} {selectedFarmer.middleName} {selectedFarmer.lastName}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                    <span>{selectedFarmer.farmerRegistryNumber}</span>
                    <span>•</span>
                    <span>
                      National ID: {showPII ? selectedFarmer.nationalIdNumber : maskNationalID(selectedFarmer.nationalIdNumber)}
                    </span>
                    {!showPII && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                        [MASKED BY DEFAULT]
                      </span>
                    )}
                  </div>
                </div>

                <span className="bg-emerald-900 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg">
                  {selectedFarmer.verificationStatus}
                </span>
              </div>

              {/* Profile Details Breakdown */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Geographic Location</div>
                  <div className="font-bold text-slate-800">
                    {selectedFarmer.county} / {selectedFarmer.district}
                  </div>
                  <div className="text-slate-600">
                    Phone: {showPII ? selectedFarmer.primaryPhone : maskPhone(selectedFarmer.primaryPhone)}
                  </div>
                  <div className="text-slate-600">
                    Clan: {selectedFarmer.clan} • Community: {selectedFarmer.community}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono pt-1">
                    GPS: {selectedFarmer.gpsLatitude}° N, {selectedFarmer.gpsLongitude}° W
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Financial &amp; Mobile Money</div>
                  <div className="font-bold text-slate-800">{selectedFarmer.mobileMoneyProvider}</div>
                  <div className="text-slate-600">
                    Account No: {showPII ? selectedFarmer.mobileMoneyNumber : maskMobileMoneyNumber(selectedFarmer.mobileMoneyNumber)}
                  </div>
                  <div className="text-slate-600">Registered Name: {selectedFarmer.mobileMoneyAccountName}</div>
                </div>
              </div>

              {/* Farm Conditions Review Section */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-amber-700" />
                  Farm Conditions &amp; Infrastructure Assessment
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Tools Used:</span>{' '}
                    <b className="text-slate-900">
                      {selectedFarmer.farmConditions?.currentToolsUsed?.join(', ') || 'Manual Hand Tools'}
                    </b>
                  </div>
                  <div>
                    <span className="text-slate-500">Road Access:</span>{' '}
                    <b className="text-slate-900">
                      {selectedFarmer.farmConditions?.farmToMarketRoad?.hasRoadAccess ? 'Connected by Road' : 'Footpath Only'}
                    </b>
                  </div>
                  <div>
                    <span className="text-slate-500">Buyer Off-Taker:</span>{' '}
                    <b className="text-slate-900">
                      {selectedFarmer.farmConditions?.buyerRelationships?.primaryBuyerType || 'Spot Market'}
                    </b>
                  </div>
                  <div>
                    <span className="text-slate-500">Nearby Processing:</span>{' '}
                    <b className="text-slate-900">
                      {selectedFarmer.farmConditions?.processingFacilities?.nearbyProcessingProximity || 'Within 5km'}
                    </b>
                  </div>
                </div>
              </div>

              {/* Officer Decision Controls */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">Verification Officer Review Notes</label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter audit review comments, field findings, or reason for return..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleDecision('APPROVED')}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Registration
                  </button>

                  <button
                    onClick={() => handleDecision('RETURNED_FOR_CORRECTION')}
                    className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Return for Correction
                  </button>

                  <button
                    onClick={() => handleDecision('REJECTED')}
                    className="bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> Reject Submission
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select a farmer submission from the queue to review credentials and authorize verification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
