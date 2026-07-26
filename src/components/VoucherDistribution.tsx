import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Store } from 'lucide-react';
import type { Voucher } from '../types';

interface VoucherDistributionProps {
  vouchers: Voucher[];
  onRedeemVoucher: (voucherId: string, vendorName: string) => void;
}

export const VoucherDistribution: React.FC<VoucherDistributionProps> = ({
  vouchers,
  onRedeemVoucher
}) => {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(vouchers[0] || null);
  const [scanInputCode, setScanInputCode] = useState('');
  const [vendorName, setVendorName] = useState('Liberia Agro-Inputs Center (Foya Branch)');

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = vouchers.find(
      (v) => v.voucherCode.toLowerCase() === scanInputCode.trim().toLowerCase()
    );
    if (found) {
      setSelectedVoucher(found);
      alert(`Voucher Found! Registered to: ${found.farmerName} (${found.approvedInputs.join(', ')})`);
    } else {
      alert(`No voucher found with code [${scanInputCode}]. Please check code.`);
    }
  };

  const handleRedeem = (voucherId: string) => {
    onRedeemVoucher(voucherId, vendorName);
    alert(`Voucher successfully REDEEMED at ${vendorName}! Input inventory deducted.`);
    setSelectedVoucher(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-amber-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              Input Distribution &amp; Subsidy Vouchers
            </div>
            <h2 className="text-2xl font-extrabold text-white">Digital Voucher &amp; Agro-Dealer Terminal</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Generates dynamic QR codes, numeric references, and SMS vouchers for certified seeds, fertilizers, tools, and mechanization services. Supports offline agro-dealer redemption.
            </p>
          </div>

          <div className="bg-amber-950 border border-amber-600/60 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-amber-400">{vouchers.length}</div>
            <div className="text-[10px] text-amber-200 font-bold uppercase">Issued Vouchers</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Agro-Dealer Terminal Scanner & Voucher List */}
        <div className="lg:col-span-5 space-y-6">
          {/* Scanner Simulation */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="font-extrabold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-700" /> Agro-Dealer Redemption Terminal
            </div>

            <form onSubmit={handleScanSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Agro-Dealer Branch Name</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scan or Enter Voucher Reference</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. LDFR-VCH-2026-8819"
                    value={scanInputCode}
                    onChange={(e) => setScanInputCode(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-2 rounded transition-colors"
                  >
                    Lookup
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Vouchers Queue */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-900 text-sm">
              Issued Vouchers Registry ({vouchers.length})
            </div>

            <div className="divide-y divide-slate-200 max-h-[300px] overflow-y-auto">
              {vouchers.map((vch) => (
                <div
                  key={vch.id}
                  onClick={() => setSelectedVoucher(vch)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedVoucher?.id === vch.id ? 'bg-amber-50 border-l-4 border-amber-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-extrabold text-slate-900 text-xs">{vch.farmerName}</div>
                    <span
                      className={`font-extrabold text-[10px] px-2 py-0.5 rounded ${
                        vch.status === 'REDEEMED'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {vch.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1">
                    Code: <b className="font-mono text-slate-800">{vch.voucherCode}</b>
                  </div>

                  <div className="text-[11px] font-bold text-emerald-800 mt-1">
                    Value: ${vch.valueUsd} USD ({vch.valueLrd.toLocaleString()} LRD)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right QR Code & Voucher Redemption Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          {selectedVoucher ? (
            <>
              <div className="border-b pb-4 flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Official Digital Voucher Ticket
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedVoucher.farmerName}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Program: <span className="font-semibold text-slate-800">{selectedVoucher.programName}</span>
                  </div>
                </div>

                <span className="bg-emerald-900 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg">
                  {selectedVoucher.status}
                </span>
              </div>

              {/* Visual QR Code Card */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-lg border-2 border-amber-400">
                <div className="bg-white p-3 rounded-xl shadow-inner shrink-0">
                  <QRCodeSVG value={selectedVoucher.voucherCode} size={130} />
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    Scan Code at Authorized Agro-Dealer
                  </div>
                  <div className="text-2xl font-black tracking-widest font-mono text-white">
                    {selectedVoucher.voucherCode}
                  </div>
                  <div className="text-xs text-slate-300">
                    Voucher Value: <b className="text-amber-300">${selectedVoucher.valueUsd} USD</b> ({selectedVoucher.valueLrd.toLocaleString()} LRD)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Issued: {new Date(selectedVoucher.issuedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Approved Inputs Basket */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider">
                  Approved Input Package Contents
                </div>
                <ul className="space-y-1.5">
                  {selectedVoucher.approvedInputs.map((input, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded border border-slate-200 font-semibold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{input}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Redemption Control Button */}
              {selectedVoucher.status === 'ISSUED' && (
                <button
                  onClick={() => handleRedeem(selectedVoucher.id)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Confirm Input Release &amp; Redeem Voucher
                </button>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select a voucher or scan a voucher reference code to view QR ticket and process redemption.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
