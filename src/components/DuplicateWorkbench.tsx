import React, { useState } from 'react';
import { GitMerge, UserCheck, ShieldAlert } from 'lucide-react';
import type { DuplicateAlert, FarmerProfile } from '../types';

interface DuplicateWorkbenchProps {
  duplicates: DuplicateAlert[];
  farmers: FarmerProfile[];
  onResolveDuplicate: (alertId: string, status: DuplicateAlert['status'], notes: string) => void;
}

export const DuplicateWorkbench: React.FC<DuplicateWorkbenchProps> = ({
  duplicates,
  farmers,
  onResolveDuplicate
}) => {
  const [selectedAlert, setSelectedAlert] = useState<DuplicateAlert | null>(duplicates[0] || null);
  const [notes, setNotes] = useState('');

  const primaryFarmer = farmers.find((f) => f.id === selectedAlert?.primaryFarmerId);
  const secondaryFarmer = farmers.find((f) => f.id === selectedAlert?.secondaryFarmerId);

  const handleAction = (status: DuplicateAlert['status']) => {
    if (!selectedAlert) return;
    onResolveDuplicate(selectedAlert.id, status, notes || 'Supervisor resolution decision recorded.');
    alert(`Duplicate Alert [${selectedAlert.id}] status updated to: ${status}`);
    setSelectedAlert(null);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-amber-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              Fraud Prevention &amp; Registry Deduplication
            </div>
            <h2 className="text-2xl font-extrabold text-white">Layered Duplicate Detection Workbench</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Deterministic and probabilistic matching screens National ID, mobile phone numbers, Levenshtein name similarity, and GIS parcel bounding-box overlaps. Requires human review.
            </p>
          </div>
          <div className="bg-amber-950 border border-amber-600/60 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-amber-400">{duplicates.filter(d => d.status === 'UNRESOLVED').length}</div>
            <div className="text-[10px] text-amber-200 font-bold uppercase">Unresolved Alerts</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Duplicate List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-900 text-sm">
            Suspected Duplicate Alerts Queue ({duplicates.length})
          </div>

          <div className="divide-y divide-slate-200 max-h-[500px] overflow-y-auto">
            {duplicates.map((dup) => (
              <div
                key={dup.id}
                onClick={() => setSelectedAlert(dup)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedAlert?.id === dup.id ? 'bg-amber-50 border-l-4 border-amber-500' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-bold text-slate-900 text-xs">
                    {dup.primaryFarmerName} vs {dup.secondaryFarmerName}
                  </div>
                  <span
                    className={`font-black text-xs px-2 py-0.5 rounded ${
                      dup.overallMatchScore >= 80
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {dup.overallMatchScore}% Match
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mt-1">
                  Risk Level: <b className="text-slate-800">{dup.riskLevel}</b> • Status: <b className="text-emerald-700">{dup.status}</b>
                </div>

                <div className="mt-2 text-[10px] text-slate-600 bg-slate-100 p-2 rounded">
                  Reasons: {dup.matchingReasons.join(' | ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side-by-Side Comparison Inspector */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          {selectedAlert ? (
            <>
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Side-by-Side Verification Inspector
                  </h3>
                  <div className="text-xs text-slate-500">Alert Ref: {selectedAlert.id}</div>
                </div>
                <div className="bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-sm px-3 py-1 rounded-lg">
                  {selectedAlert.overallMatchScore}% Score
                </div>
              </div>

              {/* Side-by-Side Table */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Primary Record */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <div className="font-extrabold text-emerald-800 text-sm border-b pb-1">
                    Primary Profile A
                  </div>
                  <div>
                    <span className="text-slate-500">Name:</span>{' '}
                    <b className="text-slate-900">{primaryFarmer?.firstName} {primaryFarmer?.lastName}</b>
                  </div>
                  <div>
                    <span className="text-slate-500">Registry Code:</span>{' '}
                    <b className="font-mono">{primaryFarmer?.farmerRegistryNumber}</b>
                  </div>
                  <div>
                    <span className="text-slate-500">National ID:</span>{' '}
                    <b className="font-mono">{primaryFarmer?.nationalIdNumber}</b>
                  </div>
                  <div>
                    <span className="text-slate-500">Mobile Phone:</span>{' '}
                    <b>{primaryFarmer?.primaryPhone}</b>
                  </div>
                  <div>
                    <span className="text-slate-500">Location:</span>{' '}
                    <b>{primaryFarmer?.county} / {primaryFarmer?.district}</b>
                  </div>
                </div>

                {/* Secondary Record */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <div className="font-extrabold text-amber-800 text-sm border-b pb-1">
                    Secondary Profile B
                  </div>
                  <div>
                    <span className="text-slate-500">Name:</span>{' '}
                    <b className="text-slate-900">{secondaryFarmer?.firstName} {secondaryFarmer?.lastName}</b>
                  </div>
                  <div>
                    <span className="text-slate-500">Registry Code:</span>{' '}
                    <b className="font-mono">{secondaryFarmer?.farmerRegistryNumber}</b>
                  </div>
                  <div>
                    <span className="text-slate-500">National ID:</span>{' '}
                    <b className="font-mono">{secondaryFarmer?.nationalIdNumber}</b>
                  </div>
                  <div>
                    <span className="text-slate-500">Mobile Phone:</span>{' '}
                    <b>{secondaryFarmer?.primaryPhone}</b>
                  </div>
                  <div>
                    <span className="text-slate-500">Location:</span>{' '}
                    <b>{secondaryFarmer?.county} / {secondaryFarmer?.district}</b>
                  </div>
                </div>
              </div>

              {/* Resolution Form */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">Supervisor Resolution Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record justification for duplicate decision..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleAction('MERGED')}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <GitMerge className="w-4 h-4" /> Merge into Primary Record
                  </button>

                  <button
                    onClick={() => handleAction('CONFIRMED_UNIQUE')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" /> Confirm as Unique Farmers
                  </button>

                  <button
                    onClick={() => handleAction('REJECTED')}
                    className="bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" /> Reject Fraudulent Submission
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select a duplicate alert from the queue to inspect side-by-side matching evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
