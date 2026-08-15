import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import FarmHome from "@/pages/farm/home";
import FarmAbout from "@/pages/farm/about";
import FarmProjects from "@/pages/farm/projects";
import FarmMarket from "@/pages/farm/market";
import FarmMedia from "@/pages/farm/media";
import FarmContact from "@/pages/farm/contact";
import FarmLogin from "@/pages/farm/login";
import FarmDashboard from "@/pages/farm/dashboard";
import ITServicesPortal from "@/pages/it-services";
import CustomSoftwarePage from "@/pages/it-services/custom-software";
import CloudInfrastructurePage from "@/pages/it-services/cloud-infrastructure";
import CybersecurityPage from "@/pages/it-services/cybersecurity";
import TrainingCapacityBuildingPage from "@/pages/it-services/training-capacity-building";
import CertifiedTechnicalWorkshopsPage from "@/pages/it-services/training/certified-technical-workshops";
import ProjectRecommendationsPage from "@/pages/it-services/project-recommendations";
import CateringPage from "@/pages/catering";
import CorporateCateringPage from "@/pages/catering/corporate-catering";
import EventPlanningPage from "@/pages/catering/event-planning";
import FoodSafetyPage from "@/pages/catering/food-safety";
import SocialCelebrationsPage from "@/pages/catering/social-celebrations";
import SpecialtyMenusPage from "@/pages/catering/specialty-menus";
import BeverageServicesPage from "@/pages/catering/beverage-services";
import OnsiteCoordinationPage from "@/pages/catering/onsite-coordination";
import PostEventServicesPage from "@/pages/catering/post-event-services";
import CateringOpsLogin from "@/pages/catering/ops/login";
import CateringDashboard from "@/pages/catering/ops/dashboard";
import GeneralMerchandisePage from "@/pages/general-merchandise";
import OrderTrackingPage from "@/pages/order-tracking";
import MerchantDashboard from "@/pages/merchant-dashboard-new";
import MerchantLogin from "@/pages/merchant-login";
import TGMEnterpriseLogin from "@/pages/tgm-enterprise-login";
import TGMEnterpriseDashboard from "@/pages/tgm-enterprise-dashboard";
import CustomerDashboard from "@/pages/customer-dashboard";
import PaymentReceipt from "@/pages/payment-receipt";
import EmailManagementPage from "@/pages/email-management";
import AdminLoginPage from "@/pages/admin-login";
import AdminDashboardPage from "@/pages/admin-dashboard";
import SubsidiaryEmailManagement from "@/pages/subsidiary-email-management";
import DomainVerificationGuide from "@/pages/domain-verification-guide";
import CargoPage from "@/pages/cargo";
import PetroleumPage from "@/pages/petroleum";
import ConstructionPage from "@/pages/construction";
import RealEstatePage from "@/pages/real-estate";
import ConsultingPage from "@/pages/consulting";
import StationeryPage from "@/pages/stationery";
import SolarPage from "@/pages/solar";
import SaaSLanding from "@/pages/saas/landing";

import SaaSRegister from "@/pages/saas/register";
import SaaSLogin from "@/pages/saas/login";
import SaaSDashboard from "@/pages/saas/dashboard";
import PaymentSuccessPage from "@/pages/saas/payment-success";
import { ChangePasswordPage } from "@/pages/saas/change-password";
import SubscriptionPage from "@/pages/saas/subscription";
import UserManagement from "@/pages/saas/users";


// HRMIS Module Pages
import HRCorePage from "@/pages/saas/modules/hr-core";
import HRRecruitmentPage from "@/pages/saas/modules/hr-recruitment";
import HRTalentPage from "@/pages/saas/modules/hr-talent";
import HRCompensationPage from "@/pages/saas/modules/hr-compensation";
import HRSelfServicePage from "@/pages/saas/modules/hr-self-service";
import HRAnalyticsPage from "@/pages/saas/modules/hr-analytics";
import HRBiometricsPage from "@/pages/saas/modules/hr-biometrics";
import HRTimeLeavePage from "@/pages/saas/modules/hr-time-leave";
import HRPayrollPage from "@/pages/saas/modules/hr-payroll";
import HRLearningPage from "@/pages/saas/modules/hr-learning";
import HREmployeeRelationsPage from "@/pages/saas/modules/hr-employee-relations";
import HROffboardingPage from "@/pages/saas/modules/hr-offboarding";
import HRPositionControlPage from "@/pages/saas/modules/hr-position-control";
import HRDocumentsPage from "@/pages/saas/modules/hr-documents";
import PlatformGovernancePage from "@/pages/saas/modules/platform-governance";
import ModuleFeaturePage from "@/pages/saas/module-feature";

