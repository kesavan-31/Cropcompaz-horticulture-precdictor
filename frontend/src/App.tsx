import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/farmers" element={<FarmersPage />} />
          <Route path="/farmers/new" element={<AddFarmerPage />} />
          <Route path="/farmers/edit/:id" element={<EditFarmerPage />} />
          <Route path="/advisory" element={<AdvisoryPage />} />
          <Route path="/advisory/history" element={<HistoryPage />} />
          <Route path="/buyers" element={<BuyersPage />} />
          <Route path="/produce" element={<ProducePage />} />
          <Route path="/quality" element={<QualityPage />} />
          <Route path="/intelligence" element={<IntelligencePage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
