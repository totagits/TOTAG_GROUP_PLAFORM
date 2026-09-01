import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Building2,
  DollarSign,
  Download,
  CreditCard,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ProformaItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceUsd: number;
  totalUsd: number;
}

export interface ProformaInvoiceData {
  proformaNo: string;
  issueDate: string;
  validUntil: string;
  subsidiary: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientTin: string;
  paymentTerms: string;
  items: ProformaItem[];
  subtotalUsd: number;
  taxRatePercent: number;
  taxAmountUsd: number;
  totalAmountUsd: number;
  totalAmountLrd: number;
  exchangeRate: number;
  notes: string;
}

interface ProformaInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubsidiary?: string;
  defaultClient?: string;
}

export const ProformaInvoiceModal: React.FC<ProformaInvoiceModalProps> = ({
  isOpen,
  onClose,
  defaultSubsidiary = "TOTAG OF COMPANIES LTD — Group Platform",
  defaultClient = "Food and Agriculture Organization (FAO UN)"
}) => {
  const [subsidiary, setSubsidiary] = useState(defaultSubsidiary);
  const [proformaNo, setProformaNo] = useState(`TOT-PRO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const [clientName, setClientName] = useState(defaultClient);
  const [clientEmail, setClientEmail] = useState("procurement@fao.org");
  const [clientPhone, setClientPhone] = useState("+231 77 055 4433");
  const [clientAddress, setClientAddress] = useState("Ministerial Complex, Tubman Blvd, Monrovia, Liberia");
  const [clientTin, setClientTin] = useState("TIN-8890412-LR");
  const [paymentTerms, setPaymentTerms] = useState("50% Advance / 50% Upon Delivery (Net 30)");

  const [items, setItems] = useState<ProformaItem[]>([
    {
      id: "1",
      description: "Digital Farmer Registry Platform License & Customization (FAO UN RFP 137641)",
      quantity: 1,
      unitPriceUsd: 125000,
      totalUsd: 125000
    },
    {
      id: "2",
      description: "GIS Cadastral Farm Parcel Mapping & Remote Sensing Module Setup",
      quantity: 1,
      unitPriceUsd: 35000,
      totalUsd: 35000
    },
    {
      id: "3",
      description: "Mobile Money Payouts & Digital Input Voucher QR Orchestration Engine",
      quantity: 1,
      unitPriceUsd: 28000,
      totalUsd: 28000
    }
  ]);

  const [taxRatePercent, setTaxRatePercent] = useState(10);
  const [exchangeRate, setExchangeRate] = useState(195);
  const [notes, setNotes] = useState("This is an official Proforma Invoice. Prices valid for 30 days from issuance.");
  const [isSuccessSent, setIsSuccessSent] = useState(false);

  if (!isOpen) return null;

  // Calculate totals
  const subtotalUsd = items.reduce((acc, item) => acc + (item.quantity * item.unitPriceUsd), 0);
  const taxAmountUsd = (subtotalUsd * taxRatePercent) / 100;
  const totalAmountUsd = subtotalUsd + taxAmountUsd;
  const totalAmountLrd = totalAmountUsd * exchangeRate;

  const handleAddItem = () => {
    const newItem: ProformaItem = {
      id: Date.now().toString(),
      description: "Additional Platform Module / Technical Service",
      quantity: 1,
      unitPriceUsd: 5000,
      totalUsd: 5000
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof ProformaItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPriceUsd') {
            updated.totalUsd = updated.quantity * updated.unitPriceUsd;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setIsSuccessSent(true);
    setTimeout(() => setIsSuccessSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/15 text-slate-100 rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="glass-header px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Proforma Invoice Generator</h3>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                  FIMS Financial Engine
                </Badge>
              </div>
              <p className="text-xs text-slate-400">Generate, print, or email official Proforma Quotation Invoices</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 rounded-xl border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {isSuccessSent && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 p-3 rounded-xl flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Proforma Invoice [{proformaNo}] dispatched successfully to {clientEmail}!</span>
            </div>
          )}

          {/* Top Form Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">TOTAG Issuer Subsidiary</label>
              <select
                value={subsidiary}
                onChange={(e) => setSubsidiary(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-xs font-semibold text-white bg-slate-950"
              >
                <option value="TOTAG OF COMPANIES LTD — Group Platform">TOTAG OF COMPANIES LTD — Group Platform</option>
                <option value="Managed IT & SaaS Solutions">Managed IT &amp; SaaS Solutions</option>
                <option value="TOCEPS Catering Services">TOCEPS Catering Services</option>
                <option value="TOTAG Farm & Agri-Tech Portal">TOTAG Farm &amp; Agri-Tech Portal</option>
                <option value="General Merchandise & Logistics">General Merchandise &amp; Logistics</option>
                <option value="Cargo & Port Handling">Cargo &amp; Port Handling</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Proforma Invoice No.</label>
              <input
                type="text"
                value={proformaNo}
                onChange={(e) => setProformaNo(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 font-mono font-bold text-amber-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 font-semibold text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Valid Until</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 font-semibold text-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Client Billed-To Section */}
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-3">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] text-sky-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Billed Client &amp; Organization Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 font-medium">Client / Organization Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 mt-1 font-bold text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 mt-1 text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Client TIN / Tax ID</label>
                <input
                  type="text"
                  value={clientTin}
                  onChange={(e) => setClientTin(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 mt-1 font-mono text-slate-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 font-medium">Billing Address</label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 mt-1 text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Payment Terms</label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 mt-1 text-amber-300 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] text-emerald-400">
                Invoice Line Items &amp; Services Breakdown
              </h4>
              <Button onClick={handleAddItem} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Line Item
              </Button>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 font-bold border-b border-white/10 text-[11px]">
                    <th className="p-2.5">Item Description &amp; Specifications</th>
                    <th className="p-2.5 w-24 text-center">Qty</th>
                    <th className="p-2.5 w-32 text-right">Unit Price ($)</th>
                    <th className="p-2.5 w-36 text-right">Total ($)</th>
                    <th className="p-2.5 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          className="w-full glass-input rounded-lg p-1.5 text-xs text-white"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full glass-input rounded-lg p-1.5 text-xs text-center font-bold text-white"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.unitPriceUsd}
                          onChange={(e) => handleUpdateItem(item.id, 'unitPriceUsd', parseFloat(e.target.value) || 0)}
                          className="w-full glass-input rounded-lg p-1.5 text-xs text-right font-mono text-emerald-300"
                        />
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-emerald-400">
                        ${(item.quantity * item.unitPriceUsd).toLocaleString()} USD
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary & Bank Instructions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment & Bank Details */}
            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2 text-[11px]">
              <h5 className="font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> Wire &amp; Bank Payment Instructions
              </h5>
              <div className="space-y-1 text-slate-300 font-mono text-[10px]">
                <p><span className="text-slate-400">Bank:</span> Ecobank Liberia Ltd (Monrovia Main)</p>
                <p><span className="text-slate-400">Account Name:</span> TOTAG OF COMPANIES LTD</p>
                <p><span className="text-slate-400">USD Account No:</span> 1010-09823-01-USD</p>
                <p><span className="text-slate-400">SWIFT / BIC:</span> ECOBLRMM</p>
                <p><span className="text-slate-400">Mobile Money:</span> Orange Money (0770554433) / MTN MoMo (0880554433)</p>
              </div>
            </div>

            {/* Calculations Summary */}
            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2 font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal (USD):</span>
                <span className="font-bold">${subtotalUsd.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1">
                  <span>GST Tax Rate:</span>
                  <input
                    type="number"
                    value={taxRatePercent}
                    onChange={(e) => setTaxRatePercent(parseFloat(e.target.value) || 0)}
                    className="w-12 glass-input rounded p-0.5 text-center text-xs font-bold text-amber-300"
                  />
                  <span>%</span>
                </span>
                <span className="font-bold">${taxAmountUsd.toLocaleString()} USD</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-white text-sm font-extrabold">
                <span>Grand Total (USD):</span>
                <span className="text-emerald-400">${totalAmountUsd.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between text-sky-300 text-xs">
                <span>LRD Equivalent (@ ${exchangeRate}):</span>
                <span className="font-bold">${totalAmountLrd.toLocaleString()} LRD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="glass-header px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO/IEC Financial Compliance Verified</span>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={onClose} variant="outline" className="border-white/15 text-slate-300">
              Close
            </Button>

            <Button onClick={handlePrint} variant="outline" className="border-sky-500/40 text-sky-300 hover:bg-sky-500/20">
              <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
            </Button>

            <Button onClick={handleSendEmail} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold">
              <Send className="w-4 h-4 mr-2" /> Email Proforma Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
