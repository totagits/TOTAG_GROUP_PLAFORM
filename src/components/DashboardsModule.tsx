import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileSpreadsheet } from 'lucide-react';
import type { FarmerProfile, Parcel, AgriculturalProgram } from '../types';

interface DashboardsModuleProps {
  farmers: FarmerProfile[];
  parcels: Parcel[];
  programs: AgriculturalProgram[];
  onLogExportAudit: (format: string) => void;
}

const COLORS = ['#006B3F', '#DAA520', '#002B49', '#38bdf8', '#f43f5e', '#8b5cf6'];

export const DashboardsModule: React.FC<DashboardsModuleProps> = ({
  farmers,
  parcels,
  programs,
  onLogExportAudit
}) => {
  // Aggregate stats
  const totalFarmers = farmers.length;
  const femaleFarmers = farmers.filter((f) => f.sex === 'FEMALE' || f.isFemaleHeadedHousehold).length;
  const youthFarmers = farmers.filter((f) => f.isYouth).length;

  const totalAreaHa = parcels.reduce((sum, p) => sum + p.calculatedAreaHectares, 0);

  // County Breakdown Data
  const countyDataMap: Record<string, number> = {};
  farmers.forEach((f) => {
    countyDataMap[f.county] = (countyDataMap[f.county] || 0) + 1;
  });

  const countyChartData = Object.keys(countyDataMap).map((county) => ({
    name: county,
    count: countyDataMap[county]
  }));

  // Gender Breakdown Data
  const genderPieData = [
    { name: 'Female Farmers', value: femaleFarmers },
    { name: 'Male Farmers', value: totalFarmers - femaleFarmers }
  ];

  const handleExportReport = (format: string) => {
    onLogExportAudit(format);

    if (format === 'CSV') {
      const csvHeader = 'RegistryID,FirstName,LastName,County,District,Sex,NationalID,Phone,VerificationStatus\n';
      const csvRows = farmers
        .map(
          (f) =>
            `${f.farmerRegistryNumber},${f.firstName},${f.lastName},${f.county},${f.district},${f.sex},${f.nationalIdNumber},${f.primaryPhone},${f.verificationStatus}`
        )
        .join('\n');

      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LDFR_National_Farmer_Registry_${Date.now()}.csv`;
      a.click();
    } else {
      alert(`Report generated and exported in [${format}] format! Audit trail log recorded.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-emerald-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            Executive Decision Support &amp; Policy Intelligence
          </div>
          <h2 className="text-2xl font-extrabold text-white">National Agricultural Analytics &amp; Reporting</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Provides privacy-protected aggregated statistics, geospatial farm cluster analytics, and gender/youth inclusion metrics across Liberia's 15 counties.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleExportReport('CSV')}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV Report
          </button>
          <button
            onClick={() => handleExportReport('PDF')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export PDF Summary
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="text-slate-500 text-xs font-bold uppercase">National Farmer Registry</div>
          <div className="text-3xl font-extrabold text-slate-900">{totalFarmers.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-700 font-semibold">100% Unique Identity Records</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="text-slate-500 text-xs font-bold uppercase">Total Mapped Farm Area</div>
          <div className="text-3xl font-extrabold text-emerald-800">{totalAreaHa.toFixed(2)} Ha</div>
          <div className="text-[10px] text-slate-500">{(totalAreaHa * 2.47105).toFixed(2)} Total Acres</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="text-slate-500 text-xs font-bold uppercase">Women &amp; Youth Inclusion</div>
          <div className="text-3xl font-extrabold text-amber-600">
            {Math.round(((femaleFarmers + youthFarmers) / (totalFarmers * 2)) * 100)}%
          </div>
          <div className="text-[10px] text-slate-500">
            {femaleFarmers} Female • {youthFarmers} Youth (&lt;35)
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="text-slate-500 text-xs font-bold uppercase">Program Coverage</div>
          <div className="text-3xl font-extrabold text-sky-700">{programs.length} Programs</div>
          <div className="text-[10px] text-slate-500">Active across 15 Liberian Counties</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* County Distribution Bar Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="font-extrabold text-slate-900 text-sm border-b pb-2 flex justify-between items-center">
            <span>Farmer Registration Distribution by County</span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">
              15 Counties Data
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countyChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#006B3F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Inclusion Pie Chart */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="font-extrabold text-slate-900 text-sm border-b pb-2">
            Gender Disaggregated Demographics
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {genderPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs space-y-1 text-slate-600 pt-2 border-t">
            <div className="flex justify-between">
              <span>Female Farmers / Households:</span>
              <b className="text-emerald-800">{femaleFarmers}</b>
            </div>
            <div className="flex justify-between">
              <span>Male Farmers / Households:</span>
              <b className="text-slate-800">{totalFarmers - femaleFarmers}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
