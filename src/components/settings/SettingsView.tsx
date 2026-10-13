import React, { useState } from 'react';
import { useFaculty } from '../../context/FacultyContext';
import {
  Sliders,
  Key,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  Lock,
  RefreshCw,
  Cpu,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { apiKey, setApiKey, isKeyValid, testApiKey, sisStatus } = useFaculty();

  const [inputKey, setInputKey] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAndTest = async () => {
    setApiKey(inputKey);
    setTesting(true);
    setTestResult(null);

    const result = await testApiKey(inputKey);
    setTesting(false);
    setTestResult(result);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          AI Copilot & Faculty Credentials Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your Gemini AI API connection for real-time grading, curriculum synthesis, and pedagogical diagnostics.
        </p>
      </div>

      {/* API Key Panel */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Gemini API Key for Faculty Copilot
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Model: gemini-3.8-flash</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Provide your institutional or personal Google AI Studio Gemini API Key. All requests are securely verified server-side to ensure compliance with university data security standards and FERPA regulations.
        </p>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Gemini API Key
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter AI Studio API Key (or leave blank to use server environment key)..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none"
            />
            <button
              onClick={handleSaveAndTest}
              disabled={testing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing Handshake...' : 'Save & Verify Key'}</span>
            </button>
          </div>
        </div>

        {/* Live Test Feedback */}
        {testResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
              testResult.valid
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}
          >
            {testResult.valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <div className="font-semibold">{testResult.valid ? 'Authentication Verified' : 'Authentication Issue'}</div>
              <p className="mt-0.5 text-[11px] leading-relaxed">{testResult.message}</p>
            </div>
          </div>
        )}

        {savedSuccess && !testResult && (
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Settings saved successfully!
          </div>
        )}

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            Zero-Exposure Server-Side Architecture
          </div>
          <p>
            Your API keys are never exposed in client bundles or public endpoints. When you grade homework or compose interventions, our Express server proxies the query to the official Gemini TypeScript SDK with academic system instructions.
          </p>
        </div>
      </div>

      {/* Pedagogical AI Model Configuration */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Pedagogical Engine Hyperparameters
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Inference Model</label>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 flex items-center justify-between">
              <span>gemini-3.8-flash</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Active & Optimized</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Rubric Grading Rigor</label>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 flex items-center justify-between">
              <span>Temperature: 0.3 (Objective & Deterministic)</span>
              <span className="text-[10px] text-indigo-400 font-semibold">Calibrated</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            University Academic Honor Code & Grading Policy Directive
          </label>
          <textarea
            rows={3}
            readOnly
            value="Enforce Bloom's Taxonomy Level 4-6 grading standards. Deduct points for unverified asymptotic boundary violations. Verify originality and flag unauthorized LLM code generation. Maintain empathetic and constructive student feedback tone at all times."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 font-mono focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
