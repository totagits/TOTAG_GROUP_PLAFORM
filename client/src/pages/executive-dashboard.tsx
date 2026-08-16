import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Layers,
  Ship,
  Fuel,
  HardHat,
  ShoppingBag,
  Laptop,
  Utensils,
  BookOpen,
  Sun,
  FileCheck,
  Zap,
  Globe
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ExecutiveDashboardPage() {
  const { data: metricsData, isLoading } = useQuery({
    queryKey: ["/api/executive/metrics"],
  });

  const metrics = (metricsData as any) || {
    groupRevenueUsd: 1428500,
    grossMarginPercentage: 38.4,
    cashPositionUsd: 840200,
    receivablesUsd: 312000,
    activeContractsCount: 14,
    activeCargoJobsCount: 8,
    activePetroleumDeliveriesCount: 6,
    activeConstructionRentalsCount: 11,
    activeStationeryOrdersCount: 18,
    subsidiariesPerformance: [
      { name: "TOTAG Cargo Handling", revenueUsd: 320000, margin: 42.1, status: "Optimal", icon: Ship, color: "text-sky-400" },
      { name: "TOTAG Petroleum Services", revenueUsd: 410000, margin: 28.5, status: "Optimal", icon: Fuel, color: "text-amber-400" },
      { name: "TOTAG General Construction", revenueUsd: 280000, margin: 34.0, status: "Optimal", icon: HardHat, color: "text-yellow-400" },
      { name: "TOTAG IT Services & SaaS", revenueUsd: 195000, margin: 68.2, status: "Optimal", icon: Laptop, color: "text-blue-400" },
      { name: "TOTAG General Merchandise", revenueUsd: 140000, margin: 31.4, status: "Optimal", icon: ShoppingBag, color: "text-purple-400" },
      { name: "TOTAG Catering (TCEPS)", revenueUsd: 85000, margin: 36.8, status: "Optimal", icon: Utensils, color: "text-red-400" },
      { name: "TOTAG FARM", revenueUsd: 62000, margin: 45.0, status: "Optimal", icon: Zap, color: "text-emerald-400" },
      { name: "TOTAG Stationery Supplies", revenueUsd: 48000, margin: 29.0, status: "Optimal", icon: BookOpen, color: "text-teal-400" },
      { name: "TOTAG Solar Energy", revenueUsd: 88000, margin: 41.5, status: "Optimal", icon: Sun, color: "text-amber-300" },
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        
        {/* Command Center Banner */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border-2 border-slate-800 text-white shadow-2xl">
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black mb-3">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Executive Command Center • Real-Time Group Telemetry</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                TOTAG Group <span className="text-emerald-400">Executive Control Tower</span>
              </h1>
              <p className="text-sm text-slate-300 font-semibold mt-1">
                Unified real-time consolidated financial performance, subsidiary profitability, cash position, and risk exposure.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="text-right p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Consolidated Group Revenue</span>
                <span className="text-3xl font-black text-emerald-400">${metrics.groupRevenueUsd.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Group Executive Top-Line KPI Cards */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-2 shadow-xl">
              <div className="flex justify-between items-center text-xs text-slate-300 font-extrabold uppercase tracking-wider">
                <span>Group Cash Position</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">
                ${metrics.cashPositionUsd.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
              </div>
              <div className="text-xs text-emerald-400 flex items-center font-black">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> +14.2% Month-on-Month
              </div>
            </div>

            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-2 shadow-xl">
              <div className="flex justify-between items-center text-xs text-slate-300 font-extrabold uppercase tracking-wider">
                <span>Group Gross Margin</span>
                <PieChart className="w-5 h-5 text-sky-400" />
              </div>
              <div className="text-3xl font-black text-sky-400">
                {metrics.grossMarginPercentage}%
              </div>
              <div className="text-xs text-sky-400 flex items-center font-black">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> Optimal Margin Efficiency
              </div>
            </div>

            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-2 shadow-xl">
              <div className="flex justify-between items-center text-xs text-slate-300 font-extrabold uppercase tracking-wider">
                <span>Accounts Receivable</span>
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400">
                ${metrics.receivablesUsd.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
              </div>
              <div className="text-xs text-amber-400 flex items-center font-black">
                <span>12 Active Institutional Receivables</span>
              </div>
            </div>

            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-2 shadow-xl">
              <div className="flex justify-between items-center text-xs text-slate-300 font-extrabold uppercase tracking-wider">
                <span>Active Agency Contracts</span>
                <FileCheck className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-purple-400">
                {metrics.activeContractsCount} Contracts
              </div>
              <div className="text-xs text-purple-400 flex items-center font-black">
                <span>UNDP, WFP, Ministries, Commercial</span>
              </div>
            </div>

          </div>
        </section>

        {/* 2. All 9 Subsidiaries Profitability & Performance Breakdown */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-emerald-400" />
                <span>9 Specialized Subsidiaries Financial & Operational Performance</span>
              </h2>
              <p className="text-xs text-slate-300 font-semibold mt-1">
                Real-time breakdown of revenue contribution, gross profit margin, and operational status per TOTAG business division.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metrics.subsidiariesPerformance.map((sub: any, i: number) => (
                <div 
                  key={i} 
                  className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-3 hover:border-emerald-500 transition-all shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                      {sub.status}
                    </span>
                    <span className="text-xs font-black text-sky-400">{sub.margin}% Margin</span>
                  </div>

                  <h3 className="text-base font-black text-white">{sub.name}</h3>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-300 font-bold">Revenue Contribution:</span>
                    <span className="text-lg font-black text-emerald-400">
                      ${sub.revenueUsd.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
