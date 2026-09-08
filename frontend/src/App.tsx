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
import { GenericPlannedPage } from './pages/GenericPlannedPage';

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
          
          {/* Future Modules */}
          <Route 
            path="/produce" 
            element={
              <GenericPlannedPage 
                title="Produce Management" 
                phase="Phase 2" 
                description="Produce grading, harvest estimation, and buyer requirement matching." 
              />
            } 
          />
          <Route 
            path="/quality" 
            element={
              <GenericPlannedPage 
                title="Quality Intelligence" 
                phase="Phase 2" 
                description="Computer vision quality assessment, defect scoring, and grade classification." 
              />
            } 
          />
          <Route 
            path="/intelligence" 
            element={
              <GenericPlannedPage 
                title="Market & Crop Intelligence" 
                phase="Phase 3" 
                description="Predictive price analytics, climate pattern forecasting, and GIS regional intelligence." 
              />
            } 
          />
          <Route 
            path="/audit" 
            element={
              <GenericPlannedPage 
                title="Feedback & Audit Trail" 
                phase="Phase 2" 
                description="Field execution feedback, farmer adoption tracking, and supervisor override logs." 
              />
            } 
          />

          <Route path="/documentation" element={<DocumentationPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
