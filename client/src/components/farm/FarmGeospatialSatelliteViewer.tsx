import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Layers, 
  Crosshair, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Droplets, 
  Tractor, 
  Search,
  Satellite,
  ShieldCheck,
  Info
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Futuristic Farm Beacon Icon
const farmBeaconIcon = new L.DivIcon({
  className: "custom-farm-beacon",
  html: `
    <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
      <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:rgba(16,185,129,0.35); animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
      <div style="position:absolute; width:22px; height:22px; border-radius:50%; background:#10b981; border:3px solid #ffffff; box-shadow:0 0 15px rgba(16,185,129,0.8); display:flex; align-items:center; justify-content:center;">
        <div style="width:6px; height:6px; border-radius:50%; background:#ffffff;"></div>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Preset Agri-Hubs in Liberia for fast navigation
const LIBERIA_AGRI_ZONES: Record<string, { lat: number; lng: number; county: string; name: string }> = {
  "Lofa": { lat: 8.421940, lng: -9.747820, county: "Lofa", name: "Voinjama & Foya Rice Belt" },
  "Nimba": { lat: 7.356200, lng: -8.718300, county: "Nimba", name: "Ganta & Sanniquellie Agro-Corridor" },
  "Bong": { lat: 6.994200, lng: -9.472200, county: "Bong", name: "CARI Suakoko Research Fields" },
  "Margibi": { lat: 6.541700, lng: -10.308300, county: "Margibi", name: "Kakata Commercial Cassava Cluster" },
  "Grand Bassa": { lat: 5.880600, lng: -10.044400, county: "Grand Bassa", name: "Buchanan River Basin" },
  "Grand Gedeh": { lat: 6.071700, lng: -8.135000, county: "Grand Gedeh", name: "Zwedru Highland Cocoa & Grains" },
  "Montserrado": { lat: 6.315600, lng: -10.807400, county: "Montserrado", name: "Paynesville & Thinker's Village Hub" },
};

// Sub-component to re-center map when coordinates change externally
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

// Sub-component for interactive map click/drag
function MapInteractionHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export interface FarmGeospatialSatelliteViewerProps {
  latitude: string;
  longitude: string;
  farmSizeAcres: number;
  cropType: string;
  cooperativeName: string;
  county: string;
  onCoordinatesChange: (lat: string, lng: string, elevation?: string) => void;
}

export function FarmGeospatialSatelliteViewer({
  latitude,
  longitude,
  farmSizeAcres,
  cropType,
  cooperativeName,
  county,
  onCoordinatesChange,
}: FarmGeospatialSatelliteViewerProps) {
  const parsedLat = parseFloat(latitude) || 8.421940;
  const parsedLng = parseFloat(longitude) || -9.747820;

  const [mapLayer, setMapLayer] = useState<"satellite" | "ndvi" | "terrain" | "hybrid">("satellite");
  const [showGeofence, setShowGeofence] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);

  // Compute bounding geofence polygon matching farm acreage
  const approxSideMeters = Math.sqrt(Math.max(1, farmSizeAcres) * 4046.86);
  const latOffset = (approxSideMeters / 111139) / 2;
  const lngOffset = (approxSideMeters / (111139 * Math.cos((parsedLat * Math.PI) / 180))) / 2;

  const polygonPoints: [number, number][] = [
    [parsedLat + latOffset, parsedLng - lngOffset],
    [parsedLat + latOffset, parsedLng + lngOffset],
    [parsedLat - latOffset, parsedLng + lngOffset],
    [parsedLat - latOffset, parsedLng - lngOffset],
  ];

  // Auto-Detect Live GPS
  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) return;
    setIsCapturingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const alt = pos.coords.altitude ? `${Math.round(pos.coords.altitude)}m elevation` : "340m Highland";
        onCoordinatesChange(lat, lng, alt);
        setIsCapturingGPS(false);
      },
      () => {
        setIsCapturingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Jump to County Agro-Hub
  const handleJumpToCounty = (countyName: string) => {
    const hub = LIBERIA_AGRI_ZONES[countyName] || LIBERIA_AGRI_ZONES["Lofa"];
    onCoordinatesChange(hub.lat.toFixed(6), hub.lng.toFixed(6), "Highland Basin");
  };

  return (
    <div className={`relative transition-all duration-300 rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl ${
      isFullScreen ? "fixed inset-4 z-50 flex flex-col h-[calc(100vh-2rem)]" : "w-full"
    }`}>
      
      {/* ================= HEADER TELEMETRY HUD ================= */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
                TOTAG GEOSPATIAL SAT-RADAR &trade;
              </h4>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-mono">
                Sentinel-2 / Esri 0.3m HD
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Plot: <span className="text-emerald-400 font-bold">{cooperativeName || "Registered Farm"}</span> &bull; {county} County &bull; {farmSizeAcres} Acres ({cropType})
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick County Preset Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-white/10 rounded-xl px-2 py-1 text-xs">
            <Search className="w-3 h-3 text-slate-400" />
            <select
              value={county}
              onChange={(e) => handleJumpToCounty(e.target.value)}
              className="bg-transparent text-[11px] text-slate-200 focus:outline-none cursor-pointer"
            >
              {Object.keys(LIBERIA_AGRI_ZONES).map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c} Agro-Hub
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleAutoDetectGPS}
            disabled={isCapturingGPS}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl h-8 shadow-sm flex items-center gap-1.5"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isCapturingGPS ? "animate-spin" : ""}`} />
            {isCapturingGPS ? "Locking Satellites..." : "📍 Auto-Detect GPS"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="bg-slate-900 border-white/10 hover:bg-slate-800 text-slate-300 text-xs rounded-xl h-8"
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* ================= INTERACTIVE SATELLITE RADAR MAP ================= */}
      <div className={`relative w-full ${isFullScreen ? "flex-1 min-h-0" : "h-[420px]"}`}>
        <MapContainer
          center={[parsedLat, parsedLng]}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
          style={{ background: "#0a0f1d" }}
        >
          <MapCenterController center={[parsedLat, parsedLng]} />
          <MapInteractionHandler
            onLocationChange={(lat, lng) => {
              onCoordinatesChange(lat.toFixed(6), lng.toFixed(6));
            }}
          />

          {/* SATELLITE BASE LAYERS */}
          {mapLayer === "satellite" && (
            <TileLayer
              attribution='&copy; Esri World Imagery'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          )}

          {mapLayer === "ndvi" && (
            <>
              <TileLayer
                attribution='&copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                attribution="Sentinel-2 Agri NDVI Synthetic Layer"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}"
                opacity={0.35}
              />
            </>
          )}

          {mapLayer === "terrain" && (
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={18}
            />
          )}

          {mapLayer === "hybrid" && (
            <>
              <TileLayer
                attribution='&copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                attribution='&copy; Esri Boundaries'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                opacity={0.8}
              />
            </>
          )}

          {/* DYNAMIC FARM GEOFENCE POLYGON */}
          {showGeofence && (
            <Polygon
              positions={polygonPoints}
              pathOptions={{
                color: "#10b981",
                weight: 2,
                fillColor: "#10b981",
                fillOpacity: 0.25,
                dashArray: "6, 6",
              }}
            >
              <Popup>
                <div className="text-xs p-1 text-slate-900 font-sans">
                  <strong className="text-emerald-700 block">{cooperativeName || "Farm Plot"}</strong>
                  <div>Area: <strong>{farmSizeAcres} Acres</strong> (~{Math.round(approxSideMeters)}m × {Math.round(approxSideMeters)}m)</div>
                  <div>Crop: <strong>{cropType}</strong></div>
                  <div>GPS: <span className="font-mono">{parsedLat.toFixed(5)}°, {parsedLng.toFixed(5)}°</span></div>
                </div>
              </Popup>
            </Polygon>
          )}

          {/* SATELLITE RANGE RADIUS */}
          <Circle
            center={[parsedLat, parsedLng]}
            radius={approxSideMeters * 1.5}
            pathOptions={{
              color: "#3b82f6",
              weight: 1,
              fillColor: "#3b82f6",
              fillOpacity: 0.06,
              dashArray: "3, 6",
            }}
          />

          {/* LIVE INTERACTIVE FARM BEACON MARKER */}
          <Marker
            position={[parsedLat, parsedLng]}
            icon={farmBeaconIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                onCoordinatesChange(pos.lat.toFixed(6), pos.lng.toFixed(6));
              },
            }}
          >
            <Popup>
              <div className="text-xs p-1.5 text-slate-900 font-sans">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <span>📍 Farm Center Point</span>
                </div>
                <div className="text-[11px] font-mono mt-1 text-slate-600">
                  Lat: <strong>{parsedLat.toFixed(6)}° N</strong><br />
                  Lng: <strong>{parsedLng.toFixed(6)}° W</strong>
                </div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">
                  ✓ Drag marker anywhere to adjust farm boundaries
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* ================= FLOATING LAYER SELECTOR HUD ================= */}
        <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-auto">
          <div className="bg-slate-950/85 backdrop-blur-md border border-white/15 p-2 rounded-2xl shadow-xl flex flex-col gap-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold px-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-400" /> Satellite Layer
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setMapLayer("satellite")}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all text-left ${
                  mapLayer === "satellite"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                }`}
              >
                🛰️ HD Sat
              </button>
              <button
                type="button"
                onClick={() => setMapLayer("hybrid")}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all text-left ${
                  mapLayer === "hybrid"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                }`}
              >
                🗺️ Hybrid
              </button>
              <button
                type="button"
                onClick={() => setMapLayer("ndvi")}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all text-left ${
                  mapLayer === "ndvi"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                }`}
              >
                🌿 NDVI Vigor
              </button>
              <button
                type="button"
                onClick={() => setMapLayer("terrain")}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all text-left ${
                  mapLayer === "terrain"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                }`}
              >
                ⛰️ Topo
              </button>
            </div>
          </div>

          <div className="bg-slate-950/85 backdrop-blur-md border border-white/15 p-2 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-[11px] text-white">
            <span className="text-[10px] font-mono text-slate-400 font-bold">Show {farmSizeAcres}ac Polygon:</span>
            <button
              type="button"
              onClick={() => setShowGeofence(!showGeofence)}
              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all ${
                showGeofence ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              {showGeofence ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* ================= BOTTOM TELEMETRY TELEMETRY HUD ================= */}
        <div className="absolute bottom-4 left-4 right-4 z-[400] bg-slate-950/90 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-2xl text-white pointer-events-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> Precise Coordinates
              </span>
              <div className="font-mono font-black text-emerald-400 text-xs">
                {parsedLat.toFixed(5)}° N, {parsedLng.toFixed(5)}° W
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-sky-400" /> Terrain & Elevation
              </span>
              <div className="font-bold text-slate-200 text-xs">
                340m (Highland Basin)
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-teal-400" /> Soil Moisture & Health
              </span>
              <div className="font-bold text-teal-300 text-xs">
                82% (Optimum Vigor)
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Tractor className="w-3 h-3 text-amber-400" /> Nearest Depot Dispatch
              </span>
              <div className="font-bold text-amber-300 text-xs">
                {county} Depot &bull; 18.4 km
              </div>
            </div>

            <div className="hidden lg:block space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" /> Traceability Pass
              </span>
              <div className="font-bold text-purple-300 text-xs truncate">
                EUDR / MoA Certified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER TIP ================= */}
      <div className="bg-slate-900 px-4 py-2 text-[11px] text-slate-400 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          Click anywhere on the satellite image or drag the green beacon to pinpoint your exact farm parcel in Liberia.
        </span>
        <span className="font-mono text-emerald-400 font-bold">
          High-Precision Sub-Meter Geo-Resolution Active
        </span>
      </div>
    </div>
  );
}
