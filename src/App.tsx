/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FacultyProvider, useFaculty } from './context/FacultyContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { RiskMonitoringView } from './components/risk/RiskMonitoringView';
import { InterventionsView } from './components/interventions/InterventionsView';
import { GradingAutomationView } from './components/grading/GradingAutomationView';
import { CurriculumStudioView } from './components/curriculum/CurriculumStudioView';
import { SISDataBridgeView } from './components/sis/SISDataBridgeView';
import { SettingsView } from './components/settings/SettingsView';
import { CopilotDrawer } from './components/copilot/CopilotDrawer';

function MainContent() {
  const { activeTab } = useFaculty();

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'risk' && <RiskMonitoringView />}
      {activeTab === 'interventions' && <InterventionsView />}
      {activeTab === 'grading' && <GradingAutomationView />}
      {activeTab === 'curriculum' && <CurriculumStudioView />}
      {activeTab === 'sis' && <SISDataBridgeView />}
      {activeTab === 'settings' && <SettingsView />}
    </main>
  );
}

export default function App() {
  return (
    <FacultyProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
        <CopilotDrawer />
      </div>
    </FacultyProvider>
  );
}
