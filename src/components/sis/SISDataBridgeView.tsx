import React from 'react';
import { useFaculty } from '../../context/FacultyContext';
import {
  Database,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRightLeft,
  Server,
  Layers,
  Clock,
  Radio,
  FileCheck
} from 'lucide-react';

export const SISDataBridgeView: React.FC = () => {
  const {
    sisStatus,
    triggerSisSync,
    isSyncingSis,
    privacyMode,
    setPrivacyMode,
    activeSection
  } = useFaculty();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            University SIS Data Bridge & LMS Integration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise synchronization hub connecting course sections with{' '}
            <span className="text-slate-200 font-semibold">{sisStatus.connectedSystem}</span> and Ellucian Banner.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerSisSync}
            disabled={isSyncingSis}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSis ? 'animate-spin' : ''}`} />
            <span>{isSyncingSis ? 'Synchronizing with Banner...' : 'Trigger Bidirectional Sync'}</span>
          </button>
        </div>
      </div>

      {/* Integration Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Primary SIS Connection</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-sm font-bold text-white truncate">{sisStatus.connectedSystem}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Live API Handshake
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Last Sync Timestamp</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-sm font-bold text-white">
            {new Date(sisStatus.lastSync).toLocaleTimeString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">15-minute automated delta cycle</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Enrolled Students Synced</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 text-sm font-bold text-white">
            {sisStatus.enrolledStudentsCount} Across 4 Sections
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Roster parity: 100% matched</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>FERPA / Title IV Safeguard</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-sm font-bold text-white">
            {privacyMode ? 'PII Masking Active' : 'Compliant Token Gateway'}
          </div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center justify-between">
            <span>Data Masking:</span>
            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className="text-xs font-bold underline hover:text-white"
            >
              {privacyMode ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Data Streams & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stream Configurations (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
              Configured Bidirectional Data Streams
            </h2>

            <div className="space-y-3">
              {[
                {
                  name: 'Canvas LMS Roster & Registration Ingestion',
                  status: 'Active',
                  details: 'Daily enrollment drops/adds, prerequisite status flags, major changes',
                  direction: 'Inbound &rarr; Portal',
                },
                {
                  name: 'LMS Gradebook & Assignment Submissions',
                  status: 'Active',
                  details: 'Real-time assignment submission alerts, rubric score pushback',
                  direction: 'Bidirectional &harr;',
                },
                {
                  name: 'Campus Physical Attendance (RFID / Classroom Sensors)',
                  status: 'Active',
                  details: 'Lecture check-in timestamps, consecutive absences alerting threshold',
                  direction: 'Inbound &rarr; Portal',
                },
                {
                  name: 'Ellucian Banner Official Midterm / Final Grade Registry',
                  status: 'Secure Ready',
                  details: 'Cryptographically signed letter grade submissions with audit verification',
                  direction: 'Outbound &rarr; Banner',
                },
              ].map((stream, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{stream.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                      {stream.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{stream.details}</p>
                  <div className="text-[10px] font-mono text-indigo-400 pt-1" dangerouslySetInnerHTML={{ __html: stream.direction }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sync Audit Trail (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Live SIS Integration Event Log
              </h2>
              <span className="text-[11px] text-slate-400">Security Audit Trail</span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {sisStatus.logs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-200 font-medium leading-snug">{log.event}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
