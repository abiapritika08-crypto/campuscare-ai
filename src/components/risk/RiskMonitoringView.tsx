import React, { useState } from 'react';
import { useFaculty } from '../../context/FacultyContext';
import { Student, RiskLevel } from '../../types';
import {
  AlertTriangle,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  UserCheck,
  TrendingDown,
  X,
  Mail,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const RiskMonitoringView: React.FC = () => {
  const {
    activeSection,
    sectionStudents,
    selectedStudent,
    setSelectedStudent,
    formatStudentName,
    setActiveTab,
    openCopilotWithPrompt
  } = useFaculty();

  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = sectionStudents.filter((student) => {
    const matchesRisk = filterRisk === 'all' || student.riskLevel === filterRisk;
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.major.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800/60">
            Critical Risk
          </span>
        );
      case 'elevated':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800/60">
            Elevated Risk
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-800/60">
            Moderate Watch
          </span>
        );
      case 'on_track':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/60">
            On Track
          </span>
        );
    }
  };

  const handleLaunchIntervention = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('interventions');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Predictive Student Risk Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Machine-learned academic distress models analyzing assignment velocity, LMS telemetrics, and prerequisite retention for{' '}
            <span className="text-slate-200 font-semibold">{activeSection.code}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              openCopilotWithPrompt(
                `Analyze all flagged students in ${activeSection.code}. Generate a synthesized cohort intervention strategy, prioritizing students with critical attendance and assignment drop-offs.`
              )
            }
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Cohort Risk Strategy</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search students by name, email, or major..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Risk Level Segmented Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all' as const, label: 'All Students' },
            { id: 'critical' as const, label: `Critical (${activeSection.retentionRiskCount.critical})` },
            { id: 'elevated' as const, label: `Elevated (${activeSection.retentionRiskCount.elevated})` },
            { id: 'moderate' as const, label: `Moderate (${activeSection.retentionRiskCount.moderate})` },
            { id: 'on_track' as const, label: `On Track (${activeSection.retentionRiskCount.on_track})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterRisk(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterRisk === tab.id
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Current Grade</th>
                <th className="py-3 px-4">Risk Level & Score</th>
                <th className="py-3 px-4">Telemetry Indicators</th>
                <th className="py-3 px-4">Predicted GPA Drag</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isCritical = student.riskLevel === 'critical';
                  const isElevated = student.riskLevel === 'elevated';

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-950/60 transition-colors ${
                        isCritical ? 'bg-rose-950/10' : isElevated ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      {/* Student info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-200 truncate">
                              {formatStudentName(student.name, student.id)}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {student.major} · {student.academicYear}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Grade */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-slate-100 text-sm">{student.currentGrade}%</span>
                          <span
                            className={`text-xs font-bold ${
                              student.currentGrade < 65
                                ? 'text-rose-400'
                                : student.currentGrade < 75
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            ({student.letterGrade})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {student.assignmentsSubmittedCount}/{student.totalAssignmentsCount} assignments
                        </div>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {getRiskBadge(student.riskLevel)}
                          <span className="font-mono text-xs font-bold text-slate-300">
                            {student.riskScore}%
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              isCritical ? 'bg-rose-500' : isElevated ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${student.riskScore}%` }}
                          />
                        </div>
                      </td>

                      {/* Multi-factor Indicators */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span>
                              Att: <strong className="text-slate-200">{student.attendanceRate}%</strong>
                            </span>
                            <span>·</span>
                            <span>
                              LMS: <strong className="text-slate-200">{student.lmsActivityHoursPerWeek}h/wk</strong>
                            </span>
                          </div>
                          {student.flaggedTopic && (
                            <div className="text-[10px] text-rose-300 truncate">
                              Struggle: {student.flaggedTopic}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Predicted GPA Drag */}
                      <td className="py-3.5 px-4 font-mono">
                        {student.predictedGpaImpact < 0 ? (
                          <span className="text-rose-400 font-semibold flex items-center gap-1">
                            <TrendingDown className="w-3.5 h-3.5" />
                            {student.predictedGpaImpact} GPA
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">0.0 (Nominal)</span>
                        )}
                        <div className="text-[10px] text-slate-400">If unaddressed by Midterm</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                          >
                            Dossier
                          </button>
                          <button
                            onClick={() => handleLaunchIntervention(student)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Intervene</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Dossier Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dossier Header */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/40"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-white">
                    {formatStudentName(selectedStudent.name, selectedStudent.id)}
                  </h2>
                  {getRiskBadge(selectedStudent.riskLevel)}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedStudent.major} · Year: {selectedStudent.academicYear} · Section: {activeSection.code}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedStudent.email}</p>
              </div>
            </div>

            {/* Diagnostic Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">Current Grade</div>
                <div className="text-lg font-bold text-white mt-1">
                  {selectedStudent.currentGrade}%{' '}
                  <span className="text-xs text-amber-400">({selectedStudent.letterGrade})</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">Attendance Rate</div>
                <div className="text-lg font-bold text-white mt-1">{selectedStudent.attendanceRate}%</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">LMS Activity Velocity</div>
                <div className="text-lg font-bold text-white mt-1">{selectedStudent.lmsActivityHoursPerWeek} hrs/wk</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">Projected GPA Impact</div>
                <div className="text-lg font-bold text-rose-400 mt-1">
                  {selectedStudent.predictedGpaImpact}
                </div>
              </div>
            </div>

            {/* Risk Factor Breakdown */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Identified Multi-Factor Risk Drivers
                </h3>
                <div className="space-y-1.5">
                  {selectedStudent.riskFactors.map((factor, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-xs text-rose-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Trajectory */}
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Weekly Assignment Trajectory
                </h3>
                <div className="flex items-end gap-2 h-24 p-3 bg-slate-950 rounded-lg border border-slate-800">
                  {selectedStudent.historicalGrades.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-mono">{item.grade}%</span>
                      <div
                        className={`w-full rounded-t transition-all ${
                          item.grade < 65 ? 'bg-rose-500' : item.grade < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ height: `${Math.max(15, (item.grade / 100) * 60)}px` }}
                      />
                      <span className="text-[10px] text-slate-400">W{item.week}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedStudent.notes && (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <div className="text-slate-400 font-semibold mb-1">Advising & Instructor Notes:</div>
                  <p className="text-slate-300 leading-relaxed">{selectedStudent.notes}</p>
                </div>
              )}
            </div>

            {/* Dossier Footer Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() =>
                  openCopilotWithPrompt(
                    `Draft a customized 3-step academic recovery plan for student ${selectedStudent.name} in ${activeSection.code}. Risk factors: ${selectedStudent.riskFactors.join(', ')}. Include an assignment renegotiation suggestion and a list of specific concepts to reteach during office hours.`
                  )
                }
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Recovery Playbook</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleLaunchIntervention(selectedStudent);
                    setSelectedStudent(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Launch Pedagogical Intervention</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
