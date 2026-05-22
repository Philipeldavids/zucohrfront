import { BrowserRouter, Route, Routes } from "react-router-dom";
//import { useServiceWorker } from "@/hooks/use-service-worker.ts";
import { DefaultProviders } from "./components/providers/default";
//import AuthCallback from "./pages/auth/Callback.tsx";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/app-layout";
import Dashboard from "./pages/dashboard/page.tsx";
import AuthGate from "./pages/auth/landing";
import EmployeesPage from "./pages/employees/page";
import LeavePage from "./pages/leave/page";
import PayrollPage from "./pages/payroll/page";
import PerformancePage from "./pages/performance/page";
import ExpensesPage from "./pages/expenses/page";
import RecruitmentPage from "./pages/recruitment/page";
import OnboardingPage from "./pages/onboarding/page";
import SettingsPage from "./pages/settings/page";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import UsersPage from "./pages/users/page";
import CareersPage from "./pages/careers/page.tsx";
import JobDetailsPage from "./pages/careers/job-details-page.tsx";
//import AssignRoleModal from "./pages/roles/AssignRoleModal.tsx";
import CreateRolePage from "./pages/roles/page"
export default function App() {
  //useServiceWorker();
  return (
    <DefaultProviders>
    <>
          <BrowserRouter>
        <Routes>
          {/* <Route path="/auth/callback" element={<AuthCallback />} /> */}
          <Route path="/" element={<AuthGate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/careers/:companySlug" element={<CareersPage />} />
          <Route path="/careers/:companySlug/:slug" element={<JobDetailsPage />} />        
          <Route element={<AppLayout />}>  
          <Route path="/users" element={<UsersPage/>} /> 
          <Route path="/roles" element={<CreateRolePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/leave" element={<LeavePage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/recruitment" element={<RecruitmentPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* ADD CUSTOM ROUTES ABOVE THE CATCH-ALL */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </>
    </DefaultProviders>
    
  );
}
