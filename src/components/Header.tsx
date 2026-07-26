import React from 'react';
import { Eye, Globe, UserCheck } from 'lucide-react';
import type { UserRole, UserAssignment } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  assignment: UserAssignment;
  onOpenAssignmentModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  unreadGrievanceCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  assignment,
  onOpenAssignmentModal,
  activeTab,
  setActiveTab,
  isHighContrast,
  setIsHighContrast,
  isOffline,
  setIsOffline,
  unreadGrievanceCount = 0
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top Disclaimer & Network Status Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white font-bold text-[10px] uppercase px-1.5 py-0.5 rounded-sm">
            Prototype Concept
          </span>
          <span className="hidden md:inline">
            Liberia Digital Public Infrastructure • Stakeholder Demonstration Model
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Network Simulator Toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              isOffline
                ? 'bg-amber-500 text-slate-950 animate-pulse-subtle'
                : 'bg-emerald-800/80 text-emerald-200 hover:bg-emerald-800'
            }`}
            title="Toggle simulated connectivity mode for low-bandwidth rural operations"
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-950' : 'bg-emerald-400'}`} />
            {isOffline ? 'Offline Field Mode' : 'Online Sync Active'}
          </button>

          {/* High Contrast Accessibility Toggle */}
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            title="Toggle Accessibility Contrast Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Accessibility Mode</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 text-slate-400">
            <Globe className="w-3.5 h-3.5" />
            <span>EN (Liberia)</span>
          </div>
        </div>
      </div>

      {/* Main Header with Official Provided Logo Assets */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Ministry of Agriculture Liberia Logo */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0">
            <img
              src="/moa_logo.png"
              alt="Ministry of Agriculture Liberia Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wide text-emerald-800 uppercase">
              Republic of Liberia
            </div>
            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
              Ministry of Agriculture
            </h1>
            <div className="text-[10px] text-slate-500 font-medium">
              Digital Farmer Registry Platform (LDFR)
            </div>
          </div>
        </div>

        {/* Center: Hero Platform Tagline */}
        <div className="hidden lg:block text-center max-w-xs">
          <div className="text-xs font-bold text-emerald-800 tracking-tight">
            Every Farmer Counted. Every Farm Connected.
          </div>
          <div className="text-[11px] text-slate-500 italic">
            Every Opportunity Delivered.
          </div>
        </div>

        {/* Right: FAO UN Partner Logo */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0">
            <img
              src="/fao_logo.png"
              alt="Food and Agriculture Organization FAO Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Quick Role Switcher Dropdown & ABAC Policy Button */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right mb-0.5">
                Active Target Role (23 Roles)
              </div>
              <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-2"
                >
                  <optgroup label="Farmer & Community Roles">
                    <option value="FARMER">Farmer (Self-Service)</option>
                    <option value="HOUSEHOLD_REP">Farmer Household Representative</option>
                    <option value="COOPERATIVE_REP">Cooperative Representative</option>
                  </optgroup>

                  <optgroup label="Field Operations & Extension">
                    <option value="ENUMERATOR">Enumerator</option>
                    <option value="SENIOR_ENUMERATOR">Senior Enumerator</option>
                    <option value="EXTENSION_AGENT">Extension Agent</option>
                  </optgroup>

                  <optgroup label="County & District Officers">
                    <option value="COUNTY_AGRICULTURAL_OFFICER">County Agricultural Officer</option>
                    <option value="DISTRICT_AGRICULTURAL_OFFICER">District Agricultural Officer</option>
                    <option value="VERIFICATION_OFFICER">Verification Officer</option>
                  </optgroup>

                  <optgroup label="Programs, Vouchers & Payments">
                    <option value="PROGRAM_OFFICER">Program Officer</option>
                    <option value="VOUCHER_ADMINISTRATOR">Voucher Administrator</option>
                    <option value="INPUT_DISTRIBUTION_OFFICER">Input-Distribution Officer</option>
                    <option value="PAYMENT_OFFICER">Payment & Mobile Money Officer</option>
                  </optgroup>

                  <optgroup label="Analytics, M&E & GIS">
                    <option value="MONITORING_EVALUATION_OFFICER">Monitoring & Evaluation Officer</option>
                    <option value="GIS_OFFICER">GIS & Remote Sensing Officer</option>
                    <option value="DATA_ANALYST">Data Analyst</option>
                  </optgroup>

                  <optgroup label="Governance, Administration & Audit">
                    <option value="HELPDESK_OFFICER">Help-Desk Officer</option>
                    <option value="DEVELOPMENT_PARTNER">Development-Partner User (FAO / Donors)</option>
                    <option value="MINISTRY_ADMINISTRATOR">Ministry Administrator</option>
                    <option value="SYSTEM_ADMINISTRATOR">System Administrator</option>
                    <option value="SECURITY_AUDITOR">Security Auditor</option>
                    <option value="READONLY_OVERSIGHT">Read-Only Oversight User</option>
                    <option value="INDEPENDENT_AUDITOR">Independent Audit User</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* ABAC Policy Scope Configurator Button */}
            <div className="pt-3">
              <button
                onClick={onOpenAssignmentModal}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                title={`ABAC Assignment (${assignment.organization} — ${assignment.county} County)`}
              >
                <span>ABAC Config</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Primary Navigation Tabs */}
      <nav className="bg-emerald-950 text-white px-4">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto no-scrollbar gap-1 text-xs">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'landing'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Public Landing Page
          </button>

          <button
            onClick={() => setActiveTab('registration')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'registration'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Farmer Registration
          </button>

          <button
            onClick={() => setActiveTab('gis')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'gis'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            GIS Parcel Mapping
          </button>

          <button
            onClick={() => setActiveTab('offline')}
            className={`px-4 py-3 font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'offline'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Field App (PWA)
            {isOffline && (
              <span className="bg-amber-400 text-slate-950 font-extrabold text-[9px] px-1 rounded">
                OFFLINE
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('duplicates')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'duplicates'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Duplicate Engine
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'verification'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Verifications
          </button>

          <button
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'programs'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Programs & Eligibility
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'vouchers'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Digital Vouchers
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'payments'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Mobile Money Payouts
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'portal'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Farmer Self-Service
          </button>

          <button
            onClick={() => setActiveTab('dashboards')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'dashboards'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Executive Analytics
          </button>

          <button
            onClick={() => setActiveTab('grievances')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1 ${
              activeTab === 'grievances'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Grievances & Helpdesk
            {unreadGrievanceCount > 0 && (
              <span className="bg-rose-500 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                {unreadGrievanceCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'audit'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            Audit Trail
          </button>
        </div>
      </nav>
    </header>
  );
};
