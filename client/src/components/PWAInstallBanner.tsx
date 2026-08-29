import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  WifiOff, 
  DownloadCloud, 
  RefreshCw, 
  CheckCircle2, 
  Smartphone,
  Zap,
  X
} from "lucide-react";
import { getOfflineQueue, flushOfflineQueue } from "@/lib/offlineSync";

export function PWAInstallBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      autoSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Track beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Track offline queue changes
    const updateCount = () => {
      setPendingCount(getOfflineQueue().length);
    };
    updateCount();
    window.addEventListener("totag_offline_queue_updated", updateCount);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("totag_offline_queue_updated", updateCount);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const autoSync = async () => {
    if (getOfflineQueue().length === 0) return;
    setIsSyncing(true);
    await flushOfflineQueue();
    setPendingCount(getOfflineQueue().length);
    setIsSyncing(false);
  };

  if (dismissed && isOnline && pendingCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-4 right-20 md:right-auto md:left-6 z-40 max-w-sm md:max-w-md pointer-events-auto">
      {/* Offline Status or Sync Notification */}
      {!isOnline && (
        <div className="mb-2 p-3 rounded-2xl bg-amber-500 text-slate-950 font-sans shadow-2xl flex items-center justify-between gap-3 border border-amber-400 animate-pulse">
          <div className="flex items-center gap-2 text-xs font-bold">
            <WifiOff className="w-4 h-4 text-slate-950 flex-shrink-0" />
            <div>
              <div>⚡ OFFLINE FIELD MODE ACTIVE</div>
              <div className="text-[10px] font-normal opacity-90">
                GPS & Form entries are safely saved locally in phone vault.
              </div>
            </div>
          </div>
          <Badge className="bg-slate-950 text-amber-400 text-[10px] font-mono px-2 py-0.5">
            {pendingCount} Queued
          </Badge>
        </div>
      )}

      {/* Online with Pending Sync Items */}
      {isOnline && pendingCount > 0 && (
        <div className="mb-2 p-3 rounded-2xl bg-emerald-950 text-white border border-emerald-500/50 shadow-2xl flex items-center justify-between gap-3 font-sans">
          <div className="flex items-center gap-2 text-xs">
            <Wifi className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-emerald-300">Connection Restored</div>
              <div className="text-[10px] text-slate-300">
                {pendingCount} offline field record(s) ready to sync.
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={autoSync}
            disabled={isSyncing}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl h-7 px-3 flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallPrompt && (
        <div className="p-3 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white border border-white/15 shadow-2xl flex items-center justify-between gap-3 font-sans">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                Install TOTAG Platform App
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[9px]">
                  Offline Ready
                </Badge>
              </div>
              <div className="text-[10px] text-slate-400">
                Fast 1-tap home screen access for field operations
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl h-7 px-3"
            >
              Install
            </Button>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
