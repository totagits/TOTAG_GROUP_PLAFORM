import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Download,
  Printer,
  ArrowLeft,
  BarChart3,
  Calendar,
  DollarSign,
  Users,
  ShieldCheck,
  Layers,
  Filter,
  CheckCircle2
} from "lucide-react";

export default function SaaSReports() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedReportType, setSelectedReportType] = useState("hrmis_statutory_payroll");
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");

  // Load real-time data from localStorage
  const crsWorkers = (() => {
    try {
      const saved = localStorage.getItem("totag_crs_workers_clean_v3");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const corporateEmployees = (() => {
    try {
      const saved = localStorage.getItem("totag_corporate_employees_live_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const institutionSettings = (() => {
    try {
      const saved = localStorage.getItem("totag_institution_settings_v1");
      return saved ? JSON.parse(saved) : { name: "TOTAG GROUP OF COMPANIES LTD", tin: "LRA-TIN-100984712", address: "Monrovia, Liberia" };
    } catch {
      return { name: "TOTAG GROUP OF COMPANIES LTD", tin: "LRA-TIN-100984712", address: "Monrovia, Liberia" };
    }
  })();

  const handleExportCSV = () => {
    let csvData = "";
    if (selectedReportType === "crs_sow_dossier") {
      csvData = "Name,Phone,National ID,Catchment,Role,Contract Signed,HHR Completed,Daily Rate USD\n" +
        crsWorkers.map((w: any) => `"${w.fullName}","${w.phone}","${w.nationalId}","${w.healthFacilityCatchment}","${w.role}","${w.byodConsentSigned ? 'YES' : 'NO'}","${w.actualHhrCompleted || 0}","${w.dailyRateUsd}"`).join("\n");
    } else {
      csvData = "Employee Code,Name,Role,Department,Base Salary USD,NASSCORP (4.75%),LRA Tax (12%)\n" +
        corporateEmployees.map((e: any) => `"${e.employeeCode}","${e.firstName} ${e.lastName}","${e.role}","${e.department}","${e.baseSalaryUsd}","${e.baseSalaryUsd * 0.0475}","${e.baseSalaryUsd * 0.12}"`).join("\n");
    }

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedReportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "✓ Report Exported to CSV",
      description: "Download initiated successfully."
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/saas/dashboard")}
            className="text-slate-400 hover:text-white rounded-xl h-8 px-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
          </Button>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h1 className="text-sm font-black text-white">Enterprise Financial & Operational Reports</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            className="bg-slate-900 border-white/20 text-slate-200 text-xs h-8 rounded-xl font-bold"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Print
          </Button>
          <Button
            onClick={handleExportCSV}
            size="sm"
            className="bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs h-8 rounded-xl font-black shadow-lg shadow-teal-500/20"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export (CSV)
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {/* Controls */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              Certified Compliance & Audit Report Generator
            </h2>
            <p className="text-xs text-slate-400">
              Generating dynamic audit extracts for <strong>{institutionSettings.name}</strong> (TIN: {institutionSettings.tin}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Select value={selectedReportType} onValueChange={setSelectedReportType}>
              <SelectTrigger className="w-64 bg-slate-950 border-white/10 text-xs rounded-xl h-9">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white text-xs">
                <SelectItem value="hrmis_statutory_payroll">HRMIS Statutory Payroll & Tax Schedule</SelectItem>
                <SelectItem value="nasscorp_pension">NASSCORP 10% Pension Contribution Remittance</SelectItem>
                <SelectItem value="crs_sow_dossier">CRS LLIN Temporary Workforce Audit Dossier</SelectItem>
                <SelectItem value="fims_ledger_balance">FIMS General Ledger Trial Balance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-slate-950 border-white/10 text-xs rounded-xl h-9">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white text-xs">
                <SelectItem value="current_month">August 2026</SelectItem>
                <SelectItem value="q3_2026">Q3 2026</SelectItem>
                <SelectItem value="ytd_2026">YTD 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Report Preview Canvas */}
        <Card className="rounded-3xl border border-white/10 bg-slate-900/90 text-white shadow-2xl overflow-hidden print:bg-white print:text-black">
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-teal-400 font-bold block">OFFICIAL AUDIT REPORT</span>
                <CardTitle className="text-lg font-black text-white mt-0.5">
                  {selectedReportType === "crs_sow_dossier" 
                    ? "CRS LLIN Mass Campaign • Temporary Workforce & SOW Audit Dossier"
                    : selectedReportType === "nasscorp_pension"
                    ? "NASSCORP Statutory Pension Remittance Statement"
                    : selectedReportType === "fims_ledger_balance"
                    ? "FIMS Executive General Ledger & Statement of Financial Position"
                    : "Corporate Statutory Payroll & LRA Withholding Tax Ledger"}
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  {institutionSettings.name} &bull; {institutionSettings.address} &bull; TIN: {institutionSettings.tin}
                </CardDescription>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-mono">
                ✓ Live Certified Real-Time
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {selectedReportType === "crs_sow_dossier" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                    <span className="text-[10px] text-slate-400">Registered Recruits</span>
                    <div className="text-xl font-bold text-white">{crsWorkers.length}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                    <span className="text-[10px] text-slate-400">Signed $129 Contracts</span>
                    <div className="text-xl font-bold text-emerald-400">{crsWorkers.filter((w: any) => w.byodConsentSigned).length}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                    <span className="text-[10px] text-slate-400">Total HHR Logged</span>
                    <div className="text-xl font-bold text-teal-400">{crsWorkers.reduce((acc: number, w: any) => acc + (w.actualHhrCompleted || 0), 0)}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                    <span className="text-[10px] text-slate-400">Total Payroll Due (USD)</span>
                    <div className="text-xl font-bold text-amber-400">${crsWorkers.reduce((acc: number, w: any) => acc + (w.dailyRateUsd * (w.contractWindowDays || 10)), 0).toLocaleString()}</div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase">
                      <tr>
                        <th className="p-3">Worker Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Catchment</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Contract Signed</th>
                        <th className="p-3 text-right">Daily Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                      {crsWorkers.length > 0 ? (
                        crsWorkers.map((w: any, idx: number) => (
                          <tr key={w.id || idx} className="hover:bg-slate-800/40">
                            <td className="p-3 font-bold text-white">{w.fullName}</td>
                            <td className="p-3">{w.phone}</td>
                            <td className="p-3">{w.healthFacilityCatchment}</td>
                            <td className="p-3">{w.role}</td>
                            <td className="p-3">
                              {w.byodConsentSigned ? (
                                <span className="text-emerald-400 font-bold">✓ Signed</span>
                              ) : (
                                <span className="text-amber-400 font-bold">Pending</span>
                              )}
                            </td>
                            <td className="p-3 text-right font-bold text-emerald-400">${w.dailyRateUsd}/day</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-500 italic">
                            No temporary workforce records registered in live database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                    <span className="text-[10px] text-slate-400">Active Staff</span>
                    <div className="text-xl font-bold text-white">{corporateEmployees.length}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                    <span className="text-[10px] text-slate-400">Gross Payroll (USD)</span>
                    <div className="text-xl font-bold text-emerald-400">${corporateEmployees.reduce((acc: number, e: any) => acc + (e.baseSalaryUsd || 0), 0).toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                    <span className="text-[10px] text-slate-400">NASSCORP (4.75%)</span>
                    <div className="text-xl font-bold text-indigo-400">${Math.round(corporateEmployees.reduce((acc: number, e: any) => acc + (e.baseSalaryUsd || 0), 0) * 0.0475).toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                    <span className="text-[10px] text-slate-400">LRA PIT Tax (12%)</span>
                    <div className="text-xl font-bold text-amber-400">${Math.round(corporateEmployees.reduce((acc: number, e: any) => acc + (e.baseSalaryUsd || 0), 0) * 0.12).toLocaleString()}</div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Employee Name</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Role</th>
                        <th className="p-3 text-right">Base Salary</th>
                        <th className="p-3 text-right">NASSCORP</th>
                        <th className="p-3 text-right">LRA Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                      {corporateEmployees.length > 0 ? (
                        corporateEmployees.map((e: any, idx: number) => (
                          <tr key={e.id || idx} className="hover:bg-slate-800/40">
                            <td className="p-3 font-bold text-indigo-400">{e.employeeCode}</td>
                            <td className="p-3 font-bold text-white">{e.firstName} {e.lastName}</td>
                            <td className="p-3">{e.department}</td>
                            <td className="p-3">{e.role}</td>
                            <td className="p-3 text-right font-bold text-emerald-400">${(e.baseSalaryUsd || 0).toLocaleString()}</td>
                            <td className="p-3 text-right font-bold text-indigo-300">${Math.round((e.baseSalaryUsd || 0) * 0.0475).toLocaleString()}</td>
                            <td className="p-3 text-right font-bold text-amber-300">${Math.round((e.baseSalaryUsd || 0) * 0.12).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-500 italic">
                            No corporate employees registered in live database. Add employees via the HRMIS Suite to generate live payroll schedules.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
