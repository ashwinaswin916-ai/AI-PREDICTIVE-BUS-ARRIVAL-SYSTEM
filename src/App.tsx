import React from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Navbar } from './components/Navbar';
import { MainDashboard } from './components/MainDashboard';
import { BusSearch } from './components/BusSearch';
import { LiveTransitMap } from './components/LiveTransitMap';
import { SmartRoutes } from './components/SmartRoutes';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { AiAnalytics } from './components/AiAnalytics';
import { AdminTransitPanel } from './components/AdminTransitPanel';
import { UserValidationPanel } from './components/UserValidationPanel';
import { AiAuditDesignPanel } from './components/AiAuditDesignPanel';
import { GtfsPipelinePanel } from './components/GtfsPipelinePanel';
import { CoursePathwayHub } from './components/CoursePathwayHub';
import { MobileNav } from './components/MobileNav';
import { PresentationModal } from './components/PresentationModal';

const AppContent: React.FC = () => {
  const { activeTab, isPresentationMode, setIsPresentationMode, theme } = useTransit();

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-slate-950 text-slate-100'
        : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Render */}
      <main className="pb-24 md:pb-12 pt-2">
        {activeTab === 'dashboard' && <MainDashboard />}
        {activeTab === 'search' && <BusSearch />}
        {activeTab === 'map' && <LiveTransitMap />}
        {activeTab === 'routes' && <SmartRoutes />}
        {activeTab === 'predictions' && <MainDashboard />}
        {activeTab === 'simulator' && <WhatIfSimulator />}
        {activeTab === 'analytics' && <AiAnalytics />}
        {activeTab === 'history' && <AiAnalytics />}
        {activeTab === 'admin' && <AdminTransitPanel />}
        {activeTab === 'validation' && <UserValidationPanel />}
        {activeTab === 'audit' && <AiAuditDesignPanel />}
        {activeTab === 'pipeline' && <GtfsPipelinePanel />}
        {activeTab === 'pathway' && <CoursePathwayHub />}
        {activeTab === 'landing' && <MainDashboard />}
        {activeTab === 'alerts' && <AdminTransitPanel />}
        {activeTab === 'favorites' && <BusSearch />}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Presentation Mode Interactive Walkthrough Modal */}
      <PresentationModal
        isOpen={isPresentationMode}
        onClose={() => setIsPresentationMode(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TransitProvider>
      <AppContent />
    </TransitProvider>
  );
}
