import React from 'react';
import { Phone, Mail, MapPin, X } from 'lucide-react';
import { LIBERIA_COUNTIES } from '../data/liberiaGeo';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToGrievances: () => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToGrievances
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative my-8 text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="w-12 h-12 bg-sky-100 border border-sky-300 rounded-xl flex items-center justify-center text-sky-800 shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Ministry of Agriculture Contact &amp; Support Directory
            </h2>
            <div className="text-xs text-slate-500">
              Republic of Liberia • National Helpdesk &amp; County Offices Directory
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" /> National HQ
              </div>
              <p className="text-[11px] text-slate-600">
                MoA Annex, Ministerial Complex, Congo Town, Monrovia, Liberia
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-700" /> Toll-Free Helpdesk
              </div>
              <p className="text-[11px] text-slate-600 font-mono font-bold">
                +231 777 533 700 / 0888 533 700
              </p>
              <span className="text-[10px] text-slate-400">Mon-Fri: 8:00 AM - 5:00 PM</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-700" /> Official Email
              </div>
              <p className="text-[11px] text-slate-600 font-mono">
                registry@moa.gov.lr
              </p>
              <span className="text-[10px] text-slate-400">Response within 24 Hours</span>
            </div>
          </div>

          {/* County Agricultural Offices List */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs mb-2 flex items-center justify-between">
              <span>County Agricultural Offices Directory (15 Counties)</span>
              <span className="text-[10px] text-emerald-700 font-bold">Active Enumeration Hubs</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded-xl">
              {LIBERIA_COUNTIES.map((c) => (
                <div key={c.name} className="bg-white p-2 border border-slate-200 rounded-lg text-[11px]">
                  <div className="font-bold text-slate-900">{c.name} County</div>
                  <div className="text-slate-500 text-[10px]">Capital: {c.capital}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-emerald-900 text-xs">Have a Registration Issue or Payment Grievance?</div>
              <div className="text-[11px] text-emerald-700">Submit a formal ticket to receive a tracking code.</div>
            </div>
            <button
              onClick={() => {
                onClose();
                onNavigateToGrievances();
              }}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-lg shrink-0 transition-colors shadow-xs"
            >
              Open Grievance Desk
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
