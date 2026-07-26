import React from 'react';
import { Building2, Globe, Shield, X, HeartHandshake } from 'lucide-react';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative my-8 text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-center text-emerald-800 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              About the Liberia Digital Farmer Registry (LDFR)
            </h2>
            <div className="text-xs text-emerald-800 font-bold">
              National Digital Public Infrastructure for Agriculture
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-600">
          <p>
            The <strong>Liberia Digital Farmer Registry (LDFR)</strong> is an official national digital public infrastructure initiative led by the <strong>Ministry of Agriculture (MoA), Republic of Liberia</strong>, in technical partnership with the <strong>Food and Agriculture Organization of the United Nations (FAO)</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <h4 className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-700" /> Platform Core Mission
              </h4>
              <p className="text-[11px] text-emerald-800">
                To identify every Liberian farmer, map every farm parcel with GIS precision, strengthen national food security planning, and deliver transparent government input subsidies and mobile money assistance directly to eligible producers.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
              <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-700" /> Data Protection & Governance
              </h4>
              <p className="text-[11px] text-amber-800">
                Operates under strict national data governance controls, combined Role-Based &amp; Attribute-Based Access Control (RBAC + ABAC), and field-level encryption for farmer PII and financial credentials.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 mt-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-sky-700" /> Institutional Mandate & Partnerships
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Coverage across all 15 Liberian Counties, 98 Districts, and 300+ Agricultural Clans.</li>
              <li>Supports MTN Mobile Money Liberia &amp; Orange Money Liberia direct benefit transfers.</li>
              <li>Integrates digital QR code input vouchers for agro-dealers and warehouse hubs.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            Close Information
          </button>
        </div>
      </div>
    </div>
  );
};
