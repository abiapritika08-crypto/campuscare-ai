import React from 'react';
import { useFaculty } from '../../context/FacultyContext';
import {
  BarChart3,
  AlertTriangle,
  MailCheck,
  FileCheck2,
  BookOpen,
  Database,
  Sliders,
  CheckCircle2,
  Users
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeSection, interventions, submissions } = useFaculty();

  const criticalCount = activeSection.retentionRiskCount.critical;
  const pendingInterventions = interventions.filter((i) => i.status === 'draft' || i.status === 'pending_review').length;
  const pendingGrading = submissions.filter((s) => s.status === 'pending').length;

  const navItems = [
    {
      id: 'analytics' as const,
      label: 'Pedagogical Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'risk' as const,
      label: 'Predictive Risk Monitor',
      icon: AlertTriangle,
      badge: criticalCount > 0 ? `${criticalCount} alert${criticalCount > 1 ? 's' : ''}` : null,
      badgeVariant: 'danger',
    },
    {
      id: 'interventions' as const,
      label: 'AI Interventions',
      icon: MailCheck,
      badge: pendingInterventions > 0 ? `${pendingInterventions} new` : null,
      badgeVariant: 'warning',
    },
    {
      id: 'grading' as const,
      label: 'AI Grading Automation',
      icon: FileCheck2,
      badge: pendingGrading > 0 ? `${pendingGrading} queue` : null,
      badgeVariant: 'primary',
    },
    {
      id: 'curriculum' as const,
      label: 'Curriculum & Syllabus Studio',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'sis' as const,
      label: 'SIS Data Bridge',
      icon: Database,
      badge: 'Live',
      badgeVariant: 'success',
    },
    {
      id: 'settings' as const,
      label: 'Copilot & API Settings',
      icon: Sliders,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3 space-y-1">
        {/* Course Section Summary Chip */}
        <div className="px-3 py-3 mb-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <div className="text-[11px] font-medium text-slate-400">Current Course Section</div>
          <div className="text-xs font-bold text-slate-100 truncate mt-0.5">{activeSection.code}</div>
          <div className="text-[11px] text-slate-400 truncate">{activeSection.title}</div>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-500" />
              {activeSection.totalEnrolled} enrolled
            </span>
            <span>·</span>
            <span>Avg: {activeSection.averageGrade}%</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      item.badgeVariant === 'danger'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                        : item.badgeVariant === 'warning'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        : item.badgeVariant === 'success'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Professor Profile Footnote */}
      <div className="p-3 border-t border-slate-900">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-slate-900/40">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-300">
            DR
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-200 truncate">Prof. David Reynolds</div>
            <div className="text-[11px] text-slate-500 truncate">Dept. of Computer Science</div>
          </div>
          <span title="Faculty SSO Authenticated">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </span>
        </div>
      </div>
    </aside>
  );
};
