import React from 'react';
import { ShieldCheck, Building2, MapPin, Layers, KeyRound, X, CheckCircle2, Lock } from 'lucide-react';
import { ROLE_DEFINITIONS } from '../types';
import type { UserAssignment, UserRole, DataSensitivityLevel } from '../types';
import { LIBERIA_COUNTIES } from '../data/liberiaGeo';

interface AssignmentSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: UserAssignment;
  onUpdateAssignment: (updated: UserAssignment) => void;
}

export const AssignmentSwitcherModal: React.FC<AssignmentSwitcherModalProps> = ({
  isOpen,
  onClose,
  assignment,
  onUpdateAssignment
}) => {
  if (!isOpen) return null;

  const currentRoleMeta = ROLE_DEFINITIONS[assignment.userRole];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 border-b border-slate-100 pb-4 mb-6">
          <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-center text-emerald-800 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              ABAC & Security Assignment Configuration
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
                Active Policy Context
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure granular Organization, Program, Geographic Jurisdiction, Data Sensitivity, and Approval Limits for your active turn.
            </p>
          </div>
        </div>

        {/* Form Fields for 10 ABAC Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Dimension 1: User Role */}
          <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>1. Target User Role (23 Roles)</span>
              <span className="text-[11px] font-normal text-emerald-700">Category: {currentRoleMeta?.category}</span>
            </label>
            <select
              value={assignment.userRole}
              onChange={(e) => {
                const role = e.target.value as UserRole;
                const meta = ROLE_DEFINITIONS[role];
                onUpdateAssignment({
                  ...assignment,
                  userRole: role,
                  dataSensitivity: meta.defaultSensitivity,
                  approvalLimitUSD: meta.maxApprovalLimitUSD,
                  permittedActions: meta.allowedActions
                });
              }}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {Object.values(ROLE_DEFINITIONS).map((r) => (
                <option key={r.code} value={r.code}>
                  {r.title} — [{r.category}]
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1.5 italic">
              {currentRoleMeta?.description}
            </p>
          </div>

          {/* Dimension 2: Organization */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              2. Operating Institution / Organization
            </label>
            <select
              value={assignment.organization}
              onChange={(e) => onUpdateAssignment({ ...assignment, organization: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium text-slate-800"
            >
              <option value="Ministry of Agriculture (MoA Liberia)">Ministry of Agriculture (MoA Liberia)</option>
              <option value="FAO United Nations Partner">FAO United Nations Partner</option>
              <option value="Lofa Smallholder Farmers Cooperative">Lofa Smallholder Farmers Cooperative</option>
              <option value="World Bank Rural Enterprise Project">World Bank Rural Enterprise Project</option>
              <option value="Independent Audit Authority Liberia">Independent Audit Authority Liberia</option>
            </select>
          </div>

          {/* Dimension 3: Program */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              3. Assigned Intervention Program
            </label>
            <select
              value={assignment.programId}
              onChange={(e) => {
                const pId = e.target.value;
                const pName = pId === 'PRG-2026-RICE' ? 'Rice Seed Support 2026' : pId === 'PRG-2026-CASSAVA' ? 'National Cassava Value-Addition' : 'All National Programs';
                onUpdateAssignment({ ...assignment, programId: pId, programName: pName });
              }}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium text-slate-800"
            >
              <option value="ALL_PROGRAMS">All National Programs (National Scope)</option>
              <option value="PRG-2026-RICE">Rice Seed Support 2026</option>
              <option value="PRG-2026-CASSAVA">National Cassava Value-Addition</option>
            </select>
          </div>

          {/* Dimension 4: County Jurisdiction */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              4. Geographic County Jurisdiction
            </label>
            <select
              value={assignment.county}
              onChange={(e) => onUpdateAssignment({ ...assignment, county: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium text-slate-800"
            >
              <option value="All Counties (National)">All Counties (National)</option>
              {LIBERIA_COUNTIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} County
                </option>
              ))}
            </select>
          </div>

          {/* Dimension 5: District Jurisdiction */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              5. District Jurisdiction
            </label>
            <input
              type="text"
              value={assignment.district}
              onChange={(e) => onUpdateAssignment({ ...assignment, district: e.target.value })}
              placeholder="e.g. Foya District or All Districts"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium text-slate-800"
            />
          </div>

          {/* Dimension 6: Data Sensitivity Level */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              6. Maximum Data Sensitivity Clearances
            </label>
            <select
              value={assignment.dataSensitivity}
              onChange={(e) => onUpdateAssignment({ ...assignment, dataSensitivity: e.target.value as DataSensitivityLevel })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-800"
            >
              <option value="PUBLIC">PUBLIC (Aggregated stats only)</option>
              <option value="INTERNAL">INTERNAL (Operational work plans)</option>
              <option value="CONFIDENTIAL">CONFIDENTIAL (Farmer profiles & farm records)</option>
              <option value="HIGHLY_RESTRICTED">HIGHLY_RESTRICTED (PII, National ID, Bank accounts)</option>
              <option value="AUDIT_RESTRICTED">AUDIT_RESTRICTED (Security logs & investigations)</option>
            </select>
          </div>

          {/* Dimension 7: Approval Limit USD */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              7. Financial & Administrative Approval Limit (USD)
            </label>
            <input
              type="number"
              value={assignment.approvalLimitUSD}
              onChange={(e) => onUpdateAssignment({ ...assignment, approvalLimitUSD: Number(e.target.value) })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-extrabold text-emerald-800"
            />
          </div>

          {/* Dimension 8: Delegation Status */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              8. Delegation & Authority Status
            </label>
            <select
              value={assignment.delegationStatus}
              onChange={(e) => onUpdateAssignment({ ...assignment, delegationStatus: e.target.value as any })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium text-slate-800"
            >
              <option value="DIRECT_AUTHORITY">Direct Substantive Authority</option>
              <option value="ACTING_DELEGATE">Acting Delegate (Formal Approval Delegation)</option>
              <option value="EXPIRED_DELEGATION">Expired Delegation (Read-only)</option>
            </select>
          </div>

          {/* Dimension 9: Time Period */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              9. Authority Valid Until Date
            </label>
            <input
              type="date"
              value={assignment.validUntil}
              onChange={(e) => onUpdateAssignment({ ...assignment, validUntil: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Permitted Actions Overview */}
        <div className="mt-5 bg-slate-900 text-white rounded-xl p-4 text-xs">
          <div className="font-bold text-amber-400 mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Permitted Actions ({assignment.permittedActions.length} Specific Actions Authorized)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {assignment.permittedActions.map((act) => (
              <span key={act} className="bg-slate-800 border border-slate-700 text-slate-200 px-2 py-0.5 rounded text-[10px] font-mono">
                {act}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            Apply Active Assignment Scope
          </button>
        </div>
      </div>
    </div>
  );
};
