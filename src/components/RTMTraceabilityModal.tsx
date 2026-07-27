import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Users,
  Award,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

interface RTMTraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RTMTraceabilityModal: React.FC<RTMTraceabilityModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'DELIVERABLES' | 'CLASSIFICATION' | 'TEAM' | 'SOP_GOVERNANCE'>('DELIVERABLES');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-emerald-700 rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-5 text-xs text-slate-900 my-8">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-xs border border-emerald-600">
              RTM
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-amber-700 tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                FAO RFP No. 2026/FRLIR/FRLIR/137641 • TOTAG Technical Offer
              </div>
              <h2 className="text-xl font-extrabold text-slate-950">
                Requirements Traceability &amp; Master Proposal Reconciliation Engine
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Contractual alignment between FAO Terms of Reference, TOTAG Technical Proposal, and 7-Month Stage-Gated Implementation Plan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('DELIVERABLES')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'DELIVERABLES'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            7-Month Delivery Roadmap (D1–D7)
          </button>

          <button
            onClick={() => setActiveTab('CLASSIFICATION')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'CLASSIFICATION'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-400" />
            3-Tier Scope Matrix [M / C / E]
          </button>

          <button
            onClick={() => setActiveTab('TEAM')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'TEAM'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            Key Experts &amp; Team RACI
          </button>

          <button
            onClick={() => setActiveTab('SOP_GOVERNANCE')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'SOP_GOVERNANCE'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            SOPs &amp; Governance Framework
          </button>
        </div>

        {/* TAB 1: 7-MONTH DELIVERY ROADMAP */}
        {activeTab === 'DELIVERABLES' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex justify-between items-center text-xs">
              <div>
                <div className="font-extrabold text-emerald-950 text-sm">
                  Integrated 7-Month Stage-Gated Delivery Plan (TECH-7 Baseline)
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Aligned to maximum TOR period with formal gate reviews at every milestone.
                </div>
              </div>
              <span className="bg-emerald-800 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                7 Stage Gates
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  month: 'Month 1 (M1)',
                  title: 'D1: Inception Report & Approved Work Plan',
                  activities: 'Mobilization, governance setup, system inventory, stakeholder mapping, discovery & field-process review.',
                  evidence: 'Approved Inception Report, baseline schedule, RAID log, governance calendar.',
                  status: 'COMPLETED & VALIDATED'
                },
                {
                  month: 'Month 2 (M2)',
                  title: 'D2: Gap Assessment & Architecture Design',
                  activities: 'Gap analysis, requirements baselining, target operating model, data architecture & UX prototype validation.',
                  evidence: 'Gap Assessment Report, System Design Document, RTM matrix, architecture decision logs.',
                  status: 'COMPLETED & VALIDATED'
                },
                {
                  month: 'Month 3 (M3)',
                  title: 'D3: Core System Design & SOP Manual Draft',
                  activities: 'Farmer, Household, Farm & Parcel data model completion, SOP drafting, REST API specs, offline sync engine.',
                  evidence: 'System Design Document, draft SOP manual, API OpenAPI specifications.',
                  status: 'COMPLETED & VALIDATED'
                },
                {
                  month: 'Month 4 (M4)',
                  title: 'D4: Module Build & Alpha Platform Release',
                  activities: 'Offline field mobile app, GIS parcel mapping, duplicate management stewardship queue, security hardening.',
                  evidence: 'Alpha Platform build, SOP manual version 1.0, security scan reports.',
                  status: 'IN PROGRESS (ALPHA READY)'
                },
                {
                  month: 'Month 5 (M5)',
                  title: 'D5: System Integration & Capacity Building',
                  activities: 'End-to-end UAT, social-protection MIS API integration, Training-of-Trainers (ToT) for national/county officers.',
                  evidence: 'Functional Interoperable Platform, training manuals & attendee competency logs.',
                  status: 'SCHEDULED (M5)'
                },
                {
                  month: 'Month 6 (M6)',
                  title: 'D6: Pilot Field Deployment & Rollout Review',
                  activities: 'Supervised field operations in pilot counties/districts, issue triage, performance monitoring, go/no-go review.',
                  evidence: 'Pilot Implementation Report, defect resolution logs, rollout decision record.',
                  status: 'SCHEDULED (M6)'
                },
                {
                  month: 'Month 7 (M7)',
                  title: 'D7: National Rollout, Handover & Final Report',
                  activities: 'Phased 15-county national deployment, hypercare support, administrator/developer handover, asset transfer.',
                  evidence: 'Final Report, signed handover register, sustainability roadmap & maintenance agreements.',
                  status: 'SCHEDULED (M7)'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-emerald-500 transition-all"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-900 text-amber-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                        {item.month}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-xs">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600">{item.activities}</p>
                    <div className="text-[10px] text-slate-400 font-semibold">Evidence: {item.evidence}</div>
                  </div>

                  <div className="text-right whitespace-nowrap">
                    <span
                      className={`inline-block font-black text-[10px] px-2.5 py-1 rounded-full uppercase ${
                        item.status.includes('COMPLETED')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : item.status.includes('IN PROGRESS')
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 3-TIER SCOPE MATRIX */}
        {activeTab === 'CLASSIFICATION' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mandatory RFP Scope */}
              <div className="bg-emerald-50 border-2 border-emerald-600 p-4 rounded-xl space-y-2">
                <div className="font-extrabold text-emerald-950 text-sm flex items-center justify-between">
                  <span>[M — Mandatory] RFP Scope</span>
                  <span className="bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded font-black">CONTRACT</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Mandatory requirements set forth in FAO RFP No. 2026/FRLIR/137641 and official clarifications.
                </p>
                <ul className="space-y-1.5 pt-2 text-[11px] font-semibold text-slate-800">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>National Farmer, Household, Farm &amp; Parcel Registry</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>15-County Liberian Admin Hierarchy (County ➔ Village)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Offline-Capable Field Registration App</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>WGS84 GIS Parcel Mapping &amp; Geometry Validation</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Human Stewardship Duplicate Management Queue</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Social Protection MIS Interoperability (MoGCSP)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Complete SOPs, Training, Pilot &amp; Handover</span>
                  </li>
                </ul>
              </div>

              {/* Committed Methodologies */}
              <div className="bg-sky-50 border-2 border-sky-600 p-4 rounded-xl space-y-2">
                <div className="font-extrabold text-sky-950 text-sm flex items-center justify-between">
                  <span>[C — Committed] TOTAG Offer</span>
                  <span className="bg-sky-700 text-white text-[10px] px-2 py-0.5 rounded font-black">PROPOSAL</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Methods, technical standards and safeguards committed in TOTAG's Technical Proposal.
                </p>
                <ul className="space-y-1.5 pt-2 text-[11px] font-semibold text-slate-800">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>7-Month Stage-Gated Delivery Work Plan</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>Requirements Traceability Matrix (RTM) Tracking</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>Maker-Checker Segregation of Duties Control</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>HP Enterprise Server Baseline Architecture</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>AES-256 Encryption &amp; TLS 1.2+ Security</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>Synthetic Demo Data Safeguards &amp; Labeling</span>
                  </li>
                </ul>
              </div>

              {/* Configurable Extensions */}
              <div className="bg-amber-50 border-2 border-amber-600 p-4 rounded-xl space-y-2">
                <div className="font-extrabold text-amber-950 text-sm flex items-center justify-between">
                  <span>[E — Enhancement] Modules</span>
                  <span className="bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded font-black">CONFIGURABLE</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Configurable extension capabilities activated only upon written government/FAO approval.
                </p>
                <ul className="space-y-1.5 pt-2 text-[11px] font-semibold text-slate-800">
                  <li className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Public Portal Marketing Banner &amp; Hero Carousel</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Cash Transfer &amp; Mobile Money Payment Release</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Electronic Input Vouchers &amp; Vendor Redemption</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Farmer Self-Service Advisory Channels (USSD/SMS)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Extended Specialist Role Templates (23 Roles)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KEY EXPERTS & RACI */}
        {activeTab === 'TEAM' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="font-extrabold text-slate-900 text-sm border-b pb-2">
              TOTAG Key Expert Technical Team &amp; Assignment (Form TECH-4)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs">Varnie N'Jola Karmo</div>
                    <div className="text-[10px] text-emerald-700 font-bold">Key Expert 1: Project Manager</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div><b>Qualifications:</b> BSc Computer Information Systems (Purdue)</div>
                  <div><b>Experience:</b> 25+ years enterprise software, Indiana General Assembly Lead.</div>
                  <div><b>Responsibilities:</b> Project planning, technical leadership, architecture, quality, delivery &amp; stage gates.</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs">M. Tarwoyouberkowu Gwoah</div>
                    <div className="text-[10px] text-emerald-700 font-bold">Key Expert 2: Software Developer</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div><b>Qualifications:</b> Associate IT + BSc Organizational Leadership (Purdue)</div>
                  <div><b>Experience:</b> JavaScript, React, Node.js, PostgreSQL/MySQL, REST APIs &amp; workflows.</div>
                  <div><b>Responsibilities:</b> Application development, workflow automation, API integration &amp; technical handover.</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs">Tonieh Alpha Gwoah</div>
                    <div className="text-[10px] text-emerald-700 font-bold">Key Expert 3: Trainer &amp; Field Ops</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div><b>Qualifications:</b> BBA Management &amp; Economics (University of Liberia)</div>
                  <div><b>Experience:</b> CHF Liberia YES Project, World Bank/WFP/WTO training &amp; field ops.</div>
                  <div><b>Responsibilities:</b> Training needs analysis, user orientation, field logistics, adoption &amp; support.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SOPS & GOVERNANCE */}
        {activeTab === 'SOP_GOVERNANCE' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="font-extrabold text-slate-900 text-sm border-b pb-2">
              Mandatory Standard Operating Procedures (SOP Manual Deliverable D4)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'SOP 1: Farmer & Household Registration', content: 'Community mobilization, consent capture, identity verification, household composition & vulnerability tagging.' },
                { title: 'SOP 2: Farm & Parcel Geodata Capture', content: 'GPS boundary walking, vertex collection, area/perimeter calculation, topology checks & GIS quality control.' },
                { title: 'SOP 3: Verification, Approval & Rejection', content: 'Maker-checker controls, supervisor quality checks, field verification, reason codes & appeal workflows.' },
                { title: 'SOP 4: Duplicate Review & Merging', content: 'Deterministic/probabilistic match queues, human stewardship, reversible merge & audit history.' },
                { title: 'SOP 5: Data Privacy & Security Governance', content: 'Access reviews, TLS/AES encryption, RBAC/ABAC enforcement, audit logging & breach escalation.' },
                { title: 'SOP 6: Social Protection Interoperability', content: 'REST API data exchange, data-sharing agreements, schema validation & vulnerability correlation.' },
                { title: 'SOP 7: Grievance & Complaint Redress', content: 'Support ticket intake, SLA tracking, whistleblower safeguards & resolution appeals.' },
                { title: 'SOP 8: Backup, Restoration & Disaster Recovery', content: 'Encrypted backups, RPO/RTO targets, secondary failover & administrative handover.' }
              ].map((sop, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                  <div className="font-extrabold text-slate-900 text-xs">{sop.title}</div>
                  <div className="text-[11px] text-slate-600">{sop.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 text-xs">
          <div className="text-[10px] text-slate-500 font-mono">
            RTM Version 2.0 • FAO RFP 2026/FRLIR/137641 • TOTAG Group of Companies Ltd
          </div>
          <button
            onClick={onClose}
            className="bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold px-5 py-2 rounded-xl cursor-pointer shadow-xs"
          >
            Close RTM Engine
          </button>
        </div>
      </div>
    </div>
  );
};
