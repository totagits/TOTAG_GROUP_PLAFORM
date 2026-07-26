import React, { useState } from 'react';
import { ShieldCheck, Send } from 'lucide-react';
import type { PaymentBatch, MobileMoneyProvider } from '../types';

interface PaymentOrchestrationProps {
  payments: PaymentBatch[];
  onDisburseBatch: (batchId: string) => void;
  onCreateBatch: (provider: MobileMoneyProvider, amountUsd: number, count: number) => void;
}

export const PaymentOrchestration: React.FC<PaymentOrchestrationProps> = ({
  payments,
  onDisburseBatch,
  onCreateBatch
}) => {
  const [selectedBatch, setSelectedBatch] = useState<PaymentBatch | null>(payments[0] || null);
  const [provider, setProvider] = useState<MobileMoneyProvider>('MTN_MOBILE_MONEY');
  const [amountUsd, setAmountUsd] = useState(250);
  const [beneficiaryCount, setBeneficiaryCount] = useState(50);
  const [processing, setProcessing] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateBatch(provider, amountUsd * beneficiaryCount, beneficiaryCount);
    alert(`Payment Batch created for ${beneficiaryCount} beneficiaries via ${provider}! Status: PENDING_APPROVAL.`);
  };

  const handleDisburse = (batchId: string) => {
    setProcessing(true);
    setTimeout(() => {
      onDisburseBatch(batchId);
      setProcessing(false);
      alert(`Mobile Money batch [${batchId}] successfully disbursed to MTN/Orange gateway! Tokenized receipts generated.`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-emerald-600">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              Liberia Digital Payments &amp; Financial Inclusion
            </div>
            <h2 className="text-2xl font-extrabold text-white">Mobile Money &amp; Bank Payment Orchestrator</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Integrates MTN Mobile Money Liberia and Orange Money adapters. Enforces tokenized disbursements, PIN-less security, maker-checker authorization, and real-time transaction reconciliation.
            </p>
          </div>

          <div className="bg-emerald-950 border border-emerald-700/60 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-emerald-400">
              ${payments.reduce((sum, p) => sum + p.totalAmountUsd, 0).toLocaleString()} USD
            </div>
            <div className="text-[10px] text-emerald-200 font-bold uppercase">Total Disbursed</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Payment Batch Creation & List */}
        <div className="lg:col-span-5 space-y-6">
          {/* Create Batch Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="font-extrabold text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
              <span>Create New Payout Batch</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                Maker Control
              </span>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-semibold"
                >
                  <option value="MTN_MOBILE_MONEY">MTN Mobile Money Liberia (Lonestar Cell)</option>
                  <option value="ORANGE_MONEY">Orange Money Liberia</option>
                  <option value="OTHER_BANK">LBDI / Ecobank Commercial Transfer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Beneficiaries</label>
                  <input
                    type="number"
                    min="1"
                    value={beneficiaryCount}
                    onChange={(e) => setBeneficiaryCount(parseInt(e.target.value) || 1)}
                    className="w-full border border-slate-300 rounded p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount per Farmer ($)</label>
                  <input
                    type="number"
                    min="10"
                    value={amountUsd}
                    onChange={(e) => setAmountUsd(parseInt(e.target.value) || 10)}
                    className="w-full border border-slate-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Generate Payout Batch (${amountUsd * beneficiaryCount} USD)
              </button>
            </form>
          </div>

          {/* Existing Batches List */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-900 text-sm">
              Payment Batches Queue ({payments.length})
            </div>

            <div className="divide-y divide-slate-200 max-h-[300px] overflow-y-auto">
              {payments.map((pay) => (
                <div
                  key={pay.id}
                  onClick={() => setSelectedBatch(pay)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedBatch?.id === pay.id ? 'bg-emerald-50 border-l-4 border-emerald-700' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-extrabold text-slate-900 text-xs">{pay.batchReference}</div>
                    <span
                      className={`font-extrabold text-[10px] px-2 py-0.5 rounded ${
                        pay.status === 'DISBURSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pay.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1">
                    Provider: <b>{pay.provider}</b> • Beneficiaries: <b>{pay.totalBeneficiaries}</b>
                  </div>

                  <div className="text-[11px] font-bold text-emerald-800 mt-1">
                    ${pay.totalAmountUsd.toLocaleString()} USD
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Batch Inspector & Authorization */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          {selectedBatch ? (
            <>
              <div className="border-b pb-4 flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Batch Payment Inspector
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedBatch.batchReference}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Program: <span className="font-semibold text-slate-800">{selectedBatch.programName}</span>
                  </div>
                </div>

                <span className="bg-slate-900 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg">
                  {selectedBatch.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Total Amount</div>
                  <div className="text-lg font-extrabold text-emerald-800">${selectedBatch.totalAmountUsd} USD</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Beneficiary Count</div>
                  <div className="text-lg font-extrabold text-slate-900">{selectedBatch.totalBeneficiaries} Farmers</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Gateway Adapter</div>
                  <div className="font-bold text-slate-800 mt-1">{selectedBatch.provider}</div>
                </div>
              </div>

              {/* Security & Tokenization Note */}
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-700" />
                  Financial Security &amp; Tokenization Protocol
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  Disbursements are processed directly via API endpoints using ISO 20022 messaging structures. No beneficiary PINs are stored or transmitted. All payments produce immutable audit transaction logs.
                </p>
              </div>

              {/* Disbursement Action Button */}
              {selectedBatch.status !== 'DISBURSED' && (
                <div className="pt-2">
                  <button
                    onClick={() => handleDisburse(selectedBatch.id)}
                    disabled={processing}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      processing
                        ? 'bg-slate-300 text-slate-600'
                        : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    <Send className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
                    {processing ? 'Processing Gateway Disbursement...' : 'Authorize Mobile Money Payout (Checker Step)'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select a payment batch to review beneficiary details and authorize disbursement.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
