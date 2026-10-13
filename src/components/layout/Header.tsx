import React from 'react';
import { useFaculty } from '../../context/FacultyContext';
import {
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Key,
  GraduationCap,
  ChevronDown,
  Layers
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    sections,
    activeSectionId,
    setActiveSectionId,
    activeSection,
    sisStatus,
    triggerSisSync,
    isSyncingSis,
    privacyMode,
    setPrivacyMode,
    apiKey,
    isKeyValid,
    setIsCopilotOpen,
    setActiveTab,
  } = useFaculty();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand / Section Switcher */}
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">SmartCampus</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-1.5 py-0.5 rounded">
                Faculty Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">Pedagogical Intelligence & SIS Hub</p>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

        {/* Section Dropdown Selector */}
        <div className="relative">
          <label htmlFor="section-select" className="sr-only">Course Section</label>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-3 py-1.5 transition-colors group">
            <Layers className="w-4 h-4 text-indigo-400" />
            <select
              id="section-select"
              value={activeSectionId}
              onChange={(e) => setActiveSectionId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-4 appearance-none"
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id} className="bg-slate-900 text-slate-200">
                  {section.code} — {section.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-3 group-hover:text-slate-200" />
          </div>
        </div>
      </div>

      {/* Action Controls & Utilities */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* FERPA Privacy Masking Toggle */}
        <button
          onClick={() => setPrivacyMode(!privacyMode)}
          title={privacyMode ? 'FERPA Masking active (student PII hidden)' : 'Click to mask student names for FERPA compliance'}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
            privacyMode
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          {privacyMode ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{privacyMode ? 'FERPA Masked' : 'Privacy Mode'}</span>
        </button>

        {/* SIS Sync Button */}
        <button
          onClick={triggerSisSync}
          disabled={isSyncingSis}
          title={`Connected to ${sisStatus.connectedSystem}. Last sync: ${new Date(sisStatus.lastSync).toLocaleTimeString()}`}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-all group"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 transition-transform ${isSyncingSis ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          <span className="hidden lg:inline text-slate-300">SIS Bridge</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* API Key Status / Config Button */}
        <button
          onClick={() => setActiveTab('settings')}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-all"
          title="Configure Gemini API Key & Model Settings"
        >
          <Key className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">AI Key</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isKeyValid ? 'bg-emerald-400' : apiKey ? 'bg-indigo-400' : 'bg-slate-500'
            }`}
          />
        </button>

        {/* Quick Launch Copilot */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Faculty Copilot</span>
        </button>
      </div>
    </header>
  );
};
