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
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenPwaModal: () => void;
  onOpenRtmModal?: () => void;
  onResetDatabase?: () => void;
  onExportSnapshot?: () => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  assignment,
  onOpenAssignmentModal,
  activeTab,
  setActiveTab,
  onOpenAbout,
  onOpenContact,
  onOpenPwaModal,
  onOpenRtmModal,
  onResetDatabase,
  onExportSnapshot,
  isHighContrast,
  setIsHighContrast,
  isOffline,
  setIsOffline
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top Disclaimer & Network Status Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-sky-600 text-white font-bold text-[10px] uppercase px-1.5 py-0.5 rounded-sm">
            FAO Initiative
          </span>
          <span className="hidden md:inline font-medium">
            Food and Agriculture Organization (FAO) • In Technical Collaboration with Ministry of Agriculture (MoA) Liberia
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

      {/* Main Header with FAO Highlighted as Primary Requesting Entity */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: FAO UN Highlighted Primary Logo & Organization Name */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white border-2 border-sky-600 rounded-full flex items-center justify-center p-1 shadow-md overflow-hidden shrink-0">
            <img
              src="/fao_logo.png"
              alt="Food and Agriculture Organization FAO Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-[11px] font-extrabold tracking-wide text-sky-800 uppercase flex items-center gap-1">
              <span>United Nations Specialized Agency</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Food and Agriculture Organization (FAO)
            </h1>
            <div className="text-[11px] text-emerald-800 font-bold">
              In Technical Collaboration with Ministry of Agriculture (MoA Liberia)
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

        {/* Right: Ministry of Agriculture Collaborating Logo & Role Switcher */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0" title="Ministry of Agriculture (MoA) Liberia - Collaborating Ministry">
            <img
              src="/moa_logo.png"
              alt="Ministry of Agriculture Liberia Logo"
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

            {/* ABAC Policy Scope & Interoperability Data Hub Tools */}
            {activeTab !== 'landing' && (
              <div className="pt-3 flex items-center gap-1.5">
                {onOpenRtmModal && (
                  <button
                    onClick={onOpenRtmModal}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                    title="Open Requirements Traceability Matrix & Master Proposal Reconciliation Engine"
                  >
                    <span>RTM Engine</span>
                  </button>
                )}

                <button
                  onClick={onOpenAssignmentModal}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  title={`ABAC Assignment (${assignment.organization} — ${assignment.county} County)`}
                >
                  <span>ABAC Config</span>
                </button>

                {onExportSnapshot && (
                  <button
                    onClick={onExportSnapshot}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
                    title="Export complete 12-module platform JSON database snapshot for FAO audit"
                  >
                    Snapshot
                  </button>
                )}

                {onResetDatabase && (
                  <button
                    onClick={onResetDatabase}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
                    title="Reset all tables to official seed baseline"
                  >
                    Reset DB
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* General Public Top Navigation Bar (Home, About Us, Contact, Public Directory) */}
      <nav className="bg-emerald-950 text-white px-4 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-3 font-bold transition-colors border-b-2 ${
                activeTab === 'landing'
                  ? 'border-amber-400 text-amber-300 bg-emerald-900/60'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30'
              }`}
            >
              Home (Public Portal)
            </button>

            <button
              onClick={onOpenAbout}
              className="px-4 py-3 font-semibold border-b-2 border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30 transition-colors"
            >
              About FAO &amp; MoA Initiative
            </button>

            <button
              onClick={onOpenContact}
              className="px-4 py-3 font-semibold border-b-2 border-transparent text-slate-300 hover:text-white hover:bg-emerald-900/30 transition-colors"
            >
              Contact &amp; Support Directory
            </button>

            <button
              onClick={onOpenPwaModal}
              className="px-3.5 py-1.5 my-2 ml-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Install Mobile App</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-sky-200">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>FAO UN Technical Assistance Project</span>
          </div>
        </div>
      </nav>
    </header>
  );
};
