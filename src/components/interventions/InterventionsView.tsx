import React, { useState, useEffect } from 'react';
import { useFaculty } from '../../context/FacultyContext';
import { Intervention, Student } from '../../types';
import {
  MailCheck,
  Send,
  Sparkles,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  MessageSquare,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Check
} from 'lucide-react';

export const InterventionsView: React.FC = () => {
  const {
    activeSection,
    sectionStudents,
    selectedStudent,
    setSelectedStudent,
    interventions,
    addIntervention,
    updateIntervention,
    formatStudentName,
    apiKey
  } = useFaculty();

  const [targetStudentId, setTargetStudentId] = useState<string>(
    selectedStudent ? selectedStudent.id : sectionStudents[0]?.id || ''
  );

  const [tone, setTone] = useState<'empathetic' | 'structured' | 'gentle'>('empathetic');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [officeHoursSlot, setOfficeHoursSlot] = useState('Thursday 2:00 PM - 2:45 PM (Turing 304)');
  const [practiceAttachment, setPracticeAttachment] = useState('Scaffolded Review Guide & Diagnostic Self-Check');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const currentTargetStudent = sectionStudents.find((s) => s.id === targetStudentId) || sectionStudents[0];

  useEffect(() => {
    if (selectedStudent) {
      setTargetStudentId(selectedStudent.id);
    }
  }, [selectedStudent]);

  // Generate AI Intervention message using Gemini API
  const handleGenerateAIIntervention = async () => {
    if (!currentTargetStudent) return;
    setIsGenerating(true);
    setDispatchSuccess(false);

    try {
      const response = await fetch('/api/gemini/intervention', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey || '',
        },
        body: JSON.stringify({
          studentName: currentTargetStudent.name,
          courseName: activeSection.title,
          riskCategory: currentTargetStudent.riskLevel,
          riskFactors: currentTargetStudent.riskFactors,
          currentGrade: currentTargetStudent.currentGrade,
          tone: tone === 'empathetic' ? 'Empathetic, encouraging and supportive' : tone === 'structured' ? 'Firm, clear, and structured accountability' : 'Gentle informal check-in',
        }),
      });

      const data = await response.json();
      if (data.subject && data.body) {
        setSubject(data.subject);
        setMessageBody(data.body);
      } else if (data.text) {
        // If raw Gemini text
        setSubject(`Support and Academic Recovery Plan for ${activeSection.code}`);
        setMessageBody(data.text);
      }
    } catch (err) {
      console.error('Failed to generate intervention', err);
      setSubject(`Support & Office Hours Invitation for ${activeSection.code}`);
      setMessageBody(
        `Hi ${currentTargetStudent.name},\n\nI wanted to reach out regarding ${activeSection.title}. I noticed that the recent assignments have presented challenges, and I want to ensure you have full pedagogical support.\n\nPlease stop by my office hours this week so we can review key concepts together.\n\nBest regards,\nProf. Davis`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Preload or refresh draft when target student or tone changes
  useEffect(() => {
    if (currentTargetStudent) {
      handleGenerateAIIntervention();
    }
  }, [currentTargetStudent?.id, tone]);

  const handleDispatch = () => {
    if (!currentTargetStudent) return;
    setIsDispatching(true);

    setTimeout(() => {
      const newIntervention: Intervention = {
        id: `int-${Date.now()}`,
        studentId: currentTargetStudent.id,
        studentName: currentTargetStudent.name,
        sectionCode: activeSection.code,
        riskLevel: currentTargetStudent.riskLevel,
        triggerReason: currentTargetStudent.riskFactors[0] || 'Academic support outreach',
        createdAt: new Date().toISOString(),
        status: 'dispatched',
        subject: subject || `Academic Support for ${activeSection.code}`,
        body: messageBody,
        tone,
        officeHoursOffered: [officeHoursSlot],
        practiceModules: [practiceAttachment],
      };

      addIntervention(newIntervention);
      setIsDispatching(false);
      setDispatchSuccess(true);
      setTimeout(() => setDispatchSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <MailCheck className="w-5 h-5 text-indigo-400" />
            Automated AI Interventions & Pedagogical Outreach
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Empathetic, evidence-backed retention outreach calibrated to individual risk profiles with 2-way SIS delivery for{' '}
            <span className="text-slate-200 font-semibold">{activeSection.code}</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Intervention Composer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Intervention Composer & Pedagogical Tone Studio
              </span>
              <span className="text-[11px] text-slate-400">Powered by Gemini 3.8</span>
            </div>

            {/* Target Student Select */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Student
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => {
                    setTargetStudentId(e.target.value);
                    const stu = sectionStudents.find((s) => s.id === e.target.value);
                    if (stu) setSelectedStudent(stu);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  {sectionStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {formatStudentName(s.name, s.id)} ({s.currentGrade}% · {s.riskLevel.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pedagogical Tone Strategy
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  {[
                    { id: 'empathetic' as const, label: 'Empathetic' },
                    { id: 'structured' as const, label: 'Structured' },
                    { id: 'gentle' as const, label: 'Gentle' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      className={`py-1 rounded font-medium text-[11px] transition-colors ${
                        tone === t.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Context Ribbon */}
            {currentTargetStudent && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-slate-300 font-semibold flex items-center gap-2">
                    <span>{formatStudentName(currentTargetStudent.name, currentTargetStudent.id)}</span>
                    <span className="text-[10px] text-rose-400 font-mono">
                      Risk Score: {currentTargetStudent.riskScore}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Primary Trigger: {currentTargetStudent.riskFactors[0] || 'Academic friction'}
                  </div>
                </div>
                <button
                  onClick={handleGenerateAIIntervention}
                  disabled={isGenerating}
                  className="px-2.5 py-1.5 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate with AI</span>
                </button>
              </div>
            )}

            {/* Subject Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                LMS / SIS Message Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject line..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Message Body Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Personalized Intervention Letter Body
              </label>
              <textarea
                rows={8}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Drafting message with AI..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 font-sans focus:outline-none leading-relaxed"
              />
            </div>

            {/* Integrated Attachments: Office Hours & Practice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Dedicated Office Hours Slot
                </label>
                <input
                  type="text"
                  value={officeHoursSlot}
                  onChange={(e) => setOfficeHoursSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Curated Review Module Attached
                </label>
                <input
                  type="text"
                  value={practiceAttachment}
                  onChange={(e) => setPracticeAttachment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Dispatch Action */}
            <div className="pt-2 flex items-center justify-between">
              {dispatchSuccess ? (
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Dispatched via SIS & Canvas Inbox successfully!
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Will be logged in Student SIS Record with FERPA compliance flag.
                </div>
              )}

              <button
                onClick={handleDispatch}
                disabled={isDispatching || !messageBody}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDispatching ? 'Dispatching via SIS...' : 'Approve & Dispatch Outreach'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Intervention History & Engagement Tracker (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Active Intervention Telemetry
              </h2>
              <span className="text-[11px] text-slate-400">{interventions.length} dispatches</span>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {interventions.map((int) => {
                const isOpened = int.status === 'opened';
                const isEngaged = int.status === 'engaged';
                const isResolved = int.status === 'resolved';

                return (
                  <div
                    key={int.id}
                    className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-200">
                          {formatStudentName(int.studentName, int.studentId)}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{int.subject}</div>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isResolved
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : isEngaged
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                            : isOpened
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {int.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/40 p-2 rounded border border-slate-800/60">
                      {int.body}
                    </p>

                    {int.studentResponse && (
                      <div className="p-2 rounded bg-indigo-950/30 border border-indigo-800/30 text-[11px] text-indigo-200 flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-indigo-100">Student Response:</strong> {int.studentResponse}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{new Date(int.createdAt).toLocaleDateString()}</span>
                      {int.status !== 'resolved' && (
                        <button
                          onClick={() => updateIntervention(int.id, { status: 'resolved' })}
                          className="text-emerald-400 hover:underline font-semibold"
                        >
                          Mark as Resolved &check;
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
