import { useState, useEffect } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";

// Hybrid Location Hook supporting both standard path URLs (/solar) and hash URLs (/#/solar) on GitHub Pages & VPS
const useHybridLocation = () => {
  const [loc, setLoc] = useState(() => {
    if (typeof window === "undefined") return "/";
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && hash.startsWith("/")) return hash;
    return window.location.pathname || "/";
  });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && hash.startsWith("/")) {
        setLoc(hash);
      } else {
        setLoc(window.location.pathname || "/");
      }
    };
    window.addEventListener("hashchange", handler);
    window.addEventListener("popstate", handler);
    return () => {
      window.removeEventListener("hashchange", handler);
      window.removeEventListener("popstate", handler);
    };
  }, []);

  const navigate = (to: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", to);
      setLoc(to);
    }
  };

  return [loc, navigate] as const;
};

function Router() {
  return (
    <WouterRouter hook={useHybridLocation}>
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
        <Route path="/institutional-services" component={InstitutionalServicesPage} />
        <Route path="/executive-dashboard" component={ExecutiveDashboardPage} />
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
    </WouterRouter>
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
