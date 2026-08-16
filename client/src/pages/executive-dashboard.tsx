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
      { name: "TOTAG Cargo Handling", revenueUsd: 320000, margin: 42.1, status: "Optimal", icon: Ship, color: "text-sky-500" },
      { name: "TOTAG Petroleum Services", revenueUsd: 410000, margin: 28.5, status: "Optimal", icon: Fuel, color: "text-amber-500" },
      { name: "TOTAG General Construction", revenueUsd: 280000, margin: 34.0, status: "Optimal", icon: HardHat, color: "text-yellow-600" },
      { name: "TOTAG IT Services & SaaS", revenueUsd: 195000, margin: 68.2, status: "Optimal", icon: Laptop, color: "text-blue-500" },
      { name: "TOTAG General Merchandise", revenueUsd: 140000, margin: 31.4, status: "Optimal", icon: ShoppingBag, color: "text-purple-500" },
      { name: "TOTAG Catering (TCEPS)", revenueUsd: 85000, margin: 36.8, status: "Optimal", icon: Utensils, color: "text-red-500" },
      { name: "TOTAG FARM", revenueUsd: 62000, margin: 45.0, status: "Optimal", icon: Zap, color: "text-emerald-500" },
      { name: "TOTAG Stationery Supplies", revenueUsd: 48000, margin: 29.0, status: "Optimal", icon: BookOpen, color: "text-teal-500" },
      { name: "TOTAG Solar Energy", revenueUsd: 88000, margin: 41.5, status: "Optimal", icon: Sun, color: "text-amber-400" },
    ]
  };

  return (
    <div className="min-h-screen bg-mesh-glass text-slate-900 dark:text-white">
      <Header />
      
      <main className="pt-28 pb-20">
        
        {/* Command Center Banner */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 border border-white/10 text-white shadow-2xl">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>Executive Command Center • Real-Time Group Telemetry</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                TOTAG Group <span className="text-emerald-400">Executive Control Tower</span>
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Unified real-time consolidated financial performance, subsidiary profitability, cash position, and risk exposure.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="text-right p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block font-semibold">Consolidated Group Revenue</span>
                <span className="text-2xl font-extrabold text-emerald-400">${metrics.groupRevenueUsd.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Group Executive Top-Line KPI Cards */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Card className="glass-card p-5 border-white/60 dark:border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                <span>Group Cash Position</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                ${metrics.cashPositionUsd.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
              </div>
              <div className="text-[11px] text-emerald-500 flex items-center font-bold">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2% Month-on-Month
              </div>
            </Card>

            <Card className="glass-card p-5 border-white/60 dark:border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                <span>Group Gross Margin</span>
                <PieChart className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">
                {metrics.grossMarginPercentage}%
              </div>
              <div className="text-[11px] text-sky-500 flex items-center font-bold">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Optimal Margin Efficiency
              </div>
            </Card>

            <Card className="glass-card p-5 border-white/60 dark:border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                <span>Accounts Receivable</span>
                <BarChart3 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                ${metrics.receivablesUsd.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
              </div>
              <div className="text-[11px] text-amber-500 flex items-center font-bold">
                <span>12 Active Institutional Receivables</span>
              </div>
            </Card>

            <Card className="glass-card p-5 border-white/60 dark:border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                <span>Active Agency Contracts</span>
                <FileCheck className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                {metrics.activeContractsCount} Contracts
              </div>
              <div className="text-[11px] text-purple-500 flex items-center font-bold">
                <span>UNDP, WFP, Ministries, Commercial</span>
              </div>
            </Card>

          </div>
        </section>

        {/* 2. All 9 Subsidiaries Profitability & Performance Breakdown */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <Card className="glass-card border-white/60 dark:border-white/10 shadow-2xl">
            <CardHeader className="border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <span>9 Specialized Subsidiaries Financial & Operational Performance</span>
              </CardTitle>
              <CardDescription>
                Real-time breakdown of revenue contribution, gross profit margin, and operational status per TOTAG business division.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.subsidiariesPerformance.map((sub: any, i: number) => (
                  <div 
                    key={i} 
                    className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 hover:scale-[1.02] transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        {sub.status}
                      </span>
                      <span className="text-xs font-bold text-sky-500">{sub.margin}% Margin</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sub.name}</h4>

                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold">Revenue Contribution:</span>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        ${sub.revenueUsd.toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

      </main>

      <Footer />
    </div>
  );
}
