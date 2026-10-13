import React from 'react';
import { useFaculty } from '../../context/FacultyContext';
import {
  TrendingUp,
  Brain,
  Flame,
  Users,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  BookMarked
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { activeSection, openCopilotWithPrompt, setActiveTab } = useFaculty();

  const handleDiagnoseFriction = (topicName: string) => {
    openCopilotWithPrompt(
      `Diagnose pedagogical friction for the topic "${topicName}" in course "${activeSection.title}" (${activeSection.code}). Students are experiencing high conceptual difficulty. Provide 3 targeted active-learning adjustments, a 5-minute peer instruction question with distractors, and scaffolded review milestones.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Pedagogical Analytics & Mastery Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, Bloom&apos;s cognitive taxonomy mapping, and lecture engagement for{' '}
            <span className="text-slate-200 font-semibold">{activeSection.code}: {activeSection.title}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              openCopilotWithPrompt(
                `Provide an executive pedagogical briefing for ${activeSection.code}: ${activeSection.title}. Summarize current retention risks, Bloom's taxonomy bottlenecks, and suggest teaching interventions for this week's lectures.`
              )
            }
            className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generate Executive Briefing</span>
          </button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Class Engagement Index</span>
            <Brain className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">84.2%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +3.8%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">LMS interaction & clickstream velocity</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Lecture Attendance Avg</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeSection.attendanceAvg}%</span>
            <span className="text-[11px] text-slate-400">({activeSection.schedule})</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Verified via RFID badge / Zoom telemetrics</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Section Mean Grade</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeSection.averageGrade}%</span>
            <span className="text-xs font-medium text-slate-400">Median: 81.0%</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Historical cohort benchmark: 79.5%</div>
        </div>

        <div
          onClick={() => setActiveTab('risk')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-900/60 cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>At-Risk Students Flagged</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-300">
              {activeSection.retentionRiskCount.critical + activeSection.retentionRiskCount.elevated}
            </span>
            <span className="text-[11px] text-rose-400 font-medium">
              ({activeSection.retentionRiskCount.critical} Critical)
            </span>
          </div>
          <div className="text-[11px] text-indigo-400 mt-1 flex items-center gap-1 group-hover:underline">
            <span>View predictive dossier</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Grid: Bloom's Taxonomy Cognitive Radar + Topic Friction Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bloom's Taxonomy Mastery Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  Bloom&apos;s Cognitive Mastery Levels
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Aggregate cohort competency across instructional dimensions
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Remembering (Recall definitions & syntax)', value: activeSection.masteryBreakdown.remembering, color: 'bg-emerald-500' },
                { label: 'Understanding (Explain algorithms & concepts)', value: activeSection.masteryBreakdown.understanding, color: 'bg-teal-500' },
                { label: 'Applying (Implement code in labs)', value: activeSection.masteryBreakdown.applying, color: 'bg-indigo-500' },
                { label: 'Analyzing (Proof rigor & failure modes)', value: activeSection.masteryBreakdown.analyzing, color: 'bg-amber-500' },
                { label: 'Evaluating (NP-reductions & trade-offs)', value: activeSection.masteryBreakdown.evaluating, color: 'bg-rose-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="font-mono font-semibold text-slate-200">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Pedagogical Insight Callout */}
          <div className="mt-6 p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-semibold text-indigo-200">AI Pedagogical Diagnostic:</div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Noticeable drop-off from <strong className="text-white">Applying ({activeSection.masteryBreakdown.applying}%)</strong> to <strong className="text-amber-300">Analyzing ({activeSection.masteryBreakdown.analyzing}%)</strong>. Students succeed at boilerplate code syntax but hit cognitive friction on formal invariant proofs and non-trivial reductions.
                </p>
                <button
                  onClick={() =>
                    openCopilotWithPrompt(
                      `Design a 15-minute scaffolded active-learning workshop to bridge the gap between Applying and Analyzing for ${activeSection.code}. Focus on making asymptotic proofs intuitive using visual diagrams.`
                    )
                  }
                  className="mt-2.5 text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1 hover:underline"
                >
                  Generate targeted scaffolding plan &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Topics Friction Heatmap (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Curriculum Topic Friction & Mastery Heatmap
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Struggle indices computed from quiz submissions, homework mistakes, and office hour inquiries
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {activeSection.topics.map((topic, i) => {
              const isHighFriction = topic.frictionScore > 70;
              const isMediumFriction = topic.frictionScore > 40 && topic.frictionScore <= 70;

              return (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200 truncate">{topic.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({topic.bloomLevel})</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400">
                      <span>
                        Mastery Rate:{' '}
                        <strong className={topic.masteryRate >= 75 ? 'text-emerald-400' : 'text-amber-400'}>
                          {topic.masteryRate}%
                        </strong>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        Friction Index:{' '}
                        <strong
                          className={
                            isHighFriction
                              ? 'text-rose-400'
                              : isMediumFriction
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          {topic.frictionScore}/100
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isHighFriction && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                        Cognitive Bottleneck
                      </span>
                    )}

                    <button
                      onClick={() => handleDiagnoseFriction(topic.name)}
                      className="px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      title="Generate pedagogical remediation plan for this topic"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>AI Remediation</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cohort Grade Distribution & Submission Velocity */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-sky-400" />
              Section Grade Distribution & Benchmark Comparison
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Grade spectrum aligned with historical department distributions (CS Dept Target: 25% A, 35% B, 25% C, 15% D/F)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { grade: 'A (90-100%)', count: 12, pct: '25%', status: 'Aligned', color: 'text-emerald-400 border-emerald-900/40 bg-emerald-950/20' },
            { grade: 'B (80-89%)', count: 18, pct: '37.5%', status: 'Healthy', color: 'text-sky-400 border-sky-900/40 bg-sky-950/20' },
            { grade: 'C (70-79%)', count: 11, pct: '22.9%', status: 'Standard', color: 'text-amber-400 border-amber-900/40 bg-amber-950/20' },
            { grade: 'D (60-69%)', count: 4, pct: '8.3%', status: 'Elevated Risk', color: 'text-orange-400 border-orange-900/40 bg-orange-950/20' },
            { grade: 'F (<60%)', count: 3, pct: '6.3%', status: 'Critical Action', color: 'text-rose-400 border-rose-900/40 bg-rose-950/20' },
          ].map((item, idx) => (
            <div key={idx} className={`p-3.5 rounded-lg border ${item.color} flex flex-col justify-between`}>
              <div className="text-xs font-semibold text-slate-300">{item.grade}</div>
              <div className="my-2">
                <span className="text-2xl font-bold text-white">{item.count}</span>
                <span className="text-xs text-slate-400 ml-1.5">students ({item.pct})</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
