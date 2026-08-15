import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  ArrowLeft, Settings, BarChart3, Database, CheckCircle2, Clock, 
  Plus, Users, Building2, FileText, Workflow, Search, Download,
  ShoppingCart, Receipt, Package, DollarSign, CreditCard, Banknote,
  UserPlus, Calendar, Target, BookOpen, Save, Loader2, User, Star,
  Eye, GraduationCap, Upload, FolderOpen, Gavel, MessageSquare, Shield, AlertTriangle
} from 'lucide-react';

export default function ModuleFeaturePage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const pathParts = location.split('/');
  const moduleIndex = pathParts.findIndex(part => part === 'modules');
  const moduleName = pathParts[moduleIndex + 1] || '';
  const featureType = pathParts[moduleIndex + 2] || '';
  const featureName = pathParts.slice(moduleIndex + 3).join('/') || '';
  
  const moduleDisplayNames: Record<string, string> = {
    'hr-core': 'HR Core Management',
    'hr-recruitment': 'Recruitment & Onboarding',
    'hr-talent': 'Talent Management',
    'hr-compensation': 'Compensation & Benefits',
    'hr-self-service': 'Employee Self-Service',
    'hr-analytics': 'HR Analytics',
    'hr-biometrics-attendance': 'Biometrics & Attendance',
    'hr-time-leave': 'Time, Leave & Scheduling',
    'hr-payroll': 'Payroll Interface',
    'hr-learning': 'Learning Management',
    'hr-employee-relations': 'Employee Relations',
    'hr-offboarding': 'Offboarding & Exit',
    'hr-position-control': 'Position Control',
    'hr-documents': 'Document Management',
    'platform-governance': 'Platform Governance',
    'fims-general-ledger': 'General Ledger',
    'fims-accounts-payable': 'Accounts Payable',
    'fims-accounts-receivable': 'Accounts Receivable',
    'fims-treasury': 'Treasury Management',
    'fims-budgeting': 'Budgeting & Planning',
    'fims-procurement': 'Procurement Management',
    'fims-reporting': 'Financial Reporting',
    'fims-compliance': 'Compliance & Audit',
    'fims-commitment-control': 'Commitment Control',
    'fims-fixed-assets': 'Fixed Assets Management',
    'fims-contracts': 'Contract Management',
    'fims-projects': 'Project & Grant Accounting'
  };

  const formatFeatureName = (name: string) => {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const moduleDisplayName = moduleDisplayNames[moduleName] || moduleName;
  const formattedFeatureName = formatFeatureName(featureName);
  const backUrl = `/saas/modules/${moduleName}`;

  const renderFeatureContent = () => {
    const fullFeatureKey = `${moduleName}/${featureType}/${featureName}`;
    const simpleFeatureKey = `${moduleName}/${featureName}`;
    
    switch (fullFeatureKey) {
      // HR Core Module
      case 'hr-core/action/add-employee':
        return <AddEmployeeForm backUrl={backUrl} />;
      case 'hr-core/action/org-chart':
      case 'hr-core/data/org-chart':
        return <OrgChartView backUrl={backUrl} />;
      case 'hr-core/action/upload-documents':
        return <UploadDocumentsForm backUrl={backUrl} />;
      case 'hr-core/action/create-workflow':
        return <CreateWorkflowForm backUrl={backUrl} />;
      case 'hr-core/action/employee-search':
      case 'hr-core/data/employee-search':
        return <EmployeeSearchView backUrl={backUrl} />;
      case 'hr-core/action/bulk-import':
        return <BulkImportForm backUrl={backUrl} />;
      case 'hr-core/data/employees':
        return <EmployeesListView backUrl={backUrl} />;
      case 'hr-core/data/departments':
        return <DepartmentsListView backUrl={backUrl} />;
      case 'hr-core/data/documents':
        return <DocumentsListView backUrl={backUrl} />;
      case 'hr-core/data/search':
        return <EmployeeSearchView backUrl={backUrl} />;
      case 'hr-core/data/bulk-operations':
        return <BulkOperationsView backUrl={backUrl} />;
      case 'hr-core/data/export':
        return <ExportDataView backUrl={backUrl} moduleName="HR Core" />;
      
      // HR Recruitment Module
      case 'hr-recruitment/action/add-applicant':
      case 'hr-recruitment/action/post-job':
        return <AddApplicantForm backUrl={backUrl} />;
      case 'hr-recruitment/action/review-applications':
        return <ReviewApplicationsView backUrl={backUrl} />;
      case 'hr-recruitment/action/schedule-interview':
        return <ScheduleInterviewForm backUrl={backUrl} />;
      case 'hr-recruitment/action/send-offer':
        return <SendOfferForm backUrl={backUrl} />;
      case 'hr-recruitment/action/candidate-search':
        return <CandidateSearchView backUrl={backUrl} />;
      case 'hr-recruitment/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Recruitment" />;
      
      // HR Talent Module
      case 'hr-talent/action/performance-review':
        return <PerformanceReviewForm backUrl={backUrl} />;
      case 'hr-talent/action/learning-paths':
        return <LearningPathsView backUrl={backUrl} />;
      case 'hr-talent/action/goal-setting':
        return <GoalSettingForm backUrl={backUrl} />;
      case 'hr-talent/action/skills-assessment':
        return <SkillsAssessmentForm backUrl={backUrl} />;
      case 'hr-talent/action/career-development':
        return <CareerDevelopmentView backUrl={backUrl} />;
      case 'hr-talent/action/succession-planning':
        return <SuccessionPlanningView backUrl={backUrl} />;
      case 'hr-talent/action/skills-gap-analysis':
        return <SkillsGapAnalysisView backUrl={backUrl} />;
      case 'hr-talent/action/assign-training':
        return <AssignTrainingForm backUrl={backUrl} />;
      case 'hr-talent/action/create-learning-path':
        return <CreateLearningPathForm backUrl={backUrl} />;
      
      // HR Compensation Module
      case 'hr-compensation/action/calculate-payroll':
        return <CalculatePayrollForm backUrl={backUrl} />;
      case 'hr-compensation/action/mobile-payments':
        return <MobilePaymentsView backUrl={backUrl} />;
      case 'hr-compensation/action/tax-reports':
        return <TaxReportsView backUrl={backUrl} />;
      case 'hr-compensation/action/benefits-admin':
        return <BenefitsAdminView backUrl={backUrl} />;
      case 'hr-compensation/action/salary-review':
        return <SalaryReviewForm backUrl={backUrl} />;
      case 'hr-compensation/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Compensation" />;
      
      // HR Analytics Module
      case 'hr-analytics/action/create-dashboard':
        return <CreateDashboardForm backUrl={backUrl} />;
      case 'hr-analytics/action/generate-report':
        return <GenerateHRReportForm backUrl={backUrl} />;
      case 'hr-analytics/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="HR Analytics" />;
      case 'hr-analytics/action/kpi-alert':
        return <KPIAlertForm backUrl={backUrl} />;
      case 'hr-analytics/action/predictive-analytics':
        return <PredictiveAnalyticsView backUrl={backUrl} />;
      case 'hr-analytics/action/compliance-reports':
        return <HRComplianceReportView backUrl={backUrl} />;
      
      // HR Biometrics Module - Core Actions
      case 'hr-biometrics-attendance/action/register-device':
      case 'hr-biometrics-attendance/data/register-device':
        return <RegisterDeviceForm backUrl={backUrl} />;
      case 'hr-biometrics-attendance/data/attendance':
      case 'hr-biometrics-attendance/data/live-attendance':
        return <AttendanceView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/action/shift-schedule':
      case 'hr-biometrics-attendance/data/manage-shifts':
        return <ShiftScheduleForm backUrl={backUrl} />;
      case 'hr-biometrics-attendance/reports/timesheet':
      case 'hr-biometrics-attendance/reports/employee-timesheet':
        return <TimesheetReportView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/settings/devices':
      case 'hr-biometrics-attendance/action/device-settings':
        return <DeviceSettingsView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/reports/summary':
        return <AttendanceReportView backUrl={backUrl} />;
      // HR Biometrics - Punch In/Out System
      case 'hr-biometrics-attendance/action/punch-clock':
      case 'hr-biometrics-attendance/data/punch-clock':
        return <PunchClockView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/action/view-attendance':
        return <AttendanceView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/action/export-timesheet':
        return <ExportTimesheetView backUrl={backUrl} />;
      // HR Biometrics - Data Pages
      case 'hr-biometrics-attendance/data/device-diagnostics':
        return <DeviceDiagnosticsView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/data/export-daily':
      case 'hr-biometrics-attendance/data/export-weekly':
      case 'hr-biometrics-attendance/data/export-monthly':
      case 'hr-biometrics-attendance/data/backup':
        return <ExportTimesheetView backUrl={backUrl} />;
      // HR Biometrics - Reports
      case 'hr-biometrics-attendance/reports/daily-attendance':
        return <DailyAttendanceReportView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/reports/tardiness':
        return <TardinessReportView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/reports/overtime':
        return <OvertimeReportView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/reports/performance-dashboard':
        return <PerformanceDashboardView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/reports/labor-law-compliance':
        return <ComplianceReportView backUrl={backUrl} reportType="compliance" />;
      case 'hr-biometrics-attendance/reports/audit-trail':
        return <AuditTrailView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/reports/create-custom':
      case 'hr-biometrics-attendance/action/reports':
        return <CustomReportForm backUrl={backUrl} />;
      // HR Biometrics - Settings
      case 'hr-biometrics-attendance/settings/grace-period':
        return <GracePeriodSettingsView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/settings/overtime-rules':
        return <OvertimeRulesSettingsView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/settings/break-rules':
        return <BreakRulesSettingsView backUrl={backUrl} />;
      case 'hr-biometrics-attendance/settings/network-diagnostics':
        return <NetworkDiagnosticsView backUrl={backUrl} />;
      
      // HR Self-Service Module
      case 'hr-self-service/action/request-leave':
        return <RequestLeaveForm backUrl={backUrl} />;
      case 'hr-self-service/action/update-profile':
        return <UpdateProfileForm backUrl={backUrl} />;
      case 'hr-self-service/action/submit-timesheet':
        return <SubmitTimesheetForm backUrl={backUrl} />;
      case 'hr-self-service/action/view-payslip':
        return <ViewPayslipPage backUrl={backUrl} />;
      case 'hr-self-service/data/team-directory':
        return <TeamDirectoryView backUrl={backUrl} />;
      case 'hr-self-service/action/hr-request':
        return <HRRequestForm backUrl={backUrl} />;
      
      // FIMS General Ledger Module
      case 'fims-general-ledger/action/new-journal-entry':
      case 'fims-general-ledger/action/journal-entry':
      case 'fims-general-ledger/action/new-entry':
        return <JournalEntryForm backUrl={backUrl} />;
      case 'fims-general-ledger/action/account-search':
        return <AccountSearchView backUrl={backUrl} />;
      case 'fims-general-ledger/action/trial-balance':
        return <TrialBalanceView backUrl={backUrl} />;
      case 'fims-general-ledger/action/reconciliation':
        return <ReconciliationForm backUrl={backUrl} />;
      case 'fims-general-ledger/action/export-gl':
        return <ExportDataView backUrl={backUrl} moduleName="General Ledger" />;
      case 'fims-general-ledger/action/period-close':
        return <PeriodCloseForm backUrl={backUrl} />;
      case 'fims-general-ledger/data/chart-of-accounts':
      case 'fims-general-ledger/data/accounts/view':
      case 'fims-general-ledger/data/accounts/chart':
        return <ChartOfAccountsView backUrl={backUrl} />;
      case 'fims-general-ledger/data/journal-entries':
      case 'fims-general-ledger/data/journal':
      case 'fims-general-ledger/data/journal/manual':
      case 'fims-general-ledger/data/journal/recurring':
      case 'fims-general-ledger/data/journal/adjusting':
        return <JournalEntriesView backUrl={backUrl} />;
      case 'fims-general-ledger/data/accounts':
      case 'fims-general-ledger/data/accounts/search':
        return <AccountsListView backUrl={backUrl} />;
      case 'fims-general-ledger/action/edit-record':
      case 'fims-general-ledger/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="General Ledger" />;
      case 'fims-general-ledger/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="General Ledger" />;
      case 'fims-general-ledger/reports/financial-statements':
      case 'fims-general-ledger/reports/income-statement':
      case 'fims-general-ledger/reports/balance-sheet':
        return <GenericReportView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      
      // FIMS Accounts Payable Module
      case 'fims-accounts-payable/action/new-invoice':
      case 'fims-accounts-payable/action/add-payable':
        return <AddPayableForm backUrl={backUrl} />;
      case 'fims-accounts-payable/action/process-payments':
        return <ProcessPaymentsView backUrl={backUrl} />;
      case 'fims-accounts-payable/data/vendors':
        return <VendorSearchView backUrl={backUrl} />;
      case 'fims-accounts-payable/action/upload-bills':
        return <UploadBillsForm backUrl={backUrl} />;
      case 'fims-accounts-payable/action/three-way-match':
        return <ThreeWayMatchView backUrl={backUrl} />;
      case 'fims-accounts-payable/reports/payments':
        return <PaymentReportView backUrl={backUrl} />;
      case 'fims-accounts-payable/action/edit-record':
      case 'fims-accounts-payable/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Accounts Payable" />;
      case 'fims-accounts-payable/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Accounts Payable" />;
      case 'fims-accounts-payable/data/invoices':
      case 'fims-accounts-payable/data/payables':
        return <GenericDataView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      case 'fims-accounts-payable/reports/aging':
        return <GenericReportView title="AP Aging Report" backUrl={backUrl} />;
      
      // FIMS Accounts Receivable Module
      case 'fims-accounts-receivable/action/new-invoice':
      case 'fims-accounts-receivable/action/add-receivable':
        return <AddReceivableForm backUrl={backUrl} />;
      case 'fims-accounts-receivable/action/send-statement':
        return <SendStatementForm backUrl={backUrl} />;
      case 'fims-accounts-receivable/action/record-payment':
        return <RecordPaymentForm backUrl={backUrl} />;
      case 'fims-accounts-receivable/data/customers':
        return <CustomerSearchView backUrl={backUrl} />;
      case 'fims-accounts-receivable/action/dunning':
        return <DunningProcessView backUrl={backUrl} />;
      case 'fims-accounts-receivable/reports/aging':
        return <ARAgingReportView backUrl={backUrl} />;
      case 'fims-accounts-receivable/action/edit-record':
      case 'fims-accounts-receivable/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Accounts Receivable" />;
      case 'fims-accounts-receivable/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Accounts Receivable" />;
      case 'fims-accounts-receivable/data/invoices':
      case 'fims-accounts-receivable/data/receivables':
        return <GenericDataView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      
      // FIMS Treasury Module
      case 'fims-treasury/action/add-bank-account':
        return <AddBankAccountForm backUrl={backUrl} />;
      case 'fims-treasury/action/bank-transfer':
        return <BankTransferForm backUrl={backUrl} />;
      case 'fims-treasury/action/currency-exchange':
        return <CurrencyExchangeForm backUrl={backUrl} />;
      case 'fims-treasury/reports/cash-forecast':
      case 'fims-treasury/reports/liquidity':
      case 'fims-treasury/reports/risk-assessment':
        return <TreasuryReportView backUrl={backUrl} reportType={featureName} />;
      case 'fims-treasury/action/edit-record':
      case 'fims-treasury/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Treasury Management" />;
      case 'fims-treasury/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Treasury" />;
      case 'fims-treasury/data/accounts':
      case 'fims-treasury/data/transactions':
        return <GenericDataView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      case 'fims-treasury/action/reconciliation':
        return <GenericActionForm title="Bank Reconciliation" backUrl={backUrl} moduleName="Treasury" />;
      
      // FIMS Budgeting Module
      case 'fims-budgeting/action/create-budget':
        return <CreateBudgetForm backUrl={backUrl} />;
      case 'fims-budgeting/action/copy-budget':
        return <CopyBudgetForm backUrl={backUrl} />;
      case 'fims-budgeting/action/update-forecast':
        return <UpdateForecastForm backUrl={backUrl} />;
      case 'fims-budgeting/action/scenario-planning':
        return <ScenarioPlanningView backUrl={backUrl} />;
      case 'fims-budgeting/reports/variance':
      case 'fims-budgeting/reports/summary':
        return <BudgetReportView backUrl={backUrl} reportType={featureName} />;
      case 'fims-budgeting/action/edit-record':
      case 'fims-budgeting/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Budgeting & Planning" />;
      case 'fims-budgeting/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Budgeting" />;
      case 'fims-budgeting/data/budgets':
        return <GenericDataView title="Budget Records" backUrl={backUrl} />;
      
      // FIMS Procurement Module
      case 'fims-procurement/action/create-po':
      case 'fims-procurement/action/new-purchase-order':
        return <CreatePurchaseOrderForm backUrl={backUrl} />;
      case 'fims-procurement/action/add-expense':
      case 'fims-procurement/action/record-expense':
        return <AddExpenseForm backUrl={backUrl} />;
      case 'fims-procurement/action/register-asset':
        return <RegisterAssetForm backUrl={backUrl} />;
      case 'fims-procurement/action/track-assets':
        return <TrackAssetsView backUrl={backUrl} />;
      case 'fims-procurement/action/vendor-evaluation':
        return <VendorEvaluationForm backUrl={backUrl} />;
      case 'fims-procurement/action/vendor-search':
      case 'fims-procurement/data/vendors':
        return <VendorSearchView backUrl={backUrl} />;
      case 'fims-procurement/reports/expense-summary':
        return <ExpenseReportView backUrl={backUrl} />;
      case 'fims-procurement/action/add-record':
        return <AddProcurementRecordForm backUrl={backUrl} />;
      case 'fims-procurement/action/edit-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Procurement" />;
      case 'fims-procurement/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Procurement" />;
      case 'fims-procurement/action/create-report':
        return <CreateProcurementReportForm backUrl={backUrl} />;
      case 'fims-procurement/action/schedule-report':
        return <ScheduleProcurementReportForm backUrl={backUrl} />;
      case 'fims-procurement/action/manage-roles':
        return <ManageRolesView backUrl={backUrl} moduleName="Procurement" />;
      
      // FIMS Compliance Module
      case 'fims-compliance/action/access-control':
        return <AccessControlView backUrl={backUrl} />;
      case 'fims-compliance/data/audit-trail':
        return <AuditTrailView backUrl={backUrl} />;
      case 'fims-compliance/action/setup-integration':
        return <SetupIntegrationForm backUrl={backUrl} />;
      case 'fims-compliance/action/security-scan':
        return <SecurityScanView backUrl={backUrl} />;
      case 'fims-compliance/reports/compliance':
      case 'fims-compliance/reports/logs':
        return <ComplianceReportView backUrl={backUrl} reportType={featureName} />;
      case 'fims-compliance/action/edit-record':
      case 'fims-compliance/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Compliance & Security" />;
      case 'fims-compliance/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Compliance" />;
      case 'fims-compliance/data/policies':
      case 'fims-compliance/data/users':
        return <GenericDataView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      
      // FIMS Commitment Control Module
      case 'fims-commitment-control/action/create-commitment':
      case 'fims-commitment-control/action/reserve-budget':
      case 'fims-commitment-control/action/release-funds':
      case 'fims-commitment-control/action/check-availability':
        return <GenericActionForm title={formatFeatureName(featureName)} backUrl={backUrl} moduleName="Commitment Control" />;
      case 'fims-commitment-control/data/commitments':
        return <GenericDataView title="Commitments" backUrl={backUrl} />;
      case 'fims-commitment-control/reports/commitments':
      case 'fims-commitment-control/reports/overspend-alerts':
      case 'fims-commitment-control/reports/budget-execution':
        return <GenericReportView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      case 'fims-commitment-control/settings/controls':
        return <GenericSettingsView title="Commitment Controls" backUrl={backUrl} />;
      case 'fims-commitment-control/action/edit-record':
      case 'fims-commitment-control/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Commitment Control" />;
      case 'fims-commitment-control/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Commitment Control" />;
      
      // FIMS Fixed Assets Module
      case 'fims-fixed-assets/action/add-asset':
      case 'fims-fixed-assets/action/transfer':
      case 'fims-fixed-assets/action/run-depreciation':
      case 'fims-fixed-assets/action/physical-verification':
      case 'fims-fixed-assets/action/disposal':
        return <GenericActionForm title={formatFeatureName(featureName)} backUrl={backUrl} moduleName="Fixed Assets" />;
      case 'fims-fixed-assets/data/assets':
        return <GenericDataView title="Asset Register" backUrl={backUrl} />;
      case 'fims-fixed-assets/reports/register':
      case 'fims-fixed-assets/reports/depreciation':
        return <GenericReportView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      case 'fims-fixed-assets/action/edit-record':
      case 'fims-fixed-assets/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Fixed Assets" />;
      case 'fims-fixed-assets/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Fixed Assets" />;
      
      // FIMS Contract Management Module
      case 'fims-contracts/action/new-contract':
      case 'fims-contracts/action/add-milestone':
      case 'fims-contracts/action/variation':
        return <GenericActionForm title={formatFeatureName(featureName)} backUrl={backUrl} moduleName="Contract Management" />;
      case 'fims-contracts/data/contracts':
      case 'fims-contracts/data/milestones':
        return <GenericDataView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      case 'fims-contracts/reports/expiry-alerts':
      case 'fims-contracts/reports/spend-analysis':
      case 'fims-contracts/reports/register':
      case 'fims-contracts/reports/vendor-performance':
        return <GenericReportView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      case 'fims-contracts/action/edit-record':
      case 'fims-contracts/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Contract Management" />;
      case 'fims-contracts/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Contract Management" />;
      
      // FIMS Project & Grant Accounting Module
      case 'fims-projects/action/new-project':
      case 'fims-projects/action/add-grant':
      case 'fims-projects/action/record-expense':
      case 'fims-projects/action/allocate-costs':
        return <GenericActionForm title={formatFeatureName(featureName)} backUrl={backUrl} moduleName="Project Accounting" />;
      case 'fims-projects/data/projects':
      case 'fims-projects/data/grants':
      case 'fims-projects/data/reports':
        return <GenericDataView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      case 'fims-projects/reports/donor-report':
      case 'fims-projects/reports/budget-actual':
      case 'fims-projects/reports/funding-analysis':
        return <GenericReportView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      case 'fims-projects/action/edit-record':
      case 'fims-projects/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Project & Grant Accounting" />;
      case 'fims-projects/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Project Accounting" />;
      
      // FIMS Reporting Module
      case 'fims-reporting/action/create-dashboard':
        return <CreateReportForm backUrl={backUrl} />;
      case 'fims-reporting/action/generate-report':
        return <GenerateFinancialReportForm backUrl={backUrl} />;
      case 'fims-reporting/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Financial Reporting" />;
      case 'fims-reporting/action/schedule-report':
        return <ScheduleReportForm backUrl={backUrl} />;
      case 'fims-reporting/action/share-dashboard':
        return <ShareDashboardForm backUrl={backUrl} />;
      case 'fims-reporting/data/explorer':
        return <DataExplorerView backUrl={backUrl} />;
      case 'fims-reporting/action/edit-record':
      case 'fims-reporting/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Financial Reporting" />;
      case 'fims-reporting/data/templates':
      case 'fims-reporting/data/reports':
        return <GenericDataView title={formatFeatureName(featureName)} backUrl={backUrl} />;
      
      // ================== NEW HRMIS MODULES ==================
      
      // HR Time, Leave & Scheduling Module
      case 'hr-time-leave/action/request-leave':
        return <LeaveRequestForm backUrl={backUrl} />;
      case 'hr-time-leave/action/submit-timesheet':
        return <TimesheetSubmissionForm backUrl={backUrl} />;
      case 'hr-time-leave/action/approve-requests':
        return <LeaveApprovalView backUrl={backUrl} />;
      case 'hr-time-leave/action/view-schedule':
        return <ShiftScheduleView backUrl={backUrl} />;
      case 'hr-time-leave/action/overtime-request':
        return <OvertimeRequestForm backUrl={backUrl} />;
      case 'hr-time-leave/action/holiday-calendar':
        return <HolidayCalendarView backUrl={backUrl} />;
      case 'hr-time-leave/action/reports':
        return <TimeLeaveReportsView backUrl={backUrl} />;
      case 'hr-time-leave/data/leave-types':
        return <LeaveTypesView backUrl={backUrl} />;
      case 'hr-time-leave/data/leave-balances':
        return <LeaveBalancesView backUrl={backUrl} />;
      case 'hr-time-leave/data/timesheets':
        return <TimesheetsListView backUrl={backUrl} />;
      case 'hr-time-leave/data/overtime-approvals':
        return <OvertimeApprovalsView backUrl={backUrl} />;
      case 'hr-time-leave/data/shift-roster':
        return <ShiftRosterView backUrl={backUrl} />;
      case 'hr-time-leave/data/shift-patterns':
        return <ShiftPatternsView backUrl={backUrl} />;
      case 'hr-time-leave/data/holiday-calendar':
        return <HolidayCalendarView backUrl={backUrl} />;
      case 'hr-time-leave/data/location-calendars':
        return <LocationCalendarsView backUrl={backUrl} />;
      case 'hr-time-leave/reports/leave-summary':
        return <LeaveSummaryReport backUrl={backUrl} />;
      case 'hr-time-leave/reports/leave-liability':
        return <LeaveLiabilityReport backUrl={backUrl} />;
      case 'hr-time-leave/reports/leave-trends':
        return <LeaveTrendsReport backUrl={backUrl} />;
      case 'hr-time-leave/reports/timesheet-summary':
        return <TimesheetSummaryReport backUrl={backUrl} />;
      case 'hr-time-leave/reports/overtime-report':
        return <OvertimeReport backUrl={backUrl} />;
      case 'hr-time-leave/reports/payroll-inputs':
        return <PayrollInputsReport backUrl={backUrl} />;
      case 'hr-time-leave/reports/shift-coverage':
        return <ShiftCoverageReport backUrl={backUrl} />;
      case 'hr-time-leave/reports/schedule-variance':
        return <ScheduleVarianceReport backUrl={backUrl} />;
      case 'hr-time-leave/reports/capacity-planning':
        return <CapacityPlanningReport backUrl={backUrl} />;
      case 'hr-time-leave/settings/leave-policies':
        return <LeavePoliciesSettings backUrl={backUrl} />;
      case 'hr-time-leave/settings/accrual-rules':
        return <AccrualRulesSettings backUrl={backUrl} />;
      case 'hr-time-leave/settings/carryover-rules':
        return <CarryoverRulesSettings backUrl={backUrl} />;
      case 'hr-time-leave/settings/approval-workflows':
        return <ApprovalWorkflowsSettings backUrl={backUrl} />;
      case 'hr-time-leave/settings/work-schedules':
        return <WorkSchedulesSettings backUrl={backUrl} />;
      case 'hr-time-leave/settings/overtime-policies':
        return <OvertimePoliciesSettings backUrl={backUrl} />;
      case 'hr-time-leave/settings/timesheet-rules':
        return <TimesheetRulesSettings backUrl={backUrl} />;
      case 'hr-time-leave/settings/pay-periods':
        return <PayPeriodsSettings backUrl={backUrl} />;
      case 'hr-time-leave/action/edit-record':
      case 'hr-time-leave/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Time, Leave & Scheduling" />;
      case 'hr-time-leave/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Time & Leave" />;

      // HR Payroll Module
      case 'hr-payroll/action/run-payroll':
        return <RunPayrollForm backUrl={backUrl} />;
      case 'hr-payroll/action/process-batch':
        return <ProcessPayrollBatchForm backUrl={backUrl} />;
      case 'hr-payroll/action/generate-payslips':
        return <GeneratePayslipsForm backUrl={backUrl} />;
      case 'hr-payroll/action/approve-payroll':
        return <ApprovePayrollView backUrl={backUrl} />;
      case 'hr-payroll/action/export-bank':
        return <ExportBankFileForm backUrl={backUrl} />;
      case 'hr-payroll/action/tax-remittance':
        return <TaxRemittanceForm backUrl={backUrl} />;
      case 'hr-payroll/data/pay-elements':
        return <PayElementsView backUrl={backUrl} />;
      case 'hr-payroll/data/deductions':
        return <DeductionsView backUrl={backUrl} />;
      case 'hr-payroll/data/payroll-history':
        return <PayrollHistoryView backUrl={backUrl} />;
      case 'hr-payroll/data/employee-earnings':
        return <EmployeeEarningsView backUrl={backUrl} />;
      case 'hr-payroll/reports/payroll-register':
        return <PayrollRegisterReport backUrl={backUrl} />;
      case 'hr-payroll/reports/tax-summary':
        return <TaxSummaryReport backUrl={backUrl} />;
      case 'hr-payroll/reports/deduction-report':
        return <DeductionReport backUrl={backUrl} />;
      case 'hr-payroll/reports/payroll-journal':
        return <PayrollJournalReport backUrl={backUrl} />;
      case 'hr-payroll/settings/pay-schedules':
        return <PaySchedulesSettings backUrl={backUrl} />;
      case 'hr-payroll/settings/tax-tables':
        return <TaxTablesSettings backUrl={backUrl} />;
      case 'hr-payroll/settings/statutory-rules':
        return <StatutoryRulesSettings backUrl={backUrl} />;
      case 'hr-payroll/action/edit-record':
      case 'hr-payroll/action/add-record':
        return <EditRecordForm backUrl={backUrl} moduleName="Payroll" />;
      case 'hr-payroll/action/export-data':
        return <ExportDataView backUrl={backUrl} moduleName="Payroll" />;

      // HR Learning Module
      case 'hr-learning/action/create-course':
        return <CreateCourseForm backUrl={backUrl} />;
      case 'hr-learning/action/enroll-employees':
        return <EnrollEmployeesForm backUrl={backUrl} />;
      case 'hr-learning/action/schedule-training':
        return <ScheduleTrainingForm backUrl={backUrl} />;
      case 'hr-learning/action/issue-certificate':
        return <IssueCertificateForm backUrl={backUrl} />;
      case 'hr-learning/action/upload-content':
        return <UploadContentForm backUrl={backUrl} />;
      case 'hr-learning/data/courses':
        return <CoursesListView backUrl={backUrl} />;
      case 'hr-learning/data/enrollments':
        return <EnrollmentsView backUrl={backUrl} />;
      case 'hr-learning/data/certifications':
        return <CertificationsView backUrl={backUrl} />;
      case 'hr-learning/data/learning-paths':
        return <LearningPathsListView backUrl={backUrl} />;
      case 'hr-learning/data/training-calendar':
        return <TrainingCalendarView backUrl={backUrl} />;
      case 'hr-learning/reports/completion-rates':
        return <CompletionRatesReport backUrl={backUrl} />;
      case 'hr-learning/reports/skills-gap':
        return <SkillsGapReport backUrl={backUrl} />;
      case 'hr-learning/reports/training-cost':
        return <TrainingCostReport backUrl={backUrl} />;
      case 'hr-learning/reports/compliance-training':
        return <ComplianceTrainingReport backUrl={backUrl} />;
      case 'hr-learning/settings/course-categories':
        return <CourseCategoriesSettings backUrl={backUrl} />;
      case 'hr-learning/settings/certification-rules':
        return <CertificationRulesSettings backUrl={backUrl} />;
      case 'hr-learning/settings/lms-integration':
        return <LMSIntegrationSettings backUrl={backUrl} />;
      case 'hr-learning/action/certifications':
        return <CertificationsManagementView backUrl={backUrl} />;
      case 'hr-learning/action/browse-courses':
        return <BrowseCoursesView backUrl={backUrl} />;
      case 'hr-learning/action/my-learning':
        return <MyLearningView backUrl={backUrl} />;
      case 'hr-learning/action/assign-training':
        return <AssignTrainingForm backUrl={backUrl} />;
      case 'hr-learning/action/compliance-training':
        return <ComplianceTrainingView backUrl={backUrl} />;
      case 'hr-learning/action/reports':
        return <LearningReportsView backUrl={backUrl} />;

      // HR Employee Relations Module
      case 'hr-employee-relations/action/log-grievance':
        return <LogGrievanceForm backUrl={backUrl} />;
      case 'hr-employee-relations/action/initiate-disciplinary':
        return <InitiateDisciplinaryForm backUrl={backUrl} />;
      case 'hr-employee-relations/action/schedule-meeting':
        return <ScheduleMeetingForm backUrl={backUrl} />;
      case 'hr-employee-relations/action/send-communication':
        return <SendCommunicationForm backUrl={backUrl} />;
      case 'hr-employee-relations/action/record-action':
        return <RecordActionForm backUrl={backUrl} />;
      case 'hr-employee-relations/action/new-case':
        return <NewCaseForm backUrl={backUrl} />;
      case 'hr-employee-relations/action/my-cases':
        return <MyCasesView backUrl={backUrl} />;
      case 'hr-employee-relations/action/grievances':
        return <GrievancesView backUrl={backUrl} />;
      case 'hr-employee-relations/action/investigations':
        return <InvestigationsView backUrl={backUrl} />;
      case 'hr-employee-relations/action/disciplinary':
        return <DisciplinaryActionsView backUrl={backUrl} />;
      case 'hr-employee-relations/action/policy-breaches':
        return <PolicyBreachesView backUrl={backUrl} />;
      case 'hr-employee-relations/action/reports':
        return <EmployeeRelationsReportsView backUrl={backUrl} />;
      case 'hr-employee-relations/data/grievances':
        return <GrievancesListView backUrl={backUrl} />;
      case 'hr-employee-relations/data/disciplinary-cases':
        return <DisciplinaryCasesView backUrl={backUrl} />;
      case 'hr-employee-relations/data/investigations':
        return <InvestigationsView backUrl={backUrl} />;
      case 'hr-employee-relations/data/warnings':
        return <WarningsView backUrl={backUrl} />;
      case 'hr-employee-relations/data/appeals':
        return <AppealsView backUrl={backUrl} />;
      case 'hr-employee-relations/reports/case-summary':
        return <CaseSummaryReport backUrl={backUrl} />;
      case 'hr-employee-relations/reports/trends-analysis':
        return <TrendsAnalysisReport backUrl={backUrl} />;
      case 'hr-employee-relations/reports/resolution-metrics':
        return <ResolutionMetricsReport backUrl={backUrl} />;
      case 'hr-employee-relations/settings/case-categories':
        return <CaseCategoriesSettings backUrl={backUrl} />;
      case 'hr-employee-relations/settings/escalation-rules':
        return <EscalationRulesSettings backUrl={backUrl} />;
      case 'hr-employee-relations/settings/resolution-workflows':
        return <ResolutionWorkflowsSettings backUrl={backUrl} />;

      // HR Offboarding Module
      case 'hr-offboarding/action/initiate-exit':
        return <InitiateExitForm backUrl={backUrl} />;
      case 'hr-offboarding/action/schedule-exit-interview':
        return <ScheduleExitInterviewForm backUrl={backUrl} />;
      case 'hr-offboarding/action/process-clearance':
        return <ProcessClearanceForm backUrl={backUrl} />;
      case 'hr-offboarding/action/generate-documents':
        return <GenerateExitDocumentsForm backUrl={backUrl} />;
      case 'hr-offboarding/action/process-final-pay':
        return <ProcessFinalPayForm backUrl={backUrl} />;
      case 'hr-offboarding/data/separations':
        return <SeparationsListView backUrl={backUrl} />;
      case 'hr-offboarding/data/exit-interviews':
        return <ExitInterviewsView backUrl={backUrl} />;
      case 'hr-offboarding/data/clearance-status':
        return <ClearanceStatusView backUrl={backUrl} />;
      case 'hr-offboarding/data/final-settlements':
        return <FinalSettlementsView backUrl={backUrl} />;
      case 'hr-offboarding/reports/turnover-analysis':
        return <TurnoverAnalysisReport backUrl={backUrl} />;
      case 'hr-offboarding/reports/exit-reasons':
        return <ExitReasonsReport backUrl={backUrl} />;
      case 'hr-offboarding/reports/clearance-audit':
        return <ClearanceAuditReport backUrl={backUrl} />;
      case 'hr-offboarding/settings/exit-checklist':
        return <ExitChecklistSettings backUrl={backUrl} />;
      case 'hr-offboarding/settings/clearance-workflow':
        return <ClearanceWorkflowSettings backUrl={backUrl} />;
      case 'hr-offboarding/settings/separation-reasons':
        return <SeparationReasonsSettings backUrl={backUrl} />;

      // HR Position Control Module
      case 'hr-position-control/action/create-position':
        return <CreatePositionForm backUrl={backUrl} />;
      case 'hr-position-control/action/create-grade':
        return <CreateGradeForm backUrl={backUrl} />;
      case 'hr-position-control/action/approve-establishment':
        return <ApproveEstablishmentForm backUrl={backUrl} />;
      case 'hr-position-control/action/request-headcount':
        return <RequestHeadcountForm backUrl={backUrl} />;
      case 'hr-position-control/data/positions':
        return <PositionsListView backUrl={backUrl} />;
      case 'hr-position-control/data/grades':
        return <GradesListView backUrl={backUrl} />;
      case 'hr-position-control/data/establishment':
        return <EstablishmentView backUrl={backUrl} />;
      case 'hr-position-control/data/vacancies':
        return <VacanciesView backUrl={backUrl} />;
      case 'hr-position-control/data/org-structure':
        return <OrgStructureView backUrl={backUrl} />;
      case 'hr-position-control/reports/establishment-report':
        return <EstablishmentReport backUrl={backUrl} />;
      case 'hr-position-control/reports/vacancy-report':
        return <VacancyReport backUrl={backUrl} />;
      case 'hr-position-control/reports/headcount-projection':
        return <HeadcountProjectionReport backUrl={backUrl} />;
      case 'hr-position-control/settings/position-types':
        return <PositionTypesSettings backUrl={backUrl} />;
      case 'hr-position-control/settings/grade-structure':
        return <GradeStructureSettings backUrl={backUrl} />;
      case 'hr-position-control/settings/approval-matrix':
        return <ApprovalMatrixSettings backUrl={backUrl} />;

      // HR Document Management Module
      case 'hr-documents/action/upload-document':
        return <UploadDocumentForm backUrl={backUrl} />;
      case 'hr-documents/action/create-template':
        return <CreateTemplateForm backUrl={backUrl} />;
      case 'hr-documents/action/generate-document':
        return <GenerateDocumentForm backUrl={backUrl} />;
      case 'hr-documents/action/request-signature':
        return <RequestSignatureForm backUrl={backUrl} />;
      case 'hr-documents/action/upload':
        return <DocumentUploadForm backUrl={backUrl} />;
      case 'hr-documents/action/generate-letter':
        return <GenerateLetterForm backUrl={backUrl} />;
      case 'hr-documents/action/search':
        return <DocumentSearchView backUrl={backUrl} />;
      case 'hr-documents/action/my-documents':
        return <MyDocumentsView backUrl={backUrl} />;
      case 'hr-documents/action/pending-signatures':
        return <PendingSignaturesView backUrl={backUrl} />;
      case 'hr-documents/action/reports':
        return <DocumentReportsView backUrl={backUrl} />;
      case 'hr-documents/data/documents':
        return <DocumentsLibraryView backUrl={backUrl} />;
      case 'hr-documents/data/templates':
        return <TemplatesView backUrl={backUrl} />;
      case 'hr-documents/data/employee-files':
        return <EmployeeFilesView backUrl={backUrl} />;
      case 'hr-documents/data/pending-signatures':
        return <PendingSignaturesView backUrl={backUrl} />;
      case 'hr-documents/data/archived':
        return <ArchivedDocumentsView backUrl={backUrl} />;
      case 'hr-documents/reports/document-audit':
        return <DocumentAuditReport backUrl={backUrl} />;
      case 'hr-documents/reports/expiring-documents':
        return <ExpiringDocumentsReport backUrl={backUrl} />;
      case 'hr-documents/reports/compliance-checklist':
        return <ComplianceChecklistReport backUrl={backUrl} />;
      case 'hr-documents/settings/document-categories':
        return <DocumentCategoriesSettings backUrl={backUrl} />;
      case 'hr-documents/settings/retention-policies':
        return <RetentionPoliciesSettings backUrl={backUrl} />;
      case 'hr-documents/settings/access-controls':
        return <DocumentAccessControlsSettings backUrl={backUrl} />;

      // Platform Governance Module
      case 'platform-governance/action/create-policy':
        return <CreatePolicyForm backUrl={backUrl} />;
      case 'platform-governance/action/configure-security':
        return <ConfigureSecurityForm backUrl={backUrl} />;
      case 'platform-governance/action/manage-roles':
        return <ManageRolesView backUrl={backUrl} moduleName="Platform Governance" />;
      case 'platform-governance/action/run-audit':
        return <RunAuditForm backUrl={backUrl} />;
      case 'platform-governance/action/configure-integration':
        return <ConfigureIntegrationForm backUrl={backUrl} />;
      case 'platform-governance/data/policies':
        return <PoliciesListView backUrl={backUrl} />;
      case 'platform-governance/data/security-settings':
        return <SecuritySettingsView backUrl={backUrl} />;
      case 'platform-governance/data/user-roles':
        return <UserRolesView backUrl={backUrl} />;
      case 'platform-governance/data/audit-logs':
        return <AuditLogsView backUrl={backUrl} />;
      case 'platform-governance/data/integrations':
        return <IntegrationsView backUrl={backUrl} />;
      case 'platform-governance/reports/security-report':
        return <SecurityReport backUrl={backUrl} />;
      case 'platform-governance/reports/access-audit':
        return <AccessAuditReport backUrl={backUrl} />;
      case 'platform-governance/reports/compliance-status':
        return <ComplianceStatusReport backUrl={backUrl} />;
      case 'platform-governance/reports/system-health':
        return <SystemHealthReport backUrl={backUrl} />;
      case 'platform-governance/settings/security-policies':
        return <SecurityPoliciesSettings backUrl={backUrl} />;
      case 'platform-governance/settings/data-retention':
        return <DataRetentionSettings backUrl={backUrl} />;
      case 'platform-governance/settings/api-configuration':
        return <APIConfigurationSettings backUrl={backUrl} />;
      
      default:
        return <DefaultFeatureView moduleName={moduleDisplayName} featureName={formattedFeatureName} featureType={featureType} backUrl={backUrl} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-900 border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href={backUrl}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Module
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {formattedFeatureName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {moduleDisplayName}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        {renderFeatureContent()}
      </div>
    </div>
  );
}

function AddEmployeeForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    employeeId: `EMP${Date.now().toString().slice(-6)}`,
    firstName: '', lastName: '', email: '', phone: '',
    department: '', position: '', jobTitle: '',
    employmentType: 'full_time', baseSalary: '', currency: 'LRD',
    startDate: new Date().toISOString().split('T')[0], city: 'Monrovia'
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/saas/hr/employees', { method: 'POST', body: JSON.stringify(data) });
    },
    onSuccess: () => {
      toast({ title: 'Employee Added', description: 'New employee has been added successfully.' });
      queryClient.invalidateQueries({ queryKey: ['/api/saas/hr/employees'] });
      setLocation(backUrl);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add employee. Please try again.', variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ ...formData, baseSalary: parseFloat(formData.baseSalary) || 0 });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Add New Employee</CardTitle>
        <CardDescription>Enter the employee details to add them to the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={formData.department} onValueChange={(v) => setFormData({...formData, department: v})}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input id="position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input id="jobTitle" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select value={formData.employmentType} onValueChange={(v) => setFormData({...formData, employmentType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Base Salary *</Label>
              <Input id="baseSalary" type="number" value={formData.baseSalary} onChange={(e) => setFormData({...formData, baseSalary: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LRD">LRD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Employee
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function OrgChartView({ backUrl }: { backUrl: string }) {
  const { data, isLoading } = useQuery({ queryKey: ['/api/saas/hr/departments'] });
  const { data: employeesData } = useQuery({ queryKey: ['/api/saas/hr/employees'] });
  
  const departments = (data as any)?.data || [];
  const employees = (employeesData as any)?.data || [];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Organization Chart</CardTitle>
        <CardDescription>View your organizational structure and reporting hierarchy.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : (
          <div className="space-y-6">
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200">
              <Building2 className="w-12 h-12 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold text-lg">Organization</h3>
              <p className="text-sm text-gray-600">{employees.length} Total Employees</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['HR', 'Finance', 'Operations', 'Sales', 'IT', 'Management'].map(dept => {
                const deptEmployees = employees.filter((e: any) => e.department === dept);
                return (
                  <div key={dept} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium">{dept}</h4>
                    <p className="text-sm text-gray-500">{deptEmployees.length} employees</p>
                    {deptEmployees.slice(0, 3).map((e: any) => (
                      <div key={e.id} className="text-xs mt-2 flex items-center gap-1">
                        <Users className="w-3 h-3" />{e.firstName} {e.lastName}
                      </div>
                    ))}
                    {deptEmployees.length > 3 && <p className="text-xs text-gray-400 mt-1">+{deptEmployees.length - 3} more</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UploadDocumentsForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ title: '', description: '', category: '', fileName: '', fileType: 'pdf' });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/hr/documents', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Document Uploaded', description: 'Document has been added successfully.' });
      setLocation(backUrl);
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Upload Document</CardTitle>
        <CardDescription>Add a new document to the document management system.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Document Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>File Name *</Label>
            <Input value={formData.fileName} onChange={(e) => setFormData({...formData, fileName: e.target.value})} placeholder="document.pdf" required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Upload Document
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function CreateWorkflowForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ name: '', description: '', type: '', triggerType: 'manual', steps: [] });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/hr/workflows', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Workflow Created', description: 'Workflow has been created successfully.' });
      setLocation(backUrl);
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Workflow className="w-5 h-5" /> Create Workflow</CardTitle>
        <CardDescription>Define an automated workflow for your organization.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Workflow Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="approval">Approval</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="offboarding">Offboarding</SelectItem>
                  <SelectItem value="leave">Leave Request</SelectItem>
                  <SelectItem value="expense">Expense Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trigger Type</Label>
              <Select value={formData.triggerType} onValueChange={(v) => setFormData({...formData, triggerType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Create Workflow
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function EmployeeSearchView({ backUrl }: { backUrl: string }) {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['/api/saas/hr/employees'] });
  const employees = (data as any)?.data || [];
  const filtered = employees.filter((e: any) => 
    `${e.firstName} ${e.lastName} ${e.email} ${e.department}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> Employee Search</CardTitle>
        <CardDescription>Search and find employees across the organization.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input placeholder="Search by name, email, or department..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No employees found</div>
        ) : (
          <div className="divide-y">
            {filtered.map((emp: any) => (
              <div key={emp.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{emp.firstName} {emp.lastName}</h4>
                  <p className="text-sm text-gray-500">{emp.jobTitle} • {emp.department}</p>
                </div>
                <Badge variant="outline">{emp.employmentStatus}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Employees List View
function EmployeesListView({ backUrl }: { backUrl: string }) {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['/api/saas/hr/employees'] });
  const employees = (data as any)?.data || [];
  const filtered = employees.filter((e: any) => 
    `${e.firstName} ${e.lastName} ${e.email} ${e.department}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Employee Directory</CardTitle>
        <CardDescription>View and manage all employees in the organization.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Link href="/saas/modules/hr-core/action/add-employee"><Button><Plus className="w-4 h-4 mr-2" /> Add Employee</Button></Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Failed to load employees</p>
            <Button variant="outline" onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-semibold">Employee</th>
                  <th className="text-left p-3 font-semibold">Department</th>
                  <th className="text-left p-3 font-semibold">Position</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-center p-3 font-semibold">Status</th>
                  <th className="text-center p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">No employees found</td></tr>
                ) : filtered.map((emp: any) => (
                  <tr key={emp.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{emp.firstName?.[0]}{emp.lastName?.[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                          <p className="text-sm text-gray-500">ID: {emp.employeeId || emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3">{emp.jobTitle}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3 text-center"><Badge variant={emp.employmentStatus === 'Active' ? 'default' : 'outline'}>{emp.employmentStatus}</Badge></td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        <Button size="sm" variant="ghost"><Search className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">Showing {filtered.length} employees</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
            <Link href={backUrl}><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Departments List View
function DepartmentsListView({ backUrl }: { backUrl: string }) {
  const departments = [
    { id: 1, name: 'Administration', head: 'John Smith', employees: 45, budget: 250000, status: 'Active' },
    { id: 2, name: 'Operations', head: 'Sarah Johnson', employees: 32, budget: 180000, status: 'Active' },
    { id: 3, name: 'Finance', head: 'Michael Brown', employees: 28, budget: 220000, status: 'Active' },
    { id: 4, name: 'IT Department', head: 'Emily Davis', employees: 25, budget: 350000, status: 'Active' },
    { id: 5, name: 'Human Resources', head: 'David Wilson', employees: 18, budget: 120000, status: 'Active' },
    { id: 6, name: 'Marketing', head: 'Lisa Anderson', employees: 8, budget: 95000, status: 'Active' },
    { id: 7, name: 'Sales', head: 'Robert Taylor', employees: 15, budget: 175000, status: 'Active' },
    { id: 8, name: 'Customer Support', head: 'Jennifer Martinez', employees: 12, budget: 85000, status: 'Active' },
  ];

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Departments</CardTitle>
        <CardDescription>View and manage organizational departments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input placeholder="Search departments..." className="max-w-sm" />
          <Button><Plus className="w-4 h-4 mr-2" /> Add Department</Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-semibold">Department</th>
                <th className="text-left p-3 font-semibold">Head</th>
                <th className="text-right p-3 font-semibold">Employees</th>
                <th className="text-right p-3 font-semibold">Budget</th>
                <th className="text-center p-3 font-semibold">Status</th>
                <th className="text-center p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-medium">{dept.name}</td>
                  <td className="p-3">{dept.head}</td>
                  <td className="p-3 text-right">{dept.employees}</td>
                  <td className="p-3 text-right font-mono">${dept.budget.toLocaleString()}</td>
                  <td className="p-3 text-center"><Badge variant="default">{dept.status}</Badge></td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-1">
                      <Button size="sm" variant="ghost"><Search className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <Link href={backUrl}><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Documents List View
function DocumentsListView({ backUrl }: { backUrl: string }) {
  const documents = [
    { id: 1, name: 'Employee Handbook 2025', type: 'Policy', size: '2.4 MB', uploadedBy: 'HR Admin', date: '2025-01-15', downloads: 145 },
    { id: 2, name: 'Leave Policy', type: 'Policy', size: '856 KB', uploadedBy: 'HR Admin', date: '2025-01-10', downloads: 89 },
    { id: 3, name: 'Onboarding Checklist', type: 'Template', size: '124 KB', uploadedBy: 'HR Manager', date: '2025-01-08', downloads: 67 },
    { id: 4, name: 'Performance Review Form', type: 'Template', size: '98 KB', uploadedBy: 'HR Manager', date: '2025-01-05', downloads: 234 },
    { id: 5, name: 'Travel Expense Report', type: 'Template', size: '156 KB', uploadedBy: 'Finance', date: '2025-01-03', downloads: 178 },
    { id: 6, name: 'IT Security Policy', type: 'Policy', size: '1.2 MB', uploadedBy: 'IT Admin', date: '2024-12-20', downloads: 56 },
    { id: 7, name: 'Dress Code Guidelines', type: 'Policy', size: '450 KB', uploadedBy: 'HR Admin', date: '2024-12-15', downloads: 92 },
  ];

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Document Library</CardTitle>
        <CardDescription>Access and manage organizational documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input placeholder="Search documents..." className="max-w-sm" />
          <Select defaultValue="all">
            <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="policy">Policy</SelectItem>
              <SelectItem value="template">Template</SelectItem>
              <SelectItem value="form">Form</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/saas/modules/hr-core/action/upload-documents"><Button><Plus className="w-4 h-4 mr-2" /> Upload Document</Button></Link>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-semibold">Document</th>
                <th className="text-left p-3 font-semibold">Type</th>
                <th className="text-right p-3 font-semibold">Size</th>
                <th className="text-left p-3 font-semibold">Uploaded By</th>
                <th className="text-left p-3 font-semibold">Date</th>
                <th className="text-right p-3 font-semibold">Downloads</th>
                <th className="text-center p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </td>
                  <td className="p-3"><Badge variant="outline">{doc.type}</Badge></td>
                  <td className="p-3 text-right text-gray-500">{doc.size}</td>
                  <td className="p-3">{doc.uploadedBy}</td>
                  <td className="p-3">{doc.date}</td>
                  <td className="p-3 text-right">{doc.downloads}</td>
                  <td className="p-3 text-center">
                    <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <Link href={backUrl}><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Bulk Operations View
function BulkOperationsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> Bulk Operations</CardTitle>
        <CardDescription>Perform bulk operations on employee data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => toast({ title: 'Bulk Import Started' })}>
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-8 h-8 text-blue-500" />
              <div>
                <h4 className="font-semibold">Import Employees</h4>
                <p className="text-sm text-gray-500">Upload CSV/Excel file to import employee data</p>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => toast({ title: 'Export Started' })}>
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-8 h-8 text-green-500" />
              <div>
                <h4 className="font-semibold">Export Employees</h4>
                <p className="text-sm text-gray-500">Download employee data as CSV/Excel</p>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => toast({ title: 'Bulk Update Form Opened' })}>
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-orange-500" />
              <div>
                <h4 className="font-semibold">Bulk Update</h4>
                <p className="text-sm text-gray-500">Update multiple employee records at once</p>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => toast({ title: 'Data Validation Started' })}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8 text-purple-500" />
              <div>
                <h4 className="font-semibold">Validate Data</h4>
                <p className="text-sm text-gray-500">Check data integrity and find issues</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function AddApplicantForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', positionApplied: '', source: '' });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/hr/applicants', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Applicant Added', description: 'Applicant has been added to the system.' });
      setLocation(backUrl);
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Add Applicant</CardTitle>
        <CardDescription>Add a new job applicant to the recruitment pipeline.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Position Applied *</Label>
              <Input value={formData.positionApplied} onChange={(e) => setFormData({...formData, positionApplied: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={formData.source} onValueChange={(v) => setFormData({...formData, source: v})}>
                <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="indeed">Indeed</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="website">Company Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Add Applicant
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function CreatePurchaseOrderForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    poNumber: `PO${Date.now().toString().slice(-8)}`,
    vendorId: '', vendorName: '', orderDate: new Date().toISOString().split('T')[0],
    subtotal: '', taxAmount: '0', totalAmount: '', notes: '', currency: 'LRD'
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/fims/purchase-orders', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Purchase Order Created', description: 'PO has been created successfully.' });
      setLocation(backUrl);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = parseFloat(formData.subtotal) || 0;
    const tax = parseFloat(formData.taxAmount) || 0;
    mutation.mutate({ ...formData, subtotal, taxAmount: tax, totalAmount: subtotal + tax, vendorId: formData.vendorName });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Create Purchase Order</CardTitle>
        <CardDescription>Create a new purchase order for goods or services.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PO Number</Label>
              <Input value={formData.poNumber} disabled className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>Order Date *</Label>
              <Input type="date" value={formData.orderDate} onChange={(e) => setFormData({...formData, orderDate: e.target.value})} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Vendor Name *</Label>
            <Input value={formData.vendorName} onChange={(e) => setFormData({...formData, vendorName: e.target.value})} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Subtotal *</Label>
              <Input type="number" step="0.01" value={formData.subtotal} onChange={(e) => setFormData({...formData, subtotal: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Tax Amount</Label>
              <Input type="number" step="0.01" value={formData.taxAmount} onChange={(e) => setFormData({...formData, taxAmount: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LRD">LRD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Create Purchase Order
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AddExpenseForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    expenseNumber: `EXP${Date.now().toString().slice(-8)}`,
    employeeId: '', category: '', description: '', amount: '',
    expenseDate: new Date().toISOString().split('T')[0], vendorName: '', currency: 'LRD'
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/fims/expenses', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Expense Recorded', description: 'Expense has been recorded successfully.' });
      setLocation(backUrl);
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5" /> Record Expense</CardTitle>
        <CardDescription>Record a new expense for tracking and reimbursement.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ ...formData, amount: parseFloat(formData.amount), employeeId: 'current-user' }); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expense Number</Label>
              <Input value={formData.expenseNumber} disabled className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input type="date" value={formData.expenseDate} onChange={(e) => setFormData({...formData, expenseDate: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="meals">Meals</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vendor Name</Label>
              <Input value={formData.vendorName} onChange={(e) => setFormData({...formData, vendorName: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LRD">LRD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Record Expense
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function RegisterAssetForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    assetTag: `AST${Date.now().toString().slice(-8)}`,
    name: '', description: '', category: '', serialNumber: '',
    manufacturer: '', model: '', purchasePrice: '', location: '', condition: 'good'
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/fims/assets', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Asset Registered', description: 'Asset has been registered successfully.' });
      setLocation(backUrl);
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> Register Asset</CardTitle>
        <CardDescription>Register a new asset for tracking and management.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ ...formData, purchasePrice: parseFloat(formData.purchasePrice) || 0, currentValue: parseFloat(formData.purchasePrice) || 0 }); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asset Tag</Label>
              <Input value={formData.assetTag} disabled className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Asset Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Manufacturer</Label>
              <Input value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Serial Number</Label>
              <Input value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Purchase Price</Label>
              <Input type="number" step="0.01" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={formData.condition} onValueChange={(v) => setFormData({...formData, condition: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Register Asset
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function TrackAssetsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const assets = [
    { tag: 'AST-001', name: 'MacBook Pro 16"', category: 'Technology', location: 'HQ - Floor 2', status: 'active', value: '$2,499', assignedTo: 'John Smith', purchaseDate: '2024-03-15', warranty: '2027-03-15' },
    { tag: 'AST-002', name: 'Conference Table', category: 'Furniture', location: 'Meeting Room A', status: 'active', value: '$850', assignedTo: 'Facilities', purchaseDate: '2023-08-20', warranty: 'N/A' },
    { tag: 'AST-003', name: 'Toyota Hilux', category: 'Vehicle', location: 'Fleet Parking', status: 'maintenance', value: '$35,000', assignedTo: 'Operations', purchaseDate: '2022-11-10', warranty: '2027-11-10' },
    { tag: 'AST-004', name: 'Dell Monitor 27"', category: 'Technology', location: 'HQ - Floor 3', status: 'active', value: '$450', assignedTo: 'Sarah Johnson', purchaseDate: '2024-01-05', warranty: '2027-01-05' }
  ];
  
  const handleView = (asset: any) => { setSelectedAsset(asset); setShowDetails(true); };
  const handleTransfer = (asset: any) => { toast({ title: 'Transfer Initiated', description: `Transfer request for ${asset.name} started.` }); };
  const handleMaintenance = (asset: any) => { toast({ title: 'Maintenance Scheduled', description: `${asset.name} scheduled for maintenance review.` }); };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> Asset Tracking</CardTitle>
        <CardDescription>Track and manage organization assets.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input placeholder="Search by tag, name, or location..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
          <Link href="/saas/modules/fims-procurement/action/register-asset"><Button><Plus className="w-4 h-4 mr-2" /> Add Asset</Button></Link>
        </div>
        
        {showDetails && selectedAsset ? (
          <div className="border rounded-lg p-6 mb-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{selectedAsset.name}</h3>
                <p className="text-sm text-gray-500">{selectedAsset.tag}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowDetails(false)}>Close</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Category:</span> <span className="font-medium">{selectedAsset.category}</span></div>
              <div><span className="text-gray-500">Value:</span> <span className="font-medium">{selectedAsset.value}</span></div>
              <div><span className="text-gray-500">Location:</span> <span className="font-medium">{selectedAsset.location}</span></div>
              <div><span className="text-gray-500">Status:</span> <Badge variant={selectedAsset.status === 'active' ? 'default' : 'secondary'}>{selectedAsset.status}</Badge></div>
              <div><span className="text-gray-500">Assigned To:</span> <span className="font-medium">{selectedAsset.assignedTo}</span></div>
              <div><span className="text-gray-500">Purchase Date:</span> <span className="font-medium">{selectedAsset.purchaseDate}</span></div>
              <div><span className="text-gray-500">Warranty Until:</span> <span className="font-medium">{selectedAsset.warranty}</span></div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button size="sm" onClick={() => handleTransfer(selectedAsset)}><Users className="w-4 h-4 mr-2" /> Transfer</Button>
              <Button size="sm" variant="outline" onClick={() => handleMaintenance(selectedAsset)}><Clock className="w-4 h-4 mr-2" /> Schedule Maintenance</Button>
              <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2" /> Export QR Code</Button>
            </div>
          </div>
        ) : null}
        
        <div className="space-y-3">
          {assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.tag.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase())).map((asset, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <div className="flex-1 cursor-pointer" onClick={() => handleView(asset)}>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-gray-500">{asset.tag}</span>
                  <h4 className="font-medium">{asset.name}</h4>
                </div>
                <p className="text-sm text-gray-500">{asset.category} • {asset.location} • {asset.assignedTo}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <Badge variant={asset.status === 'active' ? 'default' : 'secondary'}>{asset.status}</Badge>
                  <p className="text-sm font-semibold mt-1">{asset.value}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleView(asset)} title="View Details"><Search className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleTransfer(asset)} title="Transfer"><Users className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleMaintenance(asset)} title="Maintenance"><Settings className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function VendorEvaluationForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ vendorName: '', qualityScore: 4, deliveryScore: 4, priceScore: 4, communicationScore: 4, notes: '' });
  const avgScore = ((formData.qualityScore + formData.deliveryScore + formData.priceScore + formData.communicationScore) / 4).toFixed(1);
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Star className="w-5 h-5" /> Vendor Evaluation</CardTitle>
        <CardDescription>Evaluate vendor performance based on key metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Evaluation Submitted', description: `Average score: ${avgScore}/5` }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Vendor Name *</Label><Input value={formData.vendorName} onChange={(e) => setFormData({...formData, vendorName: e.target.value})} required placeholder="Select or enter vendor name" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Quality (1-5)</Label><Input type="number" min="1" max="5" value={formData.qualityScore} onChange={(e) => setFormData({...formData, qualityScore: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Delivery (1-5)</Label><Input type="number" min="1" max="5" value={formData.deliveryScore} onChange={(e) => setFormData({...formData, deliveryScore: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Price (1-5)</Label><Input type="number" min="1" max="5" value={formData.priceScore} onChange={(e) => setFormData({...formData, priceScore: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Communication (1-5)</Label><Input type="number" min="1" max="5" value={formData.communicationScore} onChange={(e) => setFormData({...formData, communicationScore: Number(e.target.value)})} /></div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-sm text-gray-600">Overall Score</p>
            <p className="text-2xl font-bold text-blue-600">{avgScore}/5</p>
          </div>
          <div className="space-y-2"><Label>Notes</Label><Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Additional comments about vendor performance..." /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Submit Evaluation</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function AddProcurementRecordForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    recordId: `REC${Date.now().toString().slice(-8)}`,
    recordType: 'purchase_order',
    vendorName: '',
    description: '',
    amount: '',
    currency: 'LRD',
    status: 'pending',
    requestDate: new Date().toISOString().split('T')[0],
    requiredDate: '',
    notes: ''
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/fims/procurement-records', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Record Created', description: 'Procurement record has been created successfully.' });
      queryClient.invalidateQueries({ queryKey: ['/api/saas/fims/procurement-records'] });
      setLocation(backUrl);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create record. Please try again.', variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ ...formData, amount: parseFloat(formData.amount) || 0 });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Add Procurement Record</CardTitle>
        <CardDescription>Create a new procurement record in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Record ID</Label>
              <Input value={formData.recordId} disabled className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>Record Type *</Label>
              <Select value={formData.recordType} onValueChange={(v) => setFormData({...formData, recordType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase_order">Purchase Order</SelectItem>
                  <SelectItem value="requisition">Requisition</SelectItem>
                  <SelectItem value="expense">Expense Claim</SelectItem>
                  <SelectItem value="asset">Asset Registration</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="quote">Quote Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Vendor / Supplier Name *</Label>
            <Input value={formData.vendorName} onChange={(e) => setFormData({...formData, vendorName: e.target.value})} placeholder="Enter vendor or supplier name" required />
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the procurement..." required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LRD">LRD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Request Date *</Label>
              <Input type="date" value={formData.requestDate} onChange={(e) => setFormData({...formData, requestDate: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Required By Date</Label>
              <Input type="date" value={formData.requiredDate} onChange={(e) => setFormData({...formData, requiredDate: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Any additional notes..." />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Record
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function CreateProcurementReportForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    reportName: '',
    reportType: 'expense_summary',
    dateFrom: '',
    dateTo: '',
    includeVendors: true,
    includePurchaseOrders: true,
    includeExpenses: true,
    includeAssets: false,
    format: 'pdf'
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Create Procurement Report</CardTitle>
        <CardDescription>Generate a custom procurement report.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Report Generated', description: `${formData.reportName} has been created.` }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Report Name *</Label>
            <Input value={formData.reportName} onChange={(e) => setFormData({...formData, reportName: e.target.value})} placeholder="Enter report name" required />
          </div>
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={formData.reportType} onValueChange={(v) => setFormData({...formData, reportType: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="expense_summary">Expense Summary</SelectItem>
                <SelectItem value="vendor_spend">Vendor Spend Analysis</SelectItem>
                <SelectItem value="purchase_orders">Purchase Orders Report</SelectItem>
                <SelectItem value="asset_register">Asset Register</SelectItem>
                <SelectItem value="budget_variance">Budget Variance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input type="date" value={formData.dateFrom} onChange={(e) => setFormData({...formData, dateFrom: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input type="date" value={formData.dateTo} onChange={(e) => setFormData({...formData, dateTo: e.target.value})} />
            </div>
          </div>
          <div className="space-y-3">
            <Label>Include in Report</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'includeVendors', label: 'Vendors' },
                { key: 'includePurchaseOrders', label: 'Purchase Orders' },
                { key: 'includeExpenses', label: 'Expenses' },
                { key: 'includeAssets', label: 'Assets' }
              ].map(item => (
                <label key={item.key} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" checked={(formData as any)[item.key]} onChange={(e) => setFormData({...formData, [item.key]: e.target.checked})} />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={formData.format} onValueChange={(v) => setFormData({...formData, format: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit"><Download className="w-4 h-4 mr-2" /> Generate Report</Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ScheduleProcurementReportForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    reportName: '',
    reportType: 'expense_summary',
    frequency: 'weekly',
    dayOfWeek: 'monday',
    time: '09:00',
    recipients: '',
    format: 'pdf'
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Schedule Report</CardTitle>
        <CardDescription>Set up automatic report generation and delivery.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Report Scheduled', description: `${formData.reportName} will be sent ${formData.frequency}.` }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Report Name *</Label>
            <Input value={formData.reportName} onChange={(e) => setFormData({...formData, reportName: e.target.value})} placeholder="Enter report name" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={formData.reportType} onValueChange={(v) => setFormData({...formData, reportType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense_summary">Expense Summary</SelectItem>
                  <SelectItem value="vendor_spend">Vendor Spend Analysis</SelectItem>
                  <SelectItem value="purchase_orders">Purchase Orders Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={formData.frequency} onValueChange={(v) => setFormData({...formData, frequency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select value={formData.dayOfWeek} onValueChange={(v) => setFormData({...formData, dayOfWeek: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email Recipients</Label>
            <Input value={formData.recipients} onChange={(e) => setFormData({...formData, recipients: e.target.value})} placeholder="email@example.com, other@example.com" />
            <p className="text-xs text-gray-500">Separate multiple emails with commas</p>
          </div>
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={formData.format} onValueChange={(v) => setFormData({...formData, format: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit"><Calendar className="w-4 h-4 mr-2" /> Schedule Report</Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function EditRecordForm({ backUrl, moduleName }: { backUrl: string; moduleName: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const recordId = new URLSearchParams(location.split('?')[1] || '').get('id') || '';
  
  const [formData, setFormData] = useState({
    recordId: recordId,
    recordType: 'expense',
    name: 'Office Supplies Purchase',
    vendorName: 'Office Depot',
    description: 'Monthly office supplies procurement',
    amount: '2450',
    currency: 'USD',
    status: 'approved',
    date: '2024-01-15',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Record Updated', description: 'The record has been updated successfully.' });
    setLocation(backUrl);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Edit Record</CardTitle>
        <CardDescription>Update the details for record {recordId}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Record ID</Label>
              <Input value={formData.recordId} disabled className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>Record Type</Label>
              <Select value={formData.recordType} onValueChange={(v) => setFormData({...formData, recordType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="purchase_order">Purchase Order</SelectItem>
                  <SelectItem value="asset">Asset</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Vendor / Supplier</Label>
            <Input value={formData.vendorName} onChange={(e) => setFormData({...formData, vendorName: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LRD">LRD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Additional notes..." />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ManageRolesView({ backUrl, moduleName }: { backUrl: string; moduleName: string }) {
  const { toast } = useToast();
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', users: 2, permissions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { id: 2, name: 'Manager', users: 5, permissions: ['view', 'create', 'edit', 'approve'] },
    { id: 3, name: 'Staff', users: 12, permissions: ['view', 'create'] },
    { id: 4, name: 'Viewer', users: 8, permissions: ['view'] }
  ]);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      setRoles([...roles, { id: Date.now(), name: newRoleName, users: 0, permissions: ['view'] }]);
      setNewRoleName('');
      setShowAddRole(false);
      toast({ title: 'Role Added', description: `${newRoleName} role has been created.` });
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Manage Roles - {moduleName}</CardTitle>
        <CardDescription>Configure access roles and permissions for this module.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{roles.length} roles configured</p>
          <Button onClick={() => setShowAddRole(!showAddRole)}>
            <Plus className="w-4 h-4 mr-2" /> Add Role
          </Button>
        </div>
        
        {showAddRole && (
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-3">
            <Label>New Role Name</Label>
            <div className="flex gap-2">
              <Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="Enter role name" />
              <Button onClick={handleAddRole}>Add</Button>
              <Button variant="outline" onClick={() => setShowAddRole(false)}>Cancel</Button>
            </div>
          </div>
        )}
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Users</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Permissions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {roles.map(role => (
                <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-4 py-3 font-medium">{role.name}</td>
                  <td className="px-4 py-3">{role.users} users</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map(p => (
                        <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" onClick={() => toast({ title: 'Edit Role', description: `Editing ${role.name} role...` })}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex gap-4 pt-4">
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Module</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function AddPayableForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    vendorId: '', vendorName: '', invoiceNumber: '', invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '', amount: '', description: '', currency: 'LRD'
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/fims/accounts-payable', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Payable Added', description: 'Accounts payable entry has been created.' });
      setLocation(backUrl);
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Add Payable</CardTitle>
        <CardDescription>Record a new accounts payable entry.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); const amt = parseFloat(formData.amount); mutation.mutate({ ...formData, vendorId: formData.vendorName, amount: amt, outstandingAmount: amt }); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Vendor Name *</Label>
            <Input value={formData.vendorName} onChange={(e) => setFormData({...formData, vendorName: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Number *</Label>
              <Input value={formData.invoiceNumber} onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Date *</Label>
              <Input type="date" value={formData.invoiceDate} onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Add Payable
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AddReceivableForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    customerId: '', customerName: '', invoiceNumber: `INV${Date.now().toString().slice(-8)}`,
    invoiceDate: new Date().toISOString().split('T')[0], dueDate: '', amount: '', description: '', currency: 'LRD'
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/fims/accounts-receivable', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Receivable Added', description: 'Accounts receivable entry has been created.' });
      setLocation(backUrl);
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Banknote className="w-5 h-5" /> Add Receivable</CardTitle>
        <CardDescription>Record a new accounts receivable entry.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); const amt = parseFloat(formData.amount); mutation.mutate({ ...formData, customerId: formData.customerName, amount: amt, outstandingAmount: amt }); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Customer Name *</Label>
            <Input value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input value={formData.invoiceNumber} disabled className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Date *</Label>
              <Input type="date" value={formData.invoiceDate} onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Add Receivable
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function JournalEntryForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    journalId: `JE${Date.now().toString().slice(-8)}`,
    accountId: '', transactionDate: new Date().toISOString().split('T')[0],
    reference: '', description: '', debitAmount: '', creditAmount: '', currency: 'LRD'
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/fims/general-ledger', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Journal Entry Created', description: 'Journal entry has been recorded.' });
      setLocation(backUrl);
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Journal Entry</CardTitle>
        <CardDescription>Create a new general ledger journal entry.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ ...formData, debitAmount: parseFloat(formData.debitAmount) || 0, creditAmount: parseFloat(formData.creditAmount) || 0, accountId: formData.reference }); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Journal ID</Label>
              <Input value={formData.journalId} disabled className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label>Transaction Date *</Label>
              <Input type="date" value={formData.transactionDate} onChange={(e) => setFormData({...formData, transactionDate: e.target.value})} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reference *</Label>
            <Input value={formData.reference} onChange={(e) => setFormData({...formData, reference: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Debit Amount</Label>
              <Input type="number" step="0.01" value={formData.debitAmount} onChange={(e) => setFormData({...formData, debitAmount: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Credit Amount</Label>
              <Input type="number" step="0.01" value={formData.creditAmount} onChange={(e) => setFormData({...formData, creditAmount: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Create Entry
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AddBankAccountForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    accountName: '', accountNumber: '', bankName: '', bankBranch: '',
    accountType: 'checking', currency: 'LRD', currentBalance: '0'
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/fims/bank-accounts', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Bank Account Added', description: 'Bank account has been registered.' });
      setLocation(backUrl);
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Banknote className="w-5 h-5" /> Add Bank Account</CardTitle>
        <CardDescription>Register a new bank account for treasury management.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ ...formData, currentBalance: parseFloat(formData.currentBalance), availableBalance: parseFloat(formData.currentBalance) }); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Account Name *</Label>
            <Input value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account Number *</Label>
              <Input value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select value={formData.accountType} onValueChange={(v) => setFormData({...formData, accountType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="money_market">Money Market</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bank Name *</Label>
              <Input value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Bank Branch</Label>
              <Input value={formData.bankBranch} onChange={(e) => setFormData({...formData, bankBranch: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Opening Balance</Label>
              <Input type="number" step="0.01" value={formData.currentBalance} onChange={(e) => setFormData({...formData, currentBalance: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LRD">LRD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Add Bank Account
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function CreateBudgetForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '', description: '', budgetYear: new Date().getFullYear(),
    budgetPeriod: 'annual', totalBudget: '', startDate: '', endDate: '', currency: 'LRD'
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/saas/fims/budgets', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: 'Budget Created', description: 'Budget has been created successfully.' });
      setLocation(backUrl);
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Create Budget</CardTitle>
        <CardDescription>Create a new budget for planning and tracking.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); const total = parseFloat(formData.totalBudget); mutation.mutate({ ...formData, totalBudget: total, remainingBudget: total }); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Budget Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Budget Year *</Label>
              <Input type="number" value={formData.budgetYear} onChange={(e) => setFormData({...formData, budgetYear: parseInt(e.target.value)})} required />
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={formData.budgetPeriod} onValueChange={(v) => setFormData({...formData, budgetPeriod: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Total Budget *</Label>
              <Input type="number" step="0.01" value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Create Budget
            </Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function VendorSearchView({ backUrl }: { backUrl: string }) {
  const [search, setSearch] = useState('');
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> Vendor Search</CardTitle>
        <CardDescription>Search and manage vendor records.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input placeholder="Search vendors by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
        </div>
        <div className="text-center py-8 text-gray-500">Enter a search term to find vendors.</div>
        <div className="flex gap-4 pt-4">
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerSearchView({ backUrl }: { backUrl: string }) {
  const [search, setSearch] = useState('');
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Customer Lookup</CardTitle>
        <CardDescription>Search and manage customer records.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input placeholder="Search customers by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
        </div>
        <div className="text-center py-8 text-gray-500">Enter a search term to find customers.</div>
        <div className="flex gap-4 pt-4">
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ExpenseReportView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5" /> Expense Report</CardTitle>
        <CardDescription>View and analyze expense reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold">$12,450</p>
            <p className="text-sm text-gray-500">Total Expenses (MTD)</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold">45</p>
            <p className="text-sm text-gray-500">Transactions</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-gray-500">Pending Approval</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button><Download className="w-4 h-4 mr-2" /> Export Report</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ProcessPaymentsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  
  const pendingPayments = [
    { id: 'PAY-001', vendor: 'ABC Suppliers Ltd', invoice: 'INV-2025-0123', amount: 4500.00, dueDate: 'Jan 28, 2025', status: 'pending', paymentMethod: 'Bank Transfer' },
    { id: 'PAY-002', vendor: 'TechServe Solutions', invoice: 'INV-2025-0089', amount: 12750.00, dueDate: 'Jan 30, 2025', status: 'pending', paymentMethod: 'Bank Transfer' },
    { id: 'PAY-003', vendor: 'Office Essentials Inc', invoice: 'INV-2025-0156', amount: 890.50, dueDate: 'Feb 01, 2025', status: 'pending', paymentMethod: 'Check' },
    { id: 'PAY-004', vendor: 'Logistics Partners', invoice: 'INV-2025-0201', amount: 3200.00, dueDate: 'Feb 05, 2025', status: 'approved', paymentMethod: 'Bank Transfer' },
    { id: 'PAY-005', vendor: 'Maintenance Pro', invoice: 'INV-2025-0178', amount: 1500.00, dueDate: 'Feb 10, 2025', status: 'pending', paymentMethod: 'Mobile Money' },
  ];
  
  const togglePayment = (id: string) => {
    setSelectedPayments(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };
  
  const selectAll = () => {
    setSelectedPayments(selectedPayments.length === pendingPayments.length ? [] : pendingPayments.map(p => p.id));
  };
  
  const processPayments = () => {
    if (selectedPayments.length === 0) {
      toast({ title: 'No Payments Selected', description: 'Please select at least one payment to process.', variant: 'destructive' });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast({ title: 'Payments Processed', description: `${selectedPayments.length} payment(s) have been submitted for processing.` });
      setSelectedPayments([]);
    }, 2000);
  };
  
  const totalSelected = pendingPayments.filter(p => selectedPayments.includes(p.id)).reduce((sum, p) => sum + p.amount, 0);
  
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Process Payments</CardTitle>
        <CardDescription>Review and process pending vendor payments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-600">{pendingPayments.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">${pendingPayments.reduce((s, p) => s + p.amount, 0).toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">${totalSelected.toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Selected ({selectedPayments.length})</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={selectedPayments.length === pendingPayments.length} onChange={selectAll} className="w-4 h-4" />
            <span className="text-sm">Select All</span>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Methods</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem><SelectItem value="check">Check</SelectItem><SelectItem value="mobile">Mobile Money</SelectItem></SelectContent></Select>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-3 py-2 text-left w-10"></th>
                <th className="px-3 py-2 text-left">Vendor</th>
                <th className="px-3 py-2 text-left">Invoice</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-center">Due Date</th>
                <th className="px-3 py-2 text-center">Method</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map(payment => (
                <tr key={payment.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => togglePayment(payment.id)}>
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedPayments.includes(payment.id)} onChange={(e) => { e.stopPropagation(); togglePayment(payment.id); }} onClick={(e) => e.stopPropagation()} className="w-4 h-4" /></td>
                  <td className="px-3 py-3 font-medium">{payment.vendor}</td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-400">{payment.invoice}</td>
                  <td className="px-3 py-3 text-right font-medium">${payment.amount.toLocaleString()}</td>
                  <td className="px-3 py-3 text-center text-sm">{payment.dueDate}</td>
                  <td className="px-3 py-3 text-center text-sm">{payment.paymentMethod}</td>
                  <td className="px-3 py-3 text-center"><Badge variant={payment.status === 'approved' ? 'default' : 'secondary'}>{payment.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex gap-4 pt-4">
          <Button onClick={processPayments} disabled={processing || selectedPayments.length === 0}>
            {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : <><DollarSign className="w-4 h-4 mr-2" /> Process Selected ({selectedPayments.length})</>}
          </Button>
          <Button variant="outline" onClick={() => toast({ title: 'Export Started', description: 'Payment batch file is being generated.' })}><Download className="w-4 h-4 mr-2" /> Export Batch</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentReportView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Payment Report</CardTitle>
        <CardDescription>View payment history and analytics.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold">$45,230</p>
            <p className="text-sm text-gray-500">Total Paid (MTD)</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold">$12,450</p>
            <p className="text-sm text-gray-500">Outstanding</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function RecordPaymentForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ invoiceNumber: '', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'bank_transfer', reference: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Payment Recorded', description: 'Payment has been recorded successfully.' });
    setLocation(backUrl);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Record Payment</CardTitle>
        <CardDescription>Record a payment received from a customer.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Number *</Label>
              <Input value={formData.invoiceNumber} onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payment Date *</Label>
              <Input type="date" value={formData.paymentDate} onChange={(e) => setFormData({...formData, paymentDate: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({...formData, paymentMethod: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit"><Save className="w-4 h-4 mr-2" /> Record Payment</Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ARAgingReportView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> AR Aging Report</CardTitle>
        <CardDescription>Accounts receivable aging analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">$125,000</p>
            <p className="text-sm text-gray-500">Current</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">$45,000</p>
            <p className="text-sm text-gray-500">1-30 Days</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">$12,000</p>
            <p className="text-sm text-gray-500">31-60 Days</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">$8,500</p>
            <p className="text-sm text-gray-500">60+ Days</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function BankTransferForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ fromAccount: '', toAccount: '', amount: '', reference: '', transferDate: new Date().toISOString().split('T')[0] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Transfer Initiated', description: 'Bank transfer has been initiated.' });
    setLocation(backUrl);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Banknote className="w-5 h-5" /> Bank Transfer</CardTitle>
        <CardDescription>Initiate a bank transfer between accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Account *</Label>
              <Input value={formData.fromAccount} onChange={(e) => setFormData({...formData, fromAccount: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>To Account *</Label>
              <Input value={formData.toAccount} onChange={(e) => setFormData({...formData, toAccount: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Transfer Date *</Label>
              <Input type="date" value={formData.transferDate} onChange={(e) => setFormData({...formData, transferDate: e.target.value})} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reference</Label>
            <Input value={formData.reference} onChange={(e) => setFormData({...formData, reference: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit"><Save className="w-4 h-4 mr-2" /> Initiate Transfer</Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function TreasuryReportView({ backUrl, reportType }: { backUrl: string; reportType: string }) {
  const title = reportType === 'cash-forecast' ? 'Cash Forecast' : reportType === 'liquidity' ? 'Liquidity Report' : 'Risk Assessment';
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> {title}</CardTitle>
        <CardDescription>Treasury management analytics and forecasting.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">$1.85M</p>
            <p className="text-sm text-gray-500">Cash Position</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">$450K</p>
            <p className="text-sm text-gray-500">Investments</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">Low</p>
            <p className="text-sm text-gray-500">Risk Level</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function BudgetReportView({ backUrl, reportType }: { backUrl: string; reportType: string }) {
  const title = reportType === 'variance' ? 'Variance Analysis' : 'Budget Summary';
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> {title}</CardTitle>
        <CardDescription>Budget performance and variance analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">$2.8M</p>
            <p className="text-sm text-gray-500">Annual Budget</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">$1.9M</p>
            <p className="text-sm text-gray-500">YTD Actual</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">3.2%</p>
            <p className="text-sm text-gray-500">Variance</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function RegisterDeviceForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ deviceName: '', deviceType: 'fingerprint', location: '', serialNumber: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Device Registered', description: 'Biometric device has been registered.' });
    setLocation(backUrl);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Register Device</CardTitle>
        <CardDescription>Register a new biometric device.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Device Name *</Label>
              <Input value={formData.deviceName} onChange={(e) => setFormData({...formData, deviceName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Device Type</Label>
              <Select value={formData.deviceType} onValueChange={(v) => setFormData({...formData, deviceType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fingerprint">Fingerprint Scanner</SelectItem>
                  <SelectItem value="facial">Facial Recognition</SelectItem>
                  <SelectItem value="card">Card Reader</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Serial Number</Label>
              <Input value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit"><Save className="w-4 h-4 mr-2" /> Register Device</Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AttendanceView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Attendance Records</CardTitle>
        <CardDescription>View daily attendance records.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">147</p>
            <p className="text-sm text-gray-500">Present</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">12</p>
            <p className="text-sm text-gray-500">Late</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">8</p>
            <p className="text-sm text-gray-500">Absent</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">5</p>
            <p className="text-sm text-gray-500">On Leave</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ShiftScheduleForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ shiftName: '', startTime: '09:00', endTime: '17:00', department: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Shift Created', description: 'Shift schedule has been created.' });
    setLocation(backUrl);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Create Shift Schedule</CardTitle>
        <CardDescription>Define a new work shift schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Shift Name *</Label>
            <Input value={formData.shiftName} onChange={(e) => setFormData({...formData, shiftName: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time *</Label>
              <Input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>End Time *</Label>
              <Input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={formData.department} onValueChange={(v) => setFormData({...formData, department: v})}>
              <SelectTrigger><SelectValue placeholder="All Departments" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit"><Save className="w-4 h-4 mr-2" /> Create Shift</Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Biometrics Punch Clock System
function PunchClockView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [todayRecords, setTodayRecords] = useState([
    { id: 1, type: 'In', time: '08:02 AM', location: 'Main Entrance', method: 'Fingerprint' },
    { id: 2, type: 'Break Out', time: '12:00 PM', location: 'Main Entrance', method: 'Fingerprint' },
    { id: 3, type: 'Break In', time: '01:00 PM', location: 'Main Entrance', method: 'Fingerprint' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handlePunchIn = () => {
    setIsPunchedIn(true);
    setPunchInTime(new Date());
    const newRecord = {
      id: todayRecords.length + 1,
      type: 'In',
      time: formatTime(new Date()),
      location: 'Web Portal',
      method: 'PIN/Password'
    };
    setTodayRecords([...todayRecords, newRecord]);
    toast({ title: 'Punched In', description: `You have successfully punched in at ${formatTime(new Date())}` });
  };

  const handlePunchOut = () => {
    setIsPunchedIn(false);
    const newRecord = {
      id: todayRecords.length + 1,
      type: 'Out',
      time: formatTime(new Date()),
      location: 'Web Portal',
      method: 'PIN/Password'
    };
    setTodayRecords([...todayRecords, newRecord]);
    toast({ title: 'Punched Out', description: `You have successfully punched out at ${formatTime(new Date())}` });
  };

  const calculateWorkHours = () => {
    if (!punchInTime) return '0:00:00';
    const diff = currentTime.getTime() - punchInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2"><Clock className="w-6 h-6" /> Biometric Punch Clock</CardTitle>
          <CardDescription>Record your attendance using the digital punch clock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
              <p className="text-5xl font-mono font-bold text-blue-600 dark:text-blue-400">{formatTime(currentTime)}</p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">{formatDate(currentTime)}</p>
            </div>
            
            <div className="flex justify-center gap-4">
              {!isPunchedIn ? (
                <Button size="lg" className="px-12 py-6 text-xl bg-green-600 hover:bg-green-700" onClick={handlePunchIn}>
                  <CheckCircle2 className="w-6 h-6 mr-3" /> Punch In
                </Button>
              ) : (
                <Button size="lg" className="px-12 py-6 text-xl bg-red-600 hover:bg-red-700" onClick={handlePunchOut}>
                  <Clock className="w-6 h-6 mr-3" /> Punch Out
                </Button>
              )}
            </div>

            {isPunchedIn && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Session</p>
                <p className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">{calculateWorkHours()}</p>
                <p className="text-sm text-gray-500">Started at {punchInTime ? formatTime(punchInTime) : '-'}</p>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4 pt-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={isPunchedIn ? 'default' : 'secondary'}>{isPunchedIn ? 'Working' : 'Off Clock'}</Badge>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-sm text-gray-500">Shift</p>
                <p className="font-semibold">Morning</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold">IT</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-sm text-gray-500">Today's Total</p>
                <p className="font-semibold">7h 25m</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Punch Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Time</th>
                  <th className="text-left p-3 font-semibold">Location</th>
                  <th className="text-left p-3 font-semibold">Method</th>
                </tr>
              </thead>
              <tbody>
                {todayRecords.map((record) => (
                  <tr key={record.id} className="border-t">
                    <td className="p-3">
                      <Badge variant={record.type === 'In' || record.type === 'Break In' ? 'default' : 'secondary'}>{record.type}</Badge>
                    </td>
                    <td className="p-3 font-mono">{record.time}</td>
                    <td className="p-3">{record.location}</td>
                    <td className="p-3">{record.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 pt-4">
            <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Module</Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Export Timesheet View
function ExportTimesheetView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('this-month');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast({ title: 'Export Complete', description: `Timesheet exported as ${exportFormat.toUpperCase()} successfully.` });
    }, 1500);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5" /> Export Timesheet</CardTitle>
        <CardDescription>Export attendance and timesheet data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger><SelectValue placeholder="Select date range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
              <SelectItem value="xlsx">Excel Workbook (.xlsx)</SelectItem>
              <SelectItem value="pdf">PDF Report</SelectItem>
              <SelectItem value="json">JSON Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold mb-2">Export Preview</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>Records to export: <strong>342</strong></p>
            <p>Employees included: <strong>156</strong></p>
            <p>Date range: <strong>{dateRange === 'this-month' ? 'January 1-31, 2025' : dateRange}</strong></p>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Exporting...</> : <><Download className="w-4 h-4 mr-2" /> Export Data</>}
          </Button>
          <Link href={backUrl}><Button variant="outline">Cancel</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Device Diagnostics View
function DeviceDiagnosticsView({ backUrl }: { backUrl: string }) {
  const devices = [
    { id: 'DEV001', name: 'Main Entrance', model: 'ZKTeco K40', ip: '192.168.1.101', status: 'Online', lastSync: '2 mins ago', records: 1245 },
    { id: 'DEV002', name: 'Back Door', model: 'ZKTeco K40', ip: '192.168.1.102', status: 'Online', lastSync: '5 mins ago', records: 892 },
    { id: 'DEV003', name: 'Warehouse', model: 'ZKTeco UA760', ip: '192.168.2.101', status: 'Offline', lastSync: '2 hours ago', records: 456 },
    { id: 'DEV004', name: 'Office Floor 2', model: 'HID DigitalPersona', ip: '192.168.1.103', status: 'Online', lastSync: '1 min ago', records: 678 },
    { id: 'DEV005', name: 'Parking Gate', model: 'ZKTeco InBio', ip: '192.168.2.102', status: 'Warning', lastSync: '30 mins ago', records: 234 },
  ];

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Device Diagnostics</CardTitle>
        <CardDescription>Monitor and troubleshoot biometric devices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">3</p>
            <p className="text-sm text-gray-500">Online</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">1</p>
            <p className="text-sm text-gray-500">Offline</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">1</p>
            <p className="text-sm text-gray-500">Warning</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">3,505</p>
            <p className="text-sm text-gray-500">Total Records</p>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-semibold">Device</th>
                <th className="text-left p-3 font-semibold">Model</th>
                <th className="text-left p-3 font-semibold">IP Address</th>
                <th className="text-center p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Last Sync</th>
                <th className="text-right p-3 font-semibold">Records</th>
                <th className="text-center p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-gray-500">{device.id}</p>
                  </td>
                  <td className="p-3">{device.model}</td>
                  <td className="p-3 font-mono text-sm">{device.ip}</td>
                  <td className="p-3 text-center">
                    <Badge variant={device.status === 'Online' ? 'default' : device.status === 'Warning' ? 'secondary' : 'destructive'}>{device.status}</Badge>
                  </td>
                  <td className="p-3">{device.lastSync}</td>
                  <td className="p-3 text-right font-mono">{device.records}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-1">
                      <Button size="sm" variant="ghost"><Search className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6">
          <Button><Download className="w-4 h-4 mr-2" /> Sync All Devices</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Daily Attendance Report
function DailyAttendanceReportView({ backUrl }: { backUrl: string }) {
  const attendanceData = [
    { name: 'John Smith', department: 'IT', checkIn: '08:02 AM', checkOut: '05:15 PM', hours: '9h 13m', status: 'Present' },
    { name: 'Sarah Johnson', department: 'Marketing', checkIn: '08:45 AM', checkOut: '05:00 PM', hours: '8h 15m', status: 'Late' },
    { name: 'Michael Brown', department: 'Sales', checkIn: '08:00 AM', checkOut: '04:30 PM', hours: '8h 30m', status: 'Present' },
    { name: 'Emily Davis', department: 'HR', checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' },
    { name: 'Robert Wilson', department: 'Operations', checkIn: '07:55 AM', checkOut: '06:30 PM', hours: '10h 35m', status: 'Overtime' },
  ];

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Daily Attendance Report</CardTitle>
        <CardDescription>Attendance summary for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">142</p>
            <p className="text-sm text-gray-500">Present</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">8</p>
            <p className="text-sm text-gray-500">Late</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">3</p>
            <p className="text-sm text-gray-500">Absent</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-500">On Leave</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">12</p>
            <p className="text-sm text-gray-500">Overtime</p>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-semibold">Employee</th>
                <th className="text-left p-3 font-semibold">Department</th>
                <th className="text-left p-3 font-semibold">Check In</th>
                <th className="text-left p-3 font-semibold">Check Out</th>
                <th className="text-left p-3 font-semibold">Hours</th>
                <th className="text-center p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3">{row.department}</td>
                  <td className="p-3 font-mono">{row.checkIn}</td>
                  <td className="p-3 font-mono">{row.checkOut}</td>
                  <td className="p-3 font-mono">{row.hours}</td>
                  <td className="p-3 text-center">
                    <Badge variant={row.status === 'Present' ? 'default' : row.status === 'Late' ? 'secondary' : row.status === 'Overtime' ? 'outline' : 'destructive'}>{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6">
          <Button><Download className="w-4 h-4 mr-2" /> Export Report</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Tardiness Report View
function TardinessReportView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Tardiness & Absence Report</CardTitle>
        <CardDescription>Track late arrivals and absences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">45</p>
            <p className="text-sm text-gray-500">Late This Month</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">12</p>
            <p className="text-sm text-gray-500">Absences</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">94%</p>
            <p className="text-sm text-gray-500">Punctuality Rate</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="p-3 border rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">Sarah Johnson</p>
              <p className="text-sm text-gray-500">Marketing - 5 late arrivals</p>
            </div>
            <Badge variant="secondary">Frequent</Badge>
          </div>
          <div className="p-3 border rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">David Lee</p>
              <p className="text-sm text-gray-500">Sales - 3 late arrivals</p>
            </div>
            <Badge variant="outline">Moderate</Badge>
          </div>
        </div>
        <div className="flex gap-4 pt-6">
          <Button><Download className="w-4 h-4 mr-2" /> Export Report</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Overtime Report View
function OvertimeReportView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Overtime Analysis</CardTitle>
        <CardDescription>Track and analyze overtime hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">245h</p>
            <p className="text-sm text-gray-500">Total OT Hours</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">32</p>
            <p className="text-sm text-gray-500">Employees w/ OT</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">7.6h</p>
            <p className="text-sm text-gray-500">Avg per Person</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-600">$12,250</p>
            <p className="text-sm text-gray-500">OT Cost</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="p-3 border rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">Operations Department</p>
              <p className="text-sm text-gray-500">85 hours - 12 employees</p>
            </div>
            <Badge>Highest</Badge>
          </div>
          <div className="p-3 border rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">IT Department</p>
              <p className="text-sm text-gray-500">65 hours - 8 employees</p>
            </div>
            <Badge variant="secondary">High</Badge>
          </div>
        </div>
        <div className="flex gap-4 pt-6">
          <Button><Download className="w-4 h-4 mr-2" /> Export Report</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Performance Dashboard View
function PerformanceDashboardView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Performance Dashboard</CardTitle>
        <CardDescription>Department and employee performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">96.2%</p>
            <p className="text-sm text-gray-500">Attendance Rate</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">98.5%</p>
            <p className="text-sm text-gray-500">Punctuality</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">8.2h</p>
            <p className="text-sm text-gray-500">Avg Work Hours</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-600">4.2</p>
            <p className="text-sm text-gray-500">Productivity Score</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-4">Top Performing Departments</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span>IT Department</span><Badge>98%</Badge></div>
              <div className="flex justify-between items-center"><span>Finance</span><Badge variant="secondary">97%</Badge></div>
              <div className="flex justify-between items-center"><span>Operations</span><Badge variant="secondary">95%</Badge></div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-4">Improvement Needed</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span>Marketing</span><Badge variant="outline">89%</Badge></div>
              <div className="flex justify-between items-center"><span>Sales</span><Badge variant="outline">88%</Badge></div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-6">
          <Button><Download className="w-4 h-4 mr-2" /> Export Dashboard</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom Report Form
function CustomReportForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Create Custom Report</CardTitle>
        <CardDescription>Build a custom attendance report</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Report Created' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Report Name *</Label>
            <Input placeholder="Enter report name" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Input type="date" required />
            </div>
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Input type="date" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Include Fields</Label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Check-in Time</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Check-out Time</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Total Hours</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Overtime</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Late Arrivals</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Early Departures</label>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit"><Save className="w-4 h-4 mr-2" /> Generate Report</Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Grace Period Settings
function GracePeriodSettingsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Grace Period Settings</CardTitle>
        <CardDescription>Configure late arrival tolerance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Grace Period (minutes)</Label>
          <Input type="number" defaultValue="15" />
          <p className="text-sm text-gray-500">Employees arriving within this time won't be marked late</p>
        </div>
        <div className="space-y-2">
          <Label>Apply To</Label>
          <Select defaultValue="all">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="morning">Morning Shift Only</SelectItem>
              <SelectItem value="evening">Evening Shift Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 pt-4">
          <Button onClick={() => toast({ title: 'Settings Saved' })}><Save className="w-4 h-4 mr-2" /> Save Settings</Button>
          <Link href={backUrl}><Button variant="outline">Cancel</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Overtime Rules Settings
function OvertimeRulesSettingsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Overtime Rules</CardTitle>
        <CardDescription>Configure overtime calculation rules</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Daily Threshold (hours)</Label>
            <Input type="number" defaultValue="8" />
          </div>
          <div className="space-y-2">
            <Label>Weekly Threshold (hours)</Label>
            <Input type="number" defaultValue="40" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Overtime Rate Multiplier</Label>
          <Select defaultValue="1.5">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1.25">1.25x (25% extra)</SelectItem>
              <SelectItem value="1.5">1.5x (50% extra)</SelectItem>
              <SelectItem value="2.0">2.0x (Double time)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 pt-4">
          <Button onClick={() => toast({ title: 'Settings Saved' })}><Save className="w-4 h-4 mr-2" /> Save Settings</Button>
          <Link href={backUrl}><Button variant="outline">Cancel</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Break Rules Settings
function BreakRulesSettingsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Break Time Rules</CardTitle>
        <CardDescription>Configure break time policies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Lunch Break</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" defaultValue="60" />
              </div>
              <div className="space-y-2">
                <Label>Paid/Unpaid</Label>
                <Select defaultValue="unpaid">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Short Breaks</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" defaultValue="15" />
              </div>
              <div className="space-y-2">
                <Label>Number per Day</Label>
                <Input type="number" defaultValue="2" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button onClick={() => toast({ title: 'Settings Saved' })}><Save className="w-4 h-4 mr-2" /> Save Settings</Button>
          <Link href={backUrl}><Button variant="outline">Cancel</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Network Diagnostics View
function NetworkDiagnosticsView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Network Diagnostics</CardTitle>
        <CardDescription>Network connectivity and device communication status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Main Office Network</h4>
                <p className="text-sm text-gray-500">192.168.1.0/24</p>
              </div>
              <Badge variant="default">Connected - 6 devices</Badge>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Warehouse Network</h4>
                <p className="text-sm text-gray-500">192.168.2.0/24</p>
              </div>
              <Badge variant="secondary">Partial - 1/2 devices</Badge>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Connection Test Results</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Database Server</span><span className="text-green-600">OK (12ms)</span></div>
              <div className="flex justify-between"><span>Sync Server</span><span className="text-green-600">OK (45ms)</span></div>
              <div className="flex justify-between"><span>Backup Server</span><span className="text-green-600">OK (78ms)</span></div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-6">
          <Button><Settings className="w-4 h-4 mr-2" /> Run Full Diagnostics</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function AuditTrailView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> Audit Trail</CardTitle>
        <CardDescription>View system audit logs and activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 border rounded-lg flex justify-between items-center">
            <div><Badge variant="outline" className="mr-2">INFO</Badge>User login successful</div>
            <span className="text-sm text-gray-500">2 mins ago</span>
          </div>
          <div className="p-3 border rounded-lg flex justify-between items-center">
            <div><Badge variant="outline" className="mr-2">CHANGE</Badge>Employee record updated</div>
            <span className="text-sm text-gray-500">15 mins ago</span>
          </div>
          <div className="p-3 border rounded-lg flex justify-between items-center">
            <div><Badge variant="outline" className="mr-2">CREATE</Badge>New purchase order created</div>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </div>
        </div>
        <div className="flex gap-4 pt-6">
          <Button><Download className="w-4 h-4 mr-2" /> Export Logs</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ComplianceReportView({ backUrl, reportType }: { backUrl: string; reportType: string }) {
  const title = reportType === 'compliance' ? 'Compliance Report' : 'System Logs';
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> {title}</CardTitle>
        <CardDescription>Compliance status and audit reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">98%</p>
            <p className="text-sm text-gray-500">Security Score</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">100%</p>
            <p className="text-sm text-gray-500">Compliance Rate</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg text-center">
            <p className="text-xl font-bold">1.2K</p>
            <p className="text-sm text-gray-500">Audit Events</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateReportForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ reportName: '', reportType: 'financial', dateRange: 'monthly', format: 'pdf' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Report Generated', description: 'Your report is being generated.' });
    setLocation(backUrl);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Generate Report</CardTitle>
        <CardDescription>Create a new financial report or dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Report Name *</Label>
            <Input value={formData.reportName} onChange={(e) => setFormData({...formData, reportName: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={formData.reportType} onValueChange={(v) => setFormData({...formData, reportType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial Statement</SelectItem>
                  <SelectItem value="budget">Budget Report</SelectItem>
                  <SelectItem value="expense">Expense Report</SelectItem>
                  <SelectItem value="custom">Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={formData.dateRange} onValueChange={(v) => setFormData({...formData, dateRange: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit"><Save className="w-4 h-4 mr-2" /> Generate Report</Button>
            <Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function DataExplorerView({ backUrl }: { backUrl: string }) {
  const [search, setSearch] = useState('');
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> Data Explorer</CardTitle>
        <CardDescription>Explore and query your financial data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input placeholder="Search data tables..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <h4 className="font-medium">Transactions</h4>
            <p className="text-sm text-gray-500">1,245 records</p>
          </div>
          <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <h4 className="font-medium">Accounts</h4>
            <p className="text-sm text-gray-500">89 records</p>
          </div>
          <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <h4 className="font-medium">Budgets</h4>
            <p className="text-sm text-gray-500">24 records</p>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// HR Core - Bulk Import
function BulkImportForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5" /> Bulk Import</CardTitle>
        <CardDescription>Import employee data from spreadsheet files.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Download className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Drag and drop your CSV or Excel file here</p>
            <p className="text-sm text-gray-400 mt-2">Supported formats: .csv, .xlsx</p>
          </div>
          <Button onClick={() => toast({ title: 'Template Downloaded', description: 'Import template has been downloaded.' })}>
            <Download className="w-4 h-4 mr-2" /> Download Template
          </Button>
        </div>
        <div className="flex gap-4 pt-6">
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

// HR Recruitment Components
function ReviewApplicationsView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Review Applications</CardTitle>
        <CardDescription>Review and process job applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg flex justify-between items-center">
            <div><h4 className="font-medium">John Smith</h4><p className="text-sm text-gray-500">Software Developer • Applied 2 days ago</p></div>
            <Badge>New</Badge>
          </div>
          <div className="p-4 border rounded-lg flex justify-between items-center">
            <div><h4 className="font-medium">Sarah Johnson</h4><p className="text-sm text-gray-500">Project Manager • Applied 3 days ago</p></div>
            <Badge variant="outline">Under Review</Badge>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ScheduleInterviewForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ candidateName: '', position: '', interviewDate: '', interviewTime: '', interviewType: 'in-person' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Schedule Interview</CardTitle>
        <CardDescription>Schedule an interview with a candidate.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Interview Scheduled' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Candidate Name *</Label><Input value={formData.candidateName} onChange={(e) => setFormData({...formData, candidateName: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Position *</Label><Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Date *</Label><Input type="date" value={formData.interviewDate} onChange={(e) => setFormData({...formData, interviewDate: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Time *</Label><Input type="time" value={formData.interviewTime} onChange={(e) => setFormData({...formData, interviewTime: e.target.value})} required /></div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Schedule</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function SendOfferForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ candidateName: '', position: '', salary: '', startDate: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Send Offer Letter</CardTitle>
        <CardDescription>Generate and send an offer letter to a candidate.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Offer Sent' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Candidate *</Label><Input value={formData.candidateName} onChange={(e) => setFormData({...formData, candidateName: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Position *</Label><Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Salary *</Label><Input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Start Date *</Label><Input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required /></div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Send Offer</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function CandidateSearchView({ backUrl }: { backUrl: string }) {
  const [search, setSearch] = useState('');
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> Candidate Search</CardTitle>
        <CardDescription>Search through applicant database.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4"><Input placeholder="Search candidates..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" /></div>
        <div className="text-center py-8 text-gray-500">Enter a search term to find candidates.</div>
        <div className="flex gap-4 pt-4"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ExportDataView({ backUrl, moduleName }: { backUrl: string; moduleName: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5" /> Export {moduleName} Data</CardTitle>
        <CardDescription>Export data in various formats.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => toast({ title: 'Exporting CSV...' })}><Download className="w-4 h-4 mr-2" /> CSV</Button>
            <Button variant="outline" onClick={() => toast({ title: 'Exporting Excel...' })}><Download className="w-4 h-4 mr-2" /> Excel</Button>
            <Button variant="outline" onClick={() => toast({ title: 'Exporting PDF...' })}><Download className="w-4 h-4 mr-2" /> PDF</Button>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

// HR Talent Components
function PerformanceReviewForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ employeeName: '', reviewPeriod: '', rating: '', comments: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Performance Review</CardTitle>
        <CardDescription>Create or update employee performance review.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Review Saved' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee *</Label><Input value={formData.employeeName} onChange={(e) => setFormData({...formData, employeeName: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Review Period *</Label>
              <Select value={formData.reviewPeriod} onValueChange={(v) => setFormData({...formData, reviewPeriod: v})}>
                <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
                <SelectContent><SelectItem value="q1">Q1 2025</SelectItem><SelectItem value="q2">Q2 2025</SelectItem><SelectItem value="q3">Q3 2025</SelectItem><SelectItem value="q4">Q4 2025</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Rating</Label>
            <Select value={formData.rating} onValueChange={(v) => setFormData({...formData, rating: v})}>
              <SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger>
              <SelectContent><SelectItem value="5">Exceptional</SelectItem><SelectItem value="4">Exceeds Expectations</SelectItem><SelectItem value="3">Meets Expectations</SelectItem><SelectItem value="2">Needs Improvement</SelectItem><SelectItem value="1">Unsatisfactory</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Comments</Label><Textarea value={formData.comments} onChange={(e) => setFormData({...formData, comments: e.target.value})} /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Save Review</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function LearningPathsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  const paths = [
    { id: 'leadership', name: 'Leadership Development', courses: 12, hours: 40, popular: true, skills: ['Management', 'Communication', 'Decision Making'] },
    { id: 'technical', name: 'Technical Excellence', courses: 8, hours: 24, popular: false, skills: ['Software Development', 'Problem Solving', 'Technical Skills'] },
    { id: 'project', name: 'Project Management', courses: 10, hours: 30, popular: false, skills: ['Planning', 'Risk Management', 'Stakeholder Management'] },
    { id: 'communication', name: 'Communication Skills', courses: 6, hours: 18, popular: false, skills: ['Presentation', 'Writing', 'Interpersonal Skills'] },
  ];
  
  const handleAssign = (pathId: string) => {
    setSelectedPath(pathId);
    setShowAssignModal(true);
  };
  
  const confirmAssignment = () => {
    toast({ title: 'Learning Path Assigned', description: 'The selected employees have been enrolled in this learning path.' });
    setShowAssignModal(false);
    setSelectedPath(null);
  };
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Learning Paths</CardTitle>
              <CardDescription>Browse and assign learning paths to employees based on their development needs.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href="/saas/modules/hr-learning/action/create-course"><Button size="sm"><Plus className="w-4 h-4 mr-2" /> Create Course</Button></Link>
              <Link href="/saas/modules/hr-talent/action/skills-gap-analysis"><Button size="sm" variant="outline"><BarChart3 className="w-4 h-4 mr-2" /> Skills Gap Analysis</Button></Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paths.map((path) => (
              <div key={path.id} className="p-4 border rounded-lg hover:border-blue-400 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{path.name}</h4>
                  {path.popular && <Badge className="bg-green-100 text-green-800">Popular</Badge>}
                </div>
                <p className="text-sm text-gray-500 mb-2">{path.courses} courses • {path.hours} hours</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {path.skills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAssign(path.id)}><UserPlus className="w-4 h-4 mr-1" /> Assign to Employee</Button>
                  <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1" /> View Courses</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {showAssignModal && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Assign Learning Path</CardTitle>
            <CardDescription>Select employees to enroll in "{paths.find(p => p.id === selectedPath)?.name}"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Select Employees</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Choose employees or group" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="dept-it">IT Department</SelectItem>
                    <SelectItem value="dept-hr">HR Department</SelectItem>
                    <SelectItem value="dept-finance">Finance Department</SelectItem>
                    <SelectItem value="managers">All Managers</SelectItem>
                    <SelectItem value="individual">Select Individual...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Deadline</Label><Input type="date" /></div>
              </div>
              <div className="space-y-2"><Label>Notes (Optional)</Label><Textarea placeholder="Add any notes for the assigned employees..." /></div>
              <div className="flex gap-3">
                <Button onClick={confirmAssignment}><CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Assignment</Button>
                <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex gap-4"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
    </div>
  );
}

function GoalSettingForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ goalTitle: '', category: '', targetDate: '', description: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Set Goals</CardTitle>
        <CardDescription>Create performance goals for employees.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Goal Created' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Goal Title *</Label><Input value={formData.goalTitle} onChange={(e) => setFormData({...formData, goalTitle: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent><SelectItem value="performance">Performance</SelectItem><SelectItem value="development">Development</SelectItem><SelectItem value="project">Project</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Target Date</Label><Input type="date" value={formData.targetDate} onChange={(e) => setFormData({...formData, targetDate: e.target.value})} /></div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Create Goal</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function SkillsAssessmentForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Skills Assessment</CardTitle>
        <CardDescription>Assess and track employee skills.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg"><div className="flex justify-between"><span>Technical Skills</span><Badge>Advanced</Badge></div></div>
          <div className="p-4 border rounded-lg"><div className="flex justify-between"><span>Communication</span><Badge variant="outline">Intermediate</Badge></div></div>
          <div className="p-4 border rounded-lg"><div className="flex justify-between"><span>Leadership</span><Badge variant="outline">Beginner</Badge></div></div>
        </div>
        <div className="flex gap-4 pt-6">
          <Button onClick={() => { toast({ title: 'Assessment Started' }); setLocation(backUrl); }}><Save className="w-4 h-4 mr-2" /> Start Assessment</Button>
          <Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function CareerDevelopmentView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Career Development</CardTitle>
        <CardDescription>Plan and track career development paths.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><h4 className="font-medium">Current Role: Software Developer</h4><p className="text-sm text-gray-500">Level 2 • 2 years experience</p></div>
          <div className="p-4 border rounded-lg"><h4 className="font-medium">Next Steps</h4><ul className="text-sm text-gray-500 mt-2 list-disc list-inside"><li>Complete leadership training</li><li>Lead 2 major projects</li><li>Mentor junior developers</li></ul></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function SuccessionPlanningView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Succession Planning</CardTitle>
        <CardDescription>Plan for key role transitions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg"><h4 className="font-medium">CFO Position</h4><p className="text-sm text-gray-500">2 successors identified • High priority</p><Badge className="mt-2">Critical Role</Badge></div>
          <div className="p-4 border rounded-lg"><h4 className="font-medium">IT Director</h4><p className="text-sm text-gray-500">3 successors identified • Medium priority</p></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function SkillsGapAnalysisView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [assignmentData, setAssignmentData] = useState({ path: '', deadline: '', notes: '' });
  
  const employees = [
    { id: 'john', name: 'John Smith', role: 'Software Engineer', gaps: ['Cloud Architecture', 'Leadership'], recommended: 'technical', recommendedName: 'Technical Excellence Path' },
    { id: 'sarah', name: 'Sarah Johnson', role: 'Team Lead', gaps: ['Strategic Planning', 'Conflict Resolution'], recommended: 'leadership', recommendedName: 'Leadership Development Path' },
    { id: 'michael', name: 'Michael Brown', role: 'Project Manager', gaps: ['Agile Methodology', 'Risk Management'], recommended: 'project', recommendedName: 'Project Management Path' },
    { id: 'emily', name: 'Emily Davis', role: 'HR Specialist', gaps: ['Data Analytics', 'Employment Law'], recommended: 'hr', recommendedName: 'HR Excellence Path' },
  ];
  
  const handleAssign = (empId: string, recommendedPath: string) => {
    setSelectedEmployee(empId);
    setAssignmentData({ ...assignmentData, path: recommendedPath });
  };
  
  const confirmAssignment = () => {
    const emp = employees.find(e => e.id === selectedEmployee);
    toast({ title: 'Training Assigned Successfully', description: `${emp?.recommendedName} has been assigned to ${emp?.name}. They will receive an email notification.` });
    setSelectedEmployee(null);
    setAssignmentData({ path: '', deadline: '', notes: '' });
  };
  
  const exportReport = () => {
    toast({ title: 'Report Exported', description: 'Skills Gap Analysis report has been downloaded as PDF.' });
  };
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Skills Gap Analysis</CardTitle>
              <CardDescription>Identify employee skill gaps and recommend appropriate training paths.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={exportReport}><Download className="w-4 h-4 mr-2" /> Export Report</Button>
              <Link href="/saas/modules/hr-talent/action/learning-paths"><Button size="sm"><BookOpen className="w-4 h-4 mr-2" /> View Learning Paths</Button></Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-red-600">24</p><p className="text-sm text-gray-500">Employees with Gaps</p></div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-yellow-600">48</p><p className="text-sm text-gray-500">Skills to Develop</p></div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-green-600">12</p><p className="text-sm text-gray-500">Paths Available</p></div>
          </div>
          
          <div className="space-y-4">
            {employees.map((emp) => (
              <div key={emp.id} className={`p-4 border rounded-lg transition-colors ${selectedEmployee === emp.id ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{emp.name}</h4>
                    <p className="text-sm text-gray-500">{emp.role}</p>
                  </div>
                  {selectedEmployee !== emp.id && (
                    <Button size="sm" onClick={() => handleAssign(emp.id, emp.recommended)}><UserPlus className="w-4 h-4 mr-1" /> Assign Training</Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-sm text-gray-500">Skills gaps:</span>
                  {emp.gaps.map((gap, j) => (
                    <Badge key={j} variant="destructive" className="text-xs">{gap}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500">Recommended:</span>
                  <Badge className="bg-blue-100 text-blue-800">{emp.recommendedName}</Badge>
                </div>
                
                {selectedEmployee === emp.id && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-900 border rounded-lg space-y-4">
                    <h5 className="font-medium flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Assign Training to {emp.name}</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Learning Path</Label>
                        <Select value={assignmentData.path} onValueChange={(v) => setAssignmentData({...assignmentData, path: v})}>
                          <SelectTrigger><SelectValue placeholder="Select path" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="leadership">Leadership Development (40 hrs)</SelectItem>
                            <SelectItem value="technical">Technical Excellence (24 hrs)</SelectItem>
                            <SelectItem value="project">Project Management (30 hrs)</SelectItem>
                            <SelectItem value="hr">HR Excellence (20 hrs)</SelectItem>
                            <SelectItem value="communication">Communication Skills (18 hrs)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Completion Deadline</Label><Input type="date" value={assignmentData.deadline} onChange={(e) => setAssignmentData({...assignmentData, deadline: e.target.value})} /></div>
                    </div>
                    <div className="space-y-2"><Label>Notes (Optional)</Label><Textarea value={assignmentData.notes} onChange={(e) => setAssignmentData({...assignmentData, notes: e.target.value})} placeholder="Add any notes for the employee..." /></div>
                    <div className="flex gap-3">
                      <Button onClick={confirmAssignment}><CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Assignment</Button>
                      <Button variant="outline" onClick={() => setSelectedEmployee(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
    </div>
  );
}

function AssignTrainingForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ employee: '', trainingType: '', path: '', deadline: '' });
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Assign Training</CardTitle>
        <CardDescription>Assign learning paths or courses to employees based on their development needs.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Training Assigned', description: 'The employee has been enrolled in the selected training.' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Employee *</Label>
            <Select value={formData.employee} onValueChange={(v) => setFormData({...formData, employee: v})}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="john">John Smith - Software Engineer</SelectItem>
                <SelectItem value="sarah">Sarah Johnson - Team Lead</SelectItem>
                <SelectItem value="michael">Michael Brown - Project Manager</SelectItem>
                <SelectItem value="emily">Emily Davis - HR Specialist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Training Type *</Label>
            <Select value={formData.trainingType} onValueChange={(v) => setFormData({...formData, trainingType: v})}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="path">Learning Path (Multiple Courses)</SelectItem>
                <SelectItem value="course">Single Course</SelectItem>
                <SelectItem value="certification">Certification Program</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Learning Path / Course *</Label>
            <Select value={formData.path} onValueChange={(v) => setFormData({...formData, path: v})}>
              <SelectTrigger><SelectValue placeholder="Select path or course" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="leadership">Leadership Development (12 courses, 40 hrs)</SelectItem>
                <SelectItem value="technical">Technical Excellence (8 courses, 24 hrs)</SelectItem>
                <SelectItem value="project">Project Management (10 courses, 30 hrs)</SelectItem>
                <SelectItem value="communication">Communication Skills (6 courses, 18 hrs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Completion Deadline</Label><Input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><UserPlus className="w-4 h-4 mr-2" /> Assign Training</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function CreateLearningPathForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ name: '', description: '', targetAudience: '', duration: '' });
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Create Learning Path</CardTitle>
        <CardDescription>Design a structured learning path by combining multiple courses.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Learning Path Created', description: 'You can now add courses and assign employees.' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Path Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Sales Excellence Program" required /></div>
          <div className="space-y-2"><Label>Description *</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the learning objectives and outcomes..." required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Target Audience</Label>
              <Select value={formData.targetAudience} onValueChange={(v) => setFormData({...formData, targetAudience: v})}>
                <SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="managers">Managers</SelectItem>
                  <SelectItem value="technical">Technical Staff</SelectItem>
                  <SelectItem value="new">New Hires</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Est. Duration (hours)</Label><Input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="40" /></div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">After creating the path, you can:</p>
            <ul className="text-sm text-gray-500 list-disc list-inside">
              <li>Add courses from the course library</li>
              <li>Set course order and prerequisites</li>
              <li>Assign employees to this path</li>
            </ul>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Create Path</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

// HR Compensation Components
function CalculatePayrollForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ payPeriod: '', department: 'all' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Calculate Payroll</CardTitle>
        <CardDescription>Run payroll calculation for a pay period.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Payroll Calculated', description: 'Processing 156 employees' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Pay Period *</Label>
              <Select value={formData.payPeriod} onValueChange={(v) => setFormData({...formData, payPeriod: v})}>
                <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
                <SelectContent><SelectItem value="jan-2025">January 2025</SelectItem><SelectItem value="feb-2025">February 2025</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Department</Label>
              <Select value={formData.department} onValueChange={(v) => setFormData({...formData, department: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Departments</SelectItem><SelectItem value="hr">HR</SelectItem><SelectItem value="finance">Finance</SelectItem><SelectItem value="operations">Operations</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Calculate Payroll</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function MobilePaymentsView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Mobile Money Payments</CardTitle>
        <CardDescription>Process salary payments via mobile money.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center"><p className="text-xl font-bold">L$4.2M</p><p className="text-sm text-gray-500">MTN Mobile Money</p></div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"><p className="text-xl font-bold">L$2.8M</p><p className="text-sm text-gray-500">Orange Money</p></div>
        </div>
        <Button className="w-full"><CreditCard className="w-4 h-4 mr-2" /> Process Mobile Payments</Button>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function TaxReportsView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Tax Reports</CardTitle>
        <CardDescription>Generate tax reports and filings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">PAYE Report</h4><p className="text-sm text-gray-500">Pay As You Earn tax summary</p></div><Button variant="outline"><Download className="w-4 h-4 mr-2" /> Generate</Button></div>
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Social Security Report</h4><p className="text-sm text-gray-500">NASSIT contributions</p></div><Button variant="outline"><Download className="w-4 h-4 mr-2" /> Generate</Button></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function BenefitsAdminView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Benefits Administration</CardTitle>
        <CardDescription>Manage employee benefits and enrollments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center"><p className="text-xl font-bold">89%</p><p className="text-sm text-gray-500">Health Insurance</p></div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"><p className="text-xl font-bold">156</p><p className="text-sm text-gray-500">Enrolled</p></div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center"><p className="text-xl font-bold">12</p><p className="text-sm text-gray-500">Pending</p></div>
        </div>
        <div className="flex gap-4 pt-4"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function SalaryReviewForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ employeeName: '', currentSalary: '', proposedSalary: '', effectiveDate: '', reason: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Salary Review</CardTitle>
        <CardDescription>Process salary adjustments and reviews.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Salary Review Submitted' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Employee *</Label><Input value={formData.employeeName} onChange={(e) => setFormData({...formData, employeeName: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Current Salary</Label><Input type="number" value={formData.currentSalary} onChange={(e) => setFormData({...formData, currentSalary: e.target.value})} /></div>
            <div className="space-y-2"><Label>Proposed Salary *</Label><Input type="number" value={formData.proposedSalary} onChange={(e) => setFormData({...formData, proposedSalary: e.target.value})} required /></div>
          </div>
          <div className="space-y-2"><Label>Effective Date *</Label><Input type="date" value={formData.effectiveDate} onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})} required /></div>
          <div className="space-y-2"><Label>Reason</Label><Textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Submit Review</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

// HR Analytics Components
function CreateDashboardForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ dashboardName: '', dashboardType: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Create Dashboard</CardTitle>
        <CardDescription>Create a new analytics dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Dashboard Created' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Dashboard Name *</Label><Input value={formData.dashboardName} onChange={(e) => setFormData({...formData, dashboardName: e.target.value})} required /></div>
          <div className="space-y-2"><Label>Dashboard Type</Label>
            <Select value={formData.dashboardType} onValueChange={(v) => setFormData({...formData, dashboardType: v})}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent><SelectItem value="hr">HR Overview</SelectItem><SelectItem value="workforce">Workforce Analytics</SelectItem><SelectItem value="performance">Performance Metrics</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Create Dashboard</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function GenerateHRReportForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ reportType: '', dateRange: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Generate HR Report</CardTitle>
        <CardDescription>Generate HR analytics reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Report Generated' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Report Type</Label>
              <Select value={formData.reportType} onValueChange={(v) => setFormData({...formData, reportType: v})}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent><SelectItem value="headcount">Headcount</SelectItem><SelectItem value="turnover">Turnover</SelectItem><SelectItem value="attendance">Attendance</SelectItem><SelectItem value="performance">Performance</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date Range</Label>
              <Select value={formData.dateRange} onValueChange={(v) => setFormData({...formData, dateRange: v})}>
                <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                <SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quarterly">Quarterly</SelectItem><SelectItem value="yearly">Yearly</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Generate</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function KPIAlertForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ kpiName: '', threshold: '', alertType: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Set KPI Alert</CardTitle>
        <CardDescription>Configure alerts for key performance indicators.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Alert Created' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>KPI Name *</Label><Input value={formData.kpiName} onChange={(e) => setFormData({...formData, kpiName: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Threshold *</Label><Input type="number" value={formData.threshold} onChange={(e) => setFormData({...formData, threshold: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Alert Type</Label>
              <Select value={formData.alertType} onValueChange={(v) => setFormData({...formData, alertType: v})}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent><SelectItem value="email">Email</SelectItem><SelectItem value="sms">SMS</SelectItem><SelectItem value="dashboard">Dashboard</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Create Alert</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function PredictiveAnalyticsView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Predictive Analytics</CardTitle>
        <CardDescription>AI-powered workforce predictions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><h4 className="font-medium">Turnover Prediction</h4><p className="text-2xl font-bold mt-2">8.5%</p><p className="text-sm text-gray-500">Expected next quarter</p></div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"><h4 className="font-medium">Hiring Needs</h4><p className="text-2xl font-bold mt-2">12</p><p className="text-sm text-gray-500">Positions forecasted</p></div>
        </div>
        <div className="flex gap-4 pt-4"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function HRComplianceReportView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> HR Compliance Reports</CardTitle>
        <CardDescription>Generate regulatory compliance reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">EEO-1 Report</h4><p className="text-sm text-gray-500">Equal Employment Opportunity</p></div><Button variant="outline"><Download className="w-4 h-4 mr-2" /> Generate</Button></div>
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Labor Law Compliance</h4><p className="text-sm text-gray-500">Liberian labor regulations</p></div><Button variant="outline"><Download className="w-4 h-4 mr-2" /> Generate</Button></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

// HR Biometrics Additional Components
function TimesheetReportView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Timesheet Report</CardTitle>
        <CardDescription>View and export timesheet data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center"><p className="text-xl font-bold">1,240</p><p className="text-sm text-gray-500">Total Hours</p></div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"><p className="text-xl font-bold">45</p><p className="text-sm text-gray-500">Overtime Hours</p></div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center"><p className="text-xl font-bold">98%</p><p className="text-sm text-gray-500">Accuracy</p></div>
        </div>
        <Button><Download className="w-4 h-4 mr-2" /> Export Timesheet</Button>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function DeviceSettingsView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Device Settings</CardTitle>
        <CardDescription>Configure biometric device settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Main Entrance Scanner</h4><p className="text-sm text-gray-500">Fingerprint • Active</p></div><Badge className="bg-green-100 text-green-800">Online</Badge></div>
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">HR Office Scanner</h4><p className="text-sm text-gray-500">Facial Recognition • Active</p></div><Badge className="bg-green-100 text-green-800">Online</Badge></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function AttendanceReportView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Attendance Summary</CardTitle>
        <CardDescription>Attendance analytics and trends.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"><p className="text-xl font-bold">94%</p><p className="text-sm text-gray-500">On-Time Rate</p></div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center"><p className="text-xl font-bold">4.2%</p><p className="text-sm text-gray-500">Late Rate</p></div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center"><p className="text-xl font-bold">1.8%</p><p className="text-sm text-gray-500">Absence Rate</p></div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center"><p className="text-xl font-bold">156</p><p className="text-sm text-gray-500">Employees</p></div>
        </div>
        <Button><Download className="w-4 h-4 mr-2" /> Export Report</Button>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

// FIMS General Ledger Additional Components
function AccountSearchView({ backUrl }: { backUrl: string }) {
  const [search, setSearch] = useState('');
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> Account Search</CardTitle>
        <CardDescription>Search chart of accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4"><Input placeholder="Search by account number or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" /></div>
        <div className="space-y-2">
          <div className="p-3 border rounded-lg flex justify-between"><span>1000 - Cash</span><Badge>Asset</Badge></div>
          <div className="p-3 border rounded-lg flex justify-between"><span>2000 - Accounts Payable</span><Badge variant="outline">Liability</Badge></div>
          <div className="p-3 border rounded-lg flex justify-between"><span>4000 - Revenue</span><Badge variant="outline">Income</Badge></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function TrialBalanceView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Trial Balance</CardTitle>
        <CardDescription>View trial balance report.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="text-left p-3">Account</th><th className="text-right p-3">Debit</th><th className="text-right p-3">Credit</th></tr></thead>
            <tbody>
              <tr className="border-t"><td className="p-3">Cash</td><td className="text-right p-3">$125,000</td><td className="text-right p-3">-</td></tr>
              <tr className="border-t"><td className="p-3">Accounts Receivable</td><td className="text-right p-3">$85,000</td><td className="text-right p-3">-</td></tr>
              <tr className="border-t"><td className="p-3">Accounts Payable</td><td className="text-right p-3">-</td><td className="text-right p-3">$45,000</td></tr>
              <tr className="border-t bg-gray-50 font-bold"><td className="p-3">Total</td><td className="text-right p-3">$210,000</td><td className="text-right p-3">$210,000</td></tr>
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Button><Download className="w-4 h-4 mr-2" /> Export</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ReconciliationForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ accountName: '', statementDate: '', statementBalance: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Account Reconciliation</CardTitle>
        <CardDescription>Reconcile bank accounts with statements.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Reconciliation Complete' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Account *</Label><Input value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Statement Date *</Label><Input type="date" value={formData.statementDate} onChange={(e) => setFormData({...formData, statementDate: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Statement Balance *</Label><Input type="number" step="0.01" value={formData.statementBalance} onChange={(e) => setFormData({...formData, statementBalance: e.target.value})} required /></div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Complete Reconciliation</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function PeriodCloseForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ period: '', closeDate: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Period Close</CardTitle>
        <CardDescription>Close an accounting period.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Period Closed' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Period *</Label>
              <Select value={formData.period} onValueChange={(v) => setFormData({...formData, period: v})}>
                <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
                <SelectContent><SelectItem value="jan-2025">January 2025</SelectItem><SelectItem value="feb-2025">February 2025</SelectItem><SelectItem value="q1-2025">Q1 2025</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Close Date *</Label><Input type="date" value={formData.closeDate} onChange={(e) => setFormData({...formData, closeDate: e.target.value})} required /></div>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"><p className="text-sm text-yellow-800 dark:text-yellow-200">Warning: Closing a period will lock all transactions for that period.</p></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Close Period</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

// Chart of Accounts View
function ChartOfAccountsView({ backUrl }: { backUrl: string }) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  const accounts = [
    { code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', balance: 125000, status: 'Active' },
    { code: '1100', name: 'Petty Cash', type: 'Asset', balance: 500, status: 'Active' },
    { code: '1200', name: 'Accounts Receivable', type: 'Asset', balance: 85000, status: 'Active' },
    { code: '1300', name: 'Inventory', type: 'Asset', balance: 45000, status: 'Active' },
    { code: '1400', name: 'Prepaid Expenses', type: 'Asset', balance: 12000, status: 'Active' },
    { code: '1500', name: 'Fixed Assets', type: 'Asset', balance: 250000, status: 'Active' },
    { code: '1510', name: 'Accumulated Depreciation', type: 'Asset', balance: -45000, status: 'Active' },
    { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 45000, status: 'Active' },
    { code: '2100', name: 'Accrued Expenses', type: 'Liability', balance: 8500, status: 'Active' },
    { code: '2200', name: 'Short-term Loans', type: 'Liability', balance: 25000, status: 'Active' },
    { code: '2300', name: 'Long-term Debt', type: 'Liability', balance: 150000, status: 'Active' },
    { code: '3000', name: 'Share Capital', type: 'Equity', balance: 100000, status: 'Active' },
    { code: '3100', name: 'Retained Earnings', type: 'Equity', balance: 75000, status: 'Active' },
    { code: '4000', name: 'Sales Revenue', type: 'Revenue', balance: 450000, status: 'Active' },
    { code: '4100', name: 'Service Revenue', type: 'Revenue', balance: 85000, status: 'Active' },
    { code: '4200', name: 'Interest Income', type: 'Revenue', balance: 2500, status: 'Active' },
    { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 180000, status: 'Active' },
    { code: '5100', name: 'Salaries & Wages', type: 'Expense', balance: 125000, status: 'Active' },
    { code: '5200', name: 'Rent Expense', type: 'Expense', balance: 36000, status: 'Active' },
    { code: '5300', name: 'Utilities Expense', type: 'Expense', balance: 8400, status: 'Active' },
    { code: '5400', name: 'Depreciation Expense', type: 'Expense', balance: 15000, status: 'Active' },
  ];

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = search === '' || acc.code.includes(search) || acc.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || acc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeBadgeVariant = (type: string) => {
    switch(type) {
      case 'Asset': return 'default';
      case 'Liability': return 'secondary';
      case 'Equity': return 'outline';
      case 'Revenue': return 'default';
      case 'Expense': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Chart of Accounts</CardTitle>
        <CardDescription>Complete listing of all accounts in the general ledger.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input placeholder="Search by code or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter by type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Asset">Assets</SelectItem>
              <SelectItem value="Liability">Liabilities</SelectItem>
              <SelectItem value="Equity">Equity</SelectItem>
              <SelectItem value="Revenue">Revenue</SelectItem>
              <SelectItem value="Expense">Expenses</SelectItem>
            </SelectContent>
          </Select>
          <Button><Plus className="w-4 h-4 mr-2" /> Add Account</Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-semibold">Code</th>
                <th className="text-left p-3 font-semibold">Account Name</th>
                <th className="text-left p-3 font-semibold">Type</th>
                <th className="text-right p-3 font-semibold">Balance</th>
                <th className="text-center p-3 font-semibold">Status</th>
                <th className="text-center p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-mono">{acc.code}</td>
                  <td className="p-3">{acc.name}</td>
                  <td className="p-3"><Badge variant={getTypeBadgeVariant(acc.type) as any}>{acc.type}</Badge></td>
                  <td className="p-3 text-right font-mono">${acc.balance.toLocaleString()}</td>
                  <td className="p-3 text-center"><Badge variant="outline" className="text-green-600">{acc.status}</Badge></td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-1">
                      <Button size="sm" variant="ghost"><Search className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">Showing {filteredAccounts.length} of {accounts.length} accounts</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
            <Link href={backUrl}><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Journal Entries View
function JournalEntriesView({ backUrl }: { backUrl: string }) {
  const [search, setSearch] = useState('');
  
  const entries = [
    { id: 'JE-2025-001', date: '2025-01-20', description: 'Monthly rent payment', debit: 3000, credit: 3000, status: 'Posted', createdBy: 'Admin' },
    { id: 'JE-2025-002', date: '2025-01-18', description: 'Sales revenue - Client ABC', debit: 15000, credit: 15000, status: 'Posted', createdBy: 'Finance' },
    { id: 'JE-2025-003', date: '2025-01-15', description: 'Payroll processing', debit: 45000, credit: 45000, status: 'Posted', createdBy: 'HR' },
    { id: 'JE-2025-004', date: '2025-01-12', description: 'Office supplies purchase', debit: 850, credit: 850, status: 'Posted', createdBy: 'Admin' },
    { id: 'JE-2025-005', date: '2025-01-10', description: 'Utility bill payment', debit: 1200, credit: 1200, status: 'Posted', createdBy: 'Finance' },
    { id: 'JE-2025-006', date: '2025-01-08', description: 'Equipment depreciation', debit: 2500, credit: 2500, status: 'Pending', createdBy: 'System' },
    { id: 'JE-2025-007', date: '2025-01-05', description: 'Bank interest income', debit: 125, credit: 125, status: 'Posted', createdBy: 'System' },
    { id: 'JE-2025-008', date: '2025-01-03', description: 'Inventory adjustment', debit: 5000, credit: 5000, status: 'Draft', createdBy: 'Warehouse' },
  ];

  const filteredEntries = entries.filter(entry => 
    search === '' || 
    entry.id.toLowerCase().includes(search.toLowerCase()) || 
    entry.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Journal Entries</CardTitle>
        <CardDescription>View and manage all journal entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input placeholder="Search entries..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Link href="/saas/modules/fims-general-ledger/action/new-journal-entry"><Button><Plus className="w-4 h-4 mr-2" /> New Entry</Button></Link>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-semibold">Entry ID</th>
                <th className="text-left p-3 font-semibold">Date</th>
                <th className="text-left p-3 font-semibold">Description</th>
                <th className="text-right p-3 font-semibold">Debit</th>
                <th className="text-right p-3 font-semibold">Credit</th>
                <th className="text-center p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Created By</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <td className="p-3 font-mono text-blue-600">{entry.id}</td>
                  <td className="p-3">{entry.date}</td>
                  <td className="p-3">{entry.description}</td>
                  <td className="p-3 text-right font-mono">${entry.debit.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono">${entry.credit.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <Badge variant={entry.status === 'Posted' ? 'default' : entry.status === 'Pending' ? 'secondary' : 'outline'}>{entry.status}</Badge>
                  </td>
                  <td className="p-3">{entry.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">Showing {filteredEntries.length} entries</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
            <Link href={backUrl}><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Accounts List View
function AccountsListView({ backUrl }: { backUrl: string }) {
  return <ChartOfAccountsView backUrl={backUrl} />;
}

// FIMS Additional Components
function UploadBillsForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5" /> Upload Bills</CardTitle>
        <CardDescription>Upload and process vendor bills.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
          <Download className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Drag and drop bill documents here</p>
          <p className="text-sm text-gray-400 mt-2">Supported: PDF, JPG, PNG</p>
        </div>
        <Button onClick={() => toast({ title: 'Bills Uploaded' })}><Download className="w-4 h-4 mr-2" /> Upload Bills</Button>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ThreeWayMatchView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> 3-Way Match</CardTitle>
        <CardDescription>Match invoices, POs, and receiving documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg"><div className="flex justify-between items-center"><div><h4 className="font-medium">INV-2025-001</h4><p className="text-sm text-gray-500">PO-001 • REC-001 • $5,000</p></div><Badge className="bg-green-100 text-green-800">Matched</Badge></div></div>
          <div className="p-4 border rounded-lg"><div className="flex justify-between items-center"><div><h4 className="font-medium">INV-2025-002</h4><p className="text-sm text-gray-500">PO-002 • Pending Receipt</p></div><Badge className="bg-yellow-100 text-yellow-800">Partial</Badge></div></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function SendStatementForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ customerName: '', statementDate: '', email: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Send Statement</CardTitle>
        <CardDescription>Generate and send customer statements.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Statement Sent' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Customer *</Label><Input value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Statement Date *</Label><Input type="date" value={formData.statementDate} onChange={(e) => setFormData({...formData, statementDate: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Email *</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Send Statement</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function DunningProcessView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Dunning Process</CardTitle>
        <CardDescription>Manage collection reminders.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg"><div className="flex justify-between items-center"><div><h4 className="font-medium">Customer ABC</h4><p className="text-sm text-gray-500">$12,500 overdue • 45 days</p></div><Button size="sm">Send Reminder</Button></div></div>
          <div className="p-4 border rounded-lg"><div className="flex justify-between items-center"><div><h4 className="font-medium">Customer XYZ</h4><p className="text-sm text-gray-500">$8,000 overdue • 30 days</p></div><Button size="sm">Send Reminder</Button></div></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function CurrencyExchangeForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ fromCurrency: 'USD', toCurrency: 'LRD', amount: '', rate: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Currency Exchange</CardTitle>
        <CardDescription>Record currency exchange transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Exchange Recorded' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>From Currency</Label>
              <Select value={formData.fromCurrency} onValueChange={(v) => setFormData({...formData, fromCurrency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="LRD">LRD</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>To Currency</Label>
              <Select value={formData.toCurrency} onValueChange={(v) => setFormData({...formData, toCurrency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="LRD">LRD</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Amount *</Label><Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Exchange Rate *</Label><Input type="number" step="0.0001" value={formData.rate} onChange={(e) => setFormData({...formData, rate: e.target.value})} required /></div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Record Exchange</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function CopyBudgetForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ sourceBudget: '', targetYear: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Copy Budget</CardTitle>
        <CardDescription>Copy budget from a previous year.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Budget Copied' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Source Budget *</Label>
              <Select value={formData.sourceBudget} onValueChange={(v) => setFormData({...formData, sourceBudget: v})}>
                <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                <SelectContent><SelectItem value="2024">2024 Annual Budget</SelectItem><SelectItem value="2023">2023 Annual Budget</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Target Year *</Label><Input type="number" value={formData.targetYear} onChange={(e) => setFormData({...formData, targetYear: e.target.value})} placeholder="2025" required /></div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Copy Budget</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function UpdateForecastForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ forecastPeriod: '', adjustmentType: '', adjustmentPercent: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Update Forecast</CardTitle>
        <CardDescription>Update rolling forecast projections.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Forecast Updated' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Forecast Period *</Label>
              <Select value={formData.forecastPeriod} onValueChange={(v) => setFormData({...formData, forecastPeriod: v})}>
                <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
                <SelectContent><SelectItem value="q2">Q2 2025</SelectItem><SelectItem value="q3">Q3 2025</SelectItem><SelectItem value="q4">Q4 2025</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Adjustment %</Label><Input type="number" step="0.1" value={formData.adjustmentPercent} onChange={(e) => setFormData({...formData, adjustmentPercent: e.target.value})} placeholder="5.0" /></div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Update Forecast</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function ScenarioPlanningView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Scenario Planning</CardTitle>
        <CardDescription>Model different budget scenarios.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"><h4 className="font-medium mb-2">Optimistic</h4><p className="text-xl font-bold">$3.2M</p><p className="text-sm text-gray-500">+15% growth</p></div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center"><h4 className="font-medium mb-2">Base Case</h4><p className="text-xl font-bold">$2.8M</p><p className="text-sm text-gray-500">+5% growth</p></div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center"><h4 className="font-medium mb-2">Conservative</h4><p className="text-xl font-bold">$2.4M</p><p className="text-sm text-gray-500">-5% growth</p></div>
        </div>
        <div className="flex gap-4 pt-4"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

// FIMS Compliance Additional Components
function AccessControlView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Access Control</CardTitle>
        <CardDescription>Manage user roles and permissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Administrator</h4><p className="text-sm text-gray-500">Full system access • 3 users</p></div><Badge>Active</Badge></div>
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Finance Manager</h4><p className="text-sm text-gray-500">Financial modules • 8 users</p></div><Badge>Active</Badge></div>
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">HR Manager</h4><p className="text-sm text-gray-500">HR modules • 5 users</p></div><Badge>Active</Badge></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function SetupIntegrationForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Setup Integration</CardTitle>
        <CardDescription>Connect external systems and services.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Banking API</h4><p className="text-sm text-gray-500">Connect to bank accounts</p></div><Button size="sm" onClick={() => toast({ title: 'Integration Started' })}>Connect</Button></div>
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Tax Authority</h4><p className="text-sm text-gray-500">LRA e-filing integration</p></div><Button size="sm" onClick={() => toast({ title: 'Integration Started' })}>Connect</Button></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function SecurityScanView({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Security Scan</CardTitle>
        <CardDescription>Run security vulnerability scans.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center mb-6">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <h3 className="font-semibold text-lg">Security Score: 98%</h3>
          <p className="text-sm text-gray-500">Last scan: 2 hours ago</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between p-2"><span>Data Encryption</span><Badge className="bg-green-100 text-green-800">Passed</Badge></div>
          <div className="flex justify-between p-2"><span>Access Controls</span><Badge className="bg-green-100 text-green-800">Passed</Badge></div>
          <div className="flex justify-between p-2"><span>Audit Logging</span><Badge className="bg-green-100 text-green-800">Passed</Badge></div>
        </div>
        <div className="flex gap-4 pt-6"><Button>Run New Scan</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

// FIMS Reporting Additional Components
function GenerateFinancialReportForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ reportType: '', period: '', format: 'pdf' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Generate Financial Report</CardTitle>
        <CardDescription>Create financial statements and reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Report Generated' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Report Type *</Label>
            <Select value={formData.reportType} onValueChange={(v) => setFormData({...formData, reportType: v})}>
              <SelectTrigger><SelectValue placeholder="Select report" /></SelectTrigger>
              <SelectContent><SelectItem value="income">Income Statement</SelectItem><SelectItem value="balance">Balance Sheet</SelectItem><SelectItem value="cashflow">Cash Flow Statement</SelectItem><SelectItem value="equity">Statement of Equity</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Period *</Label>
              <Select value={formData.period} onValueChange={(v) => setFormData({...formData, period: v})}>
                <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
                <SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quarterly">Quarterly</SelectItem><SelectItem value="annual">Annual</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Format</Label>
              <Select value={formData.format} onValueChange={(v) => setFormData({...formData, format: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="excel">Excel</SelectItem><SelectItem value="csv">CSV</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Generate Report</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function ScheduleReportForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ reportName: '', schedule: '', recipients: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Schedule Report</CardTitle>
        <CardDescription>Set up automated report generation.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Report Scheduled' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Report Name *</Label><Input value={formData.reportName} onChange={(e) => setFormData({...formData, reportName: e.target.value})} required /></div>
          <div className="space-y-2"><Label>Schedule *</Label>
            <Select value={formData.schedule} onValueChange={(v) => setFormData({...formData, schedule: v})}>
              <SelectTrigger><SelectValue placeholder="Select schedule" /></SelectTrigger>
              <SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Recipients (emails)</Label><Input value={formData.recipients} onChange={(e) => setFormData({...formData, recipients: e.target.value})} placeholder="email@example.com, email2@example.com" /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Schedule Report</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function ShareDashboardForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ dashboardName: '', shareWith: '', accessLevel: 'view' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Share Dashboard</CardTitle>
        <CardDescription>Share dashboards with team members.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Dashboard Shared' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Dashboard *</Label><Input value={formData.dashboardName} onChange={(e) => setFormData({...formData, dashboardName: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Share With (emails) *</Label><Input value={formData.shareWith} onChange={(e) => setFormData({...formData, shareWith: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Access Level</Label>
              <Select value={formData.accessLevel} onValueChange={(v) => setFormData({...formData, accessLevel: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="view">View Only</SelectItem><SelectItem value="edit">Can Edit</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Share Dashboard</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

// HR Self-Service Components
function RequestLeaveForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ leaveType: '', startDate: '', endDate: '', reason: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Request Leave</CardTitle>
        <CardDescription>Submit a leave request for approval.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Leave Request Submitted', description: 'Your manager will review shortly.' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Leave Type *</Label>
            <Select value={formData.leaveType} onValueChange={(v) => setFormData({...formData, leaveType: v})}>
              <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
              <SelectContent><SelectItem value="annual">Annual Leave</SelectItem><SelectItem value="sick">Sick Leave</SelectItem><SelectItem value="personal">Personal Leave</SelectItem><SelectItem value="maternity">Maternity Leave</SelectItem><SelectItem value="paternity">Paternity Leave</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Date *</Label><Input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required /></div>
            <div className="space-y-2"><Label>End Date *</Label><Input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required /></div>
          </div>
          <div className="space-y-2"><Label>Reason</Label><Textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} placeholder="Describe your reason for leave..." /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Submit Request</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function UpdateProfileForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', emergencyContact: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Update Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Profile Updated' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>First Name *</Label><Input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Last Name *</Label><Input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Email *</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Phone *</Label><Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required /></div>
          </div>
          <div className="space-y-2"><Label>Address</Label><Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} /></div>
          <div className="space-y-2"><Label>Emergency Contact</Label><Input value={formData.emergencyContact} onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})} /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Save Profile</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function SubmitTimesheetForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ weekStart: '', mondayHours: 8, tuesdayHours: 8, wednesdayHours: 8, thursdayHours: 8, fridayHours: 8 });
  const totalHours = formData.mondayHours + formData.tuesdayHours + formData.wednesdayHours + formData.thursdayHours + formData.fridayHours;
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Submit Timesheet</CardTitle>
        <CardDescription>Log your weekly work hours.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Timesheet Submitted', description: `Total: ${totalHours} hours` }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Week Starting *</Label><Input type="date" value={formData.weekStart} onChange={(e) => setFormData({...formData, weekStart: e.target.value})} required /></div>
          <div className="grid grid-cols-5 gap-2">
            <div className="space-y-2"><Label>Mon</Label><Input type="number" min="0" max="24" value={formData.mondayHours} onChange={(e) => setFormData({...formData, mondayHours: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Tue</Label><Input type="number" min="0" max="24" value={formData.tuesdayHours} onChange={(e) => setFormData({...formData, tuesdayHours: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Wed</Label><Input type="number" min="0" max="24" value={formData.wednesdayHours} onChange={(e) => setFormData({...formData, wednesdayHours: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Thu</Label><Input type="number" min="0" max="24" value={formData.thursdayHours} onChange={(e) => setFormData({...formData, thursdayHours: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Fri</Label><Input type="number" min="0" max="24" value={formData.fridayHours} onChange={(e) => setFormData({...formData, fridayHours: Number(e.target.value)})} /></div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><p className="text-center font-semibold">Total Hours: {totalHours}</p></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Submit Timesheet</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function ViewPayslipPage({ backUrl }: { backUrl: string }) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> View Payslip</CardTitle>
        <CardDescription>Your most recent pay statement.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex justify-between border-b pb-4"><h3 className="font-semibold">Pay Period: January 2025</h3><Badge>Paid</Badge></div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Basic Salary</p><p className="font-semibold">L$45,000</p></div>
            <div><p className="text-sm text-gray-500">Transport Allowance</p><p className="font-semibold">L$5,000</p></div>
            <div><p className="text-sm text-gray-500">Housing Allowance</p><p className="font-semibold">L$8,000</p></div>
            <div><p className="text-sm text-gray-500">PAYE Tax</p><p className="font-semibold text-red-600">-L$4,500</p></div>
          </div>
          <div className="border-t pt-4 flex justify-between"><span className="font-bold">Net Pay</span><span className="font-bold text-green-600">L$53,500</span></div>
        </div>
        <div className="flex gap-4 pt-6"><Button><Download className="w-4 h-4 mr-2" /> Download PDF</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function TeamDirectoryView({ backUrl }: { backUrl: string }) {
  const [search, setSearch] = useState('');
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Team Directory</CardTitle>
        <CardDescription>Find and contact your colleagues.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4"><Input placeholder="Search by name or department..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" /></div>
        <div className="space-y-3">
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">John Smith</h4><p className="text-sm text-gray-500">Engineering • Senior Developer</p></div><Button size="sm" variant="outline">Contact</Button></div>
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Sarah Johnson</h4><p className="text-sm text-gray-500">HR • HR Manager</p></div><Button size="sm" variant="outline">Contact</Button></div>
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Michael Brown</h4><p className="text-sm text-gray-500">Finance • Accountant</p></div><Button size="sm" variant="outline">Contact</Button></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function HRRequestForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ requestType: '', subject: '', description: '', priority: 'medium' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> HR Request</CardTitle>
        <CardDescription>Submit a request to the HR department.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Request Submitted', description: 'HR will respond within 2 business days.' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Request Type *</Label>
              <Select value={formData.requestType} onValueChange={(v) => setFormData({...formData, requestType: v})}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent><SelectItem value="certificate">Employment Certificate</SelectItem><SelectItem value="letter">Salary Letter</SelectItem><SelectItem value="benefits">Benefits Inquiry</SelectItem><SelectItem value="policy">Policy Question</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Subject *</Label><Input value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required /></div>
          <div className="space-y-2"><Label>Description *</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required rows={4} /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Submit Request</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

// ================== TIME, LEAVE & SCHEDULING COMPONENTS ==================

function LeaveRequestForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ leaveType: '', startDate: '', endDate: '', reason: '', halfDay: false });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Request Leave</CardTitle>
        <CardDescription>Submit a new leave request for approval.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Leave Request Submitted', description: 'Your request has been sent for approval.' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Leave Type *</Label>
            <Select value={formData.leaveType} onValueChange={(v) => setFormData({...formData, leaveType: v})}>
              <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
              <SelectContent><SelectItem value="annual">Annual Leave</SelectItem><SelectItem value="sick">Sick Leave</SelectItem><SelectItem value="maternity">Maternity Leave</SelectItem><SelectItem value="paternity">Paternity Leave</SelectItem><SelectItem value="compassionate">Compassionate Leave</SelectItem><SelectItem value="unpaid">Unpaid Leave</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Date *</Label><Input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required /></div>
            <div className="space-y-2"><Label>End Date *</Label><Input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required /></div>
          </div>
          <div className="space-y-2"><Label>Reason</Label><Textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} placeholder="Provide reason for leave..." /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Submit Request</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function TimesheetSubmissionForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [entries, setEntries] = useState([
    { day: 'Monday', date: '2025-01-20', regular: '8', overtime: '0' },
    { day: 'Tuesday', date: '2025-01-21', regular: '8', overtime: '1' },
    { day: 'Wednesday', date: '2025-01-22', regular: '8', overtime: '0' },
    { day: 'Thursday', date: '2025-01-23', regular: '8', overtime: '2' },
    { day: 'Friday', date: '2025-01-24', regular: '8', overtime: '0' },
  ]);
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Submit Timesheet</CardTitle>
        <CardDescription>Record your work hours for the pay period.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Timesheet Submitted', description: 'Your timesheet has been sent for approval.' }); setLocation(backUrl); }} className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">Day</th><th className="px-4 py-2 text-left">Date</th><th className="px-4 py-2">Regular Hours</th><th className="px-4 py-2">Overtime</th></tr></thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{entry.day}</td>
                    <td className="px-4 py-2">{entry.date}</td>
                    <td className="px-4 py-2"><Input type="number" value={entry.regular} onChange={(e) => { const newEntries = [...entries]; newEntries[i].regular = e.target.value; setEntries(newEntries); }} className="w-20 text-center" /></td>
                    <td className="px-4 py-2"><Input type="number" value={entry.overtime} onChange={(e) => { const newEntries = [...entries]; newEntries[i].overtime = e.target.value; setEntries(newEntries); }} className="w-20 text-center" /></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800">
                <tr><td colSpan={2} className="px-4 py-2 font-semibold">Total</td><td className="px-4 py-2 text-center font-semibold">{entries.reduce((sum, e) => sum + parseInt(e.regular || '0'), 0)}h</td><td className="px-4 py-2 text-center font-semibold">{entries.reduce((sum, e) => sum + parseInt(e.overtime || '0'), 0)}h</td></tr>
              </tfoot>
            </table>
          </div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Submit Timesheet</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function LeaveApprovalView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const requests = [
    { id: 'LR001', employee: 'John Smith', type: 'Annual Leave', dates: 'Jan 27-31, 2025', days: 5, status: 'Pending' },
    { id: 'LR002', employee: 'Sarah Johnson', type: 'Sick Leave', dates: 'Jan 24, 2025', days: 1, status: 'Pending' },
    { id: 'LR003', employee: 'Michael Brown', type: 'Compassionate', dates: 'Jan 25-26, 2025', days: 2, status: 'Pending' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Approve Leave Requests</CardTitle>
        <CardDescription>Review and approve pending leave requests.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium">{req.employee}</h4>
                <p className="text-sm text-gray-500">{req.type} • {req.dates} ({req.days} days)</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => toast({ title: 'Leave Approved', description: `${req.employee}'s leave has been approved.` })} className="bg-green-600 hover:bg-green-700">Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => toast({ title: 'Leave Rejected' })}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ShiftScheduleView({ backUrl }: { backUrl: string }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const shifts = [
    { employee: 'John Smith', schedule: ['Day', 'Day', 'Day', 'Day', 'Day', 'Off', 'Off'] },
    { employee: 'Sarah Johnson', schedule: ['Day', 'Day', 'Day', 'Off', 'Off', 'Day', 'Day'] },
    { employee: 'Michael Brown', schedule: ['Night', 'Night', 'Night', 'Night', 'Off', 'Off', 'Off'] },
  ];
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Weekly Shift Schedule</CardTitle>
        <CardDescription>View and manage employee shift assignments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr><th className="px-4 py-2 text-left">Employee</th>{days.map((d) => <th key={d} className="px-4 py-2 text-center">{d}</th>)}</tr>
            </thead>
            <tbody>
              {shifts.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2 font-medium">{s.employee}</td>
                  {s.schedule.map((shift, j) => (
                    <td key={j} className="px-4 py-2 text-center">
                      <Badge variant={shift === 'Day' ? 'default' : shift === 'Night' ? 'secondary' : 'outline'}>{shift}</Badge>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Add Shift</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function OvertimeRequestForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ date: '', hours: '', reason: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Overtime Request</CardTitle>
        <CardDescription>Request approval for overtime work.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Overtime Request Submitted' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Date *</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Hours *</Label><Input type="number" step="0.5" value={formData.hours} onChange={(e) => setFormData({...formData, hours: e.target.value})} required /></div>
          </div>
          <div className="space-y-2"><Label>Reason *</Label><Textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} placeholder="Describe the work requiring overtime..." required /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Submit Request</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function HolidayCalendarView({ backUrl }: { backUrl: string }) {
  const holidays = [
    { date: 'Jan 1, 2025', name: "New Year's Day", type: 'Public' },
    { date: 'Feb 11, 2025', name: 'Armed Forces Day', type: 'Public' },
    { date: 'Mar 15, 2025', name: 'J.J. Roberts Birthday', type: 'Public' },
    { date: 'Jul 26, 2025', name: 'Independence Day', type: 'Public' },
    { date: 'Nov 29, 2025', name: 'President Tubman Birthday', type: 'Public' },
    { date: 'Dec 25, 2025', name: 'Christmas Day', type: 'Public' },
  ];
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Holiday Calendar 2025</CardTitle>
        <CardDescription>Public holidays and company observances.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {holidays.map((h, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between items-center">
              <div><h4 className="font-medium">{h.name}</h4><p className="text-sm text-gray-500">{h.date}</p></div>
              <Badge>{h.type}</Badge>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Add Holiday</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function TimeLeaveReportsView({ backUrl }: { backUrl: string }) {
  const reports = [
    { name: 'Leave Summary Report', description: 'Overview of all leave taken', lastRun: '2 hours ago' },
    { name: 'Timesheet Summary', description: 'Work hours by employee', lastRun: '1 day ago' },
    { name: 'Overtime Report', description: 'Overtime hours and costs', lastRun: '3 days ago' },
  ];
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Time & Leave Reports</CardTitle>
        <CardDescription>Generate and view time and leave reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((r, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between items-center">
              <div><h4 className="font-medium">{r.name}</h4><p className="text-sm text-gray-500">{r.description} • Last run: {r.lastRun}</p></div>
              <Button size="sm"><Download className="w-4 h-4 mr-2" /> Generate</Button>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function LeaveTypesView({ backUrl }: { backUrl: string }) {
  const types = [
    { name: 'Annual Leave', days: 21, accrual: 'Monthly', status: 'Active' },
    { name: 'Sick Leave', days: 14, accrual: 'Annual', status: 'Active' },
    { name: 'Maternity Leave', days: 90, accrual: 'One-time', status: 'Active' },
    { name: 'Paternity Leave', days: 10, accrual: 'One-time', status: 'Active' },
    { name: 'Compassionate Leave', days: 5, accrual: 'Annual', status: 'Active' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Leave Types</CardTitle>
        <CardDescription>Configure leave types and entitlements.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">Leave Type</th><th className="px-4 py-2">Days/Year</th><th className="px-4 py-2">Accrual</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Actions</th></tr></thead>
            <tbody>
              {types.map((t, i) => (
                <tr key={i} className="border-t"><td className="px-4 py-2 font-medium">{t.name}</td><td className="px-4 py-2 text-center">{t.days}</td><td className="px-4 py-2 text-center">{t.accrual}</td><td className="px-4 py-2 text-center"><Badge>{t.status}</Badge></td><td className="px-4 py-2 text-center"><Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Add Leave Type</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function LeaveBalancesView({ backUrl }: { backUrl: string }) {
  const balances = [
    { employee: 'John Smith', annual: 15, sick: 10, used: 6, pending: 2 },
    { employee: 'Sarah Johnson', annual: 18, sick: 14, used: 3, pending: 0 },
    { employee: 'Michael Brown', annual: 12, sick: 8, used: 9, pending: 5 },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Leave Balances</CardTitle>
        <CardDescription>View employee leave balances and usage.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">Employee</th><th className="px-4 py-2">Annual</th><th className="px-4 py-2">Sick</th><th className="px-4 py-2">Used</th><th className="px-4 py-2">Pending</th></tr></thead>
            <tbody>
              {balances.map((b, i) => (
                <tr key={i} className="border-t"><td className="px-4 py-2 font-medium">{b.employee}</td><td className="px-4 py-2 text-center">{b.annual} days</td><td className="px-4 py-2 text-center">{b.sick} days</td><td className="px-4 py-2 text-center">{b.used} days</td><td className="px-4 py-2 text-center"><Badge variant="outline">{b.pending}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Button><Download className="w-4 h-4 mr-2" /> Export</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function TimesheetsListView({ backUrl }: { backUrl: string }) {
  const timesheets = [
    { id: 'TS001', employee: 'John Smith', period: 'Jan 20-26, 2025', hours: 42, status: 'Approved' },
    { id: 'TS002', employee: 'Sarah Johnson', period: 'Jan 20-26, 2025', hours: 40, status: 'Pending' },
    { id: 'TS003', employee: 'Michael Brown', period: 'Jan 20-26, 2025', hours: 45, status: 'Pending' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Timesheets</CardTitle>
        <CardDescription>View and manage employee timesheets.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">ID</th><th className="px-4 py-2 text-left">Employee</th><th className="px-4 py-2">Period</th><th className="px-4 py-2">Hours</th><th className="px-4 py-2">Status</th></tr></thead>
            <tbody>
              {timesheets.map((t) => (
                <tr key={t.id} className="border-t"><td className="px-4 py-2 font-mono">{t.id}</td><td className="px-4 py-2">{t.employee}</td><td className="px-4 py-2 text-center">{t.period}</td><td className="px-4 py-2 text-center">{t.hours}h</td><td className="px-4 py-2 text-center"><Badge variant={t.status === 'Approved' ? 'default' : 'secondary'}>{t.status}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function OvertimeApprovalsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const requests = [
    { id: 'OT001', employee: 'John Smith', date: 'Jan 23, 2025', hours: 3, reason: 'Project deadline' },
    { id: 'OT002', employee: 'Sarah Johnson', date: 'Jan 24, 2025', hours: 2, reason: 'Client meeting prep' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Overtime Approvals</CardTitle>
        <CardDescription>Review and approve overtime requests.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div><h4 className="font-medium">{r.employee}</h4><p className="text-sm text-gray-500">{r.date} • {r.hours} hours • {r.reason}</p></div>
              <div className="flex gap-2"><Button size="sm" onClick={() => toast({ title: 'Overtime Approved' })} className="bg-green-600">Approve</Button><Button size="sm" variant="destructive">Reject</Button></div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ShiftRosterView({ backUrl }: { backUrl: string }) { return <ShiftScheduleView backUrl={backUrl} />; }
function ShiftPatternsView({ backUrl }: { backUrl: string }) {
  const patterns = [
    { name: 'Day Shift', hours: '8:00 AM - 5:00 PM', days: 'Mon-Fri' },
    { name: 'Night Shift', hours: '10:00 PM - 6:00 AM', days: 'Mon-Fri' },
    { name: 'Flexible', hours: 'Core 10:00 AM - 3:00 PM', days: 'Mon-Fri' },
  ];
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Shift Patterns</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">{patterns.map((p, i) => (<div key={i} className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">{p.name}</h4><p className="text-sm text-gray-500">{p.hours} • {p.days}</p></div><Button size="sm" variant="outline"><Settings className="w-4 h-4" /></Button></div>))}</div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Add Pattern</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function LocationCalendarsView({ backUrl }: { backUrl: string }) {
  const locations = [{ name: 'Monrovia HQ', holidays: 15, timezone: 'WAT' }, { name: 'Buchanan Office', holidays: 15, timezone: 'WAT' }];
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Location Calendars</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">{locations.map((l, i) => (<div key={i} className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">{l.name}</h4><p className="text-sm text-gray-500">{l.holidays} holidays • {l.timezone}</p></div><Button size="sm" variant="outline"><Settings className="w-4 h-4" /></Button></div>))}</div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function LeaveSummaryReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Leave Summary Report" backUrl={backUrl} />; }
function LeaveLiabilityReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Leave Liability Report" backUrl={backUrl} />; }
function LeaveTrendsReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Leave Trends Analysis" backUrl={backUrl} />; }
function TimesheetSummaryReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Timesheet Summary Report" backUrl={backUrl} />; }
function OvertimeReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Overtime Report" backUrl={backUrl} />; }
function PayrollInputsReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Payroll Inputs Report" backUrl={backUrl} />; }
function ShiftCoverageReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Shift Coverage Report" backUrl={backUrl} />; }
function ScheduleVarianceReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Schedule Variance Report" backUrl={backUrl} />; }
function CapacityPlanningReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Capacity Planning Report" backUrl={backUrl} />; }

function LeavePoliciesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Leave Policies" backUrl={backUrl} />; }
function AccrualRulesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Accrual Rules" backUrl={backUrl} />; }
function CarryoverRulesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Carryover Rules" backUrl={backUrl} />; }
function ApprovalWorkflowsSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Approval Workflows" backUrl={backUrl} />; }
function WorkSchedulesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Work Schedules" backUrl={backUrl} />; }
function OvertimePoliciesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Overtime Policies" backUrl={backUrl} />; }
function TimesheetRulesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Timesheet Rules" backUrl={backUrl} />; }
function PayPeriodsSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Pay Periods" backUrl={backUrl} />; }

// ================== PAYROLL COMPONENTS ==================

function RunPayrollForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ payPeriod: '', payDate: '', includeAll: true });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Run Payroll</CardTitle><CardDescription>Process payroll for the selected period.</CardDescription></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Payroll Processing Started', description: 'Payroll is being calculated.' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Pay Period *</Label>
              <Select value={formData.payPeriod} onValueChange={(v) => setFormData({...formData, payPeriod: v})}>
                <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
                <SelectContent><SelectItem value="jan-2025">January 2025</SelectItem><SelectItem value="feb-2025">February 2025</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Pay Date *</Label><Input type="date" value={formData.payDate} onChange={(e) => setFormData({...formData, payDate: e.target.value})} required /></div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><p className="text-sm"><strong>Preview:</strong> 156 employees • Est. gross: $485,000 • Est. net: $328,830</p></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><DollarSign className="w-4 h-4 mr-2" /> Run Payroll</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function ProcessPayrollBatchForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Workflow className="w-5 h-5" /> Process Payroll Batch</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg"><h4 className="font-medium mb-2">Batch Details</h4><p className="text-sm text-gray-500">January 2025 Payroll • 156 employees</p></div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><p className="text-2xl font-bold">$485,000</p><p className="text-sm text-gray-500">Gross Pay</p></div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><p className="text-2xl font-bold">$156,170</p><p className="text-sm text-gray-500">Deductions</p></div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"><p className="text-2xl font-bold text-green-600">$328,830</p><p className="text-sm text-gray-500">Net Pay</p></div>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Batch Processed' })}><CheckCircle2 className="w-4 h-4 mr-2" /> Process Batch</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function GeneratePayslipsForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Generate Payslips</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Pay Period</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger><SelectContent><SelectItem value="jan">January 2025</SelectItem><SelectItem value="feb">February 2025</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Format</Label>
            <Select defaultValue="pdf"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="email">Email to Employees</SelectItem></SelectContent></Select>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Payslips Generated', description: '156 payslips created.' })}><Download className="w-4 h-4 mr-2" /> Generate</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ApprovePayrollView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Approve Payroll</CardTitle></CardHeader>
      <CardContent>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6"><p className="text-sm font-medium">January 2025 payroll is pending approval</p><p className="text-sm text-gray-600">Total: $328,830 net for 156 employees</p></div>
        <div className="flex gap-4"><Button onClick={() => toast({ title: 'Payroll Approved' })} className="bg-green-600"><CheckCircle2 className="w-4 h-4 mr-2" /> Approve</Button><Button variant="destructive">Reject</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ExportBankFileForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Banknote className="w-5 h-5" /> Export Bank File</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Bank</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger><SelectContent><SelectItem value="lbdi">LBDI</SelectItem><SelectItem value="ecobank">Ecobank</SelectItem><SelectItem value="uba">UBA</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Format</Label>
            <Select defaultValue="csv"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="csv">CSV</SelectItem><SelectItem value="xlsx">Excel</SelectItem><SelectItem value="ach">ACH File</SelectItem></SelectContent></Select>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Bank File Exported' })}><Download className="w-4 h-4 mr-2" /> Export</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function TaxRemittanceForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5" /> Tax Remittance</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"><p className="text-xl font-bold">$72,750</p><p className="text-sm text-gray-500">PAYE Tax</p></div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"><p className="text-xl font-bold">$30,070</p><p className="text-sm text-gray-500">Social Security</p></div>
          </div>
          <div className="space-y-2"><Label>Remittance Period</Label><Input type="month" defaultValue="2025-01" /></div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Remittance Submitted' })}><Save className="w-4 h-4 mr-2" /> Submit Remittance</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function PayElementsView({ backUrl }: { backUrl: string }) {
  const elements = [
    { name: 'Basic Salary', type: 'Earning', taxable: true },
    { name: 'Housing Allowance', type: 'Earning', taxable: false },
    { name: 'Transport Allowance', type: 'Earning', taxable: false },
    { name: 'Overtime', type: 'Earning', taxable: true },
    { name: 'Bonus', type: 'Earning', taxable: true },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Pay Elements</CardTitle></CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">Element Name</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Taxable</th><th className="px-4 py-2">Actions</th></tr></thead>
            <tbody>{elements.map((e, i) => (<tr key={i} className="border-t"><td className="px-4 py-2">{e.name}</td><td className="px-4 py-2 text-center"><Badge>{e.type}</Badge></td><td className="px-4 py-2 text-center">{e.taxable ? 'Yes' : 'No'}</td><td className="px-4 py-2 text-center"><Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button></td></tr>))}</tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Add Element</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function DeductionsView({ backUrl }: { backUrl: string }) {
  const deductions = [
    { name: 'PAYE Tax', type: 'Statutory', percentage: '15%' },
    { name: 'Social Security (NASSCORP)', type: 'Statutory', percentage: '6.2%' },
    { name: 'Health Insurance', type: 'Voluntary', percentage: '5%' },
    { name: 'Pension', type: 'Voluntary', percentage: '4%' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Deductions</CardTitle></CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">Deduction</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Rate</th><th className="px-4 py-2">Actions</th></tr></thead>
            <tbody>{deductions.map((d, i) => (<tr key={i} className="border-t"><td className="px-4 py-2">{d.name}</td><td className="px-4 py-2 text-center"><Badge variant={d.type === 'Statutory' ? 'default' : 'secondary'}>{d.type}</Badge></td><td className="px-4 py-2 text-center">{d.percentage}</td><td className="px-4 py-2 text-center"><Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button></td></tr>))}</tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Add Deduction</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function PayrollHistoryView({ backUrl }: { backUrl: string }) {
  const history = [
    { period: 'January 2025', employees: 156, gross: '$485,000', net: '$328,830', status: 'Completed' },
    { period: 'December 2024', employees: 154, gross: '$478,000', net: '$324,100', status: 'Completed' },
    { period: 'November 2024', employees: 152, gross: '$470,000', net: '$318,900', status: 'Completed' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Payroll History</CardTitle></CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">Period</th><th className="px-4 py-2">Employees</th><th className="px-4 py-2">Gross</th><th className="px-4 py-2">Net</th><th className="px-4 py-2">Status</th></tr></thead>
            <tbody>{history.map((h, i) => (<tr key={i} className="border-t"><td className="px-4 py-2">{h.period}</td><td className="px-4 py-2 text-center">{h.employees}</td><td className="px-4 py-2 text-center">{h.gross}</td><td className="px-4 py-2 text-center">{h.net}</td><td className="px-4 py-2 text-center"><Badge>{h.status}</Badge></td></tr>))}</tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function EmployeeEarningsView({ backUrl }: { backUrl: string }) { return <PayrollHistoryView backUrl={backUrl} />; }
function PayrollRegisterReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Payroll Register" backUrl={backUrl} />; }
function TaxSummaryReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Tax Summary Report" backUrl={backUrl} />; }
function DeductionReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Deduction Report" backUrl={backUrl} />; }
function PayrollJournalReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Payroll Journal" backUrl={backUrl} />; }
function PaySchedulesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Pay Schedules" backUrl={backUrl} />; }
function TaxTablesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Tax Tables" backUrl={backUrl} />; }
function StatutoryRulesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Statutory Rules" backUrl={backUrl} />; }

// ================== LEARNING MANAGEMENT COMPONENTS ==================

function CreateCourseForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ title: '', category: '', duration: '', description: '' });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Create Course</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Course Created' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Course Title *</Label><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent><SelectItem value="technical">Technical</SelectItem><SelectItem value="soft-skills">Soft Skills</SelectItem><SelectItem value="compliance">Compliance</SelectItem><SelectItem value="leadership">Leadership</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Duration (hours)</Label><Input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} /></div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Create Course</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function EnrollEmployeesForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Enroll Employees</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Select Course</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger><SelectContent><SelectItem value="safety">Workplace Safety</SelectItem><SelectItem value="ethics">Business Ethics</SelectItem><SelectItem value="leadership">Leadership 101</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Select Employees</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select employees" /></SelectTrigger><SelectContent><SelectItem value="all">All Employees</SelectItem><SelectItem value="dept">By Department</SelectItem><SelectItem value="selected">Individual Selection</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Deadline</Label><Input type="date" /></div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Employees Enrolled' })}><UserPlus className="w-4 h-4 mr-2" /> Enroll</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ScheduleTrainingForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Schedule Training</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Training Course</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger><SelectContent><SelectItem value="safety">Workplace Safety</SelectItem><SelectItem value="fire">Fire Safety</SelectItem></SelectContent></Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
            <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
          </div>
          <div className="space-y-2"><Label>Location</Label><Input placeholder="Conference Room A" /></div>
          <div className="space-y-2"><Label>Instructor</Label><Input placeholder="Enter instructor name" /></div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Training Scheduled' })}><Calendar className="w-4 h-4 mr-2" /> Schedule</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function IssueCertificateForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-5 h-5" /> Issue Certificate</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Employee</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger><SelectContent><SelectItem value="john">John Smith</SelectItem><SelectItem value="sarah">Sarah Johnson</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Course/Certification</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select certification" /></SelectTrigger><SelectContent><SelectItem value="safety">Workplace Safety</SelectItem><SelectItem value="first-aid">First Aid</SelectItem></SelectContent></Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Issue Date</Label><Input type="date" /></div>
            <div className="space-y-2"><Label>Expiry Date</Label><Input type="date" /></div>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Certificate Issued' })}><Star className="w-4 h-4 mr-2" /> Issue Certificate</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function UploadContentForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Upload Learning Content</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Course</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger><SelectContent><SelectItem value="safety">Workplace Safety</SelectItem><SelectItem value="ethics">Business Ethics</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Content Type</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="video">Video</SelectItem><SelectItem value="pdf">PDF Document</SelectItem><SelectItem value="scorm">SCORM Package</SelectItem></SelectContent></Select>
          </div>
          <div className="border-2 border-dashed rounded-lg p-8 text-center"><p className="text-gray-500">Drag and drop files here or click to browse</p><Button variant="outline" className="mt-4">Browse Files</Button></div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Content Uploaded' })}><Save className="w-4 h-4 mr-2" /> Upload</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function CoursesListView({ backUrl }: { backUrl: string }) {
  const courses = [
    { name: 'Workplace Safety', category: 'Compliance', enrollments: 156, completion: '92%' },
    { name: 'Business Ethics', category: 'Compliance', enrollments: 156, completion: '88%' },
    { name: 'Leadership Essentials', category: 'Leadership', enrollments: 45, completion: '75%' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Courses</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">{courses.map((c, i) => (<div key={i} className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">{c.name}</h4><p className="text-sm text-gray-500">{c.category} • {c.enrollments} enrolled • {c.completion} complete</p></div><Button size="sm" variant="outline">View</Button></div>))}</div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Add Course</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function EnrollmentsView({ backUrl }: { backUrl: string }) { return <CoursesListView backUrl={backUrl} />; }
function CertificationsView({ backUrl }: { backUrl: string }) { return <CoursesListView backUrl={backUrl} />; }
function LearningPathsListView({ backUrl }: { backUrl: string }) { return <CoursesListView backUrl={backUrl} />; }
function TrainingCalendarView({ backUrl }: { backUrl: string }) { return <HolidayCalendarView backUrl={backUrl} />; }
function CompletionRatesReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Completion Rates Report" backUrl={backUrl} />; }
function SkillsGapReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Skills Gap Analysis" backUrl={backUrl} />; }
function TrainingCostReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Training Cost Report" backUrl={backUrl} />; }
function ComplianceTrainingReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Compliance Training Report" backUrl={backUrl} />; }
function CourseCategoriesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Course Categories" backUrl={backUrl} />; }
function CertificationRulesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Certification Rules" backUrl={backUrl} />; }
function LMSIntegrationSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="LMS Integration" backUrl={backUrl} />; }

function CertificationsManagementView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  
  const certifications = [
    { id: 'safety', name: 'Workplace Safety', type: 'Mandatory', employees: 156, compliant: 148, expiring: 8, validity: '1 year' },
    { id: 'first-aid', name: 'First Aid & CPR', type: 'Mandatory', employees: 45, compliant: 42, expiring: 3, validity: '2 years' },
    { id: 'security', name: 'Information Security', type: 'Mandatory', employees: 156, compliant: 152, expiring: 4, validity: '1 year' },
    { id: 'project-mgmt', name: 'Project Management (PMP)', type: 'Professional', employees: 28, compliant: 25, expiring: 2, validity: '3 years' },
    { id: 'leadership', name: 'Leadership Excellence', type: 'Professional', employees: 35, compliant: 35, expiring: 0, validity: 'Lifetime' },
  ];
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2"><Star className="w-5 h-5" /> Certification Management</CardTitle>
              <CardDescription>Track and manage employee certifications, renewals, and compliance.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => toast({ title: 'Report Exported' })} variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
              <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Certification</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-blue-600">5</p><p className="text-sm text-gray-500">Cert Types</p></div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-green-600">402</p><p className="text-sm text-gray-500">Active Certs</p></div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-yellow-600">17</p><p className="text-sm text-gray-500">Expiring Soon</p></div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-red-600">4</p><p className="text-sm text-gray-500">Non-Compliant</p></div>
          </div>
          
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className={`p-4 border rounded-lg cursor-pointer hover:border-blue-400 transition-colors ${selectedCert === cert.id ? 'border-blue-400 bg-blue-50/50' : ''}`} onClick={() => setSelectedCert(selectedCert === cert.id ? null : cert.id)}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{cert.name}</h4>
                      <Badge variant={cert.type === 'Mandatory' ? 'default' : 'secondary'}>{cert.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{cert.employees} employees • Valid for {cert.validity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center"><p className="text-lg font-bold text-green-600">{cert.compliant}</p><p className="text-xs text-gray-500">Compliant</p></div>
                    {cert.expiring > 0 && <div className="text-center"><p className="text-lg font-bold text-yellow-600">{cert.expiring}</p><p className="text-xs text-gray-500">Expiring</p></div>}
                  </div>
                </div>
                {selectedCert === cert.id && (
                  <div className="mt-4 pt-4 border-t flex gap-3">
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); toast({ title: 'Enrollments opened for ' + cert.name }); }}><UserPlus className="w-4 h-4 mr-1" /> Enroll Employees</Button>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); toast({ title: 'Reminder sent' }); }}>Send Renewal Reminders</Button>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}><Settings className="w-4 h-4 mr-1" /> Settings</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
    </div>
  );
}

function BrowseCoursesView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const courses = [
    { id: 'safety-101', name: 'Workplace Safety Fundamentals', category: 'Compliance', duration: '2 hours', enrolled: 156, rating: 4.8, mandatory: true },
    { id: 'excel-adv', name: 'Advanced Excel Skills', category: 'Technical', duration: '4 hours', enrolled: 89, rating: 4.5, mandatory: false },
    { id: 'leadership-101', name: 'Leadership Essentials', category: 'Leadership', duration: '6 hours', enrolled: 45, rating: 4.9, mandatory: false },
    { id: 'comm-skills', name: 'Effective Communication', category: 'Soft Skills', duration: '3 hours', enrolled: 112, rating: 4.6, mandatory: false },
    { id: 'project-mgmt', name: 'Project Management Basics', category: 'Technical', duration: '8 hours', enrolled: 67, rating: 4.7, mandatory: false },
    { id: 'ethics-101', name: 'Business Ethics', category: 'Compliance', duration: '1.5 hours', enrolled: 156, rating: 4.4, mandatory: true },
  ];
  
  const filteredCourses = courses.filter(c => 
    (categoryFilter === 'all' || c.category.toLowerCase() === categoryFilter) &&
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Course Catalog</CardTitle>
              <CardDescription>Browse and enroll in available training courses.</CardDescription>
            </div>
            <Link href="/saas/modules/hr-learning/action/create-course"><Button size="sm"><Plus className="w-4 h-4 mr-2" /> Create Course</Button></Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-sm" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="soft skills">Soft Skills</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg hover:border-blue-400 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{course.name}</h4>
                  {course.mandatory && <Badge variant="destructive" className="text-xs">Mandatory</Badge>}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{course.category}</Badge>
                  <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{course.duration}</Badge>
                  <Badge variant="outline"><Star className="w-3 h-3 mr-1" />{course.rating}</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3">{course.enrolled} employees enrolled</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toast({ title: 'Enrolled in ' + course.name })}><Plus className="w-4 h-4 mr-1" /> Enroll</Button>
                  <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1" /> Preview</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
    </div>
  );
}

function MyLearningView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  
  const inProgress = [
    { id: 'safety-101', name: 'Workplace Safety Fundamentals', progress: 75, dueDate: 'Feb 15, 2025', status: 'In Progress' },
    { id: 'excel-adv', name: 'Advanced Excel Skills', progress: 30, dueDate: 'Mar 1, 2025', status: 'In Progress' },
  ];
  
  const completed = [
    { id: 'ethics-101', name: 'Business Ethics', completedDate: 'Jan 10, 2025', certificate: true },
    { id: 'comm-skills', name: 'Effective Communication', completedDate: 'Dec 20, 2024', certificate: true },
    { id: 'onboarding', name: 'New Hire Onboarding', completedDate: 'Nov 15, 2024', certificate: false },
  ];
  
  const assigned = [
    { id: 'leadership-101', name: 'Leadership Essentials', assignedBy: 'HR Department', dueDate: 'Apr 1, 2025' },
  ];
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5" /> My Learning</CardTitle>
          <CardDescription>Track your learning progress and completed courses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> In Progress ({inProgress.length})</h3>
            <div className="space-y-3">
              {inProgress.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{course.name}</h4>
                    <span className="text-sm text-gray-500">Due: {course.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: `${course.progress}%`}}></div></div>
                    <span className="text-sm font-medium">{course.progress}%</span>
                    <Button size="sm" onClick={() => toast({ title: 'Resuming ' + course.name })}>Continue</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4" /> Assigned ({assigned.length})</h3>
            <div className="space-y-3">
              {assigned.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div><h4 className="font-medium">{course.name}</h4><p className="text-sm text-gray-500">Assigned by {course.assignedBy} • Due: {course.dueDate}</p></div>
                  <Button size="sm" onClick={() => toast({ title: 'Starting ' + course.name })}>Start</Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Completed ({completed.length})</h3>
            <div className="space-y-3">
              {completed.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div><h4 className="font-medium">{course.name}</h4><p className="text-sm text-gray-500">Completed: {course.completedDate}</p></div>
                  {course.certificate && <Button size="sm" variant="outline" onClick={() => toast({ title: 'Certificate Downloaded' })}><Download className="w-4 h-4 mr-1" /> Certificate</Button>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
    </div>
  );
}

function ComplianceTrainingView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  
  const training = [
    { id: 'safety', name: 'Workplace Safety', required: 156, completed: 148, overdue: 3, dueDate: 'Monthly' },
    { id: 'ethics', name: 'Business Ethics', required: 156, completed: 152, overdue: 0, dueDate: 'Annual' },
    { id: 'security', name: 'Information Security', required: 156, completed: 145, overdue: 2, dueDate: 'Quarterly' },
    { id: 'harassment', name: 'Anti-Harassment', required: 156, completed: 156, overdue: 0, dueDate: 'Annual' },
    { id: 'privacy', name: 'Data Privacy (GDPR)', required: 89, completed: 85, overdue: 1, dueDate: 'Annual' },
  ];
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Compliance Training</CardTitle>
              <CardDescription>Track mandatory training completion and compliance status.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast({ title: 'Compliance Report Exported' })}><Download className="w-4 h-4 mr-2" /> Export Report</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-green-600">94%</p><p className="text-sm text-gray-500">Overall Compliance</p></div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-blue-600">686</p><p className="text-sm text-gray-500">Completed</p></div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-yellow-600">27</p><p className="text-sm text-gray-500">Pending</p></div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center"><p className="text-2xl font-bold text-red-600">6</p><p className="text-sm text-gray-500">Overdue</p></div>
          </div>
          
          <div className="space-y-4">
            {training.map((t) => (
              <div key={t.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{t.name}</h4>
                    <p className="text-sm text-gray-500">Renewal: {t.dueDate}</p>
                  </div>
                  <div className="flex gap-2">
                    {t.overdue > 0 && <Badge variant="destructive">{t.overdue} overdue</Badge>}
                    <Badge variant={t.completed === t.required ? 'default' : 'secondary'}>{Math.round(t.completed / t.required * 100)}% complete</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${t.completed === t.required ? 'bg-green-600' : 'bg-blue-600'}`} style={{width: `${t.completed / t.required * 100}%`}}></div></div>
                  <span className="text-sm">{t.completed}/{t.required}</span>
                  {t.overdue > 0 && <Button size="sm" variant="outline" onClick={() => toast({ title: 'Reminders sent for ' + t.name })}>Send Reminders</Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
    </div>
  );
}

function LearningReportsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  
  const reports = [
    { name: 'Training Completion Summary', description: 'Overall training completion rates by department', lastRun: '2 hours ago' },
    { name: 'Compliance Status Report', description: 'Mandatory training compliance by employee', lastRun: '1 day ago' },
    { name: 'Course Effectiveness', description: 'Course ratings, completion rates, and feedback', lastRun: '3 days ago' },
    { name: 'Skills Gap Analysis', description: 'Employee skills gaps and training recommendations', lastRun: '1 week ago' },
    { name: 'Training Cost Analysis', description: 'Training investment and ROI metrics', lastRun: '1 week ago' },
    { name: 'Certification Expiry Report', description: 'Upcoming certification renewals', lastRun: '1 day ago' },
  ];
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Learning Reports</CardTitle>
        <CardDescription>Generate and download learning management reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((r, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between items-center">
              <div><h4 className="font-medium">{r.name}</h4><p className="text-sm text-gray-500">{r.description} • Last run: {r.lastRun}</p></div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toast({ title: r.name + ' Generated' })}><BarChart3 className="w-4 h-4 mr-1" /> View</Button>
                <Button size="sm" onClick={() => toast({ title: r.name + ' Downloaded' })}><Download className="w-4 h-4 mr-1" /> Export</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

// ================== EMPLOYEE RELATIONS COMPONENTS ==================

function LogGrievanceForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ employee: '', category: '', description: '', anonymous: false });
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Log Grievance</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Grievance Logged', description: 'Case has been created.' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Employee (if not anonymous)</Label><Input value={formData.employee} onChange={(e) => setFormData({...formData, employee: e.target.value})} placeholder="Employee name" /></div>
          <div className="space-y-2"><Label>Category *</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent><SelectItem value="harassment">Harassment</SelectItem><SelectItem value="discrimination">Discrimination</SelectItem><SelectItem value="workload">Workload Issues</SelectItem><SelectItem value="management">Management Concerns</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Description *</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the grievance in detail..." required /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Log Grievance</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function InitiateDisciplinaryForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Initiate Disciplinary Action</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Disciplinary Case Initiated' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Employee *</Label><Input placeholder="Employee name" required /></div>
          <div className="space-y-2"><Label>Violation Type *</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="misconduct">Misconduct</SelectItem><SelectItem value="performance">Performance Issues</SelectItem><SelectItem value="attendance">Attendance Problems</SelectItem><SelectItem value="policy">Policy Violation</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Action Level *</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger><SelectContent><SelectItem value="verbal">Verbal Warning</SelectItem><SelectItem value="written">Written Warning</SelectItem><SelectItem value="final">Final Warning</SelectItem><SelectItem value="suspension">Suspension</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Details *</Label><Textarea placeholder="Describe the incident and circumstances..." required /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Initiate</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function ScheduleMeetingForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Schedule Meeting</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Meeting Type</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="disciplinary">Disciplinary Hearing</SelectItem><SelectItem value="grievance">Grievance Discussion</SelectItem><SelectItem value="mediation">Mediation</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Participants</Label><Input placeholder="Enter participant names" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
            <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
          </div>
          <div className="space-y-2"><Label>Location</Label><Input placeholder="Meeting room" /></div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Meeting Scheduled' })}><Calendar className="w-4 h-4 mr-2" /> Schedule</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function SendCommunicationForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Send Communication</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Recipient</Label><Input placeholder="Employee name or email" /></div>
          <div className="space-y-2"><Label>Communication Type</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="letter">Formal Letter</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="notice">Notice</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Subject</Label><Input placeholder="Subject line" /></div>
          <div className="space-y-2"><Label>Content</Label><Textarea placeholder="Write your message..." /></div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Communication Sent' })}><Save className="w-4 h-4 mr-2" /> Send</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function RecordActionForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Record Action</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Case Reference</Label><Input placeholder="GRV-001 or DIS-001" /></div>
          <div className="space-y-2"><Label>Action Taken</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select action" /></SelectTrigger><SelectContent><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="escalated">Escalated</SelectItem><SelectItem value="closed">Closed - No Action</SelectItem><SelectItem value="warning">Warning Issued</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Record details of the action taken..." /></div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Action Recorded' })}><Save className="w-4 h-4 mr-2" /> Record</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function GrievancesListView({ backUrl }: { backUrl: string }) {
  const grievances = [
    { id: 'GRV-001', category: 'Workload', status: 'Open', date: 'Jan 20, 2025' },
    { id: 'GRV-002', category: 'Management', status: 'In Progress', date: 'Jan 18, 2025' },
    { id: 'GRV-003', category: 'Harassment', status: 'Resolved', date: 'Jan 10, 2025' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Grievances</CardTitle></CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">ID</th><th className="px-4 py-2">Category</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Date</th><th className="px-4 py-2">Actions</th></tr></thead>
            <tbody>{grievances.map((g) => (<tr key={g.id} className="border-t"><td className="px-4 py-2 font-mono">{g.id}</td><td className="px-4 py-2 text-center">{g.category}</td><td className="px-4 py-2 text-center"><Badge variant={g.status === 'Resolved' ? 'default' : g.status === 'Open' ? 'destructive' : 'secondary'}>{g.status}</Badge></td><td className="px-4 py-2 text-center">{g.date}</td><td className="px-4 py-2 text-center"><Button size="sm" variant="outline">View</Button></td></tr>))}</tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function DisciplinaryCasesView({ backUrl }: { backUrl: string }) { return <GrievancesListView backUrl={backUrl} />; }
function InvestigationsView({ backUrl }: { backUrl: string }) { return <GrievancesListView backUrl={backUrl} />; }
function WarningsView({ backUrl }: { backUrl: string }) { return <GrievancesListView backUrl={backUrl} />; }
function AppealsView({ backUrl }: { backUrl: string }) { return <GrievancesListView backUrl={backUrl} />; }
function CaseSummaryReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Case Summary Report" backUrl={backUrl} />; }
function TrendsAnalysisReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Trends Analysis" backUrl={backUrl} />; }
function ResolutionMetricsReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Resolution Metrics" backUrl={backUrl} />; }
function CaseCategoriesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Case Categories" backUrl={backUrl} />; }
function EscalationRulesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Escalation Rules" backUrl={backUrl} />; }
function ResolutionWorkflowsSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Resolution Workflows" backUrl={backUrl} />; }

function NewCaseForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> New Case</CardTitle><CardDescription>Create a new employee relations case.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label>Case Type *</Label>
          <Select><SelectTrigger><SelectValue placeholder="Select case type" /></SelectTrigger><SelectContent><SelectItem value="grievance">Grievance</SelectItem><SelectItem value="disciplinary">Disciplinary</SelectItem><SelectItem value="harassment">Harassment Complaint</SelectItem><SelectItem value="performance">Performance Issue</SelectItem><SelectItem value="policy">Policy Violation</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2"><Label>Employee Involved *</Label>
          <Select><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger><SelectContent><SelectItem value="emp1">John Smith</SelectItem><SelectItem value="emp2">Sarah Johnson</SelectItem><SelectItem value="emp3">Michael Brown</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2"><Label>Priority</Label>
          <Select><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2"><Label>Description *</Label><Textarea placeholder="Describe the case details..." className="min-h-[100px]" /></div>
        <div className="flex items-center space-x-2"><Switch id="confidential" /><Label htmlFor="confidential">Mark as Confidential</Label></div>
        <div className="flex gap-4 pt-4"><Button onClick={() => toast({ title: 'Case Created Successfully' })}><Save className="w-4 h-4 mr-2" /> Create Case</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function MyCasesView({ backUrl }: { backUrl: string }) {
  const myCases = [
    { id: 'GRV-005', type: 'Grievance', subject: 'Workload concerns', status: 'In Progress', created: 'Jan 20, 2025', lastUpdate: '1 day ago' },
    { id: 'DIS-003', type: 'Disciplinary', subject: 'Attendance issue', status: 'Pending Review', created: 'Jan 18, 2025', lastUpdate: '3 days ago' },
    { id: 'GRV-002', type: 'Grievance', subject: 'Equipment request', status: 'Resolved', created: 'Jan 10, 2025', lastUpdate: '1 week ago' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" /> My Cases</CardTitle><CardDescription>Cases you have filed or are assigned to.</CardDescription></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {myCases.map((c) => (
            <div key={c.id} className="p-4 border rounded-lg hover:border-blue-400 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div><span className="font-mono text-sm text-blue-600">{c.id}</span><h4 className="font-medium">{c.subject}</h4></div>
                <Badge variant={c.status === 'Resolved' ? 'default' : c.status === 'In Progress' ? 'secondary' : 'outline'}>{c.status}</Badge>
              </div>
              <p className="text-sm text-gray-500">{c.type} • Created: {c.created} • Updated: {c.lastUpdate}</p>
              <div className="flex gap-2 mt-3"><Button size="sm">View Details</Button><Button size="sm" variant="outline">Add Comment</Button></div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function GrievancesView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const grievances = [
    { id: 'GRV-001', employee: 'John Smith', category: 'Workload', status: 'Open', priority: 'High', date: 'Jan 20, 2025' },
    { id: 'GRV-002', employee: 'Sarah Johnson', category: 'Management', status: 'In Progress', priority: 'Medium', date: 'Jan 18, 2025' },
    { id: 'GRV-003', employee: 'Anonymous', category: 'Harassment', status: 'Resolved', priority: 'Critical', date: 'Jan 10, 2025' },
    { id: 'GRV-004', employee: 'Michael Brown', category: 'Compensation', status: 'Open', priority: 'Low', date: 'Jan 8, 2025' },
  ];
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Grievances</CardTitle><CardDescription>Manage and resolve employee grievances.</CardDescription></div>
          <Link href="/saas/modules/hr-employee-relations/action/new-case"><Button size="sm"><Plus className="w-4 h-4 mr-2" /> New Grievance</Button></Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center"><p className="text-xl font-bold text-red-600">2</p><p className="text-xs text-gray-500">Open</p></div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center"><p className="text-xl font-bold text-yellow-600">1</p><p className="text-xs text-gray-500">In Progress</p></div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"><p className="text-xl font-bold text-green-600">1</p><p className="text-xs text-gray-500">Resolved</p></div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center"><p className="text-xl font-bold text-blue-600">4</p><p className="text-xs text-gray-500">Total</p></div>
        </div>
        <div className="space-y-3">
          {grievances.map((g) => (
            <div key={g.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div><span className="font-mono text-sm text-blue-600">{g.id}</span><span className="mx-2">•</span><span className="font-medium">{g.employee}</span><Badge className="ml-2" variant={g.priority === 'Critical' ? 'destructive' : g.priority === 'High' ? 'default' : 'outline'}>{g.priority}</Badge></div>
                <Badge variant={g.status === 'Resolved' ? 'default' : g.status === 'Open' ? 'destructive' : 'secondary'}>{g.status}</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">{g.category} • Filed: {g.date}</p>
              <div className="flex gap-2 mt-3"><Button size="sm" onClick={() => toast({ title: 'Opening case ' + g.id })}>Review</Button><Button size="sm" variant="outline">Assign</Button></div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function DisciplinaryActionsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const cases = [
    { id: 'DIS-001', employee: 'Robert Wilson', offense: 'Repeated tardiness', stage: 'Written Warning', status: 'Active', date: 'Jan 22, 2025' },
    { id: 'DIS-002', employee: 'Linda Davis', offense: 'Policy violation', stage: 'Verbal Warning', status: 'Closed', date: 'Jan 15, 2025' },
    { id: 'DIS-003', employee: 'James Miller', offense: 'Attendance issue', stage: 'Final Warning', status: 'Active', date: 'Jan 10, 2025' },
  ];
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div><CardTitle className="flex items-center gap-2"><Gavel className="w-5 h-5" /> Disciplinary Actions</CardTitle><CardDescription>Track and manage disciplinary cases.</CardDescription></div>
          <Button size="sm"><Plus className="w-4 h-4 mr-2" /> New Case</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cases.map((c) => (
            <div key={c.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div><span className="font-mono text-sm text-orange-600">{c.id}</span><span className="mx-2">•</span><span className="font-medium">{c.employee}</span></div>
                <div className="flex gap-2"><Badge variant="outline">{c.stage}</Badge><Badge variant={c.status === 'Active' ? 'default' : 'secondary'}>{c.status}</Badge></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{c.offense} • Opened: {c.date}</p>
              <div className="flex gap-2 mt-3"><Button size="sm" onClick={() => toast({ title: 'Opening case details' })}>View Details</Button><Button size="sm" variant="outline">Escalate</Button><Button size="sm" variant="outline">Close Case</Button></div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function PolicyBreachesView({ backUrl }: { backUrl: string }) {
  const breaches = [
    { id: 'POL-001', policy: 'Data Security Policy', employee: 'Mark Thompson', severity: 'High', status: 'Under Investigation', date: 'Jan 21, 2025' },
    { id: 'POL-002', policy: 'Code of Conduct', employee: 'Anna White', severity: 'Medium', status: 'Resolved', date: 'Jan 14, 2025' },
    { id: 'POL-003', policy: 'Attendance Policy', employee: 'Chris Martin', severity: 'Low', status: 'Action Required', date: 'Jan 10, 2025' },
  ];
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Policy Breaches</CardTitle><CardDescription>Track policy violations and corrective actions.</CardDescription></div>
          <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Report Breach</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {breaches.map((b) => (
            <div key={b.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div><span className="font-mono text-sm text-purple-600">{b.id}</span><span className="mx-2">•</span><span className="font-medium">{b.policy}</span></div>
                <div className="flex gap-2"><Badge variant={b.severity === 'High' ? 'destructive' : b.severity === 'Medium' ? 'default' : 'secondary'}>{b.severity}</Badge><Badge variant="outline">{b.status}</Badge></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Employee: {b.employee} • Reported: {b.date}</p>
              <div className="flex gap-2 mt-3"><Button size="sm">View Details</Button><Button size="sm" variant="outline">Assign Investigator</Button></div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function EmployeeRelationsReportsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const reports = [
    { name: 'Case Summary Report', description: 'Overview of all employee relations cases', lastRun: '2 hours ago' },
    { name: 'Trends Analysis', description: 'Case trends by type, department, and time period', lastRun: '1 day ago' },
    { name: 'Resolution Metrics', description: 'Average resolution time and outcomes', lastRun: '3 days ago' },
    { name: 'Department Comparison', description: 'Compare case rates across departments', lastRun: '1 week ago' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Employee Relations Reports</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((r, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between items-center">
              <div><h4 className="font-medium">{r.name}</h4><p className="text-sm text-gray-500">{r.description} • Last run: {r.lastRun}</p></div>
              <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => toast({ title: r.name + ' Generated' })}><BarChart3 className="w-4 h-4 mr-1" /> View</Button><Button size="sm" onClick={() => toast({ title: r.name + ' Downloaded' })}><Download className="w-4 h-4 mr-1" /> Export</Button></div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

// ================== OFFBOARDING COMPONENTS ==================

function InitiateExitForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Initiate Employee Exit</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Exit Process Initiated' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Employee *</Label><Input placeholder="Employee name" required /></div>
          <div className="space-y-2"><Label>Separation Type *</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="resignation">Resignation</SelectItem><SelectItem value="termination">Termination</SelectItem><SelectItem value="retirement">Retirement</SelectItem><SelectItem value="layoff">Layoff</SelectItem><SelectItem value="contract-end">Contract End</SelectItem></SelectContent></Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Last Working Day *</Label><Input type="date" required /></div>
            <div className="space-y-2"><Label>Notice Period</Label><Input placeholder="30 days" /></div>
          </div>
          <div className="space-y-2"><Label>Reason</Label><Textarea placeholder="Reason for separation..." /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Initiate Exit</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function ScheduleExitInterviewForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Schedule Exit Interview</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Employee</Label><Input placeholder="Employee name" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
            <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
          </div>
          <div className="space-y-2"><Label>Interviewer</Label><Input placeholder="HR representative" /></div>
          <div className="space-y-2"><Label>Location</Label><Input placeholder="Meeting room or virtual" /></div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Exit Interview Scheduled' })}><Calendar className="w-4 h-4 mr-2" /> Schedule</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ProcessClearanceForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const checklist = [
    { item: 'IT Assets Returned', completed: true },
    { item: 'Access Cards Collected', completed: true },
    { item: 'Company Property Returned', completed: false },
    { item: 'Knowledge Transfer Complete', completed: false },
    { item: 'Finance Clearance', completed: false },
  ];
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Process Clearance</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checklist.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <span>{c.item}</span>
              <Badge variant={c.completed ? 'default' : 'secondary'}>{c.completed ? 'Completed' : 'Pending'}</Badge>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Clearance Updated' })}><CheckCircle2 className="w-4 h-4 mr-2" /> Update Status</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function GenerateExitDocumentsForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Generate Exit Documents</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Employee</Label><Input placeholder="Employee name" /></div>
          <div className="space-y-2"><Label>Documents to Generate</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Experience Certificate</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Relieving Letter</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> No Dues Certificate</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Final Settlement Statement</label>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Documents Generated' })}><Download className="w-4 h-4 mr-2" /> Generate</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ProcessFinalPayForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Process Final Pay</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"><p className="text-xl font-bold">$4,500</p><p className="text-sm text-gray-500">Pending Salary</p></div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"><p className="text-xl font-bold">$1,200</p><p className="text-sm text-gray-500">Leave Encashment</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"><p className="text-xl font-bold">-$500</p><p className="text-sm text-gray-500">Deductions</p></div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"><p className="text-xl font-bold text-green-600">$5,200</p><p className="text-sm text-gray-500">Total Final Pay</p></div>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Final Pay Processed' })}><DollarSign className="w-4 h-4 mr-2" /> Process Payment</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function SeparationsListView({ backUrl }: { backUrl: string }) {
  const separations = [
    { id: 'SEP-001', employee: 'John Doe', type: 'Resignation', date: 'Jan 31, 2025', status: 'In Progress' },
    { id: 'SEP-002', employee: 'Jane Smith', type: 'Retirement', date: 'Feb 28, 2025', status: 'Pending' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Separations</CardTitle></CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">ID</th><th className="px-4 py-2">Employee</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Last Day</th><th className="px-4 py-2">Status</th></tr></thead>
            <tbody>{separations.map((s) => (<tr key={s.id} className="border-t"><td className="px-4 py-2 font-mono">{s.id}</td><td className="px-4 py-2">{s.employee}</td><td className="px-4 py-2 text-center">{s.type}</td><td className="px-4 py-2 text-center">{s.date}</td><td className="px-4 py-2 text-center"><Badge>{s.status}</Badge></td></tr>))}</tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ExitInterviewsView({ backUrl }: { backUrl: string }) { return <SeparationsListView backUrl={backUrl} />; }
function ClearanceStatusView({ backUrl }: { backUrl: string }) { return <ProcessClearanceForm backUrl={backUrl} />; }
function FinalSettlementsView({ backUrl }: { backUrl: string }) { return <SeparationsListView backUrl={backUrl} />; }
function TurnoverAnalysisReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Turnover Analysis" backUrl={backUrl} />; }
function ExitReasonsReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Exit Reasons Report" backUrl={backUrl} />; }
function ClearanceAuditReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Clearance Audit Report" backUrl={backUrl} />; }
function ExitChecklistSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Exit Checklist" backUrl={backUrl} />; }
function ClearanceWorkflowSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Clearance Workflow" backUrl={backUrl} />; }
function SeparationReasonsSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Separation Reasons" backUrl={backUrl} />; }

// ================== POSITION CONTROL COMPONENTS ==================

function CreatePositionForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Create Position</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Position Created' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Position Title *</Label><Input placeholder="e.g., Senior Software Engineer" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Department *</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent><SelectItem value="engineering">Engineering</SelectItem><SelectItem value="hr">Human Resources</SelectItem><SelectItem value="finance">Finance</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Grade *</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger><SelectContent><SelectItem value="g1">Grade 1</SelectItem><SelectItem value="g2">Grade 2</SelectItem><SelectItem value="g3">Grade 3</SelectItem></SelectContent></Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Reports To</Label><Input placeholder="Position/Title" /></div>
            <div className="space-y-2"><Label>Headcount</Label><Input type="number" defaultValue="1" /></div>
          </div>
          <div className="space-y-2"><Label>Job Description</Label><Textarea placeholder="Position responsibilities and requirements..." /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Create Position</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function CreateGradeForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Create Grade</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Grade Created' }); setLocation(backUrl); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Grade Code *</Label><Input placeholder="G1, G2, etc." required /></div>
            <div className="space-y-2"><Label>Grade Name *</Label><Input placeholder="e.g., Junior Level" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Min Salary (LRD)</Label><Input type="number" placeholder="50000" /></div>
            <div className="space-y-2"><Label>Max Salary (LRD)</Label><Input type="number" placeholder="100000" /></div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Grade level description..." /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Create Grade</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function ApproveEstablishmentForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Approve Establishment</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"><p className="font-medium">Pending Establishment Changes</p><p className="text-sm text-gray-600">3 new positions require approval for FY 2025</p></div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">Position</th><th className="px-4 py-2">Department</th><th className="px-4 py-2">Headcount</th><th className="px-4 py-2">Action</th></tr></thead>
              <tbody>
                <tr className="border-t"><td className="px-4 py-2">Software Engineer</td><td className="px-4 py-2 text-center">IT</td><td className="px-4 py-2 text-center">+2</td><td className="px-4 py-2 text-center"><Button size="sm" onClick={() => toast({ title: 'Approved' })} className="bg-green-600">Approve</Button></td></tr>
                <tr className="border-t"><td className="px-4 py-2">HR Analyst</td><td className="px-4 py-2 text-center">HR</td><td className="px-4 py-2 text-center">+1</td><td className="px-4 py-2 text-center"><Button size="sm" onClick={() => toast({ title: 'Approved' })} className="bg-green-600">Approve</Button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function RequestHeadcountForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Request Headcount</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Headcount Request Submitted' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Position *</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger><SelectContent><SelectItem value="eng">Software Engineer</SelectItem><SelectItem value="analyst">Business Analyst</SelectItem></SelectContent></Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Additional Headcount *</Label><Input type="number" defaultValue="1" required /></div>
            <div className="space-y-2"><Label>Effective Date</Label><Input type="date" /></div>
          </div>
          <div className="space-y-2"><Label>Justification *</Label><Textarea placeholder="Explain the business need..." required /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Submit Request</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function PositionsListView({ backUrl }: { backUrl: string }) {
  const positions = [
    { title: 'Software Engineer', department: 'IT', grade: 'G3', filled: 8, total: 10 },
    { title: 'HR Manager', department: 'HR', grade: 'G5', filled: 1, total: 1 },
    { title: 'Finance Analyst', department: 'Finance', grade: 'G3', filled: 3, total: 4 },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Positions</CardTitle></CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">Position Title</th><th className="px-4 py-2">Department</th><th className="px-4 py-2">Grade</th><th className="px-4 py-2">Filled/Total</th><th className="px-4 py-2">Actions</th></tr></thead>
            <tbody>{positions.map((p, i) => (<tr key={i} className="border-t"><td className="px-4 py-2">{p.title}</td><td className="px-4 py-2 text-center">{p.department}</td><td className="px-4 py-2 text-center">{p.grade}</td><td className="px-4 py-2 text-center">{p.filled}/{p.total}</td><td className="px-4 py-2 text-center"><Button size="sm" variant="outline">View</Button></td></tr>))}</tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Add Position</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function GradesListView({ backUrl }: { backUrl: string }) {
  const grades = [
    { code: 'G1', name: 'Entry Level', range: 'LRD 50,000 - 75,000', positions: 25 },
    { code: 'G2', name: 'Junior', range: 'LRD 75,000 - 100,000', positions: 45 },
    { code: 'G3', name: 'Mid-Level', range: 'LRD 100,000 - 150,000', positions: 52 },
    { code: 'G4', name: 'Senior', range: 'LRD 150,000 - 200,000', positions: 28 },
    { code: 'G5', name: 'Management', range: 'LRD 200,000 - 300,000', positions: 6 },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Grade Structure</CardTitle></CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">Code</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">Salary Range</th><th className="px-4 py-2">Positions</th></tr></thead>
            <tbody>{grades.map((g, i) => (<tr key={i} className="border-t"><td className="px-4 py-2 font-mono">{g.code}</td><td className="px-4 py-2">{g.name}</td><td className="px-4 py-2 text-center">{g.range}</td><td className="px-4 py-2 text-center">{g.positions}</td></tr>))}</tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Add Grade</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function EstablishmentView({ backUrl }: { backUrl: string }) { return <PositionsListView backUrl={backUrl} />; }
function VacanciesView({ backUrl }: { backUrl: string }) { return <PositionsListView backUrl={backUrl} />; }
function OrgStructureView({ backUrl }: { backUrl: string }) { return <OrgChartView backUrl={backUrl} />; }
function EstablishmentReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Establishment Report" backUrl={backUrl} />; }
function VacancyReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Vacancy Report" backUrl={backUrl} />; }
function HeadcountProjectionReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Headcount Projection" backUrl={backUrl} />; }
function PositionTypesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Position Types" backUrl={backUrl} />; }
function GradeStructureSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Grade Structure" backUrl={backUrl} />; }
function ApprovalMatrixSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Approval Matrix" backUrl={backUrl} />; }

// ================== DOCUMENT MANAGEMENT COMPONENTS ==================

function UploadDocumentForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Upload Document</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Document Uploaded' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Document Title *</Label><Input placeholder="Document title" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Category *</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem value="policy">Policy</SelectItem><SelectItem value="contract">Contract</SelectItem><SelectItem value="form">Form</SelectItem><SelectItem value="report">Report</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Related Employee</Label><Input placeholder="Employee name (optional)" /></div>
          </div>
          <div className="border-2 border-dashed rounded-lg p-8 text-center"><p className="text-gray-500">Drag and drop files here or click to browse</p><Button variant="outline" className="mt-4">Browse Files</Button></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Upload</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function CreateTemplateForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Create Template</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Template Created' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Template Name *</Label><Input placeholder="e.g., Offer Letter Template" required /></div>
          <div className="space-y-2"><Label>Template Type *</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="letter">Letter</SelectItem><SelectItem value="certificate">Certificate</SelectItem><SelectItem value="form">Form</SelectItem><SelectItem value="contract">Contract</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Template Content</Label><Textarea placeholder="Enter template content with {{placeholders}}..." className="min-h-[200px]" /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Create Template</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function GenerateDocumentForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Generate Document</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Template</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger><SelectContent><SelectItem value="offer">Offer Letter</SelectItem><SelectItem value="contract">Employment Contract</SelectItem><SelectItem value="certificate">Experience Certificate</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Employee</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger><SelectContent><SelectItem value="john">John Smith</SelectItem><SelectItem value="sarah">Sarah Johnson</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Output Format</Label>
            <Select defaultValue="pdf"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="docx">Word Document</SelectItem></SelectContent></Select>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Document Generated' })}><Download className="w-4 h-4 mr-2" /> Generate</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function RequestSignatureForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Request Signature</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Document</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select document" /></SelectTrigger><SelectContent><SelectItem value="contract1">Employment Contract - John Smith</SelectItem><SelectItem value="policy1">Policy Acknowledgment</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Signer Email</Label><Input type="email" placeholder="signer@company.com" /></div>
          <div className="space-y-2"><Label>Message (optional)</Label><Textarea placeholder="Add a message for the signer..." /></div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Signature Requested' })}><Save className="w-4 h-4 mr-2" /> Send Request</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function DocumentsLibraryView({ backUrl }: { backUrl: string }) {
  const documents = [
    { name: 'Employee Handbook 2025', category: 'Policy', date: 'Jan 1, 2025', size: '2.5 MB' },
    { name: 'Leave Policy', category: 'Policy', date: 'Jan 1, 2025', size: '450 KB' },
    { name: 'Employment Contract Template', category: 'Template', date: 'Dec 15, 2024', size: '125 KB' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Document Library</CardTitle></CardHeader>
      <CardContent>
        <div className="mb-4"><Input placeholder="Search documents..." className="max-w-sm" /></div>
        <div className="space-y-3">{documents.map((d, i) => (<div key={i} className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">{d.name}</h4><p className="text-sm text-gray-500">{d.category} • {d.date} • {d.size}</p></div><div className="flex gap-2"><Button size="sm" variant="outline"><Download className="w-4 h-4" /></Button><Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button></div></div>))}</div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Upload Document</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function TemplatesView({ backUrl }: { backUrl: string }) { return <DocumentsLibraryView backUrl={backUrl} />; }
function EmployeeFilesView({ backUrl }: { backUrl: string }) { return <DocumentsLibraryView backUrl={backUrl} />; }
function PendingSignaturesView({ backUrl }: { backUrl: string }) { return <DocumentsLibraryView backUrl={backUrl} />; }
function ArchivedDocumentsView({ backUrl }: { backUrl: string }) { return <DocumentsLibraryView backUrl={backUrl} />; }
function DocumentAuditReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Document Audit Report" backUrl={backUrl} />; }
function ExpiringDocumentsReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Expiring Documents Report" backUrl={backUrl} />; }
function ComplianceChecklistReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Compliance Checklist" backUrl={backUrl} />; }
function DocumentCategoriesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Document Categories" backUrl={backUrl} />; }
function RetentionPoliciesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Retention Policies" backUrl={backUrl} />; }
function DocumentAccessControlsSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Access Controls" backUrl={backUrl} />; }

function DocumentUploadForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5" /> Upload Document</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 mb-2">Drag and drop files here, or click to browse</p>
          <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Select Files</Button>
        </div>
        <div className="space-y-2"><Label>Document Category</Label>
          <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem value="policy">Policy Documents</SelectItem><SelectItem value="employee">Employee Records</SelectItem><SelectItem value="contract">Contracts</SelectItem><SelectItem value="compliance">Compliance</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2"><Label>Description (optional)</Label><Textarea placeholder="Brief description of the document..." /></div>
        <div className="flex gap-4 pt-4"><Button onClick={() => toast({ title: 'Document Uploaded Successfully' })}><Upload className="w-4 h-4 mr-2" /> Upload</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function GenerateLetterForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Generate Letter</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label>Letter Type *</Label>
          <Select><SelectTrigger><SelectValue placeholder="Select letter type" /></SelectTrigger><SelectContent><SelectItem value="offer">Offer Letter</SelectItem><SelectItem value="confirmation">Employment Confirmation</SelectItem><SelectItem value="promotion">Promotion Letter</SelectItem><SelectItem value="termination">Termination Letter</SelectItem><SelectItem value="reference">Reference Letter</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2"><Label>Employee *</Label>
          <Select><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger><SelectContent><SelectItem value="emp1">John Smith</SelectItem><SelectItem value="emp2">Sarah Johnson</SelectItem><SelectItem value="emp3">Michael Brown</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2"><Label>Additional Notes</Label><Textarea placeholder="Any specific content to include..." /></div>
        <div className="flex gap-4 pt-4"><Button onClick={() => toast({ title: 'Letter Generated' })}><FileText className="w-4 h-4 mr-2" /> Generate</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function DocumentSearchView({ backUrl }: { backUrl: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const results = [
    { name: 'Employee Handbook 2025', category: 'Policy', date: 'Jan 1, 2025', match: 'Title match' },
    { name: 'Annual Leave Policy', category: 'Policy', date: 'Jan 1, 2025', match: 'Content match' },
    { name: 'Remote Work Guidelines', category: 'Policy', date: 'Dec 1, 2024', match: 'Content match' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> Search Documents</CardTitle></CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input placeholder="Search by name, content, or tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1" />
          <Select><SelectTrigger className="w-40"><SelectValue placeholder="All Types" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="policy">Policies</SelectItem><SelectItem value="contract">Contracts</SelectItem><SelectItem value="employee">Employee Files</SelectItem></SelectContent></Select>
          <Button><Search className="w-4 h-4 mr-2" /> Search</Button>
        </div>
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between items-center hover:border-blue-400 cursor-pointer">
              <div><h4 className="font-medium">{r.name}</h4><p className="text-sm text-gray-500">{r.category} • {r.date} • {r.match}</p></div>
              <div className="flex gap-2"><Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button><Button size="sm" variant="outline"><Download className="w-4 h-4" /></Button></div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function MyDocumentsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const myDocs = [
    { name: 'Employment Contract', status: 'Signed', date: 'Nov 15, 2024', signedDate: 'Nov 20, 2024' },
    { name: 'NDA Agreement', status: 'Pending', date: 'Jan 10, 2025', signedDate: null },
    { name: 'Benefits Enrollment Form', status: 'Signed', date: 'Nov 16, 2024', signedDate: 'Nov 18, 2024' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FolderOpen className="w-5 h-5" /> My Documents</CardTitle><CardDescription>Documents assigned to you for review or signature.</CardDescription></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {myDocs.map((doc, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between items-center">
              <div><h4 className="font-medium">{doc.name}</h4><p className="text-sm text-gray-500">Received: {doc.date} {doc.signedDate && `• Signed: ${doc.signedDate}`}</p></div>
              <div className="flex items-center gap-3">
                <Badge variant={doc.status === 'Signed' ? 'default' : 'secondary'}>{doc.status}</Badge>
                {doc.status === 'Pending' ? <Button size="sm" onClick={() => toast({ title: 'Opening for signature...' })}>Sign Now</Button> : <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-1" /> Download</Button>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function DocumentReportsView({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const reports = [
    { name: 'Document Status Report', description: 'Overview of all documents and their current status', lastRun: '2 hours ago' },
    { name: 'Pending Signatures', description: 'Documents awaiting signature by employees', lastRun: '1 day ago' },
    { name: 'Expiring Documents', description: 'Documents approaching expiration', lastRun: '3 days ago' },
    { name: 'Compliance Audit Trail', description: 'Document access and modification history', lastRun: '1 week ago' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Document Reports</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((r, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between items-center">
              <div><h4 className="font-medium">{r.name}</h4><p className="text-sm text-gray-500">{r.description} • Last run: {r.lastRun}</p></div>
              <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => toast({ title: r.name + ' Generated' })}><BarChart3 className="w-4 h-4 mr-1" /> View</Button><Button size="sm" onClick={() => toast({ title: r.name + ' Downloaded' })}><Download className="w-4 h-4 mr-1" /> Export</Button></div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

// ================== PLATFORM GOVERNANCE COMPONENTS ==================

function CreatePolicyForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Create Policy</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Policy Created' }); setLocation(backUrl); }} className="space-y-4">
          <div className="space-y-2"><Label>Policy Name *</Label><Input placeholder="e.g., Data Privacy Policy" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Category *</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem value="security">Security</SelectItem><SelectItem value="data">Data Management</SelectItem><SelectItem value="access">Access Control</SelectItem><SelectItem value="compliance">Compliance</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Effective Date</Label><Input type="date" /></div>
          </div>
          <div className="space-y-2"><Label>Policy Content *</Label><Textarea placeholder="Enter policy details..." className="min-h-[150px]" required /></div>
          <div className="flex gap-4 pt-4"><Button type="submit"><Save className="w-4 h-4 mr-2" /> Create Policy</Button><Link href={backUrl}><Button type="button" variant="outline">Cancel</Button></Link></div>
        </form>
      </CardContent>
    </Card>
  );
}

function ConfigureSecurityForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Configure Security</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Password Policy</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between"><span>Minimum Length</span><Input type="number" defaultValue="8" className="w-20" /></label>
              <label className="flex items-center justify-between"><span>Require Special Characters</span><input type="checkbox" defaultChecked /></label>
              <label className="flex items-center justify-between"><span>Require Numbers</span><input type="checkbox" defaultChecked /></label>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Session Settings</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between"><span>Session Timeout (minutes)</span><Input type="number" defaultValue="30" className="w-20" /></label>
              <label className="flex items-center justify-between"><span>Require 2FA</span><input type="checkbox" /></label>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Security Settings Updated' })}><Save className="w-4 h-4 mr-2" /> Save Settings</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function RunAuditForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> Run System Audit</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Audit Type</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select audit type" /></SelectTrigger><SelectContent><SelectItem value="security">Security Audit</SelectItem><SelectItem value="access">Access Audit</SelectItem><SelectItem value="data">Data Integrity Audit</SelectItem><SelectItem value="full">Full System Audit</SelectItem></SelectContent></Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" /></div>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Audit Started', description: 'This may take a few minutes.' })}><Search className="w-4 h-4 mr-2" /> Run Audit</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function ConfigureIntegrationForm({ backUrl }: { backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Configure Integration</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Single Sign-On (SSO)</h4><p className="text-sm text-gray-500">SAML/OAuth integration</p></div><Button size="sm" onClick={() => toast({ title: 'SSO Configured' })}>Configure</Button></div>
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">API Keys</h4><p className="text-sm text-gray-500">Manage API access tokens</p></div><Button size="sm" variant="outline">Manage</Button></div>
          <div className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">Webhooks</h4><p className="text-sm text-gray-500">Configure event notifications</p></div><Button size="sm" variant="outline">Setup</Button></div>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function PoliciesListView({ backUrl }: { backUrl: string }) {
  const policies = [
    { name: 'Data Privacy Policy', category: 'Data', status: 'Active', updated: 'Jan 1, 2025' },
    { name: 'Access Control Policy', category: 'Security', status: 'Active', updated: 'Dec 15, 2024' },
    { name: 'Password Policy', category: 'Security', status: 'Active', updated: 'Dec 1, 2024' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Platform Policies</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">{policies.map((p, i) => (<div key={i} className="p-4 border rounded-lg flex justify-between items-center"><div><h4 className="font-medium">{p.name}</h4><p className="text-sm text-gray-500">{p.category} • Updated: {p.updated}</p></div><Badge>{p.status}</Badge></div>))}</div>
        <div className="flex gap-4 pt-6"><Button><Plus className="w-4 h-4 mr-2" /> Add Policy</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function SecuritySettingsView({ backUrl }: { backUrl: string }) { return <ConfigureSecurityForm backUrl={backUrl} />; }
function UserRolesView({ backUrl }: { backUrl: string }) { return <AccessControlView backUrl={backUrl} />; }
function AuditLogsView({ backUrl }: { backUrl: string }) { return <AuditTrailView backUrl={backUrl} />; }
function IntegrationsView({ backUrl }: { backUrl: string }) { return <ConfigureIntegrationForm backUrl={backUrl} />; }
function SecurityReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Security Report" backUrl={backUrl} />; }
function AccessAuditReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Access Audit Report" backUrl={backUrl} />; }
function ComplianceStatusReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="Compliance Status Report" backUrl={backUrl} />; }
function SystemHealthReport({ backUrl }: { backUrl: string }) { return <GenericReportView title="System Health Report" backUrl={backUrl} />; }
function SecurityPoliciesSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Security Policies" backUrl={backUrl} />; }
function DataRetentionSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="Data Retention" backUrl={backUrl} />; }
function APIConfigurationSettings({ backUrl }: { backUrl: string }) { return <GenericSettingsView title="API Configuration" backUrl={backUrl} />; }

// ================== GENERIC COMPONENTS ==================

function GenericReportView({ title, backUrl }: { title: string; backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> {title}</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Date Range</Label>
              <Select defaultValue="month"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem><SelectItem value="quarter">This Quarter</SelectItem><SelectItem value="year">This Year</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Format</Label>
              <Select defaultValue="pdf"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="excel">Excel</SelectItem><SelectItem value="csv">CSV</SelectItem></SelectContent></Select>
            </div>
          </div>
          <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Report preview will appear here</p>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Report Generated' })}><Download className="w-4 h-4 mr-2" /> Generate Report</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function GenericActionForm({ title, backUrl, moduleName }: { title: string; backUrl: string; moduleName?: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> {title}</CardTitle><CardDescription>{moduleName || 'Action'}</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label>Name/Description *</Label><Input placeholder="Enter name or description..." /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Category</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="cat1">Category 1</SelectItem><SelectItem value="cat2">Category 2</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Status</Label>
            <Select defaultValue="active"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent></Select>
          </div>
        </div>
        <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Additional details..." /></div>
        <div className="flex gap-4 pt-4"><Button onClick={() => toast({ title: title + ' Completed' })}><Save className="w-4 h-4 mr-2" /> Submit</Button><Link href={backUrl}><Button variant="outline">Cancel</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function GenericDataView({ title, backUrl }: { title: string; backUrl: string }) {
  const sampleData = [
    { id: 'REC-001', name: 'Sample Record 1', status: 'Active', date: 'Jan 20, 2025' },
    { id: 'REC-002', name: 'Sample Record 2', status: 'Pending', date: 'Jan 18, 2025' },
    { id: 'REC-003', name: 'Sample Record 3', status: 'Completed', date: 'Jan 15, 2025' },
  ];
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> {title}</CardTitle></CardHeader>
      <CardContent>
        <div className="mb-4"><Input placeholder="Search..." className="max-w-sm" /></div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800"><tr><th className="px-4 py-2 text-left">ID</th><th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-center">Status</th><th className="px-4 py-2 text-center">Date</th><th className="px-4 py-2 text-center">Actions</th></tr></thead>
            <tbody>{sampleData.map((r) => (<tr key={r.id} className="border-t"><td className="px-4 py-2 font-mono text-sm">{r.id}</td><td className="px-4 py-2">{r.name}</td><td className="px-4 py-2 text-center"><Badge variant={r.status === 'Active' ? 'default' : 'secondary'}>{r.status}</Badge></td><td className="px-4 py-2 text-center text-sm">{r.date}</td><td className="px-4 py-2 text-center"><Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button></td></tr>))}</tbody>
          </table>
        </div>
        <div className="flex gap-4 pt-6"><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function GenericSettingsView({ title, backUrl }: { title: string; backUrl: string }) {
  const { toast } = useToast();
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> {title}</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg"><h4 className="font-medium mb-2">Configuration Options</h4><p className="text-sm text-gray-500">Adjust settings for {title.toLowerCase()}.</p></div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><span>Enable Feature</span><input type="checkbox" defaultChecked /></div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><span>Send Notifications</span><input type="checkbox" /></div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><span>Require Approval</span><input type="checkbox" defaultChecked /></div>
          </div>
        </div>
        <div className="flex gap-4 pt-6"><Button onClick={() => toast({ title: 'Settings Saved' })}><Save className="w-4 h-4 mr-2" /> Save Settings</Button><Link href={backUrl}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link></div>
      </CardContent>
    </Card>
  );
}

function DefaultFeatureView({ moduleName, featureName, featureType, backUrl }: { moduleName: string; featureName: string; featureType: string; backUrl: string }) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{featureName}</CardTitle>
        <CardDescription>{moduleName} - {featureType}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold text-lg mb-2">Feature Under Development</h3>
          <p className="text-gray-500 mb-6">This feature is being built and will be available soon.</p>
          <Link href={backUrl}>
            <Button><ArrowLeft className="w-4 h-4 mr-2" /> Return to Module</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
