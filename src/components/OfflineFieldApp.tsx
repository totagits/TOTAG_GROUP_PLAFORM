import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, HardDrive, CheckCircle2, CloudUpload } from 'lucide-react';
import type { FarmerProfile } from '../types';

interface OfflineFieldAppProps {
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  savedFarmers: FarmerProfile[];
  onSyncAll: () => void;
}

export const OfflineFieldApp: React.FC<OfflineFieldAppProps> = ({
  isOffline,
  setIsOffline,
  savedFarmers,
  onSyncAll
}) => {
  const [syncing, setSyncing] = useState(false);

  // Filter unverified/draft items for offline queue demo
  const pendingOfflineRecords = savedFarmers.filter(
    (f) => f.verificationStatus === 'SUBMITTED' || f.verificationStatus === 'DRAFT'
  );

  const handleSyncTrigger = () => {
    if (isOffline) {
      alert('Cannot synchronize while in Simulated Offline Field Mode. Please toggle connectivity to "Online" first.');
      return;
    }
    setSyncing(true);
    setTimeout(() => {
      onSyncAll();
      setSyncing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Field App Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-amber-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded">
                PWA Field Engine v2.4
              </span>
              <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                Field Enumerator Workspace
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Offline-First Mobile Field Application
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Designed for remote Liberian clans and districts without mobile internet coverage. Encrypted local storage (IndexedDB) buffers draft registrations and parcel drawings.
            </p>
          </div>

          {/* Connectivity Status Switcher */}
          <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl space-y-2 text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Field Connection Status</div>
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                isOffline
                  ? 'bg-amber-500 text-slate-950 shadow-md animate-pulse-subtle'
                  : 'bg-emerald-700 text-white hover:bg-emerald-600'
              }`}
            >
              {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              <span>{isOffline ? 'SIMULATED OFFLINE MODE' : 'ONLINE CONNECTED'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Queue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
            <span>Pending Sync Queue</span>
            <HardDrive className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{pendingOfflineRecords.length} Records</div>
          <p className="text-xs text-slate-500">Stored safely in client-side IndexedDB local database.</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
            <span>Local Encryption</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-extrabold text-emerald-800">AES-256 Enabled</div>
          <p className="text-xs text-slate-500">Beneficiary data encrypted on mobile storage.</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
            <span>Background Sync</span>
            <CloudUpload className="w-4 h-4 text-emerald-700" />
          </div>
          <button
            onClick={handleSyncTrigger}
            disabled={syncing}
            className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              syncing
                ? 'bg-slate-300 text-slate-600'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Synchronizing with Central Server...' : 'Trigger Manual Sync Now'}
          </button>
        </div>
      </div>

      {/* Offline Pending Records Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">
            Local Offline Records Buffer ({pendingOfflineRecords.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {isOffline ? 'Awaiting internet reconnect...' : 'Ready for central server submission'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="p-3">Farmer Name</th>
                <th className="p-3">Registry Code</th>
                <th className="p-3">County / District</th>
                <th className="p-3">Road Access</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pendingOfflineRecords.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">
                    {farmer.firstName} {farmer.lastName}
                  </td>
                  <td className="p-3 font-mono text-slate-600">{farmer.farmerRegistryNumber}</td>
                  <td className="p-3">
                    {farmer.county} / {farmer.district}
                  </td>
                  <td className="p-3">
                    {farmer.farmConditions?.farmToMarketRoad?.hasRoadAccess ? (
                      <span className="text-emerald-700 font-semibold">Motorable Road</span>
                    ) : (
                      <span className="text-amber-700 font-semibold">Footpath Only</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2 py-0.5 rounded">
                      {farmer.verificationStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={handleSyncTrigger}
                      className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                    >
                      Sync Item
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
