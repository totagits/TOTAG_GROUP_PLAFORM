import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Download, Plus, Compass } from 'lucide-react';
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

export const GISMapModule: React.FC<GISMapModuleProps> = ({ parcels, onSaveParcel }) => {
  const [selectedCounty, setSelectedCounty] = useState(LIBERIA_COUNTIES[7]); // Lofa default
  const [mapLayer, setMapLayer] = useState<'SATELLITE' | 'STREET'>('SATELLITE');
  const [drawMode, setDrawMode] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Array<[number, number]>>([]);
  const [farmName, setFarmName] = useState('');
  const farmerId = 'f-101';
  const [primaryCrop, setPrimaryCrop] = useState('Rice (Lowland Paddy)');

  // Selected Parcel for Inspector view
  const [activeParcel, setActiveParcel] = useState<Parcel | null>(parcels[0] || null);

  // Map Click Handler Component
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

  // Helper area calculation (Ha & Acres)
  const calculatePolygonArea = (coords: Array<[number, number]>) => {
    if (coords.length < 3) return { ha: 0, acres: 0 };

    // Approximation for Liberian latitudes (~6-8 degrees N)
    let areaSqMeters = 0;
    const R = 6378137; // Radius of earth
    for (let i = 0; i < coords.length; i++) {
      const p1 = coords[i];
      const p2 = coords[(i + 1) % coords.length];
      const lat1 = (p1[0] * Math.PI) / 180;
      const lat2 = (p2[0] * Math.PI) / 180;
      const lon1 = (p1[1] * Math.PI) / 180;
      const lon2 = (p2[1] * Math.PI) / 180;
      areaSqMeters += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    areaSqMeters = Math.abs((areaSqMeters * R * R) / 2);

    const ha = areaSqMeters / 10000;
    const acres = areaSqMeters / 4046.86;
    return { ha: Number(ha.toFixed(2)), acres: Number(acres.toFixed(2)) };
  };

  const currentArea = calculatePolygonArea(drawnPoints);

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

    const { ha, acres } = currentArea;

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
      verificationStatus: 'SUBMITTED',
      createdAt: new Date().toISOString()
    };

    onSaveParcel(newParcel);
    setActiveParcel(newParcel);
    handleClearDraw();
    alert(`Parcel "${newParcel.farmName}" saved! Calculated Area: ${ha} Ha (${acres} Acres).`);
  };

  const handleExportGeoJson = () => {
    const geoJsonData = {
      type: 'FeatureCollection',
      features: parcels.map((p) => ({
        type: 'Feature',
        properties: {
          id: p.id,
          farmName: p.farmName,
          registryNumber: p.farmRegistryNumber,
          county: p.county,
          crop: p.primaryCrop,
          areaHectares: p.calculatedAreaHectares,
          areaAcres: p.calculatedAreaAcres
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
    a.download = `LDFR_Parcels_${selectedCounty.name}_${Date.now()}.geojson`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top GIS Toolbar */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            National Agricultural Cadastre &amp; Remote Sensing
          </div>
          <h2 className="text-xl font-extrabold text-white">Advanced GIS Farm Parcel Mapper</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="bg-slate-800 border border-slate-700 p-1 rounded-lg flex text-xs">
            <button
              onClick={() => setMapLayer('SATELLITE')}
              className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                mapLayer === 'SATELLITE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite Imagery
            </button>
            <button
              onClick={() => setMapLayer('STREET')}
              className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                mapLayer === 'STREET' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Street / Topo
            </button>
          </div>

          {/* County Selector */}
          <select
            value={selectedCounty.code}
            onChange={(e) => {
              const c = LIBERIA_COUNTIES.find((cnt) => cnt.code === e.target.value);
              if (c) setSelectedCounty(c);
            }}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-3 py-2 rounded-lg"
          >
            {LIBERIA_COUNTIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} County
              </option>
            ))}
          </select>

          {/* Export GeoJSON Button */}
          <button
            onClick={handleExportGeoJson}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export GeoJSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Map Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-2 shadow-xs space-y-2 relative">
          {/* Map Sub-Header & Draw Mode Toggle */}
          <div className="flex justify-between items-center px-2 py-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Center: {selectedCounty.name} ({selectedCounty.center[0]}° N, {selectedCounty.center[1]}° W)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrawMode(!drawMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  drawMode
                    ? 'bg-rose-600 text-white animate-pulse-subtle'
                    : 'bg-emerald-700 text-white hover:bg-emerald-600'
                }`}
              >
                <Plus className="w-3.5 h-3.5" /> {drawMode ? 'Drawing Active (Click Map)' : 'Draw New Parcel Polygon'}
              </button>

              {drawnPoints.length > 0 && (
                <button
                  onClick={handleClearDraw}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-lg"
                >
                  Clear Draw ({drawnPoints.length})
                </button>
              )}
            </div>
          </div>

          {/* Leaflet Map Element */}
          <div className="h-[480px] w-full rounded-xl overflow-hidden relative border border-slate-300 shadow-inner">
            <MapContainer
              center={selectedCounty.center}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <ChangeView center={selectedCounty.center} />
              <MapClickHandler />
              {mapLayer === 'SATELLITE' ? (
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

              {/* Render Existing Saved Parcels */}
              {parcels.map((parcel) => (
                <Polygon
                  key={parcel.id}
                  positions={parcel.polygonCoordinates}
                  pathOptions={{
                    color: activeParcel?.id === parcel.id ? '#DAA520' : '#006B3F',
                    fillColor: activeParcel?.id === parcel.id ? '#DAA520' : '#006B3F',
                    fillOpacity: 0.35,
                    weight: activeParcel?.id === parcel.id ? 4 : 2
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
              ))}

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

            {/* Live Area Calculation Floating Badge */}
            {drawnPoints.length >= 3 && (
              <div className="absolute bottom-4 left-4 z-50 bg-slate-900/90 text-white p-3 rounded-lg border border-amber-400 shadow-xl text-xs space-y-1">
                <div className="font-bold text-amber-400 uppercase tracking-wider">Geospatial Area Result</div>
                <div className="text-lg font-extrabold text-white">
                  {currentArea.ha} Hectares <span className="text-xs font-normal text-slate-300">({currentArea.acres} Acres)</span>
                </div>
                <div className="text-[10px] text-slate-400">Vertices Captured: {drawnPoints.length} Points</div>
              </div>
            )}
          </div>
        </div>

        {/* Right GIS Inspector Panel & Parcel Creation Form */}
        <div className="lg:col-span-4 space-y-4">
          {drawMode && drawnPoints.length >= 3 ? (
            <div className="bg-white border-2 border-emerald-600 rounded-xl p-4 shadow-md space-y-3 text-xs">
              <div className="font-extrabold text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
                <span>Save New Farm Parcel</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                  {currentArea.ha} Ha
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
          ) : null}

          {/* Active Parcel Inspector Details */}
          {activeParcel && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 text-xs">
              <div className="font-extrabold text-slate-900 text-sm border-b pb-2 flex justify-between items-center">
                <span>Parcel Attributes Inspector</span>
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">
                  {activeParcel.farmRegistryNumber}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Farm Name</div>
                  <div className="font-bold text-slate-900 text-sm">{activeParcel.farmName}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded">
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold">Calculated Area</div>
                    <div className="font-bold text-emerald-800 text-sm">{activeParcel.calculatedAreaHectares} Ha</div>
                    <div className="text-[10px] text-slate-500">({activeParcel.calculatedAreaAcres} Acres)</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold">Primary Crop</div>
                    <div className="font-bold text-slate-800">{activeParcel.primaryCrop}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Geographic Location</div>
                  <div className="font-semibold text-slate-800">
                    {activeParcel.county} County / {activeParcel.district}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Verification Status</div>
                  <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded mt-0.5">
                    {activeParcel.verificationStatus}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
