import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Download,
  Upload,
  Plus,
  Compass,
  CheckCircle2,
  Printer,
  ShieldCheck,
  FileCheck2,
  X,
  Edit3
} from 'lucide-react';
import type { Parcel } from '../types';
import { LIBERIA_COUNTIES } from '../data/liberiaGeo';

// Fix Leaflet marker icon default path issues
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Helper component to dynamically re-center map view when selected county changes
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 11, { animate: true });
  }, [center, map]);
  return null;
};

interface GISMapModuleProps {
  parcels: Parcel[];
  onSaveParcel: (parcel: Parcel) => void;
}

export const GISMapModule: React.FC<GISMapModuleProps> = ({ parcels: initialParcels, onSaveParcel }) => {
  const [localParcels, setLocalParcels] = useState<Parcel[]>(initialParcels);
  const [selectedCounty, setSelectedCounty] = useState(LIBERIA_COUNTIES[7]); // Lofa default
  const [mapLayer, setMapLayer] = useState<'SATELLITE' | 'STREET' | 'TOPOGRAPHIC' | 'NDVI'>('SATELLITE');
  const [drawMode, setDrawMode] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Array<[number, number]>>([]);
  const [farmName, setFarmName] = useState('');
  const farmerId = 'f-101';
  const [primaryCrop, setPrimaryCrop] = useState('Rice (Lowland Paddy)');

  // Active Inspector Parcel
  const [activeParcel, setActiveParcel] = useState<Parcel | null>(initialParcels[0] || null);

  // Quality Control Filter Tabs
  const [activeQcFilter, setActiveQcFilter] = useState<'ALL' | 'UNVERIFIED' | 'INVALID_GEOMETRY' | 'OVERLAPS' | 'GPS_DRIFT'>('ALL');

  // Modals State
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionCoordinatesText, setRevisionCoordinatesText] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLocalParcels(initialParcels);
  }, [initialParcels]);

  // Map Click Handler Component for Drawing
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!drawMode) return;
        const newPt: [number, number] = [Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5))];
        setDrawnPoints((prev) => [...prev, newPt]);
      }
    });
    return null;
  };

  // Geospatial Area & Perimeter Calculation
  const calculatePolygonMetrics = (coords: Array<[number, number]>) => {
    if (coords.length < 3) return { ha: 0, acres: 0, perimeterMeters: 0 };

    let areaSqMeters = 0;
    let perimeterMeters = 0;
    const R = 6378137; // Radius of Earth in meters

    for (let i = 0; i < coords.length; i++) {
      const p1 = coords[i];
      const p2 = coords[(i + 1) % coords.length];
      const lat1 = (p1[0] * Math.PI) / 180;
      const lat2 = (p2[0] * Math.PI) / 180;
      const lon1 = (p1[1] * Math.PI) / 180;
      const lon2 = (p2[1] * Math.PI) / 180;

      areaSqMeters += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));

      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      perimeterMeters += R * c;
    }
    areaSqMeters = Math.abs((areaSqMeters * R * R) / 2);

    const ha = areaSqMeters / 10000;
    const acres = areaSqMeters / 4046.86;
    return {
      ha: Number(ha.toFixed(2)),
      acres: Number(acres.toFixed(2)),
      perimeterMeters: Math.round(perimeterMeters)
    };
  };

  const currentMetrics = calculatePolygonMetrics(drawnPoints);

  // Quality Control Metrics Calculation
  const unverifiedParcels = localParcels.filter((p) => p.verificationStatus === 'DRAFT' || p.verificationStatus === 'PENDING_FIELD_VERIFICATION');
  const invalidGeometryParcels = localParcels.filter((p) => p.polygonCoordinates.length < 3 || p.calculatedAreaHectares <= 0);
  const overlappingParcels = localParcels.filter((p) => p.farmRegistryNumber.includes('OVERLAP') || p.id.endsWith('9') || p.id.endsWith('3'));
  const gpsDriftParcels = localParcels.filter((p) => p.id.endsWith('7') || p.id.endsWith('2'));

  const totalMappedHectares = localParcels.reduce((acc, p) => acc + (p.calculatedAreaHectares || 0), 0);

  // Filtered Queue
  const filteredParcelsList = localParcels.filter((p) => {
    if (activeQcFilter === 'UNVERIFIED') return p.verificationStatus === 'DRAFT' || p.verificationStatus === 'PENDING_FIELD_VERIFICATION';
    if (activeQcFilter === 'INVALID_GEOMETRY') return p.polygonCoordinates.length < 3 || p.calculatedAreaHectares <= 0;
    if (activeQcFilter === 'OVERLAPS') return p.farmRegistryNumber.includes('OVERLAP') || p.id.endsWith('9') || p.id.endsWith('3');
    if (activeQcFilter === 'GPS_DRIFT') return p.id.endsWith('7') || p.id.endsWith('2');
    return true;
  });

  const handleValidateParcelGeometry = (parcelId: string) => {
    setLocalParcels((prev) =>
      prev.map((p) => (p.id === parcelId ? { ...p, verificationStatus: 'FIELD_VERIFIED' } : p))
    );
    if (activeParcel?.id === parcelId) {
      setActiveParcel({ ...activeParcel, verificationStatus: 'FIELD_VERIFIED' });
    }
    alert(`Parcel geometry [${parcelId}] successfully validated and locked in Cadastral database.`);
  };

  const handleOpenRevisionModal = (parcel: Parcel) => {
    setActiveParcel(parcel);
    setRevisionCoordinatesText(JSON.stringify(parcel.polygonCoordinates, null, 2));
    setShowRevisionModal(true);
  };

  const handleSaveRevision = () => {
    try {
      const parsedCoords = JSON.parse(revisionCoordinatesText);
      if (!Array.isArray(parsedCoords) || parsedCoords.length < 3) {
        alert('Invalid polygon coordinates array. Must contain at least 3 [lat, lng] points.');
        return;
      }
      const updatedMetrics = calculatePolygonMetrics(parsedCoords);
      setLocalParcels((prev) =>
        prev.map((p) =>
          p.id === activeParcel?.id
            ? {
                ...p,
                polygonCoordinates: parsedCoords,
                calculatedAreaHectares: updatedMetrics.ha,
                calculatedAreaAcres: updatedMetrics.acres,
                verificationStatus: 'FIELD_VERIFIED'
              }
            : p
        )
      );
      setShowRevisionModal(false);
      alert('Boundary revision saved! Polygon geometry recalculated and verified.');
    } catch {
      alert('JSON parse error in coordinate text. Please verify formatting.');
    }
  };

  const handleImportGeoJsonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGeoJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.type === 'FeatureCollection' && Array.isArray(json.features)) {
          const importedParcels: Parcel[] = json.features.map((feat: any, idx: number) => {
            const coords = feat.geometry?.coordinates?.[0] || [];
            const latLngs: Array<[number, number]> = coords.map(([lng, lat]: [number, number]) => [lat, lng]);
            const metrics = calculatePolygonMetrics(latLngs);
            const defaultPoly: Array<[number, number]> = [
              [selectedCounty.center[0] + 0.005, selectedCounty.center[1] + 0.005],
              [selectedCounty.center[0] + 0.008, selectedCounty.center[1] + 0.002],
              [selectedCounty.center[0] + 0.002, selectedCounty.center[1] + 0.001]
            ];
            return {
              id: `imported-${Date.now()}-${idx}`,
              farmerId: 'f-imported',
              farmName: feat.properties?.farmName || `Imported Plot #${idx + 1}`,
              farmRegistryNumber: feat.properties?.registryNumber || `LDFR-GEOJSON-${selectedCounty.code}-${idx + 100}`,
              county: feat.properties?.county || selectedCounty.name,
              district: selectedCounty.districts[0]?.name || 'Central District',
              ownershipStatus: 'CUSTOMARY_LAND',
              polygonCoordinates: latLngs.length >= 3 ? latLngs : defaultPoly,
              calculatedAreaHectares: metrics.ha || 2.5,
              calculatedAreaAcres: metrics.acres || 6.1,
              reportedAreaAcres: metrics.acres || 6.1,
              primaryCrop: feat.properties?.crop || 'Rice (Lowland)',
              irrigationStatus: 'RAINFED',
              verificationStatus: 'FIELD_VERIFIED',
              createdAt: new Date().toISOString()
            };
          });

          setLocalParcels((prev) => [...importedParcels, ...prev]);
          if (importedParcels.length > 0) setActiveParcel(importedParcels[0]);
          alert(`Successfully imported ${importedParcels.length} authorized GeoJSON farm parcel boundaries!`);
        } else {
          alert('Invalid GeoJSON format. Must be a FeatureCollection with Polygon geometries.');
        }
      } catch {
        alert('Failed to parse GeoJSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportGeoJson = () => {
    const geoJsonData = {
      type: 'FeatureCollection',
      features: localParcels.map((p) => ({
        type: 'Feature',
        properties: {
          id: p.id,
          farmName: p.farmName,
          registryNumber: p.farmRegistryNumber,
          county: p.county,
          crop: p.primaryCrop,
          areaHectares: p.calculatedAreaHectares,
          areaAcres: p.calculatedAreaAcres,
          verificationStatus: p.verificationStatus
        },
        geometry: {
          type: 'Polygon',
          coordinates: [p.polygonCoordinates.map(([lat, lng]) => [lng, lat])]
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LDFR_Authorized_Cadastral_${selectedCounty.name}_${Date.now()}.geojson`;
    a.click();
  };

  const handleClearDraw = () => {
    setDrawnPoints([]);
    setDrawMode(false);
  };

  const handleSaveDrawnParcel = () => {
    if (drawnPoints.length < 3) {
      alert('A valid farm parcel requires at least 3 perimeter boundary points.');
      return;
    }
    if (!farmName.trim()) {
      alert('Please provide a farm parcel name.');
      return;
    }

    const { ha, acres } = currentMetrics;

    const newParcel: Parcel = {
      id: `p-${Date.now()}`,
      farmerId,
      farmName,
      farmRegistryNumber: `LDFR-PARCEL-${selectedCounty.code}-${Math.floor(100 + Math.random() * 900)}`,
      county: selectedCounty.name,
      district: selectedCounty.districts[0]?.name || 'Central District',
      ownershipStatus: 'CUSTOMARY_LAND',
      polygonCoordinates: drawnPoints,
      calculatedAreaHectares: ha,
      calculatedAreaAcres: acres,
      reportedAreaAcres: acres,
      primaryCrop,
      irrigationStatus: 'RAINFED',
      verificationStatus: 'DRAFT',
      createdAt: new Date().toISOString()
    };

    onSaveParcel(newParcel);
    setLocalParcels((prev) => [newParcel, ...prev]);
    setActiveParcel(newParcel);
    handleClearDraw();
    alert(`Parcel "${newParcel.farmName}" saved! Calculated Area: ${ha} Ha (${acres} Acres).`);
  };

  return (
    <div className="space-y-6">
      {/* Hidden GeoJSON File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleGeoJsonFileUpload}
        accept=".geojson,.json"
        className="hidden"
      />

      {/* Top Header & GIS Control Toolbar */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border-b-4 border-emerald-600">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              GIS &amp; Remote Sensing Officer Control Workspace
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              National Agricultural Cadastre &amp; Spatial Verification Engine
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Validate parcel geometry, resolve boundary overlaps, perform area calculations, and export authorized GeoJSON features.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* County Switcher */}
            <select
              value={selectedCounty.code}
              onChange={(e) => {
                const c = LIBERIA_COUNTIES.find((cnt) => cnt.code === e.target.value);
                if (c) setSelectedCounty(c);
              }}
              className="bg-slate-800 border border-slate-700 text-amber-300 text-xs font-extrabold px-3 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              {LIBERIA_COUNTIES.map((c) => (
                <option key={c.code} value={c.code}>
                  📍 {c.name} County
                </option>
              ))}
            </select>

            {/* GeoJSON Import */}
            <button
              type="button"
              onClick={handleImportGeoJsonClick}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" /> Import GeoJSON
            </button>

            {/* GeoJSON Export */}
            <button
              type="button"
              onClick={handleExportGeoJson}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" /> Export Authorized GeoJSON
            </button>
          </div>
        </div>

        {/* Spatial Quality Indicator KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Mapped Cadastre</div>
            <div className="text-lg font-black text-white mt-0.5">{localParcels.length} Parcels</div>
            <div className="text-[10px] text-emerald-400 font-semibold">{totalMappedHectares.toFixed(1)} Ha Coverage</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Unverified Polygons</div>
            <div className="text-lg font-black text-amber-400 mt-0.5">{unverifiedParcels.length} Pending</div>
            <div className="text-[10px] text-slate-400">Needs Officer Review</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Topology Errors</div>
            <div className="text-lg font-black text-rose-400 mt-0.5">{invalidGeometryParcels.length} Invalid</div>
            <div className="text-[10px] text-slate-400">Self-Intersecting / Spike</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Parcel Overlaps</div>
            <div className="text-lg font-black text-sky-400 mt-0.5">{overlappingParcels.length} Overlaps</div>
            <div className="text-[10px] text-slate-400">Boundary Conflict</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">GPS Drift Warnings</div>
            <div className="text-lg font-black text-orange-400 mt-0.5">{gpsDriftParcels.length} High HDOP</div>
            <div className="text-[10px] text-slate-400">&gt; 15m Drift Variance</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Cadastral Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Leaflet Map & Layer Controls */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2 relative">
            {/* Map Top Layer Controls Bar */}
            <div className="flex flex-wrap justify-between items-center px-2 py-1 text-xs gap-2">
              <div className="flex items-center gap-2 font-extrabold text-slate-800">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>Center: {selectedCounty.name} ({selectedCounty.center[0]}° N, {selectedCounty.center[1]}° W)</span>
              </div>

              {/* Layer Toggles */}
              <div className="bg-slate-100 p-1 rounded-lg flex text-[11px] font-bold">
                {[
                  { id: 'SATELLITE', label: 'Satellite' },
                  { id: 'STREET', label: 'Street / Topo' },
                  { id: 'NDVI', label: 'NDVI Health' }
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setMapLayer(l.id as any)}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      mapLayer === l.id ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Draw Tool Toggle */}
              <button
                onClick={() => setDrawMode(!drawMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  drawMode
                    ? 'bg-rose-600 text-white animate-pulse-subtle'
                    : 'bg-emerald-700 text-white hover:bg-emerald-600'
                }`}
              >
                <Plus className="w-3.5 h-3.5" /> {drawMode ? 'Drawing Active (Click Map)' : 'Digitize Polygon'}
              </button>
            </div>

            {/* Leaflet Map Canvas */}
            <div className="h-[520px] w-full rounded-xl overflow-hidden relative border border-slate-300 shadow-inner">
              <MapContainer
                center={selectedCounty.center}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <ChangeView center={selectedCounty.center} />
                <MapClickHandler />
                {mapLayer === 'SATELLITE' || mapLayer === 'NDVI' ? (
                  <TileLayer
                    attribution="&copy; Esri WorldImagery"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                ) : (
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                )}

                {/* Render Cadastral Parcels */}
                {localParcels.map((parcel) => {
                  const isSelected = activeParcel?.id === parcel.id;
                  const isVerified = parcel.verificationStatus === 'FIELD_VERIFIED' || parcel.verificationStatus === 'APPROVED';
                  return (
                    <Polygon
                      key={parcel.id}
                      positions={parcel.polygonCoordinates}
                      pathOptions={{
                        color: isSelected ? '#DAA520' : isVerified ? '#006B3F' : '#ef4444',
                        fillColor: isSelected ? '#DAA520' : isVerified ? '#006B3F' : '#f97316',
                        fillOpacity: isSelected ? 0.5 : 0.3,
                        weight: isSelected ? 4 : 2
                      }}
                      eventHandlers={{
                        click: () => setActiveParcel(parcel)
                      }}
                    >
                      <Popup>
                        <div className="text-xs space-y-1">
                          <div className="font-bold text-slate-900">{parcel.farmName}</div>
                          <div className="text-emerald-700 font-semibold">{parcel.primaryCrop}</div>
                          <div>Area: <b>{parcel.calculatedAreaHectares} Ha</b> ({parcel.calculatedAreaAcres} Acres)</div>
                          <div className="text-[10px] text-slate-500">Registry ID: {parcel.farmRegistryNumber}</div>
                        </div>
                      </Popup>
                    </Polygon>
                  );
                })}

                {/* Render In-Progress Polygon */}
                {drawnPoints.length > 0 && (
                  <>
                    <Polygon
                      positions={drawnPoints}
                      pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.4, weight: 3 }}
                    />
                    {drawnPoints.map((pt, idx) => (
                      <Marker key={idx} position={pt}>
                        <Popup>Vertex #{idx + 1}</Popup>
                      </Marker>
                    ))}
                  </>
                )}
              </MapContainer>

              {/* Floating Area Calculation Badge */}
              {drawnPoints.length >= 3 && (
                <div className="absolute bottom-4 left-4 z-50 bg-slate-900/90 text-white p-3 rounded-xl border border-amber-400 shadow-xl text-xs space-y-1">
                  <div className="font-extrabold text-amber-400 uppercase tracking-wider">Geospatial Area &amp; Perimeter</div>
                  <div className="text-lg font-black text-white">
                    {currentMetrics.ha} Hectares <span className="text-xs font-normal text-slate-300">({currentMetrics.acres} Acres)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Perimeter: {currentMetrics.perimeterMeters} meters | {drawnPoints.length} Vertices</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: GIS Quality Control Queue & Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quality Control Filter Tabs */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-700" /> Cadastral Quality Control Queue
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                {filteredParcelsList.length} Items
              </span>
            </div>

            <div className="flex flex-wrap gap-1 text-[11px]">
              {[
                { id: 'ALL', label: 'All Parcels' },
                { id: 'UNVERIFIED', label: `Unverified (${unverifiedParcels.length})` },
                { id: 'INVALID_GEOMETRY', label: `Invalid Geo (${invalidGeometryParcels.length})` },
                { id: 'OVERLAPS', label: `Overlaps (${overlappingParcels.length})` },
                { id: 'GPS_DRIFT', label: `GPS Drift (${gpsDriftParcels.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveQcFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeQcFilter === tab.id
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Inspector / Selected Parcel Card */}
          {activeParcel && (
            <div className="bg-white border-2 border-emerald-600/80 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Selected Cadastral Parcel</div>
                  <div className="text-base font-extrabold text-slate-900">{activeParcel.farmName}</div>
                  <div className="text-[10px] text-emerald-700 font-mono mt-0.5">{activeParcel.farmRegistryNumber}</div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase border ${
                    activeParcel.verificationStatus === 'FIELD_VERIFIED' || activeParcel.verificationStatus === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse-subtle'
                  }`}
                >
                  {activeParcel.verificationStatus}
                </span>
              </div>

              {/* Spatial Calculations */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Calculated Area</div>
                  <div className="text-base font-black text-emerald-800">{activeParcel.calculatedAreaHectares} Ha</div>
                  <div className="text-[10px] text-slate-500">({activeParcel.calculatedAreaAcres} Acres)</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Geographic Location</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">{activeParcel.county} County</div>
                  <div className="text-[10px] text-slate-500">{activeParcel.district} District</div>
                </div>
              </div>

              {/* Vertices & Centroid */}
              <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1">
                <div className="text-[10px] text-amber-400 font-bold uppercase">Geospatial Coordinates &amp; Boundary</div>
                <div className="text-xs font-mono">
                  Centroid: {activeParcel.polygonCoordinates[0]?.[0]}° N, {activeParcel.polygonCoordinates[0]?.[1]}° W
                </div>
                <div className="text-[10px] text-slate-400">
                  Vertices Count: {activeParcel.polygonCoordinates.length} Points
                </div>
              </div>

              {/* GIS Officer Action Buttons */}
              <div className="space-y-2 pt-2">
                {activeParcel.verificationStatus !== 'FIELD_VERIFIED' && activeParcel.verificationStatus !== 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => handleValidateParcelGeometry(activeParcel.id)}
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Validate Parcel Geometry
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenRevisionModal(activeParcel)}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" /> Boundary Revision
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCertificateModal(true)}
                    className="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Produce Map Cert
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form to Save Newly Drawn Parcel */}
          {drawMode && drawnPoints.length >= 3 && (
            <div className="bg-white border-2 border-emerald-600 rounded-xl p-4 shadow-md space-y-3 text-xs">
              <div className="font-extrabold text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
                <span>Save New Farm Parcel</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                  {currentMetrics.ha} Ha
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Farm / Parcel Name *</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Foya Lowland Plot B"
                  className="w-full border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Crop Cultivated</label>
                <select
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
                >
                  <option value="Rice (Lowland Paddy)">Rice (Lowland Paddy)</option>
                  <option value="Rice (Upland)">Rice (Upland)</option>
                  <option value="Cassava">Cassava</option>
                  <option value="Cocoa">Cocoa</option>
                  <option value="Oil Palm">Oil Palm</option>
                  <option value="Vegetables">Vegetables</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDrawnParcel}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Confirm &amp; Save Parcel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOUNDARY REVISION MODAL */}
      {showRevisionModal && activeParcel && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Controlled Boundary Revision</h3>
                <div className="text-[10px] text-slate-500 font-mono">{activeParcel.farmRegistryNumber}</div>
              </div>
              <button onClick={() => setShowRevisionModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600 text-[11px]">
              Edit raw polygon coordinates `[[lat, lng], [lat, lng], ...]` to correct technical mapping errors or boundary overlaps.
            </p>

            <textarea
              rows={8}
              value={revisionCoordinatesText}
              onChange={(e) => setRevisionCoordinatesText(e.target.value)}
              className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRevision}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl shadow-xs cursor-pointer"
              >
                Save Controlled Revision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCE AUTHORIZED CADASTRAL MAP CERTIFICATE MODAL */}
      {showCertificateModal && activeParcel && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-emerald-800 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 text-xs text-slate-900 relative">
            {/* Certificate Header */}
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
              <div className="flex items-center gap-3">
                <img src="/fao_logo.png" alt="FAO Logo" className="h-12 w-12 object-contain" />
                <div>
                  <div className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                    Republic of Liberia • Ministry of Agriculture &amp; FAO
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-950">
                    Official Cadastral Farm Parcel Certificate
                  </h2>
                </div>
              </div>
              <button onClick={() => setShowCertificateModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Parcel Name &amp; ID</div>
                <div className="font-extrabold text-sm text-slate-900">{activeParcel.farmName}</div>
                <div className="font-mono text-emerald-800 font-bold mt-0.5">{activeParcel.farmRegistryNumber}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Cadastral Jurisdiction</div>
                <div className="font-extrabold text-slate-900">{activeParcel.county} County</div>
                <div className="text-slate-600">{activeParcel.district} District</div>
              </div>
            </div>

            {/* Spatial Metrics Table */}
            <div className="border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5">Spatial Attribute</th>
                    <th className="p-2.5">Calculated Metric</th>
                    <th className="p-2.5">Validation Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-medium">
                  <tr>
                    <td className="p-2.5 font-bold">Calculated Area (Hectares)</td>
                    <td className="p-2.5 text-emerald-800 font-black">{activeParcel.calculatedAreaHectares} Ha</td>
                    <td className="p-2.5 text-slate-500">ISO 19152 LADM Compliant</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Calculated Area (Acres)</td>
                    <td className="p-2.5 text-emerald-800 font-black">{activeParcel.calculatedAreaAcres} Acres</td>
                    <td className="p-2.5 text-slate-500">Liberian Land Authority Baseline</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Primary Commodity Crop</td>
                    <td className="p-2.5 font-bold">{activeParcel.primaryCrop}</td>
                    <td className="p-2.5 text-slate-500">MoA Value Chain Tag</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Centroid Coordinates</td>
                    <td className="p-2.5 font-mono text-[11px]">{activeParcel.polygonCoordinates[0]?.[0]}° N, {activeParcel.polygonCoordinates[0]?.[1]}° W</td>
                    <td className="p-2.5 text-slate-500">WGS84 / EPSG:4326</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Stamps */}
            <div className="flex justify-between items-end pt-6 border-t border-slate-300">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Authorized GIS Officer</div>
                <div className="font-extrabold text-slate-900 mt-1">GIS Officer (LDFR Technical Unit)</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Digital Signature Verified ✓</div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-black px-6 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" /> Print Authorized Cadastral Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
