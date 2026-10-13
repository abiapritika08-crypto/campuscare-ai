import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to instantiate GoogleGenAI with either custom or env key
function getGenAIClient(customKey?: string) {
  const apiKey = (customKey && customKey.trim()) || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System Information System (SIS) mock state
let sisState = {
  lastSync: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  connectedSystem: 'Canvas LMS + Ellucian Banner v9.4',
  institution: 'Apex Institute of Technology & Sciences',
  syncStatus: 'Active & Verified',
  activeSectionsCount: 4,
  enrolledStudentsCount: 168,
  ferpaComplianceEnabled: true,
  logs: [
    { timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(), event: 'Automated 15-min roster & attendance delta sync completed (0 errors)', type: 'success' },
    { timestamp: new Date(Date.now() - 74 * 60 * 1000).toISOString(), event: 'LMS gradebook checkpoint reconciled with Ellucian Banner SIS', type: 'info' },
    { timestamp: new Date(Date.now() - 190 * 60 * 1000).toISOString(), event: 'Authentication token renewed via University SSO SAML 2.0', type: 'info' }
  ]
};

// --- SIS Routes ---
app.get('/api/sis/status', (req, res) => {
  res.json({
    ...sisState,
    hasServerApiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

app.post('/api/sis/sync', (req, res) => {
  sisState.lastSync = new Date().toISOString();
  sisState.logs.unshift({
    timestamp: new Date().toISOString(),
    event: `Manual bidirectional SIS sync completed. 168 student records and 4 course sections refreshed.`,
    type: 'success'
  });
  if (sisState.logs.length > 20) sisState.logs = sisState.logs.slice(0, 20);
  res.json({ success: true, lastSync: sisState.lastSync, logs: sisState.logs });
});

app.post('/api/sis/push-grades', (req, res) => {
  const { assignmentTitle, sectionCode, count } = req.body;
  sisState.logs.unshift({
    timestamp: new Date().toISOString(),
    event: `Pushed ${count || 1} gradebook records for "${assignmentTitle || 'Assignment'}" to ${sectionCode || 'SIS'} Grade Registry.`,
    type: 'success'
  });
  res.json({ success: true, message: 'Grades successfully synced with University SIS' });
});

// --- Gemini API Key Check ---
app.post('/api/gemini/test-key', async (req, res) => {
  try {
    const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
    const ai = getGenAIClient(customKey);
    
    if (!ai) {
      return res.status(400).json({
        valid: false,
        error: 'No API key provided. Please provide an API key in the copilot settings or ensure GEMINI_API_KEY is configured.'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Respond with exactly: "OK: Pedagogical Copilot Ready"',
    });

    res.json({
      valid: true,
      text: response.text,
      model: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Gemini test key error:', error);
    res.status(500).json({
      valid: false,
      error: error?.message || 'Failed to authenticate with Gemini API'
    });
  }
});

// --- General AI Pedagogical Copilot Chat / Query ---
app.post('/api/gemini/copilot', async (req, res) => {
  try {
    const { prompt, context, systemRole } = req.body;
    const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
    const ai = getGenAIClient(customKey);

    const defaultSystemInstruction = `You are an elite University Pedagogical AI Copilot assisting professors and instructors in higher education.
You possess deep expertise in educational psychology, Bloom's Taxonomy, ABET/AACSB accreditation, formative assessment, curriculum scaffolding, and empathetic student intervention.
Be concise, analytical, academically rigorous, and provide structured outputs with clear headings, actionable steps, and pedagogically sound rationale.`;

    if (!ai) {
      // High-quality pedagogical fallback when API key is not configured
      const fallbackResponse = `### [AI Faculty Copilot Analysis]
Based on course section telemetry and pedagogical data:

1. **Pedagogical Assessment**: The target topic demonstrates cognitive friction at the *application* level of Bloom's Taxonomy. Students grasp definitions but struggle with synthesis under constraint.
2. **Immediate Action Item**: Implement a 10-minute peer-instruction think-pair-share during next lecture with an active scaffold problem.
3. **Assessment Alignment**: Ensure formative quiz items contain progressive test cases and conceptual diagnostics.
4. **Targeted Follow-up**: Schedule a 20-minute targeted group TA review session for students flagged in the bottom quartile.

*(Tip: Connect your Gemini API Key in the Copilot Settings panel to run live inference across your custom student submissions and syllabi.)*`;

      return res.json({ text: fallbackResponse, simulated: true });
    }

    const fullPrompt = `${context ? `### COURSE SECTION & PEDAGOGICAL CONTEXT:\n${context}\n\n` : ''}### PROFESSOR QUERY:\n${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemRole || defaultSystemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text, simulated: false });
  } catch (error: any) {
    console.error('Copilot API error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate copilot response',
    });
  }
});

// --- AI Grading Automation ---
app.post('/api/gemini/grade', async (req, res) => {
  try {
    const { submission, rubric, assignmentTitle, studentName, courseName } = req.body;
    const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
    const ai = getGenAIClient(customKey);

    const promptText = `Evaluate the following student submission for the assignment "${assignmentTitle || 'Assignment'}" in course "${courseName || 'Course'}".
Student: ${studentName || 'Student'}

### GRADING RUBRIC & EXPECTED CRITERIA:
${rubric || 'Criteria 1: Correctness and Problem Solving (40 pts)\nCriteria 2: Architecture & Clean Code/Clarity (30 pts)\nCriteria 3: Edge Case Handling & Rigor (20 pts)\nCriteria 4: Documentation & Rationale (10 pts)'}

### STUDENT SUBMISSION CONTENT:
${submission}

Please provide:
1. An overall score out of 100 with letter grade.
2. Breakdown per rubric criterion with specific points awarded and justification.
3. Key strengths identified in the work.
4. Critical constructive feedback & pedagogical pointers for improvement.
5. Suggested concise feedback comments to return to the student.
6. Academic Integrity & AI assistance estimation (Likelihood score 0-100% with explanation).`;

    if (!ai) {
      // Realistic pedagogical simulated grade response
      return res.json({
        score: 87,
        letterGrade: 'B+',
        criteria: [
          { name: 'Algorithmic Correctness & Logic', score: 36, maxScore: 40, feedback: 'Strong foundational logic with correct asymptotic bounds; minor off-by-one boundary handling.' },
          { name: 'Code Quality & Design Pattern', score: 27, maxScore: 30, feedback: 'Modular organization and clean variable nomenclature. Follows standard architectural guidelines.' },
          { name: 'Edge Case & Invariant Handling', score: 15, maxScore: 20, feedback: 'Misses zero-capacity check and empty array edge case; fails 2 out of 10 stress tests.' },
          { name: 'Complexity Proof & Documentation', score: 9, maxScore: 10, feedback: 'Thorough Big-O runtime analysis provided with clear inductive explanation.' }
        ],
        strengths: [
          'Effective decomposition of the recursive problem into dynamic programming state transitions.',
          'Comprehensive comments detailing loop invariant guarantees.',
          'Clean test harness provided alongside the core logic.'
        ],
        weaknesses: [
          'Boundary condition failure when input vector length equals 0.',
          'Memory allocation could be optimized from O(N^2) to O(N) using rolling buffer technique.'
        ],
        studentFeedback: `Great work on this problem set, ${studentName || 'Student'}. Your core algorithmic reasoning is sound and your Big-O justification was among the best in the section. For future milestones, pay extra attention to boundary tests (such as empty inputs or negative weights) before finalizing your solution. Keep up the high standard!`,
        aiIntegrityScore: 12,
        aiIntegrityAnalysis: 'Low probability of unauthorized AI generation. Unique formatting, idiosyncratic variable nomenclature, and progressive reasoning markers indicate original student authorship.',
        simulated: true
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: `You are an automated university grading assistant. Be objective, precise, and supportive. Provide fair rubric-based scores and deeply actionable feedback.`,
        temperature: 0.3,
      }
    });

    res.json({ text: response.text, simulated: false });
  } catch (error: any) {
    console.error('Grading API error:', error);
    res.status(500).json({ error: error?.message || 'Grading failed' });
  }
});

// --- AI Curriculum & Syllabus Design ---
app.post('/api/gemini/curriculum', async (req, res) => {
  try {
    const { taskType, courseName, topic, targetAudience, weeksCount, learningObjectives } = req.body;
    const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
    const ai = getGenAIClient(customKey);

    const promptText = `Task: ${taskType || 'Generate Full Module Plan and Assessment Suite'}
Course: ${courseName || 'Computer Science'}
Target Topic / Domain: ${topic || 'Advanced Distributed Systems'}
Audience Level: ${targetAudience || 'Undergraduate Juniors & Seniors'}
Duration: ${weeksCount || 4} Weeks / Modules
Key Learning Objectives: ${learningObjectives || 'Master consensus algorithms, CAP theorem trade-offs, and fault-tolerant replication'}

Format the curriculum assistance with:
1. Module Breakdown (Weekly themes, required readings, interactive lab activities)
2. Bloom's Taxonomy Cognitive Mapping (Remembering, Understanding, Applying, Analyzing, Evaluating, Creating)
3. Formative Assessment Question Bank (3 conceptual check questions + 1 complex capstone coding/design problem with scoring criteria)
4. Active Learning / Studio Workshop Design (Peer-instruction activity and real-world case study)
5. Scaffolded Student Support & Inclusivity Guidance`;

    if (!ai) {
      return res.json({
        topic,
        courseName,
        curriculumOverview: `4-Week Rigorous Module Architecture for ${topic || 'Advanced Topics'}`,
        modules: [
          {
            week: 1,
            title: `Foundations & Core Principles of ${topic || 'the Discipline'}`,
            cognitiveLevel: 'Understand & Analyze',
            readings: 'Primary Literature Ch. 1-3 & Seminal Research Paper',
            activities: 'Interactive whiteboard decomposition and conceptual diagnostic quiz',
            deliverable: 'Diagnostic Problem Set 1 (Formative)'
          },
          {
            week: 2,
            title: 'Algorithmic Mechanics & Implementation Paradigms',
            cognitiveLevel: 'Apply & Evaluate',
            readings: 'Technical Specifications & Benchmark Case Studies',
            activities: 'Hands-on programming laboratory with automated CI/CD test suites',
            deliverable: 'Programming Milestone 1 (Automated Grading)'
          },
          {
            week: 3,
            title: 'Failure Modes, Resilience & Edge-Case Dynamics',
            cognitiveLevel: 'Analyze & Synthesize',
            readings: 'Industry Incident Post-Mortems & Resilience Patterns',
            activities: 'Red-Team / Blue-Team architectural critique in seminar groups',
            deliverable: 'Comparative Systems Evaluation Memo'
          },
          {
            week: 4,
            title: 'Synthesis, Capstone Integration & Future Horizons',
            cognitiveLevel: 'Create & Defend',
            readings: 'Emerging Frontiers & Frontier Benchmarks',
            activities: 'Capstone prototype demonstration and peer code review',
            deliverable: 'End-of-Module Mini-Project Presentation'
          }
        ],
        sampleAssessments: [
          {
            question: `Explain how the trade-offs in ${topic || 'this system'} differ when scaling from single-node to heterogeneous distributed clusters.`,
            taxonomyLevel: 'Evaluate (Level 5)',
            solutionGuide: 'Students must reference latency bounds, network partitions, and data consistency models.'
          },
          {
            question: `Given a failure trace with 15% packet loss, diagnose whether the anomaly stems from thread starvation or network split-brain.`,
            taxonomyLevel: 'Analyze (Level 4)',
            solutionGuide: 'Look for metric divergence in heartbeat timestamps and socket retransmissions.'
          }
        ],
        simulated: true
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an expert instructional designer and academic curriculum architect for leading research universities.',
        temperature: 0.6,
      }
    });

    res.json({ text: response.text, simulated: false });
  } catch (error: any) {
    console.error('Curriculum API error:', error);
    res.status(500).json({ error: error?.message || 'Curriculum generation failed' });
  }
});

// --- AI Student Intervention Generator ---
app.post('/api/gemini/intervention', async (req, res) => {
  try {
    const { studentName, courseName, riskCategory, riskFactors, tone, currentGrade } = req.body;
    const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
    const ai = getGenAIClient(customKey);

    const promptText = `Compose a personalized pedagogical intervention message from Professor to Student:
Student Name: ${studentName}
Course: ${courseName}
Current Grade: ${currentGrade}%
Risk Category: ${riskCategory}
Identified Risk Factors: ${Array.isArray(riskFactors) ? riskFactors.join(', ') : riskFactors}
Desired Communication Tone: ${tone || 'Empathetic, Encouraging & Action-Oriented'}

Generate:
1. Email / LMS Direct Message Draft (Subject line + body that is non-judgmental, warm, empowering, and gives specific concrete next steps).
2. Recommended Supplemental Learning Assets (e.g. 2 recommended video modules or interactive guides).
3. 3 Custom Practice Problems targeted at their weak areas.
4. Suggested 1-on-1 Office Hour Discussion Agenda (15 mins).`;

    if (!ai) {
      return res.json({
        subject: `Checking in on your progress in ${courseName} & support resources`,
        body: `Hi ${studentName},\n\nI hope your week is going well. I wanted to reach out directly to check in on how you're feeling about ${courseName}. I noticed that the recent assignments and attendance have been challenging, and I want to make sure you have every resource needed to succeed.\n\nYou have strong potential in this course, and these mid-semester topics are notoriously demanding. Let's work together to get you back on track before the upcoming exam.\n\nCould you stop by my office hours this Thursday between 2:00 PM and 4:00 PM (or join via Zoom)? In the meantime, I've curated a dedicated review sheet and practice questions linked below.\n\nBest regards,\nProfessor Davis`,
        officeHoursAgenda: [
          'Review of recent Problem Set questions where points were lost (5 mins)',
          'Diagnosing core conceptual misunderstanding in recursion & dynamic programming (5 mins)',
          'Developing a realistic weekly study & homework roadmap with TA support (5 mins)'
        ],
        recommendedResources: [
          'Visualgo Interactive Algorithm Visualizer - Module 4',
          'Course Scaffold Guide: Overcoming Dynamic Programming Subproblems',
          'Peer Tutoring Center Walk-in Hours: Mon/Wed 4-6 PM'
        ],
        simulated: true
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an empathetic, world-class university educator crafting personalized retention interventions for at-risk students.',
        temperature: 0.5,
      }
    });

    res.json({ text: response.text, simulated: false });
  } catch (error: any) {
    console.error('Intervention API error:', error);
    res.status(500).json({ error: error?.message || 'Intervention generation failed' });
  }
});

// --- Server Environment Setup (Dev vs Prod) ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Campus AI Analytics Teacher Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
