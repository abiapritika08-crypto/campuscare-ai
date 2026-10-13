import React, { useState } from 'react';
import { useFaculty } from '../../context/FacultyContext';
import {
  BookOpen,
  Sparkles,
  Layers,
  Copy,
  Check,
  Download,
  Calendar,
  CheckCircle2,
  Brain,
  HelpCircle,
  FileCode2,
  RefreshCw
} from 'lucide-react';

export const CurriculumStudioView: React.FC = () => {
  const { activeSection, apiKey } = useFaculty();

  const [topic, setTopic] = useState('Dynamic Programming, Recurrences & Poly-Time Reductions');
  const [weeksCount, setWeeksCount] = useState(4);
  const [audience, setAudience] = useState('Undergraduate Juniors (CS Majors)');
  const [learningObjectives, setLearningObjectives] = useState(
    'Formalize recurrence relations, identify overlapping subproblems, prove loop invariants, and construct polynomial-time reductions from 3-SAT to Vertex Cover.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'assessments' | 'active_learning'>('modules');

  // Generated curriculum state
  const [curriculumData, setCurriculumData] = useState<any>({
    title: '4-Week Rigorous Curriculum Blueprint',
    modules: [
      {
        week: 1,
        title: 'Recurrence Trees & The Master Theorem in Action',
        cognitiveLevel: 'Understanding & Applying',
        readings: 'CLRS Ch. 4 (Divide-and-Conquer) & Kleinberg-Tardos Ch. 5',
        activities: 'Step-by-step unrolling of recursive Fibonacci into bottom-up memoization table.',
        deliverable: 'Diagnostic Quiz 1: Asymptotic Invariants (Formative)',
      },
      {
        week: 2,
        title: 'State Transition Formulations & 2D Memoization Matrices',
        cognitiveLevel: 'Analyzing (Bloom Level 4)',
        readings: 'Seminal Paper: Bellman on Dynamic Programming Formulations',
        activities: 'Hands-on live laboratory: Longest Common Subsequence & Edit Distance under O(N) space constraint.',
        deliverable: 'Programming Milestone 1: Automated Test Harness (80 pts)',
      },
      {
        week: 3,
        title: 'Intractability, NP-Completeness & Reduction Philosophy',
        cognitiveLevel: 'Analyzing & Evaluating',
        readings: 'Garey & Johnson: Computers and Intractability (Ch. 1-2)',
        activities: 'Interactive Red-Team reduction walkthrough: 3-SAT to Independent Set.',
        deliverable: 'Peer Proof Critique Memo (Formative Workshop)',
      },
      {
        week: 4,
        title: 'Approximation Ratios & Real-World Capstone Synthesis',
        cognitiveLevel: 'Creating & Defending (Bloom Level 6)',
        readings: 'Selected case studies in bioinformatic genome sequence alignment',
        activities: 'Capstone showcase: Designing a 2-approximation metric TSP algorithm.',
        deliverable: 'Capstone Synthesis Project & Oral Defense',
      },
    ],
    sampleAssessments: [
      {
        question:
          'Given a recurrence T(n) = 3T(n/2) + O(n log n), determine the exact asymptotic bound using Master Theorem or Akra-Bazzi method, and explain why the standard Master Theorem Case 1 or 2 applies.',
        taxonomyLevel: 'Analyze (Bloom Level 4)',
        rubric: 'Full marks require demonstrating log_2(3) > 1 and polynomial dominance.',
      },
      {
        question:
          'Explain why reducing a known NP-complete problem B to your target problem A proves that A is NP-hard, but reducing A to B proves nothing about the hardness of A.',
        taxonomyLevel: 'Evaluate (Bloom Level 5)',
        rubric: 'Must articulate the directional preservation of computational hardness via polynomial-time translation.',
      },
      {
        question:
          'Construct a dynamic programming recurrence for the Subset Sum problem with negative weights allowed. If impossible in pseudo-polynomial time, prove why.',
        taxonomyLevel: 'Create (Bloom Level 6)',
        rubric: 'Requires addressing offset index shifts and bounded capacity guarantees.',
      },
    ],
    activeLearningActivity: {
      name: 'Peer Instruction: The Faulty Reduction Debug Lab',
      duration: '20 minutes',
      description:
        'Students are presented with a flawed 5-step reduction proof from 3-SAT to 3-Colorability. In pairs, students must identify the invalid polynomial gadget mapping that allows false positives.',
      scaffoldingNote:
        'Provide hint cards for students who have not yet internalized gadget truth assignments.',
    },
  });

  const handleGenerateCurriculum = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/curriculum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey || '',
        },
        body: JSON.stringify({
          taskType: 'Design Modular Curriculum & Question Bank',
          courseName: activeSection.title,
          topic,
          targetAudience: audience,
          weeksCount,
          learningObjectives,
        }),
      });

      const data = await response.json();
      if (data.modules) {
        setCurriculumData(data);
      } else if (data.text) {
        // If raw Gemini text, populate into overview
        setCurriculumData((prev: any) => ({
          ...prev,
          rawMarkdown: data.text,
        }));
      }
    } catch (err) {
      console.error('Curriculum generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    let md = `# Curriculum Blueprint: ${activeSection.title}\n\n`;
    md += `## Topic: ${topic}\nTarget Audience: ${audience}\nDuration: ${weeksCount} Weeks\n\n`;
    md += `### Weekly Modules:\n`;
    curriculumData.modules?.forEach((m: any) => {
      md += `#### Week ${m.week}: ${m.title}\n- **Cognitive Level:** ${m.cognitiveLevel}\n- **Readings:** ${m.readings}\n- **Activities:** ${m.activities}\n- **Deliverable:** ${m.deliverable}\n\n`;
    });
    if (curriculumData.rawMarkdown) {
      md += `\n${curriculumData.rawMarkdown}`;
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Curriculum & Syllabus Design Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            AI-assisted course architecture, Bloom&apos;s taxonomy scaffolding, and formative assessment design for{' '}
            <span className="text-slate-200 font-semibold">{activeSection.code}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Syllabus Markdown'}</span>
          </button>

          <button
            onClick={handleGenerateCurriculum}
            disabled={isGenerating}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Blueprint...' : 'Generate with Gemini'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Curriculum Specification Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Instructional Parameters
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Domain / Topic Module Focus
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Dynamic Programming & NP-Completeness"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Duration (Weeks)
                </label>
                <select
                  value={weeksCount}
                  onChange={(e) => setWeeksCount(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value={2}>2 Weeks (Mini-Module)</option>
                  <option value={4}>4 Weeks (Standard Unit)</option>
                  <option value={8}>8 Weeks (Half Semester)</option>
                  <option value={14}>14 Weeks (Full Term)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Cohort Level
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Undergraduate Lower-Div (Introductory)">Undergraduate Lower-Div</option>
                  <option value="Undergraduate Juniors (CS Majors)">Undergraduate Juniors</option>
                  <option value="Undergraduate Honors & Seniors">Undergraduate Honors</option>
                  <option value="Graduate / Master's Level">Graduate / Master&apos;s Level</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Key Learning Outcomes & ABET Standards
              </label>
              <textarea
                rows={4}
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
                placeholder="Specify core pedagogical goals and expected competencies..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/30 text-[11px] text-indigo-300 flex items-start gap-2">
              <Brain className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Gemini automatically incorporates Bloom&apos;s Revised Taxonomy, cognitive load theory, and active-learning scaffolding patterns into every generated syllabus.
              </span>
            </div>
          </div>
        </div>

        {/* Curriculum Architecture & Assessment Suite (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveSubTab('modules')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeSubTab === 'modules'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Weekly Modules
                </button>
                <button
                  onClick={() => setActiveSubTab('assessments')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeSubTab === 'assessments'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Assessment Question Bank
                </button>
                <button
                  onClick={() => setActiveSubTab('active_learning')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeSubTab === 'active_learning'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Active Learning Workshop
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {weeksCount} Weeks Architecture
              </span>
            </div>

            {/* Sub-tab 1: Weekly Modules */}
            {activeSubTab === 'modules' && (
              <div className="space-y-3">
                {curriculumData.modules?.map((mod: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                          Week {mod.week}
                        </span>
                        <h2 className="text-xs font-bold text-slate-200 mt-0.5">{mod.title}</h2>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                        {mod.cognitiveLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                      <div>
                        <strong className="text-slate-300">Readings:</strong> {mod.readings}
                      </div>
                      <div>
                        <strong className="text-slate-300">Deliverable:</strong> {mod.deliverable}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800/60">
                      <strong className="text-indigo-300">Studio Activity:</strong> {mod.activities}
                    </div>
                  </div>
                ))}

                {curriculumData.rawMarkdown && (
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                    {curriculumData.rawMarkdown}
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab 2: Assessment Question Bank */}
            {activeSubTab === 'assessments' && (
              <div className="space-y-3">
                {curriculumData.sampleAssessments?.map((q: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                        Problem Item #{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                        {q.taxonomyLevel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{q.question}</p>

                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                      <strong className="text-slate-300">Scoring Rubric Anchor:</strong> {q.rubric}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-tab 3: Active Learning Workshop */}
            {activeSubTab === 'active_learning' && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-emerald-400" />
                      {curriculumData.activeLearningActivity?.name}
                    </h2>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {curriculumData.activeLearningActivity?.duration}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {curriculumData.activeLearningActivity?.description}
                  </p>

                  <div className="p-3 rounded bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200">
                    <strong className="text-indigo-100">Pedagogical Scaffolding Note:</strong>{' '}
                    {curriculumData.activeLearningActivity?.scaffoldingNote}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
