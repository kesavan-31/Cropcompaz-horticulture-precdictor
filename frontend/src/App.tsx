import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { FarmerLoginPage } from './pages/auth/FarmerLoginPage';
import { BuyerLoginPage } from './pages/auth/BuyerLoginPage';

// Farmer Portal Pages
import { FarmerLayout } from './components/layout/FarmerLayout';
import { FarmerDashboardPage } from './pages/farmer/FarmerDashboardPage';
import { FarmerFarmPage } from './pages/farmer/FarmerFarmPage';
import { FarmerAdvisoryPage } from './pages/farmer/FarmerAdvisoryPage';
import { FarmerRecommendationsPage } from './pages/farmer/FarmerRecommendationsPage';
import { FarmerHarvestPage } from './pages/farmer/FarmerHarvestPage';
import { FarmerQualityPage } from './pages/farmer/FarmerQualityPage';
import { FarmerFeedbackPage } from './pages/farmer/FarmerFeedbackPage';

// Buyer Portal Pages
import { BuyerLayout } from './components/layout/BuyerLayout';
import { BuyerDashboardPage } from './pages/buyer/BuyerDashboardPage';
import { BuyerRequirementsPage } from './pages/buyer/BuyerRequirementsPage';
import { BuyerProducePage } from './pages/buyer/BuyerProducePage';
import { BuyerTraceabilityPage } from './pages/buyer/BuyerTraceabilityPage';
import { BuyerFeedbackPage } from './pages/buyer/BuyerFeedbackPage';

// Cooperative Management Pages
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { FarmersPage } from './pages/FarmersPage';
import { AddFarmerPage } from './pages/AddFarmerPage';
import { EditFarmerPage } from './pages/EditFarmerPage';
import { AdvisoryPage } from './pages/AdvisoryPage';
import { HistoryPage } from './pages/HistoryPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { BuyersPage } from './pages/BuyersPage';
import { ProducePage } from './pages/ProducePage';
import { QualityPage } from './pages/QualityPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { AuditPage } from './pages/AuditPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portal Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/farmer/login" element={<FarmerLoginPage />} />
          <Route path="/buyer/login" element={<BuyerLoginPage />} />

          {/* Farmer Portal (Protected) */}
          <Route
            path="/farmer/*"
            element={
              <ProtectedRoute allowedPortal="farmer">
                <FarmerLayout>
                  <Routes>
                    <Route path="dashboard" element={<FarmerDashboardPage />} />
                    <Route path="farm" element={<FarmerFarmPage />} />
                    <Route path="advisory" element={<FarmerAdvisoryPage />} />
                    <Route path="recommendations" element={<FarmerRecommendationsPage />} />
                    <Route path="harvest" element={<FarmerHarvestPage />} />
                    <Route path="quality" element={<FarmerQualityPage />} />
                    <Route path="feedback" element={<FarmerFeedbackPage />} />
                    <Route path="*" element={<Navigate to="/farmer/dashboard" replace />} />
                  </Routes>
                </FarmerLayout>
              </ProtectedRoute>
            }
          />

          {/* Buyer Portal (Protected) */}
          <Route
            path="/buyer/*"
            element={
              <ProtectedRoute allowedPortal="buyer">
                <BuyerLayout>
                  <Routes>
                    <Route path="dashboard" element={<BuyerDashboardPage />} />
                    <Route path="requirements" element={<BuyerRequirementsPage />} />
                    <Route path="produce" element={<BuyerProducePage />} />
                    <Route path="quality" element={<BuyerProducePage />} />
                    <Route path="orders" element={<BuyerProducePage />} />
                    <Route path="traceability" element={<BuyerTraceabilityPage />} />
                    <Route path="feedback" element={<BuyerFeedbackPage />} />
                    <Route path="*" element={<Navigate to="/buyer/dashboard" replace />} />
                  </Routes>
                </BuyerLayout>
              </ProtectedRoute>
            }
          />

          {/* Cooperative & Admin Operations Portal */}
          <Route
            path="/cooperative/*"
            element={
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="farmers" element={<FarmersPage />} />
                  <Route path="farmers/new" element={<AddFarmerPage />} />
                  <Route path="farmers/edit/:id" element={<EditFarmerPage />} />
                  <Route path="advisory" element={<AdvisoryPage />} />
                  <Route path="advisory/history" element={<HistoryPage />} />
                  <Route path="buyers" element={<BuyersPage />} />
                  <Route path="produce" element={<ProducePage />} />
                  <Route path="quality" element={<QualityPage />} />
                  <Route path="intelligence" element={<IntelligencePage />} />
                  <Route path="audit" element={<AuditPage />} />
                  <Route path="documentation" element={<DocumentationPage />} />
                  <Route path="*" element={<Navigate to="/cooperative/dashboard" replace />} />
                </Routes>
              </Layout>
            }
          />

          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
