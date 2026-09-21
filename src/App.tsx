import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { RoleGate } from './components/RoleGate'
import { LandingPage } from './pages/LandingPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { CompanyDashboard } from './pages/company/CompanyDashboard'
import { CompanyOnboarding } from './pages/company/CompanyOnboarding'
import { CompanyPricing } from './pages/company/CompanyPricing'
import { CompanyMarkets } from './pages/company/CompanyMarkets'
import { ApprovedCompanyGate } from './components/ApprovedCompanyGate'
import { CustomerBrowse } from './pages/customer/CustomerBrowse'
import { CompanyProfilePage } from './pages/customer/CompanyProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<LandingPage />} />
          <Route
            path="admin"
            element={
              <RoleGate allow="admin">
                <AdminDashboard />
              </RoleGate>
            }
          />
          <Route path="company" element={<Navigate to="/company/dashboard" replace />} />
          <Route
            path="company/dashboard"
            element={
              <RoleGate allow="company">
                <CompanyDashboard />
              </RoleGate>
            }
          />
          <Route
            path="company/onboarding"
            element={
              <RoleGate allow="company">
                <CompanyOnboarding />
              </RoleGate>
            }
          />
          <Route
            path="company/pricing"
            element={
              <RoleGate allow="company">
                <ApprovedCompanyGate>
                  <CompanyPricing />
                </ApprovedCompanyGate>
              </RoleGate>
            }
          />
          <Route
            path="company/markets"
            element={
              <RoleGate allow="company">
                <ApprovedCompanyGate>
                  <CompanyMarkets />
                </ApprovedCompanyGate>
              </RoleGate>
            }
          />
          <Route
            path="customer/browse"
            element={
              <RoleGate allow="customer">
                <CustomerBrowse />
              </RoleGate>
            }
          />
          <Route
            path="customer/company/:id"
            element={
              <RoleGate allow="customer">
                <CompanyProfilePage />
              </RoleGate>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