// FIMS Module Pages
import FIMSGeneralLedgerPage from "@/pages/saas/modules/fims-general-ledger";
import FIMSAccountsPayablePage from "@/pages/saas/modules/fims-accounts-payable";
import FIMSAccountsReceivablePage from "@/pages/saas/modules/fims-accounts-receivable";
import FIMSTreasuryPage from "@/pages/saas/modules/fims-treasury";
import FIMSBudgetingPage from "@/pages/saas/modules/fims-budgeting";
import FIMSProcurementPage from "@/pages/saas/modules/fims-procurement";
import FIMSReportingPage from "@/pages/saas/modules/fims-reporting";
import FIMSCompliancePage from "@/pages/saas/modules/fims-compliance";
import FIMSCommitmentControlPage from "@/pages/saas/modules/fims-commitment-control";
import FIMSFixedAssetsPage from "@/pages/saas/modules/fims-fixed-assets";
import FIMSContractsPage from "@/pages/saas/modules/fims-contracts";
import FIMSProjectsPage from "@/pages/saas/modules/fims-projects";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/farm" component={FarmHome} />
      <Route path="/farm/about" component={FarmAbout} />
      <Route path="/farm/projects" component={FarmProjects} />
      <Route path="/farm/market" component={FarmMarket} />
      <Route path="/farm/media" component={FarmMedia} />
      <Route path="/farm/contact" component={FarmContact} />
      <Route path="/farm/login" component={FarmLogin} />
      <Route path="/farm/dashboard" component={FarmDashboard} />
      <Route path="/it-services" component={ITServicesPortal} />
      <Route path="/it-services/custom-software" component={CustomSoftwarePage} />
      <Route path="/it-services/cloud-infrastructure" component={CloudInfrastructurePage} />
      <Route path="/it-services/cybersecurity" component={CybersecurityPage} />
      <Route path="/it-services/training-capacity-building" component={TrainingCapacityBuildingPage} />
      <Route path="/it-services/training/certified-technical-workshops" component={CertifiedTechnicalWorkshopsPage} />
      <Route path="/it-services/project-recommendations" component={ProjectRecommendationsPage} />
      <Route path="/catering" component={CateringPage} />
      <Route path="/catering/corporate-catering" component={CorporateCateringPage} />
      <Route path="/catering/event-planning" component={EventPlanningPage} />
      <Route path="/catering/food-safety" component={FoodSafetyPage} />
      <Route path="/catering/social-celebrations" component={SocialCelebrationsPage} />
      <Route path="/catering/specialty-menus" component={SpecialtyMenusPage} />
      <Route path="/catering/beverage-services" component={BeverageServicesPage} />
      <Route path="/catering/onsite-coordination" component={OnsiteCoordinationPage} />
      <Route path="/catering/post-event-services" component={PostEventServicesPage} />
      <Route path="/catering/ops/login" component={CateringOpsLogin} />
      <Route path="/catering/ops/dashboard" component={CateringDashboard} />
      <Route path="/general-merchandise" component={GeneralMerchandisePage} />
      <Route path="/cargo" component={CargoPage} />
      <Route path="/petroleum" component={PetroleumPage} />
      <Route path="/construction" component={ConstructionPage} />
      <Route path="/real-estate" component={RealEstatePage} />
      <Route path="/consulting" component={ConsultingPage} />
      <Route path="/stationery" component={StationeryPage} />
      <Route path="/solar" component={SolarPage} />
      <Route path="/order-tracking" component={OrderTrackingPage} />


      <Route path="/merchant-login" component={MerchantLogin} />
      <Route path="/merchant-dashboard-new" component={MerchantDashboard} />
      <Route path="/customer-dashboard" component={CustomerDashboard} />
      <Route path="/payment-receipt" component={PaymentReceipt} />
      <Route path="/tgm-enterprise-login" component={TGMEnterpriseLogin} />
      <Route path="/tgm-enterprise-dashboard" component={TGMEnterpriseDashboard} />
      <Route path="/email-management" component={EmailManagementPage} />
      <Route path="/admin-login" component={AdminLoginPage} />
      <Route path="/admin-dashboard" component={AdminDashboardPage} />
      <Route path="/subsidiary-email-management" component={SubsidiaryEmailManagement} />
      <Route path="/domain-verification-guide" component={DomainVerificationGuide} />
      <Route path="/saas" component={SaaSLanding} />
      <Route path="/saas/register" component={SaaSRegister} />
      <Route path="/saas/payment-success" component={PaymentSuccessPage} />
      <Route path="/saas/login" component={SaaSLogin} />
      <Route path="/saas/change-password" component={ChangePasswordPage} />
      <Route path="/saas/dashboard" component={SaaSDashboard} />
      <Route path="/saas/subscription" component={SubscriptionPage} />
      <Route path="/saas/users" component={UserManagement} />
      
      {/* Module Feature Routes - Must come BEFORE module pages to catch action/data/reports/settings paths */}
      <Route path="/saas/modules/:module/action/:feature" component={ModuleFeaturePage} />
      <Route path="/saas/modules/:module/data/:feature" component={ModuleFeaturePage} />
      <Route path="/saas/modules/:module/reports/:feature" component={ModuleFeaturePage} />
      <Route path="/saas/modules/:module/settings/:feature" component={ModuleFeaturePage} />
      <Route path="/saas/modules/:module/:type/:feature/:subfeature" component={ModuleFeaturePage} />
      
      {/* HRMIS Module Routes - with tab support */}
      <Route path="/saas/modules/hr-core/:tab?" component={HRCorePage} />
      <Route path="/saas/modules/hr-recruitment/:tab?" component={HRRecruitmentPage} />
      <Route path="/saas/modules/hr-talent/:tab?" component={HRTalentPage} />
      <Route path="/saas/modules/hr-compensation/:tab?" component={HRCompensationPage} />
      <Route path="/saas/modules/hr-self-service/:tab?" component={HRSelfServicePage} />
      <Route path="/saas/modules/hr-analytics/:tab?" component={HRAnalyticsPage} />
      <Route path="/saas/modules/hr-biometrics-attendance/:tab?" component={HRBiometricsPage} />
      <Route path="/saas/modules/hr-time-leave/:tab?" component={HRTimeLeavePage} />
      <Route path="/saas/modules/hr-payroll/:tab?" component={HRPayrollPage} />
      <Route path="/saas/modules/hr-learning/:tab?" component={HRLearningPage} />
      <Route path="/saas/modules/hr-employee-relations/:tab?" component={HREmployeeRelationsPage} />
      <Route path="/saas/modules/hr-offboarding/:tab?" component={HROffboardingPage} />
      <Route path="/saas/modules/hr-position-control/:tab?" component={HRPositionControlPage} />
      <Route path="/saas/modules/hr-documents/:tab?" component={HRDocumentsPage} />
      <Route path="/saas/modules/platform-governance/:tab?" component={PlatformGovernancePage} />
      
      {/* FIMS Module Routes - with tab support */}
      <Route path="/saas/modules/fims-general-ledger/:tab?" component={FIMSGeneralLedgerPage} />
      <Route path="/saas/modules/fims-accounts-payable/:tab?" component={FIMSAccountsPayablePage} />
      <Route path="/saas/modules/fims-accounts-receivable/:tab?" component={FIMSAccountsReceivablePage} />
      <Route path="/saas/modules/fims-treasury/:tab?" component={FIMSTreasuryPage} />
      <Route path="/saas/modules/fims-budgeting/:tab?" component={FIMSBudgetingPage} />
      <Route path="/saas/modules/fims-procurement/:tab?" component={FIMSProcurementPage} />
      <Route path="/saas/modules/fims-reporting/:tab?" component={FIMSReportingPage} />
      <Route path="/saas/modules/fims-compliance/:tab?" component={FIMSCompliancePage} />
      <Route path="/saas/modules/fims-commitment-control/:tab?" component={FIMSCommitmentControlPage} />
      <Route path="/saas/modules/fims-fixed-assets/:tab?" component={FIMSFixedAssetsPage} />
      <Route path="/saas/modules/fims-contracts/:tab?" component={FIMSContractsPage} />
      <Route path="/saas/modules/fims-projects/:tab?" component={FIMSProjectsPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
