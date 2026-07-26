import React from 'react';
import { ShieldCheck, Lock, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-6 border-t-4 border-sky-600 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
        {/* Col 1: Platform Overview with FAO Logo */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center p-1 shadow-sm shrink-0">
              <img
                src="/fao_logo.png"
                alt="Food and Agriculture Organization FAO UN Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Food and Agriculture Organization (FAO)</div>
              <div className="text-[10px] text-sky-400 font-bold">UN Lead Requesting Agency</div>
              <div className="text-[10px] text-slate-400">In Collaboration with MoA Liberia</div>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed mb-4">
            Official UN FAO initiative in technical collaboration with the Ministry of Agriculture (MoA Liberia), connecting smallholders across all 15 counties to verified assistance, financial inclusion, input vouchers, and national agricultural markets.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ISO/IEC 27001 Security &amp; UN Data Governance Compliant</span>
          </div>
        </div>

        {/* Col 2: Institutional Partners */}
        <div>
          <div className="font-bold text-white uppercase text-xs tracking-wider mb-3 pb-1 border-b border-slate-800">
            Institutional Partners
          </div>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center justify-between">
              <span>Food &amp; Agriculture Organization (FAO)</span>
              <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.5 rounded font-bold">UN Lead Agency</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Ministry of Agriculture Liberia (MoA)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">Collaborating Ministry</span>
            </li>
            <li>Liberia Institute of Statistics &amp; Geo-Information Services (LISGIS)</li>
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
            <li>GIS Parcel Boundary Mapping &amp; Acreage Calculation</li>
            <li>Layered Identity &amp; Duplicate Detection Engine</li>
            <li>MTN Mobile Money &amp; Orange Money Disbursements</li>
            <li>QR-Code Input Voucher Redemption</li>
            <li>Farmers Self-Service Portal &amp; Grievance Helpdesk</li>
          </ul>
        </div>

        {/* Col 4: Contact & Helpdesk */}
        <div>
          <div className="font-bold text-white uppercase text-xs tracking-wider mb-3 pb-1 border-b border-slate-800">
            National Registry Helpdesk
          </div>
          <div className="space-y-2.5 text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Ministry of Agriculture, Ministerial Complex, Tubman Boulevard, Monrovia, Liberia</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Toll-Free Farmer Hotline: 5544 (Liberia)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
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
            Mandatory Disclaimer &amp; Legal Notice
          </div>
          <blockquote className="text-xs text-slate-300 italic leading-relaxed max-w-4xl mx-auto">
            "Concept demonstration developed for stakeholder review. The appearance of institutional names or logo placeholders does not constitute endorsement, commissioning or approval by FAO or the Government of Liberia."
          </blockquote>
          <div className="mt-2 text-[10px] text-slate-500">
            © 2026 Food and Agriculture Organization (FAO) of the United Nations &amp; Republic of Liberia Ministry of Agriculture (MoA). All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
