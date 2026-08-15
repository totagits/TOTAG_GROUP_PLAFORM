import React, { useState } from 'react';
import {
  UserCheck,
  MapPin,
  WifiOff,
  CopyCheck,
  ShieldCheck,
  Layers,
  QrCode,
  CreditCard,
  User,
  BarChart3,
  HelpCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Building2,
  Lock
} from 'lucide-react';
import type { UserRole, UserAssignment } from '../types';
import { ROLE_DEFINITIONS } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  assignment: UserAssignment;
  onOpenAssignmentModal: () => void;
  unreadGrievanceCount: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  allowedRoles?: UserRole[]; // If omitted or contains SYSTEM_ADMINISTRATOR, checked dynamically
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  setActiveTab,
  assignment,
  onOpenAssignmentModal,
  unreadGrievanceCount
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const roleMeta = ROLE_DEFINITIONS[currentRole];

  // Helper to determine if a menu tab is authorized for currentRole
  const isMenuAllowed = (tabId: string): boolean => {
    // SYSTEM_ADMINISTRATOR & MINISTRY_ADMINISTRATOR see ALL menus
    if (currentRole === 'SYSTEM_ADMINISTRATOR' || currentRole === 'MINISTRY_ADMINISTRATOR') {
      return true;
    }

    switch (tabId) {
      case 'portal':
        return [
          'FARMER',
          'HOUSEHOLD_REP',
          'COOPERATIVE_REP',
          'EXTENSION_AGENT'
        ].includes(currentRole);

      case 'registration':
        return [
          'FARMER',
          'ENUMERATOR',
          'SENIOR_ENUMERATOR',
          'HOUSEHOLD_REP'
        ].includes(currentRole);

      case 'gis':
        return [
          'FARMER',
          'ENUMERATOR',
          'SENIOR_ENUMERATOR',
          'GIS_OFFICER',
          'COUNTY_AGRICULTURAL_OFFICER',
          'DISTRICT_AGRICULTURAL_OFFICER'
        ].includes(currentRole);

      case 'offline':
        return [
          'ENUMERATOR',
          'SENIOR_ENUMERATOR',
          'EXTENSION_AGENT'
        ].includes(currentRole);

      case 'duplicates':
        return [
          'SENIOR_ENUMERATOR',
          'VERIFICATION_OFFICER',
          'COUNTY_AGRICULTURAL_OFFICER',
          'SYSTEM_ADMINISTRATOR'
        ].includes(currentRole);

      case 'verification':
        return [
          'SENIOR_ENUMERATOR',
          'VERIFICATION_OFFICER',
          'COUNTY_AGRICULTURAL_OFFICER',
          'DISTRICT_AGRICULTURAL_OFFICER'
        ].includes(currentRole);

      case 'programs':
        return [
          'PROGRAM_OFFICER',
          'MONITORING_EVALUATION_OFFICER'
        ].includes(currentRole);

      case 'vouchers':
        return [
          'FARMER',
          'VOUCHER_ADMINISTRATOR',
          'INPUT_DISTRIBUTION_OFFICER',
          'COOPERATIVE_REP'
        ].includes(currentRole);

      case 'payments':
        return [
          'PAYMENT_OFFICER'
        ].includes(currentRole);

      case 'dashboards':
        return [
          'MONITORING_EVALUATION_OFFICER',
          'DATA_ANALYST',
          'DEVELOPMENT_PARTNER',
          'READONLY_OVERSIGHT',
          'COUNTY_AGRICULTURAL_OFFICER',
          'DISTRICT_AGRICULTURAL_OFFICER'
        ].includes(currentRole);

      case 'grievances':
        return [
          'HELPDESK_OFFICER',
          'FARMER',
          'HOUSEHOLD_REP'
        ].includes(currentRole);

      case 'audit':
        return [
          'SECURITY_AUDITOR',
          'INDEPENDENT_AUDITOR'
        ].includes(currentRole);

      default:
        return false;
    }
  };

  const isFarmerGroup = ['FARMER', 'HOUSEHOLD_REP', 'COOPERATIVE_REP'].includes(currentRole);

  // Menu items list with dynamic role labels
  const ALL_MENUS: MenuItem[] = [
    { id: 'portal', label: isFarmerGroup ? 'My Portal & Wallet' : 'Farmer Self-Service', icon: User },
    { id: 'registration', label: isFarmerGroup ? 'Register / Update My Farm' : 'Farmer Registration Wizard', icon: UserCheck },
    { id: 'gis', label: isFarmerGroup ? 'My GIS Farm Parcels' : 'GIS Parcel Mapping', icon: MapPin },
    { id: 'offline', label: 'Field App (PWA)', icon: WifiOff, badge: 'Offline Mode' },
    { id: 'duplicates', label: 'Duplicate Workbench', icon: CopyCheck, badge: '2 Alerts', badgeColor: 'bg-amber-500' },
    { id: 'verification', label: 'Verifications Desk', icon: ShieldCheck, badge: '3 Pending' },
    { id: 'programs', label: 'Programs & Eligibility', icon: Layers },
    { id: 'vouchers', label: isFarmerGroup ? 'My Input Vouchers' : 'Digital Vouchers', icon: QrCode },
    { id: 'payments', label: 'Mobile Money Payouts', icon: CreditCard },
    { id: 'dashboards', label: 'Executive Analytics', icon: BarChart3 },
    { id: 'grievances', label: isFarmerGroup ? 'Helpdesk & Appeals' : 'Grievances & Helpdesk', icon: HelpCircle, badge: unreadGrievanceCount || undefined, badgeColor: 'bg-rose-500' },
    { id: 'audit', label: 'Audit Trail & Logs', icon: FileText }
  ];

  const permittedMenus = ALL_MENUS.filter((m) => isMenuAllowed(m.id));

  return (
    <aside
      className={`glass-panel text-slate-300 border-r border-white/10 transition-all duration-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] backdrop-blur-xl ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header / Role Summary */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <div className="text-[10px] font-black text-gradient-gold uppercase tracking-wider">
              {roleMeta?.category?.replace('_', ' ')}
            </div>
            <div className="text-xs font-extrabold text-white truncate max-w-[170px]" title={roleMeta?.title}>
              {roleMeta?.title}
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-white/10 rounded-xl transition-all hover:scale-[1.05]"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ABAC Scope Quick Pin Card */}
      {!isCollapsed && (
        <div className="m-3 p-3 glass-card space-y-1 text-[11px]">
          <div className="flex items-center justify-between font-bold text-amber-300">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Scope Pins
            </span>
            <button
              onClick={onOpenAssignmentModal}
              className="text-[9px] bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-2 py-0.5 rounded-lg shadow-sm hover:brightness-110"
            >
              Edit ABAC
            </button>
          </div>
          <div className="text-slate-200 truncate font-semibold">
            {assignment.organization}
          </div>
          <div className="text-slate-400 flex items-center justify-between text-[10px]">
            <span>{assignment.county} ({assignment.district})</span>
            <span className="text-emerald-400 font-mono font-bold">${assignment.approvalLimitUSD / 1000}k Limit</span>
          </div>
        </div>
      )}

      {/* Dynamic RBAC Permitted Navigation Links */}
      <nav className="flex-1 px-2 py-3 space-y-1.5 overflow-y-auto">
        <div className={`px-2 pb-1 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? 'Tools' : `Permitted Tools (${permittedMenus.length})`}
        </div>

        {permittedMenus.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/30'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={item.label}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[9px] font-extrabold text-slate-950 px-2 py-0.5 rounded-full shadow-xs ${
                    item.badgeColor || 'bg-amber-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {permittedMenus.length === 0 && !isCollapsed && (
          <div className="p-3 text-[11px] text-slate-400 italic text-center">
            No tools assigned to this role. Please use the ABAC Config button to update your assignment.
          </div>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Lock className="w-3.5 h-3.5" /> RBAC Enforced
          </div>
        )}
        <div className="text-[10px] text-slate-500 font-mono">v2.6 Glass</div>
      </div>
    </aside>
  );
};
