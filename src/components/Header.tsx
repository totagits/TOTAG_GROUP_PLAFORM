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
    <header className="glass-header sticky top-0 z-50 shadow-2xl">
      {/* Top Disclaimer & Network Status Bar */}
      <div className="bg-slate-950/90 border-b border-white/10 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center gap-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm">
            TOTAG OF COMPANIES LTD Platform
          </span>
          <span className="hidden md:inline font-medium text-slate-300">
            FAO UN RFP 137641 • Technical Collaboration with Ministry of Agriculture (MoA) Liberia
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Network Simulator Toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-300 border ${
              isOffline
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse-subtle'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
            }`}
            title="Toggle simulated connectivity mode for low-bandwidth rural operations"
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            {isOffline ? 'Offline Field Mode' : 'Online Sync Active'}
          </button>

          {/* High Contrast Accessibility Toggle */}
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-[11px]"
            title="Toggle Accessibility Contrast Mode"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Accessibility</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>EN (Liberia)</span>
          </div>
        </div>
      </div>

      {/* Main Header with TOTAG OF COMPANIES LTD & FAO UN Highlighted Logos */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: TOTAG OF COMPANIES LTD & FAO UN Primary Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-slate-900 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center p-1 shadow-lg shadow-emerald-500/10 overflow-hidden shrink-0">
            <img
              src="/fao_logo.png"
              alt="Food and Agriculture Organization FAO Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-[10px] font-black tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
              <span>TOTAG OF COMPANIES LTD</span>
              <span className="text-slate-500">•</span>
              <span className="text-sky-400 font-bold">FAO UN RFP 137641</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white leading-tight tracking-tight flex items-center gap-2">
              <span>Liberia Digital Farmer Registry</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                v2.6 Enterprise Glass
              </span>
            </h1>
            <div className="text-[11px] text-slate-400 font-medium">
              Food and Agriculture Organization (FAO) &amp; MoA Liberia Collaboration
            </div>
          </div>
        </div>

        {/* Center: Hero Platform Tagline */}
        <div className="hidden lg:block text-center max-w-xs">
          <div className="text-xs font-black text-gradient-emerald tracking-tight">
            Every Farmer Counted. Every Farm Connected.
          </div>
          <div className="text-[11px] text-slate-400 italic">
            Empowering Agricultural Resilience &amp; Traceability
          </div>
        </div>

        {/* Right: Ministry of Agriculture Logo & Role Switcher */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center p-1 shadow-md overflow-hidden shrink-0" title="Ministry of Agriculture (MoA) Liberia">
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
                Target Role (23 RBAC Profiles)
              </div>
              <div className="flex items-center gap-2 glass-panel hover:bg-slate-900/90 border border-white/15 px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-md">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-bold text-slate-100 focus:outline-none cursor-pointer pr-2"
                >
                  <optgroup label="Farmer & Community Roles" className="bg-slate-900 text-slate-100">
                    <option value="FARMER">Farmer (Self-Service)</option>
                    <option value="HOUSEHOLD_REP">Farmer Household Representative</option>
                    <option value="COOPERATIVE_REP">Cooperative Representative</option>
                  </optgroup>

                  <optgroup label="Field Operations & Extension" className="bg-slate-900 text-slate-100">
                    <option value="ENUMERATOR">Enumerator</option>
                    <option value="SENIOR_ENUMERATOR">Senior Enumerator</option>
                    <option value="EXTENSION_AGENT">Extension Agent</option>
                  </optgroup>

                  <optgroup label="County & District Officers" className="bg-slate-900 text-slate-100">
                    <option value="COUNTY_AGRICULTURAL_OFFICER">County Agricultural Officer</option>
                    <option value="DISTRICT_AGRICULTURAL_OFFICER">District Agricultural Officer</option>
                    <option value="VERIFICATION_OFFICER">Verification Officer</option>
                  </optgroup>

                  <optgroup label="Programs, Vouchers & Payments" className="bg-slate-900 text-slate-100">
                    <option value="PROGRAM_OFFICER">Program Officer</option>
                    <option value="VOUCHER_ADMINISTRATOR">Voucher Administrator</option>
                    <option value="INPUT_DISTRIBUTION_OFFICER">Input-Distribution Officer</option>
                    <option value="PAYMENT_OFFICER">Payment & Mobile Money Officer</option>
                  </optgroup>

                  <optgroup label="Analytics, M&E & GIS" className="bg-slate-900 text-slate-100">
                    <option value="MONITORING_EVALUATION_OFFICER">Monitoring & Evaluation Officer</option>
                    <option value="GIS_OFFICER">GIS & Remote Sensing Officer</option>
                    <option value="DATA_ANALYST">Data Analyst</option>
                  </optgroup>

                  <optgroup label="Governance, Administration & Audit" className="bg-slate-900 text-slate-100">
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

            {/* System Administrative & Audit Tools */}
            {activeTab !== 'landing' && (
              <div className="pt-3 flex items-center gap-1.5">
                {(currentRole === 'SYSTEM_ADMINISTRATOR' || currentRole === 'MINISTRY_ADMINISTRATOR' || currentRole === 'SECURITY_AUDITOR' || currentRole === 'DEVELOPMENT_PARTNER') && onOpenRtmModal && (
                  <button
                    onClick={onOpenRtmModal}
                    className="bg-emerald-600/80 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-all shadow-md cursor-pointer backdrop-blur-md border border-emerald-400/30 hover:scale-[1.03]"
                    title="Open Requirements Traceability Matrix & Master Proposal Reconciliation Engine"
                  >
                    <span>RTM Engine</span>
                  </button>
                )}

                {(currentRole === 'SYSTEM_ADMINISTRATOR' || currentRole === 'MINISTRY_ADMINISTRATOR' || currentRole === 'SECURITY_AUDITOR') && (
                  <button
                    onClick={onOpenAssignmentModal}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.03]"
                    title={`ABAC Assignment (${assignment.organization} — ${assignment.county} County)`}
                  >
                    <span>ABAC Config</span>
                  </button>
                )}

                {(currentRole === 'SYSTEM_ADMINISTRATOR' || currentRole === 'MINISTRY_ADMINISTRATOR' || currentRole === 'SECURITY_AUDITOR' || currentRole === 'DEVELOPMENT_PARTNER') && onExportSnapshot && (
                  <button
                    onClick={onExportSnapshot}
                    className="bg-sky-600/80 hover:bg-sky-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-xs transition-all shadow-md cursor-pointer border border-sky-400/30 hover:scale-[1.03]"
                    title="Export complete 12-module platform JSON database snapshot for FAO audit"
                  >
                    Snapshot
                  </button>
                )}

                {currentRole === 'SYSTEM_ADMINISTRATOR' && onResetDatabase && (
                  <button
                    onClick={onResetDatabase}
                    className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-all shadow-md cursor-pointer border border-white/10 hover:scale-[1.03]"
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

      {/* General Public Top Navigation Bar */}
      <nav className="bg-slate-950/80 border-t border-white/10 px-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-3 font-bold transition-all border-b-2 ${
                activeTab === 'landing'
                  ? 'border-emerald-400 text-emerald-400 bg-white/5'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home (Public Portal)
            </button>

            <button
              onClick={onOpenAbout}
              className="px-4 py-3 font-semibold border-b-2 border-transparent text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              About TOTAG &amp; FAO Initiative
            </button>

            <button
              onClick={onOpenContact}
              className="px-4 py-3 font-semibold border-b-2 border-transparent text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Contact &amp; Support Directory
            </button>

            <button
              onClick={onOpenPwaModal}
              className="px-3.5 py-1.5 my-2 ml-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md hover:scale-[1.03]"
            >
              <span>Install Mobile App</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-sky-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>FAO UN Technical Assistance Project • TOTAG Platform</span>
          </div>
        </div>
      </nav>
    </header>
  );
};
