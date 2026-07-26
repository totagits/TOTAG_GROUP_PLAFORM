import React, { useState } from 'react';
import { Wallet, Sun, TrendingUp, UserCheck, MapPin, DollarSign, QrCode } from 'lucide-react';
import type { FarmerProfile, Parcel, Voucher } from '../types';
import { INITIAL_FARMERS, INITIAL_PARCELS, INITIAL_VOUCHERS } from '../data/mockData';

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
  // Use provided farmers list or fallback to INITIAL_FARMERS if empty
  const activeFarmerList = farmers && farmers.length > 0 ? farmers : INITIAL_FARMERS;
  const activeParcelList = parcels && parcels.length > 0 ? parcels : INITIAL_PARCELS;
  const activeVoucherList = vouchers && vouchers.length > 0 ? vouchers : INITIAL_VOUCHERS;

  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(activeFarmerList[0]?.id || INITIAL_FARMERS[0].id);

  const farmer = activeFarmerList.find((f) => f.id === selectedFarmerId) || activeFarmerList[0] || INITIAL_FARMERS[0];

  const farmerParcels = activeParcelList.filter((p) => p.farmerId === farmer?.id);
  const farmerVouchers = activeVoucherList.filter(
    (v) => v.farmerId === farmer?.id || (farmer?.lastName && v.farmerName.toLowerCase().includes(farmer.lastName.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Portal Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border-b-4 border-emerald-600">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-amber-400 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              FAO &amp; MoA Farmer Self-Service &amp; Digital Wallet Portal
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Welcome, {farmer?.firstName} {farmer?.middleName ? farmer.middleName + ' ' : ''}{farmer?.lastName}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Track your official FAO/MoA digital farmer identity, registered land parcels, QR code input vouchers, Mobile Money payout transfers, and live crop market prices.
            </p>
          </div>

          {/* Farmer Switcher for Stakeholder Review */}
          <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-xl text-xs shrink-0">
            <span className="text-[10px] text-amber-300 block font-extrabold uppercase mb-1">
              Simulate Logged-in Farmer Account
            </span>
            <select
              value={farmer?.id}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white font-bold text-xs p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {activeFarmerList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.firstName} {f.lastName} ({f.county} — {f.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {farmer && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Personal Identity & Digital Wallet Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Identity & Status Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-xs font-mono">
                    {farmer.firstName[0]}
                    {farmer.lastName[0]}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">National Farmer Registry Card</div>
                    <div className="text-[10px] text-slate-400 font-mono">{farmer.farmerRegistryNumber}</div>
                  </div>
                </div>

                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                  {farmer.verificationStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Producer Classification</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">
                    {farmer.entityRegistrationType ? farmer.entityRegistrationType.replace(/_/g, ' ') : 'Smallholder Subsistence'}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">MoA Accreditation</div>
                  <div className="font-extrabold text-sky-800 mt-0.5">
                    {farmer.valueChainClassification?.isMoaAccredited ? (
                      <span className="text-emerald-700 font-bold">✓ Accredited ({farmer.valueChainClassification.moaAccreditationNumber || 'MOA-ACC-2026'})</span>
                    ) : (
                      <span className="text-slate-500">Unaccredited / Pending</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Grant / Loan History</div>
                  <div className="font-bold text-amber-700 mt-0.5">
                    {farmer.interventionAndFinance?.hasReceivedFinancialAssistance && farmer.interventionAndFinance.hasReceivedFinancialAssistance !== 'NO_ASSISTANCE' ? (
                      <span>${farmer.interventionAndFinance.totalAssistanceAmountUsd || 1500} USD ({farmer.interventionAndFinance.hasReceivedFinancialAssistance.replace(/_/g, ' ')})</span>
                    ) : (
                      <span className="text-slate-500">No Past Aid</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">County &amp; Community</div>
                  <div className="font-bold text-emerald-800 mt-0.5">{farmer.county} ({farmer.community || farmer.district})</div>
                </div>
              </div>
            </div>

            {/* Digital Voucher Wallet Card */}
            <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-5 shadow-md space-y-4 border border-emerald-700/60">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Digital Input Voucher Wallet</h3>
                    <div className="text-[10px] text-emerald-300">FAO / MoA Subsidy Wallet</div>
                  </div>
                </div>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {farmerVouchers.length > 0 ? farmerVouchers.length : 2} Vouchers Active
                </span>
              </div>

              <div className="space-y-3">
                {farmerVouchers.length > 0 ? (
                  farmerVouchers.map((vch) => (
                    <div
                      key={vch.id}
                      className="bg-emerald-950/80 border border-emerald-700/80 p-4 rounded-xl space-y-2 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-amber-300">{vch.programName}</div>
                          <div className="text-[11px] font-mono text-emerald-200 mt-0.5">Code: {vch.voucherCode}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-amber-400">${vch.valueUsd} USD</div>
                          <span className="text-[9px] bg-emerald-700 text-white font-extrabold px-1.5 py-0.5 rounded uppercase">
                            {vch.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300 pt-1 border-t border-emerald-800/60 flex items-center justify-between">
                        <span>Approved Inputs: <b>{vch.approvedInputs?.join(', ') || 'Certified Rice Seed & NPK Fertilizer'}</b></span>
                        <QrCode className="w-5 h-5 text-amber-400 shrink-0" />
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-emerald-950/80 border border-emerald-700/80 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-amber-300">FAO Rice Seed &amp; Fertilizer Voucher</div>
                          <div className="text-[11px] font-mono text-emerald-200 mt-0.5">Code: VCH-2026-RICE-881</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-amber-400">$150.00 USD</div>
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded uppercase">
                            ISSUED / READY
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-300 pt-1 border-t border-emerald-800/60 flex items-center justify-between">
                        <span>Inputs: <b>Certified Paddy Rice Seed (25kg) &amp; NPK Fertilizer</b></span>
                        <QrCode className="w-5 h-5 text-amber-400 shrink-0" />
                      </div>
                    </div>

                    <div className="bg-emerald-950/80 border border-emerald-700/80 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-amber-300">FAO Mechanization Support Subsidy</div>
                          <div className="text-[11px] font-mono text-emerald-200 mt-0.5">Code: VCH-2026-MECH-402</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-amber-400">$220.00 USD</div>
                          <span className="text-[9px] bg-emerald-700 text-white font-extrabold px-1.5 py-0.5 rounded uppercase">
                            ISSUED / READY
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-300 pt-1 border-t border-emerald-800/60 flex items-center justify-between">
                        <span>Inputs: <b>Power Tiller Rental &amp; Swamp Land Preparation Service</b></span>
                        <QrCode className="w-5 h-5 text-amber-400 shrink-0" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Weather & Seasonal Advisory */}
            <div className="bg-amber-500 text-slate-950 p-4 rounded-2xl space-y-2 shadow-xs border border-amber-600">
              <div className="flex items-center justify-between font-bold text-xs">
                <span className="uppercase tracking-wider">Agro-Weather Advisory</span>
                <Sun className="w-4 h-4 text-slate-900" />
              </div>
              <div className="font-black text-sm">{farmer.county} County Rainfall Outlook</div>
              <p className="text-xs text-slate-900 leading-relaxed font-medium">
                Heavy rainfall forecast across lowland swamps for the upcoming 7 days. Optimal window for lowland paddy transplanting and fertilizer top-dressing.
              </p>
            </div>
          </div>

          {/* Right Column: Registered Land Parcels & Market Prices Ticker */}
          <div className="lg:col-span-7 space-y-6">
            {/* Registered Farm Parcels */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>My Registered Farm Parcels ({farmerParcels.length})</span>
                </div>
                <span className="text-xs text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Total Area: {farmerParcels.reduce((sum, p) => sum + p.calculatedAreaHectares, 0).toFixed(2)} Hectares
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {farmerParcels.map((p) => (
                  <div key={p.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs hover:border-emerald-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="font-extrabold text-slate-900 text-sm">{p.farmName}</div>
                      <span className="bg-emerald-800 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded">
                        {p.primaryCrop}
                      </span>
                    </div>
                    <div className="text-emerald-800 font-extrabold">{p.primaryCrop}</div>
                    <div className="text-slate-600 flex items-center justify-between">
                      <span>Area: <b>{p.calculatedAreaHectares} Ha</b> ({p.calculatedAreaAcres} Acres)</span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {p.farmRegistryNumber}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-1.5 flex justify-between">
                      <span>District: {p.district}</span>
                      <span>County: {p.county}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Money Payout History */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <span>Mobile Money Cash Payout History</span>
                </div>
                <span className="text-xs text-slate-500 font-bold">{farmer.mobileMoneyProvider}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">FAO Smallholder Emergency Cash Transfer</div>
                    <div className="text-[10px] text-slate-500">Txn Ref: MTN-LR-2026-99482 • Disbursed via MTN MoMo</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-700 text-sm">$120.00 USD</div>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded">
                      SUCCESS / PAID
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Crop Market Prices Ticker */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Live Liberian Farm-Gate &amp; Wholesale Market Prices</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Lowland Rice (50kg)</div>
                  <div className="font-black text-slate-900 text-sm mt-0.5">$32.50 USD</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Red Light Market</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Fresh Cassava (Bag)</div>
                  <div className="font-black text-slate-900 text-sm mt-0.5">$14.00 USD</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Gbarnga Central</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Dry Cocoa Beans (kg)</div>
                  <div className="font-black text-slate-900 text-sm mt-0.5">$4.80 USD</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Voinjama Buying Center</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Crude Palm Oil (Gal)</div>
                  <div className="font-black text-slate-900 text-sm mt-0.5">$18.50 USD</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Buchanan Port</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
