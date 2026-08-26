export interface QueuedItem {
  id: string;
  type: "farmer_enrollment" | "time_clock_in" | "leave_request" | "cargo_inspection" | "weighbridge_intake";
  payload: any;
  timestamp: string;
  gpsCoordinates?: { lat: string; lng: string };
  status: "pending" | "synced" | "failed";
}

const OFFLINE_STORAGE_KEY = "totag_offline_sync_vault_v1";

export function getOfflineQueue(): QueuedItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToOfflineQueue(type: QueuedItem["type"], payload: any, gpsCoordinates?: { lat: string; lng: string }): QueuedItem {
  const item: QueuedItem = {
    id: `OFFLINE-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
    gpsCoordinates,
    status: "pending"
  };

  const current = getOfflineQueue();
  current.unshift(item);
  localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent("totag_offline_queue_updated", { detail: { count: current.length } }));
  return item;
}

export function clearSyncedItem(id: string) {
  const current = getOfflineQueue().filter(item => item.id !== id);
  localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent("totag_offline_queue_updated", { detail: { count: current.length } }));
}

export async function flushOfflineQueue(): Promise<{ syncedCount: number; errors: number }> {
  const queue = getOfflineQueue().filter(i => i.status === "pending");
  if (queue.length === 0) return { syncedCount: 0, errors: 0 };

  let synced = 0;
  let errors = 0;

  for (const item of queue) {
    try {
      // Simulate/Trigger API sync
      await new Promise(r => setTimeout(r, 400));
      clearSyncedItem(item.id);
      synced++;
    } catch {
      errors++;
    }
  }

  return { syncedCount: synced, errors };
}
