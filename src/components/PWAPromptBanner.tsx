import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, ShieldCheck } from 'lucide-react';

interface PWAPromptBannerProps {
  onOpenModal: () => void;
}

export const PWAPromptBanner: React.FC<PWAPromptBannerProps> = ({ onOpenModal }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Open detailed PWA download modal guide
      onOpenModal();
    }
  };

  if (isDismissed || isInstalled) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-slate-900 text-white border-2 border-sky-500 rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto backdrop-blur-md">
        {/* Left: FAO App Icon & Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white border-2 border-sky-400 p-1 flex items-center justify-center shrink-0 shadow-md">
            <img
              src="/fao_logo.png"
              alt="FAO UN Logo Favicon Icon"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-sky-500 text-slate-950 font-black text-[10px] uppercase px-1.5 py-0.5 rounded">
                Official UN Mobile App
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Offline Field Ready
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-white mt-0.5">
              Install FAO Liberia Digital Farmer Registry Mobile App
            </h4>
            <p className="text-xs text-slate-300 hidden md:block">
              Install our lightweight mobile app on your phone or tablet for offline GPS farm mapping &amp; QR voucher wallet.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={handleInstallClick}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>{deferredPrompt ? 'Install App Now' : 'Mobile App & APK'}</span>
          </button>

          <button
            onClick={onOpenModal}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">APK Download</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Dismiss prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
