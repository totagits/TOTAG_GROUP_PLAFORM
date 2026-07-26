import React, { useState } from 'react';
import { Wallet, Sun, TrendingUp } from 'lucide-react';
import type { FarmerProfile, Parcel, Voucher } from '../types';

interface FarmerPortalProps {
  farmers: FarmerProfile[];
  parcels: Parcel[];
  vouchers: Voucher[];
}

export const FarmerPortal: React.FC<FarmerPortalProps> = ({
  farmers,
  parcels,
  vouchers
}) => {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || '');
  const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];

  const farmerParcels = parcels.filter((p) => p.farmerId === farmer?.id);
  const farmerVouchers = vouchers.filter((v) => v.farmerId === farmer?.id || v.farmerName.includes(farmer?.lastName || ''));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-emerald-600">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              Farmer Self-Service &amp; Advisory Portal
            </div>
            <h2 className="text-2xl font-extrabold text-white">Welcome, {farmer?.firstName} {farmer?.lastName}</h2>
            <p className="text-xs text-slate-300 mt-1">
              Track your registry status, farm parcels, input vouchers, Mobile Money payouts, weather alerts, and crop market prices.
            </p>
          </div>

          {/* Farmer Switcher for Demo */}
          <div className="bg-slate-800 border border-slate-700 p-2 rounded-xl text-xs text-right">
            <span className="text-[10px] text-slate-400 block font-bold uppercase mb-1">Simulate Logged-In Farmer</span>
            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white font-bold text-xs p-1.5 rounded"
            >
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.firstName} {f.lastName} ({f.county})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {farmer && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Personal Overview & Voucher Wallet */}
          <div className="lg:col-span-4 space-y-6">
            {/* Identity Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="text-xs font-bold text-slate-900 uppercase">National Registry Identity</div>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded">
                  {farmer.verificationStatus}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500">Registry ID:</span>{' '}
                  <b className="font-mono text-slate-900">{farmer.farmerRegistryNumber}</b>
                </div>
                <div>
                  <span className="text-slate-500">National ID (NIN):</span>{' '}
                  <b className="font-mono text-slate-900">{farmer.nationalIdNumber}</b>
                </div>
                <div>
                  <span className="text-slate-500">Location:</span>{' '}
                  <b>{farmer.county} County / {farmer.district}</b>
                </div>
                <div>
                  <span className="text-slate-500">Mobile Money:</span>{' '}
                  <b>{farmer.mobileMoneyProvider} ({farmer.mobileMoneyNumber})</b>
                </div>
              </div>
            </div>

            {/* Weather & Seasonal Advisory */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-5 rounded-xl space-y-3 shadow-md border-l-4 border-amber-400">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Weather &amp; Planting Advisory
                </div>
                <Sun className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-xl font-extrabold">{farmer.county} County Outlook</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Expect heavy rainfall in lowland swamps over the next 5 days. Ideal window for lowland paddy transplanting.
              </p>
            </div>
          </div>

          {/* Right Column: Farm Parcels, Vouchers & Market Prices */}
          <div className="lg:col-span-8 space-y-6">
            {/* Registered Farm Parcels */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="font-extrabold text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
                <span>My Registered Farm Parcels ({farmerParcels.length})</span>
                <span className="text-xs text-emerald-800 font-bold">
                  Total Area: {farmerParcels.reduce((sum, p) => sum + p.calculatedAreaHectares, 0).toFixed(2)} Ha
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {farmerParcels.map((p) => (
                  <div key={p.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                    <div className="font-extrabold text-slate-900 text-sm">{p.farmName}</div>
                    <div className="text-emerald-800 font-bold">{p.primaryCrop}</div>
                    <div className="text-slate-600">
                      Area: <b>{p.calculatedAreaHectares} Ha</b> ({p.calculatedAreaAcres} Acres)
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {p.farmRegistryNumber}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Voucher Wallet */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="font-extrabold text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
                <span>Digital Voucher Wallet ({farmerVouchers.length})</span>
                <Wallet className="w-4 h-4 text-emerald-700" />
              </div>

              {farmerVouchers.length > 0 ? (
                <div className="space-y-3">
                  {farmerVouchers.map((vch) => (
                    <div key={vch.id} className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <div className="font-extrabold text-slate-900">{vch.programName}</div>
                        <div className="font-mono text-slate-600">Code: {vch.voucherCode}</div>
                        <div className="text-slate-700 font-semibold mt-1">
                          Inputs: {vch.approvedInputs.join(', ')}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-amber-700">${vch.valueUsd} USD</div>
                        <span className="bg-amber-200 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded">
                          {vch.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-xs py-4 text-center">
                  No active vouchers issued for this farmer account.
                </div>
              )}
            </div>

            {/* Live Crop Market Prices Ticker */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="font-extrabold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                Live Liberian Farm-Gate &amp; Wholesale Market Prices (USD / LRD)
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Lowland Rice (50kg)</div>
                  <div className="font-bold text-slate-900 text-sm">$32.50 USD</div>
                  <div className="text-[10px] text-emerald-700">Monrovia / Red Light</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Fresh Cassava (Bag)</div>
                  <div className="font-bold text-slate-900 text-sm">$14.00 USD</div>
                  <div className="text-[10px] text-emerald-700">Gbarnga Market</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Dry Cocoa Beans (kg)</div>
                  <div className="font-bold text-slate-900 text-sm">$4.80 USD</div>
                  <div className="text-[10px] text-emerald-700">Voinjama Buying Center</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Crude Palm Oil (Gallon)</div>
                  <div className="font-bold text-slate-900 text-sm">$18.50 USD</div>
                  <div className="text-[10px] text-emerald-700">Buchanan Central</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
