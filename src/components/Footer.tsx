import React from 'react';
import { ShieldCheck, Lock, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel text-slate-300 pt-10 pb-6 border-t border-emerald-500/30 mt-16 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
        {/* Col 1: Platform Overview with TOTAG & FAO Logos */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 flex items-center justify-center p-1 shadow-lg shadow-emerald-500/10 shrink-0">
              <img
                src="/fao_logo.png"
                alt="Food and Agriculture Organization FAO UN Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">TOTAG OF COMPANIES LTD</div>
              <div className="text-[10px] text-gradient-emerald font-extrabold uppercase">Engineering Stewardship</div>
              <div className="text-[10px] text-slate-400">FAO UN RFP 137641 • MoA Liberia</div>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed mb-4">
            A state-of-the-art product-ready platform engineered by TOTAG OF COMPANIES LTD in collaboration with UN FAO and the Ministry of Agriculture (MoA Liberia), empowering smallholders across Liberia with digital identity, GIS acreage mapping, mobile money payouts, and input vouchers.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ISO/IEC 27001 Security &amp; UN Data Governance Compliant</span>
          </div>
        </div>

        {/* Col 2: Institutional Partners */}
        <div>
          <div className="font-bold text-white uppercase text-xs tracking-wider mb-3 pb-1 border-b border-white/10">
            Institutional Partners
          </div>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center justify-between">
              <span>TOTAG OF COMPANIES LTD</span>
              <span className="text-[10px] glass-badge-emerald px-2 py-0.5 rounded font-bold">Tech Partner</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Food &amp; Agriculture Organization (FAO)</span>
              <span className="text-[10px] glass-badge-sky px-2 py-0.5 rounded font-bold">UN Lead Agency</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Ministry of Agriculture Liberia (MoA)</span>
              <span className="text-[10px] glass-badge-amber px-2 py-0.5 rounded font-bold">Ministry</span>
            </li>
            <li>LISGIS Geo-Information Services</li>
            <li>Central Bank of Liberia (CBL)</li>
            <li>CARI Agricultural Research Institute</li>
          </ul>
        </div>

        {/* Col 3: Key Services */}
        <div>
          <div className="font-bold text-white uppercase text-xs tracking-wider mb-3 pb-1 border-b border-white/10">
            Platform Capabilities
          </div>
          <ul className="space-y-2 text-slate-400">
            <li>Offline-First PWA Field Enrollment</li>
            <li>GIS Parcel Boundary &amp; Crop Acreage Mapping</li>
            <li>Layered Identity &amp; Biometric Deduplication</li>
            <li>MTN &amp; Orange Mobile Money Disbursements</li>
            <li>QR-Code Input Voucher Redemption</li>
            <li>Farmer Self-Service Portal &amp; RTM Engine</li>
          </ul>
        </div>

        {/* Col 4: Contact & Helpdesk */}
        <div>
          <div className="font-bold text-white uppercase text-xs tracking-wider mb-3 pb-1 border-b border-white/10">
            National Registry Helpdesk
          </div>
          <div className="space-y-2.5 text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ministry of Agriculture, Ministerial Complex, Monrovia, Liberia</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Toll-Free Farmer Hotline: 5544 (Liberia)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>registry-support@moa.gov.lr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Legal & Corporate Footer Box */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass-card border border-white/10 p-4 text-center">
          <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            Legal Notice &amp; Platform Stewardship
          </div>
          <blockquote className="text-xs text-slate-300 italic leading-relaxed max-w-4xl mx-auto">
            "Designed and developed by TOTAG OF COMPANIES LTD for the Liberia Digital Farmer Registry Platform (FAO UN RFP 137641). Demonstrates enterprise glassmorphism UI, offline sync, GIS parcel mapping, and ABAC access control."
          </blockquote>
          <div className="mt-2 text-[10px] text-slate-400">
            © 2026 TOTAG OF COMPANIES LTD &amp; Food and Agriculture Organization (FAO) of the United Nations. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
