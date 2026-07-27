import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { RegistrationWizard } from './components/RegistrationWizard';
import { GISMapModule } from './components/GISMapModule';
import { OfflineFieldApp } from './components/OfflineFieldApp';
import { DuplicateWorkbench } from './components/DuplicateWorkbench';
import { VerificationModule } from './components/VerificationModule';
import { ProgramsModule } from './components/ProgramsModule';
import { PaymentOrchestration } from './components/PaymentOrchestration';
import { VoucherDistribution } from './components/VoucherDistribution';
import { FarmerPortal } from './components/FarmerPortal';
import { DashboardsModule } from './components/DashboardsModule';
import { GrievanceModule } from './components/GrievanceModule';
import { AuditTrailModule } from './components/AuditTrailModule';

import {
  ROLE_DEFINITIONS,
  type FarmerProfile,
  type Parcel,
  type AgriculturalProgram,
  type Voucher,
  type PaymentBatch,
  type DuplicateAlert,
  type GrievanceTicket,
  type AuditEvent,
  type UserRole,
  type VerificationStatus,
  type MobileMoneyProvider
} from './types';

import { db, initializeDatabase, logAuditEvent, resetDatabaseToBaseline, exportPlatformSnapshot } from './services/db';
import { checkForDuplicates } from './services/duplicateEngine';
import {
  INITIAL_FARMERS,
  INITIAL_PARCELS,
  INITIAL_PROGRAMS,
  INITIAL_VOUCHERS,
  INITIAL_PAYMENTS,
  INITIAL_DUPLICATES,
  INITIAL_GRIEVANCES,
  INITIAL_AUDIT_LOGS
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { AboutUsModal } from './components/AboutUsModal';
import { ContactUsModal } from './components/ContactUsModal';
import { PWAPromptBanner } from './components/PWAPromptBanner';
import { PWAInstallModal } from './components/PWAInstallModal';
import { AssignmentSwitcherModal } from './components/AssignmentSwitcherModal';
import { RTMTraceabilityModal } from './components/RTMTraceabilityModal';
import { filterFarmersByAssignment, filterParcelsByAssignment } from './services/securityEngine';
import type { UserAssignment } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('FARMER');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isRtmModalOpen, setIsRtmModalOpen] = useState(false);

  // Active ABAC Assignment State
  const [activeAssignment, setActiveAssignment] = useState<UserAssignment>({
    id: 'ASG-2026-DEFAULT',
    userRole: 'FARMER',
    organization: 'Food and Agriculture Organization (FAO UN)',
    programId: 'ALL_PROGRAMS',
    programName: 'All National Programs',
    county: 'Lofa',
    district: 'Foya District',
    dataSensitivity: 'HIGHLY_RESTRICTED',
    recordOwnershipOnly: false,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    approvalLimitUSD: 500000,
    delegationStatus: 'DIRECT_AUTHORITY',
    permittedActions: [
      'VIEW', 'CREATE', 'EDIT_DRAFT', 'SUBMIT', 'RETURN_FOR_CORRECTION',
      'VERIFY', 'RECOMMEND', 'APPROVE', 'REJECT', 'SUSPEND', 'REACTIVATE',
      'ASSIGN', 'ISSUE', 'REDEEM', 'RECONCILE', 'EXPORT', 'PRINT',
      'CONFIGURE', 'ADMINISTER_USERS', 'VIEW_AUDIT_RECORDS'
    ]
  });

  // Map role changes directly to dedicated dashboard views & sync assignment
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setActiveAssignment((prev) => ({
      ...prev,
      userRole: newRole
    }));

    switch (newRole) {
      case 'FARMER':
      case 'HOUSEHOLD_REP':
      case 'COOPERATIVE_REP':
      case 'EXTENSION_AGENT':
        setActiveTab('portal');
        break;

      case 'ENUMERATOR':
        setActiveTab('offline');
        break;

      case 'SENIOR_ENUMERATOR':
      case 'COUNTY_AGRICULTURAL_OFFICER':
      case 'DISTRICT_AGRICULTURAL_OFFICER':
      case 'VERIFICATION_OFFICER':
        setActiveTab('verification');
        break;

      case 'PROGRAM_OFFICER':
        setActiveTab('programs');
        break;

      case 'VOUCHER_ADMINISTRATOR':
      case 'INPUT_DISTRIBUTION_OFFICER':
        setActiveTab('vouchers');
        break;

      case 'PAYMENT_OFFICER':
        setActiveTab('payments');
        break;

      case 'GIS_OFFICER':
        setActiveTab('gis');
        break;

      case 'MONITORING_EVALUATION_OFFICER':
      case 'DATA_ANALYST':
      case 'DEVELOPMENT_PARTNER':
      case 'MINISTRY_ADMINISTRATOR':
      case 'SYSTEM_ADMINISTRATOR':
      case 'READONLY_OVERSIGHT':
        setActiveTab('dashboards');
        break;

      case 'HELPDESK_OFFICER':
        setActiveTab('grievances');
        break;

      case 'SECURITY_AUDITOR':
      case 'INDEPENDENT_AUDITOR':
        setActiveTab('audit');
        break;

      default:
        setActiveTab('dashboards');
    }
  };

  // State arrays populated from DB or initial seed
  const [farmers, setFarmers] = useState<FarmerProfile[]>(INITIAL_FARMERS);
  const [parcels, setParcels] = useState<Parcel[]>(INITIAL_PARCELS);
  const [programs, setPrograms] = useState<AgriculturalProgram[]>(INITIAL_PROGRAMS);
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [payments, setPayments] = useState<PaymentBatch[]>(INITIAL_PAYMENTS);
  const [duplicates, setDuplicates] = useState<DuplicateAlert[]>(INITIAL_DUPLICATES);
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(INITIAL_GRIEVANCES);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);

  // Load from IndexedDB on startup
  useEffect(() => {
    async function loadData() {
      await initializeDatabase();
      const fList = await db.farmers.toArray();
      const pList = await db.parcels.toArray();
      const prgList = await db.programs.toArray();
      const vList = await db.vouchers.toArray();
      const payList = await db.payments.toArray();
      const dupList = await db.duplicates.toArray();
      const grvList = await db.grievances.toArray();
      const audList = await db.auditLogs.toArray();

      if (fList.length > 0) setFarmers(fList);
      if (pList.length > 0) setParcels(pList);
      if (prgList.length > 0) setPrograms(prgList);
      if (vList.length > 0) setVouchers(vList);
      if (payList.length > 0) setPayments(payList);
      if (dupList.length > 0) setDuplicates(dupList);
      if (grvList.length > 0) setGrievances(grvList);
      if (audList.length > 0) setAuditLogs(audList);
    }
    loadData();
  }, []);

  // Handlers for state updates + DB persistence + Audit Trail
  const handleSaveFarmer = async (newFarmer: FarmerProfile) => {
    setFarmers((prev) => [newFarmer, ...prev]);
    await db.farmers.add(newFarmer);

    // Check duplicates
    const foundDups = checkForDuplicates(newFarmer, farmers);
    if (foundDups.length > 0) {
      setDuplicates((prev) => [...foundDups, ...prev]);
      await db.duplicates.bulkAdd(foundDups);
    }

    await logAuditEvent(
      `${newFarmer.firstName} ${newFarmer.lastName}`,
      currentRole,
      'REGISTER_FARMER',
      'FARMER',
      newFarmer.id,
      `Registered farmer profile [${newFarmer.farmerRegistryNumber}] in ${newFarmer.county} County.`
    );
    const updatedAudits = await db.auditLogs.toArray();
    setAuditLogs(updatedAudits);
  };

  const handleSaveParcel = async (newParcel: Parcel) => {
    setParcels((prev) => [newParcel, ...prev]);
    await db.parcels.add(newParcel);

    await logAuditEvent(
      'GIS Officer',
      currentRole,
      'CREATE_PARCEL',
      'PARCEL',
      newParcel.id,
      `Captured GIS parcel boundary for ${newParcel.farmName} (${newParcel.calculatedAreaHectares} Ha).`
    );
    const updatedAudits = await db.auditLogs.toArray();
    setAuditLogs(updatedAudits);
  };

  const handleUpdateFarmerStatus = async (farmerId: string, newStatus: VerificationStatus, notes: string) => {
    setFarmers((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, verificationStatus: newStatus, notes } : f))
    );
    await db.farmers.update(farmerId, { verificationStatus: newStatus, notes });

    // Interoperability Trigger: Auto-issue FAO Input Voucher upon verification approval
    if (newStatus === 'APPROVED') {
      const farmer = farmers.find((f) => f.id === farmerId);
      if (farmer) {
        const defaultProg = programs[0] || INITIAL_PROGRAMS[0];
        const autoVoucher: Voucher = {
          id: `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          voucherCode: `LDFR-VCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          qrCodeUrl: `LDFR-VCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          programId: defaultProg.id,
          programName: defaultProg.name,
          farmerId: farmer.id,
          farmerName: `${farmer.firstName} ${farmer.lastName}`,
          farmerPhone: farmer.primaryPhone,
          valueUsd: defaultProg.benefitValueUsd || 150,
          valueLrd: (defaultProg.benefitValueUsd || 150) * 195,
          approvedInputs: ['25kg Certified Rice Seed', '50kg NPK Fertilizer', 'Pesticide Pack'],
          status: 'ISSUED',
          issuedDate: new Date().toISOString()
        };

        setVouchers((prev) => [autoVoucher, ...prev]);
        await db.vouchers.add(autoVoucher);
      }
    }

    await logAuditEvent(
      'County Officer',
      currentRole,
      'VERIFY_FARMER',
      'FARMER',
      farmerId,
      `Updated farmer status to ${newStatus}. Notes: ${notes}`
    );
    const updatedAudits = await db.auditLogs.toArray();
    setAuditLogs(updatedAudits);
  };

  const handleResolveDuplicate = async (alertId: string, status: DuplicateAlert['status'], notes: string) => {
    setDuplicates((prev) =>
      prev.map((d) => (d.id === alertId ? { ...d, status, resolutionNotes: notes } : d))
    );
    await db.duplicates.update(alertId, { status, resolutionNotes: notes });

    await logAuditEvent(
      'Supervisor',
      currentRole,
      'RESOLVE_DUPLICATE',
      'DUPLICATE_ALERT',
      alertId,
      `Resolved duplicate alert [${alertId}] to status ${status}.`
    );
    const updatedAudits = await db.auditLogs.toArray();
    setAuditLogs(updatedAudits);
  };

  const handleEnrollFarmerInProgram = async (programId: string, farmerId: string) => {
    const prg = programs.find((p) => p.id === programId);
    const farmer = farmers.find((f) => f.id === farmerId);

    if (prg && farmer) {
      // Issue digital voucher
      const newVoucher: Voucher = {
        id: `v-${Date.now()}`,
        voucherCode: `LDFR-VCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        qrCodeUrl: `LDFR-VCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        programId: prg.id,
        programName: prg.name,
        farmerId: farmer.id,
        farmerName: `${farmer.firstName} ${farmer.lastName}`,
        farmerPhone: farmer.primaryPhone,
        valueUsd: prg.benefitValueUsd,
        valueLrd: prg.benefitValueUsd * 195,
        approvedInputs: ['25kg Certified Rice Seed', '50kg NPK Fertilizer'],
        status: 'ISSUED',
        issuedDate: new Date().toISOString()
      };

      setVouchers((prev) => [newVoucher, ...prev]);
      await db.vouchers.add(newVoucher);

      // Increment enrollment count
      setPrograms((prev) =>
        prev.map((p) => (p.id === programId ? { ...p, enrolledCount: p.enrolledCount + 1 } : p))
      );
      await db.programs.update(programId, { enrolledCount: prg.enrolledCount + 1 });

      await logAuditEvent(
        'Program Officer',
        currentRole,
        'ENROLL_BENEFICIARY',
        'PROGRAM',
        programId,
        `Enrolled ${farmer.firstName} ${farmer.lastName} into ${prg.name}. Issued voucher ${newVoucher.voucherCode}.`
      );
      const updatedAudits = await db.auditLogs.toArray();
      setAuditLogs(updatedAudits);
    }
  };

  const handleDisburseBatch = async (batchId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === batchId ? { ...p, status: 'DISBURSED', disbursedAt: new Date().toISOString() } : p))
    );
    await db.payments.update(batchId, { status: 'DISBURSED', disbursedAt: new Date().toISOString() });

    await logAuditEvent(
      'Payment Officer',
      currentRole,
      'DISBURSE_PAYMENT_BATCH',
      'PAYMENT_BATCH',
      batchId,
      `Authorized mobile money payout disbursement for batch ${batchId}.`
    );
    const updatedAudits = await db.auditLogs.toArray();
    setAuditLogs(updatedAudits);
  };

  const handleCreatePaymentBatch = async (provider: MobileMoneyProvider, amountUsd: number, count: number) => {
    const newBatch: PaymentBatch = {
      id: `pay-${Date.now()}`,
      batchReference: `MOA-PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      programId: 'prg-02',
      programName: 'National Women & Youth Agri-Tech Cash Grant',
      totalBeneficiaries: count,
      totalAmountUsd: amountUsd,
      provider,
      status: 'PENDING_APPROVAL',
      createdBy: 'Payment Officer Sackie',
      createdAt: new Date().toISOString()
    };

    setPayments((prev) => [newBatch, ...prev]);
    await db.payments.add(newBatch);

    await logAuditEvent(
      'Payment Officer',
      currentRole,
      'CREATE_PAYMENT_BATCH',
      'PAYMENT_BATCH',
      newBatch.id,
      `Created payment batch ${newBatch.batchReference} for $${amountUsd} USD.`
    );
    const updatedAudits = await db.auditLogs.toArray();
    setAuditLogs(updatedAudits);
  };

  const handleRedeemVoucher = async (voucherId: string, vendorName: string) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === voucherId
          ? { ...v, status: 'REDEEMED', vendorName, redeemedDate: new Date().toISOString() }
          : v
      )
    );
    await db.vouchers.update(voucherId, {
      status: 'REDEEMED',
      vendorName,
      redeemedDate: new Date().toISOString()
    });

    await logAuditEvent(
      vendorName,
      currentRole,
      'REDEEM_VOUCHER',
      'VOUCHER',
      voucherId,
      `Redeemed input voucher ${voucherId} at ${vendorName}.`
    );
    const updatedAudits = await db.auditLogs.toArray();
    setAuditLogs(updatedAudits);
  };

  const handleSubmitGrievance = async (ticket: GrievanceTicket) => {
    setGrievances((prev) => [ticket, ...prev]);
    await db.grievances.add(ticket);

    await logAuditEvent(
      ticket.farmerName,
      currentRole,
      'SUBMIT_GRIEVANCE',
      'GRIEVANCE',
      ticket.id,
      `Submitted helpdesk grievance ${ticket.trackingCode}.`
    );
    const updatedAudits = await db.auditLogs.toArray();
    setAuditLogs(updatedAudits);
  };

  const handleUpdateGrievanceStatus = async (ticketId: string, status: GrievanceTicket['status'], notes: string) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === ticketId ? { ...g, status, resolutionNotes: notes } : g))
    );
    await db.grievances.update(ticketId, { status, resolutionNotes: notes });

    await logAuditEvent(
      'Helpdesk Officer',
      currentRole,
      'RESOLVE_GRIEVANCE',
      'GRIEVANCE',
      ticketId,
      `Updated grievance ticket status to ${status}.`
    );
    const updatedAudits = await db.auditLogs.toArray();
    setAuditLogs(updatedAudits);
  };

  const handleLogExportAudit = async (format: string) => {
    await logAuditEvent(
      'Administrator',
      currentRole,
      'EXPORT_REPORTS',
      'REPORT',
      `REP-${Date.now()}`,
      `Exported national farmer registry report in ${format} format.`
    );
    const updatedAudits = await db.auditLogs.toArray();
    setAuditLogs(updatedAudits);
  };

  const handleResetDatabase = async () => {
    if (window.confirm('Reset all platform tables back to official initial seed records?')) {
      await resetDatabaseToBaseline();
      const fList = await db.farmers.toArray();
      const pList = await db.parcels.toArray();
      const prgList = await db.programs.toArray();
      const vList = await db.vouchers.toArray();
      const payList = await db.payments.toArray();
      const dupList = await db.duplicates.toArray();
      const grvList = await db.grievances.toArray();
      const audList = await db.auditLogs.toArray();

      setFarmers(fList);
      setParcels(pList);
      setPrograms(prgList);
      setVouchers(vList);
      setPayments(payList);
      setDuplicates(dupList);
      setGrievances(grvList);
      setAuditLogs(audList);

      alert('LDFR Platform Database reset back to official baseline seed data.');
    }
  };

  // Compute ABAC Scoped Data subsets based on Active Policy Assignment
  const scopedFarmers = filterFarmersByAssignment(farmers, activeAssignment);
  const scopedParcels = filterParcelsByAssignment(parcels, activeAssignment);

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'contrast-125 bg-black text-yellow-300' : 'bg-slate-100 text-slate-900'}`}>
      <Header
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
        assignment={activeAssignment}
        onOpenAssignmentModal={() => setIsAssignmentModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        onOpenRtmModal={() => setIsRtmModalOpen(true)}
        onResetDatabase={handleResetDatabase}
        onExportSnapshot={exportPlatformSnapshot}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
      />

      {/* Mandatory Scope Banner (Combined RBAC + ABAC Policy Display for Internal Workspaces) */}
      {activeTab !== 'landing' && (
        <div className="bg-slate-900 text-white border-b border-slate-800 py-2.5 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wide">
                Current Assignment
              </span>
              <span className="font-extrabold text-amber-300">
                {ROLE_DEFINITIONS[currentRole]?.title || currentRole}
              </span>
              <span className="text-slate-400 font-bold">—</span>
              <span className="text-emerald-400 font-extrabold">{activeAssignment.programName}</span>
              <span className="text-slate-400 hidden md:inline">—</span>
              <span className="text-slate-300 hidden md:inline">{activeAssignment.organization}</span>
              <span className="text-slate-400 font-bold">—</span>
              <span className="text-sky-300 font-bold">{activeAssignment.county} County ({activeAssignment.district})</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 font-medium">
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-amber-300 font-mono text-[10px]">
                Sensitivity: {activeAssignment.dataSensitivity}
              </span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-emerald-300 font-mono text-[10px]">
                Limit: ${activeAssignment.approvalLimitUSD.toLocaleString()} USD
              </span>
              <span className="text-slate-400 italic hidden lg:inline">Valid through {activeAssignment.validUntil}</span>
            </div>
          </div>
        </div>
      )}

      <AssignmentSwitcherModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        assignment={activeAssignment}
        onUpdateAssignment={(updated) => {
          setActiveAssignment(updated);
          setCurrentRole(updated.userRole);
        }}
      />

      <AboutUsModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <ContactUsModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onNavigateToGrievances={() => setActiveTab('grievances')}
      />

      <PWAInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

      <PWAPromptBanner
        onOpenModal={() => setIsPwaModalOpen(true)}
      />

      {/* Main Container with Collapsible Left Sidebar for Logged-In Workspaces */}
      <div className="flex-1 flex w-full min-h-[calc(100vh-10rem)]">
        {activeTab !== 'landing' && (
          <Sidebar
            currentRole={currentRole}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            assignment={activeAssignment}
            onOpenAssignmentModal={() => setIsAssignmentModalOpen(true)}
            unreadGrievanceCount={grievances.filter((g) => g.status === 'OPEN').length}
          />
        )}

        {/* Main App Content View Switcher */}
        <main className={`flex-1 overflow-x-hidden w-full ${activeTab === 'landing' ? 'p-0' : 'p-6'}`}>
        {activeTab === 'landing' && (
          <LandingPage
            onRegisterClick={() => {
              setCurrentRole('FARMER');
              setActiveTab('registration');
            }}
            onExploreGis={() => {
              setCurrentRole('GIS_OFFICER');
              setActiveTab('gis');
            }}
          />
        )}

        {activeTab === 'registration' && (
          <RegistrationWizard
            onSaveFarmer={handleSaveFarmer}
            onCancel={() => setActiveTab('landing')}
          />
        )}

        {activeTab === 'gis' && (
          <GISMapModule parcels={scopedParcels} onSaveParcel={handleSaveParcel} />
        )}

        {activeTab === 'offline' && (
          <OfflineFieldApp
            isOffline={isOffline}
            setIsOffline={setIsOffline}
            savedFarmers={scopedFarmers}
            onSyncAll={() => alert('Offline field data synchronized with central LDFR database!')}
          />
        )}

        {activeTab === 'duplicates' && (
          <DuplicateWorkbench
            duplicates={duplicates}
            farmers={scopedFarmers}
            onResolveDuplicate={handleResolveDuplicate}
          />
        )}

        {activeTab === 'verification' && (
          <VerificationModule farmers={scopedFarmers} onUpdateStatus={handleUpdateFarmerStatus} />
        )}

        {activeTab === 'programs' && (
          <ProgramsModule
            programs={programs}
            farmers={scopedFarmers}
            parcels={parcels}
            onEnrollFarmer={handleEnrollFarmerInProgram}
          />
        )}

        {activeTab === 'vouchers' && (
          <VoucherDistribution vouchers={vouchers} onRedeemVoucher={handleRedeemVoucher} />
        )}

        {activeTab === 'payments' && (
          <PaymentOrchestration
            payments={payments}
            onDisburseBatch={handleDisburseBatch}
            onCreateBatch={handleCreatePaymentBatch}
          />
        )}

        {activeTab === 'portal' && (
          <FarmerPortal farmers={farmers} parcels={parcels} vouchers={vouchers} />
        )}

        {activeTab === 'dashboards' && (
          <DashboardsModule
            farmers={scopedFarmers}
            parcels={scopedParcels}
            programs={programs}
            onLogExportAudit={handleLogExportAudit}
          />
        )}

        {activeTab === 'grievances' && (
          <GrievanceModule
            grievances={grievances}
            onSubmitGrievance={handleSubmitGrievance}
            onUpdateStatus={handleUpdateGrievanceStatus}
          />
        )}

        {activeTab === 'audit' && <AuditTrailModule auditLogs={auditLogs} />}
      </main>
      </div>

      {/* RTM Traceability & Proposal Reconciliation Modal */}
      <RTMTraceabilityModal isOpen={isRtmModalOpen} onClose={() => setIsRtmModalOpen(false)} />

      <Footer />
    </div>
  );
}

export default App;
