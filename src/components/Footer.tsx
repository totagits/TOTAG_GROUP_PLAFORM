import React from 'react';
import { ShieldCheck, Lock, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-6 border-t-4 border-emerald-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
        {/* Col 1: Platform Overview */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-white text-xs">
              MOA
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Liberia Digital Farmer Registry</div>
              <div className="text-[10px] text-slate-400">National Public Digital Infrastructure</div>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed mb-4">
            Connecting Liberia's smallholders and agricultural enterprises across all 15 counties to verified assistance, financial inclusion, input vouchers, extension advisories, and national markets.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>ISO/IEC 27001 Security & Data Governance Compliant</span>
          </div>
        </div>

        {/* Col 2: Institutional Partners */}
        <div>
          <div className="font-bold text-white uppercase text-xs tracking-wider mb-3 pb-1 border-b border-slate-800">
            Institutional Partners
          </div>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center justify-between">
              <span>Ministry of Agriculture Liberia (MoA)</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">Lead Ministry</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Food & Agriculture Organization (FAO)</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-sky-400">UN Technical Partner</span>
            </li>
            <li>Liberia Institute of Statistics & Geo-Information Services (LISGIS)</li>
            <li>Central Bank of Liberia (CBL)</li>
            <li>Central Agricultural Research Institute (CARI)</li>
          </ul>
        </div>

        {/* Col 3: Key Services */}
        <div>
          <div className="font-bold text-white uppercase text-xs tracking-wider mb-3 pb-1 border-b border-slate-800">
            Platform Capabilities
          </div>
          <ul className="space-y-2 text-slate-400">
            <li>Offline-First Mobile Field Enrollment</li>
            <li>GIS Parcel Boundary Mapping & Acreage Calculation</li>
            <li>Layered Identity & Duplicate Detection Engine</li>
            <li>MTN Mobile Money & Orange Money Disbursements</li>
            <li>QR-Code Input Voucher Redemption</li>
            <li>Farmers Self-Service Portal & Grievance Helpdesk</li>
          </ul>
        </div>

        {/* Col 4: Contact & Helpdesk */}
        <div>
          <div className="font-bold text-white uppercase text-xs tracking-wider mb-3 pb-1 border-b border-slate-800">
            National Registry Helpdesk
          </div>
          <div className="space-y-2.5 text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Ministry of Agriculture, Ministerial Complex, Tubman Boulevard, Monrovia, Liberia</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Toll-Free Farmer Hotline: 5544 (Liberia)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>registry-support@moa.gov.lr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Footer Box per Prompt Section 1 */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
          <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Mandatory Disclaimer & Legal Notice
          </div>
          <blockquote className="text-xs text-slate-300 italic leading-relaxed max-w-4xl mx-auto">
            "Concept demonstration developed for stakeholder review. The appearance of institutional names or logo placeholders does not constitute endorsement, commissioning or approval by FAO or the Government of Liberia."
          </blockquote>
          <div className="mt-2 text-[10px] text-slate-500">
            © 2026 Republic of Liberia Ministry of Agriculture (MoA) & Food and Agriculture Organization (FAO) of the United Nations. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
