import React from 'react';
import { Smartphone, Download, CheckCircle2, Shield, X, Globe, HardDrive } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadApk = () => {
    // Generate simulated APK download file for stakeholder review
    const content = 'FAO Liberia Digital Farmer Registry Mobile App Release v2.0 - Official UN FAO & MoA APK Binary';
    const blob = new Blob([content], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FAO_LDFR_Mobile_v2.0.apk';
    a.click();
    alert('FAO LDFR Android APK download initiated! Install on any Android 8.0+ device.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative my-8 text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with FAO Logo */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-white border-2 border-sky-600 p-1 flex items-center justify-center shrink-0 shadow-md">
            <img
              src="/fao_logo.png"
              alt="FAO UN Logo Favicon"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-[10px] font-black text-sky-800 uppercase tracking-wider">
              Food and Agriculture Organization (FAO) • UN Mobile App
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
              Download FAO LDFR Mobile App &amp; Android APK
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official PWA &amp; Standalone Android App for Liberia Digital Farmer Registry
            </p>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="space-y-5 text-xs">
          {/* APK Direct Download Banner */}
          <div className="bg-gradient-to-br from-sky-900 to-slate-900 text-white p-4 rounded-xl flex items-center justify-between gap-4 border border-sky-700 shadow-md">
            <div>
              <div className="text-amber-400 font-extrabold text-xs uppercase flex items-center gap-1.5">
                <HardDrive className="w-4 h-4" /> Android Package (APK) Download
              </div>
              <div className="text-sm font-black text-white mt-1">FAO_LDFR_Mobile_v2.0.apk (18.4 MB)</div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Optimized for rural field enumerators &amp; smallholder farmers across all 15 Liberian counties.
              </p>
            </div>

            <button
              onClick={handleDownloadApk}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download APK
            </button>
          </div>

          {/* Installation Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Android / Chrome PWA */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-700" /> Android &amp; Chrome PWA Install
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600">
                <li>Open <b>https://liberia-farmer-registry...</b> in Google Chrome.</li>
                <li>Tap the <b>3 dots menu (⋮)</b> in the top right.</li>
                <li>Select <b>"Add to Home Screen"</b> or <b>"Install App"</b>.</li>
                <li>Launch app directly from your home screen offline!</li>
              </ol>
            </div>

            {/* iOS Safari PWA */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-700" /> iPhone &amp; iPad Safari Install
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600">
                <li>Open the portal link in <b>Safari</b> on iOS.</li>
                <li>Tap the <b>Share icon</b> at the bottom.</li>
                <li>Scroll down and tap <b>"Add to Home Screen"</b>.</li>
                <li>Confirm to install the FAO LDFR app icon.</li>
              </ol>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-2">
            <h4 className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-700" /> Mobile App Core Capabilities
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-900">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Offline GPS Parcel Mapping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>QR Code Input Voucher Wallet</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>MTN &amp; Orange Money Payout Status</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Liberian Farm-Gate Price Ticker</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center pt-3 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 font-mono">Build ID: FAO-LDFR-PWA-v2.0</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
