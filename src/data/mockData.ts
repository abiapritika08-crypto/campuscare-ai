import { CourseSection, Student, Intervention, SubmissionToGrade } from '../types';

export const mockSections: CourseSection[] = [
  {
    id: 'cs-301-01',
    code: 'CS 301 (01)',
    title: 'Advanced Algorithms & Data Structures',
    term: 'Fall 2026',
    room: 'Turing Hall 304',
    schedule: 'MWF 10:00 - 11:15 AM',
    totalEnrolled: 48,
    averageGrade: 78.4,
    attendanceAvg: 86.2,
    retentionRiskCount: {
      critical: 3,
      elevated: 7,
      moderate: 12,
      on_track: 26,
    },
    masteryBreakdown: {
      remembering: 92,
      understanding: 84,
      applying: 71,
      analyzing: 63,
      evaluating: 58,
    },
    topics: [
      { name: 'Asymptotic Analysis & Recurrences', masteryRate: 88, frictionScore: 22, bloomLevel: 'Understanding' },
      { name: 'Divide & Conquer (FFT, Inversion)', masteryRate: 79, frictionScore: 35, bloomLevel: 'Applying' },
      { name: 'Dynamic Programming & Memoization', masteryRate: 59, frictionScore: 82, bloomLevel: 'Analyzing' },
      { name: 'Max-Flow & Network Bipartite Matching', masteryRate: 64, frictionScore: 74, bloomLevel: 'Analyzing' },
      { name: 'NP-Completeness & Poly-Time Reductions', masteryRate: 52, frictionScore: 91, bloomLevel: 'Evaluating' },
      { name: 'Approximation Algorithms', masteryRate: 72, frictionScore: 48, bloomLevel: 'Applying' },
    ],
  },
  {
    id: 'cs-301-02',
    code: 'CS 301 (02)',
    title: 'Advanced Algorithms & Data Structures (Honors)',
    term: 'Fall 2026',
    room: 'Turing Hall 308',
    schedule: 'TR 1:00 - 2:45 PM',
    totalEnrolled: 52,
    averageGrade: 83.1,
    attendanceAvg: 91.5,
    retentionRiskCount: {
      critical: 1,
      elevated: 4,
      moderate: 10,
      on_track: 37,
    },
    masteryBreakdown: {
      remembering: 96,
      understanding: 89,
      applying: 82,
      analyzing: 77,
      evaluating: 71,
    },
    topics: [
      { name: 'Asymptotic Analysis & Recurrences', masteryRate: 94, frictionScore: 12, bloomLevel: 'Understanding' },
      { name: 'Divide & Conquer (FFT, Inversion)', masteryRate: 88, frictionScore: 24, bloomLevel: 'Applying' },
      { name: 'Dynamic Programming & Memoization', masteryRate: 71, frictionScore: 62, bloomLevel: 'Analyzing' },
      { name: 'Max-Flow & Network Bipartite Matching', masteryRate: 76, frictionScore: 54, bloomLevel: 'Analyzing' },
      { name: 'NP-Completeness & Poly-Time Reductions', masteryRate: 66, frictionScore: 78, bloomLevel: 'Evaluating' },
      { name: 'Approximation Algorithms', masteryRate: 80, frictionScore: 32, bloomLevel: 'Applying' },
    ],
  },
  {
    id: 'data-204-a',
    code: 'DATA 204 (A)',
    title: 'Machine Learning Foundations & Ethics',
    term: 'Fall 2026',
    room: 'Lovelace Science Center 110',
    schedule: 'MW 2:00 - 3:45 PM',
    totalEnrolled: 38,
    averageGrade: 81.2,
    attendanceAvg: 88.0,
    retentionRiskCount: {
      critical: 2,
      elevated: 5,
      moderate: 9,
      on_track: 22,
    },
    masteryBreakdown: {
      remembering: 94,
      understanding: 86,
      applying: 78,
      analyzing: 69,
      evaluating: 62,
    },
    topics: [
      { name: 'Supervised Learning & Loss Optimization', masteryRate: 86, frictionScore: 28, bloomLevel: 'Understanding' },
      { name: 'Gradient Descent & Convex Formulations', masteryRate: 73, frictionScore: 58, bloomLevel: 'Applying' },
      { name: 'Overfitting, Bias-Variance & Regularization', masteryRate: 69, frictionScore: 64, bloomLevel: 'Analyzing' },
      { name: 'Algorithmic Fairness & Model Governance', masteryRate: 88, frictionScore: 25, bloomLevel: 'Evaluating' },
    ],
  },
  {
    id: 'eng-102-03',
    code: 'ENG 102 (03)',
    title: 'Systems Engineering & Software Design',
    term: 'Fall 2026',
    room: 'Shannon Hall 202',
    schedule: 'F 9:00 - 12:00 PM (Lab)',
    totalEnrolled: 30,
    averageGrade: 76.8,
    attendanceAvg: 82.5,
    retentionRiskCount: {
      critical: 3,
      elevated: 6,
      moderate: 8,
      on_track: 13,
    },
    masteryBreakdown: {
      remembering: 90,
      understanding: 79,
      applying: 68,
      analyzing: 59,
      evaluating: 54,
    },
    topics: [
      { name: 'Modular Architecture & Microservices', masteryRate: 77, frictionScore: 42, bloomLevel: 'Applying' },
      { name: 'Concurrency, Deadlocks & Thread Synchronization', masteryRate: 54, frictionScore: 89, bloomLevel: 'Analyzing' },
      { name: 'Database ACID Transactions & Isolation', masteryRate: 66, frictionScore: 68, bloomLevel: 'Analyzing' },
      { name: 'Automated CI/CD & Testing Verification', masteryRate: 82, frictionScore: 30, bloomLevel: 'Applying' },
    ],
  },
];

export const mockStudents: Student[] = [
  {
    id: 'stu-101',
    name: 'Marcus Vance',
    email: 'm.vance@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    sectionId: 'cs-301-01',
    major: 'Computer Science (B.S.)',
    academicYear: 'Junior',
    currentGrade: 54.2,
    letterGrade: 'F',
    riskLevel: 'critical',
    riskScore: 92,
    attendanceRate: 61.5,
    lmsActivityHoursPerWeek: 1.4,
    assignmentsSubmittedCount: 3,
    totalAssignmentsCount: 6,
    riskFactors: [
      'Missing 3 consecutive problem sets',
      'Attendance dropped below 65% trigger',
      'LMS late-night logins zero in past 14 days',
      'Struggling heavily on Dynamic Programming',
    ],
    historicalGrades: [
      { week: 1, grade: 82 },
      { week: 2, grade: 76 },
      { week: 3, grade: 64 },
      { week: 4, grade: 58 },
      { week: 5, grade: 52 },
      { week: 6, grade: 54 },
    ],
    predictedGpaImpact: -0.74,
    flaggedTopic: 'Dynamic Programming & Memoization',
    notes: 'Transferred from community college this semester. Prerequisite Discrete Math credit was approved via waiver.',
  },
  {
    id: 'stu-102',
    name: 'Elena Rostova',
    email: 'e.rostova@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    sectionId: 'cs-301-01',
    major: 'Data Science & Applied Math',
    academicYear: 'Sophomore',
    currentGrade: 63.8,
    letterGrade: 'D',
    riskLevel: 'critical',
    riskScore: 84,
    attendanceRate: 68.0,
    lmsActivityHoursPerWeek: 2.2,
    assignmentsSubmittedCount: 4,
    totalAssignmentsCount: 6,
    riskFactors: [
      'Midterm score 51/100 (bottom 5th percentile)',
      'High friction in NP-Completeness proofs',
      'Consecutive late submissions with penalty',
    ],
    historicalGrades: [
      { week: 1, grade: 88 },
      { week: 2, grade: 81 },
      { week: 3, grade: 70 },
      { week: 4, grade: 66 },
      { week: 5, grade: 61 },
      { week: 6, grade: 63 },
    ],
    predictedGpaImpact: -0.62,
    flaggedTopic: 'NP-Completeness & Poly-Time Reductions',
    notes: 'Expressed confusion during office hours regarding polynomial reduction direction.',
  },
  {
    id: 'stu-103',
    name: 'Devon James',
    email: 'd.james@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    sectionId: 'cs-301-01',
    major: 'Computer Engineering',
    academicYear: 'Senior',
    currentGrade: 67.4,
    letterGrade: 'D+',
    riskLevel: 'critical',
    riskScore: 78,
    attendanceRate: 72.0,
    lmsActivityHoursPerWeek: 3.1,
    assignmentsSubmittedCount: 5,
    totalAssignmentsCount: 6,
    riskFactors: [
      'Submissions submitted within 4 minutes of deadline',
      'Failed Unit Tests on Memory Leaks in Lab 2',
      'Prerequisite gap in Graph Theory',
    ],
    historicalGrades: [
      { week: 1, grade: 78 },
      { week: 2, grade: 72 },
      { week: 3, grade: 68 },
      { week: 4, grade: 65 },
      { week: 5, grade: 64 },
      { week: 6, grade: 67 },
    ],
    predictedGpaImpact: -0.51,
    flaggedTopic: 'Max-Flow & Network Bipartite Matching',
  },
  {
    id: 'stu-104',
    name: 'Sophia Chen',
    email: 's.chen@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    sectionId: 'cs-301-01',
    major: 'Computer Science',
    academicYear: 'Junior',
    currentGrade: 71.9,
    letterGrade: 'C-',
    riskLevel: 'elevated',
    riskScore: 64,
    attendanceRate: 79.5,
    lmsActivityHoursPerWeek: 4.8,
    assignmentsSubmittedCount: 6,
    totalAssignmentsCount: 6,
    riskFactors: [
      'Score trending downwards (-12% over 3 weeks)',
      'Frequent help-desk inquiries regarding recurrence relations',
    ],
    historicalGrades: [
      { week: 1, grade: 91 },
      { week: 2, grade: 84 },
      { week: 3, grade: 78 },
      { week: 4, grade: 74 },
      { week: 5, grade: 70 },
      { week: 6, grade: 71 },
    ],
    predictedGpaImpact: -0.38,
    flaggedTopic: 'Dynamic Programming & Memoization',
  },
  {
    id: 'stu-105',
    name: 'Liam Gallagher',
    email: 'l.gallagher@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    sectionId: 'cs-301-01',
    major: 'Software Engineering',
    academicYear: 'Junior',
    currentGrade: 73.5,
    letterGrade: 'C',
    riskLevel: 'elevated',
    riskScore: 58,
    attendanceRate: 83.0,
    lmsActivityHoursPerWeek: 3.9,
    assignmentsSubmittedCount: 6,
    totalAssignmentsCount: 6,
    riskFactors: [
      'Struggles on theoretical mathematical induction proofs',
      'High coding score but low analytical quiz scores',
    ],
    historicalGrades: [
      { week: 1, grade: 80 },
      { week: 2, grade: 77 },
      { week: 3, grade: 75 },
      { week: 4, grade: 72 },
      { week: 5, grade: 74 },
      { week: 6, grade: 73 },
    ],
    predictedGpaImpact: -0.29,
    flaggedTopic: 'NP-Completeness & Poly-Time Reductions',
  },
  {
    id: 'stu-106',
    name: 'Amina Al-Mansoor',
    email: 'a.mansoor@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    sectionId: 'cs-301-01',
    major: 'Artificial Intelligence',
    academicYear: 'Junior',
    currentGrade: 78.8,
    letterGrade: 'C+',
    riskLevel: 'moderate',
    riskScore: 42,
    attendanceRate: 89.0,
    lmsActivityHoursPerWeek: 6.2,
    assignmentsSubmittedCount: 6,
    totalAssignmentsCount: 6,
    riskFactors: [
      'Sporadic quiz participation',
      'Average mastery in Divide & Conquer',
    ],
    historicalGrades: [
      { week: 1, grade: 84 },
      { week: 2, grade: 81 },
      { week: 3, grade: 76 },
      { week: 4, grade: 79 },
      { week: 5, grade: 78 },
      { week: 6, grade: 78 },
    ],
    predictedGpaImpact: -0.15,
  },
  {
    id: 'stu-107',
    name: 'Gabriel Morales',
    email: 'g.morales@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
    sectionId: 'cs-301-01',
    major: 'Computer Science',
    academicYear: 'Sophomore',
    currentGrade: 94.6,
    letterGrade: 'A',
    riskLevel: 'on_track',
    riskScore: 6,
    attendanceRate: 98.0,
    lmsActivityHoursPerWeek: 8.5,
    assignmentsSubmittedCount: 6,
    totalAssignmentsCount: 6,
    riskFactors: [],
    historicalGrades: [
      { week: 1, grade: 96 },
      { week: 2, grade: 94 },
      { week: 3, grade: 92 },
      { week: 4, grade: 95 },
      { week: 5, grade: 96 },
      { week: 6, grade: 94 },
    ],
    predictedGpaImpact: 0.0,
  },
  {
    id: 'stu-108',
    name: 'Priya Patel',
    email: 'p.patel@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    sectionId: 'cs-301-01',
    major: 'Computer Science & Mathematics',
    academicYear: 'Junior',
    currentGrade: 98.1,
    letterGrade: 'A+',
    riskLevel: 'on_track',
    riskScore: 3,
    attendanceRate: 100.0,
    lmsActivityHoursPerWeek: 11.2,
    assignmentsSubmittedCount: 6,
    totalAssignmentsCount: 6,
    riskFactors: [],
    historicalGrades: [
      { week: 1, grade: 99 },
      { week: 2, grade: 98 },
      { week: 3, grade: 97 },
      { week: 4, grade: 98 },
      { week: 5, grade: 99 },
      { week: 6, grade: 98 },
    ],
    predictedGpaImpact: 0.0,
  },
  // Students for cs-301-02
  {
    id: 'stu-201',
    name: 'Zachary Taylor',
    email: 'z.taylor@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
    sectionId: 'cs-301-02',
    major: 'Computer Science (Honors)',
    academicYear: 'Sophomore',
    currentGrade: 59.5,
    letterGrade: 'F',
    riskLevel: 'critical',
    riskScore: 88,
    attendanceRate: 64.0,
    lmsActivityHoursPerWeek: 1.8,
    assignmentsSubmittedCount: 3,
    totalAssignmentsCount: 5,
    riskFactors: [
      'Honors cohort pacing lag',
      'Fell behind after Week 4 illness',
      'Incomplete dynamic programming milestone',
    ],
    historicalGrades: [
      { week: 1, grade: 85 },
      { week: 2, grade: 80 },
      { week: 3, grade: 70 },
      { week: 4, grade: 60 },
      { week: 5, grade: 59 },
    ],
    predictedGpaImpact: -0.68,
    flaggedTopic: 'Dynamic Programming & Memoization',
  },
  // Students for data-204-a
  {
    id: 'stu-301',
    name: 'Maya Lin',
    email: 'm.lin@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    sectionId: 'data-204-a',
    major: 'Cognitive Science & Data',
    academicYear: 'Senior',
    currentGrade: 58.2,
    letterGrade: 'F',
    riskLevel: 'critical',
    riskScore: 89,
    attendanceRate: 59.0,
    lmsActivityHoursPerWeek: 1.2,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 5,
    riskFactors: [
      'Missing Gradient Descent Lab submission',
      'Severe attendance attrition in Monday seminars',
      'High friction with Convex Optimization math',
    ],
    historicalGrades: [
      { week: 1, grade: 80 },
      { week: 2, grade: 72 },
      { week: 3, grade: 63 },
      { week: 4, grade: 58 },
    ],
    predictedGpaImpact: -0.71,
    flaggedTopic: 'Gradient Descent & Convex Formulations',
  },
  // Students for eng-102-03
  {
    id: 'stu-401',
    name: 'Jordan Brooks',
    email: 'j.brooks@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    sectionId: 'eng-102-03',
    major: 'Electrical & Computer Eng.',
    academicYear: 'Junior',
    currentGrade: 56.0,
    letterGrade: 'F',
    riskLevel: 'critical',
    riskScore: 91,
    attendanceRate: 60.0,
    lmsActivityHoursPerWeek: 1.5,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 5,
    riskFactors: [
      'Concurrency lab deadlock issues in multithreading',
      'Missed 2 Friday hands-on lab sessions',
    ],
    historicalGrades: [
      { week: 1, grade: 78 },
      { week: 2, grade: 68 },
      { week: 3, grade: 61 },
      { week: 4, grade: 56 },
    ],
    predictedGpaImpact: -0.80,
    flaggedTopic: 'Concurrency, Deadlocks & Thread Synchronization',
  },
];

export const mockInterventions: Intervention[] = [
  {
    id: 'int-001',
    studentId: 'stu-101',
    studentName: 'Marcus Vance',
    sectionCode: 'CS 301 (01)',
    riskLevel: 'critical',
    triggerReason: '3 consecutive missing problem sets & attendance < 65%',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'opened',
    subject: 'Support check-in & personalized review plan for CS 301',
    body: `Hi Marcus,\n\nI noticed you haven't had a chance to submit Problem Sets 4 and 5, and wanted to reach out directly. The dynamic programming and recurrence topics we are covering right now are among the toughest in the entire curriculum, and it is completely normal to encounter friction.\n\nI want to make sure you have the exact support you need. I've prepared a scaffolded review walkthrough on memoization matrices and would love to sit down with you for 15 minutes during my office hours this Thursday at 2:00 PM or Friday at 11:30 AM.\n\nPlease let me know which time works best for you. We can also grant an excused extension for PS4 once we review the core patterns.\n\nWarm regards,\nProf. Davis`,
    tone: 'empathetic',
    officeHoursOffered: ['Thursday 2:00 PM - 2:30 PM (Turing 304)', 'Friday 11:30 AM - 12:00 PM (Zoom)'],
    practiceModules: ['Scaffolded DP Memoization Guide', 'Recurrence Trees Quick Diagnostic'],
    openedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    studentResponse: 'Thank you Professor Davis! I was feeling really overwhelmed with the transfer credit adjustment. I will definitely come by Thursday at 2:00 PM.',
  },
  {
    id: 'int-002',
    studentId: 'stu-102',
    studentName: 'Elena Rostova',
    sectionCode: 'CS 301 (01)',
    riskLevel: 'critical',
    triggerReason: 'Midterm bottom 5th percentile & NP-Completeness friction',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'engaged',
    subject: 'Midterm reflection & recovery strategy for CS 301',
    body: `Dear Elena,\n\nI reviewed your recent Midterm exam and noticed that the theoretical polynomial-time reduction proofs presented significant difficulties, despite your strong earlier performance in divide-and-conquer.\n\nBecause reductions involve a shift in perspective (showing hardness rather than finding an algorithm), many students struggle at this exact juncture. Let's schedule a dedicated session with Head TA Alex or myself to master the 3-step proof template.\n\nYou are capable of mastering this material, and there are still 50% of course points remaining.\n\nBest,\nProf. Davis`,
    tone: 'structured',
    officeHoursOffered: ['Wednesday 3:00 PM (Turing 304)', 'Thursday 10:00 AM (Zoom)'],
    practiceModules: ['Polynomial Reductions Step-by-Step Template', '3-SAT to Vertex Cover Illustrated'],
    openedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'int-003',
    studentId: 'stu-104',
    studentName: 'Sophia Chen',
    sectionCode: 'CS 301 (01)',
    riskLevel: 'elevated',
    triggerReason: 'Trajectory trending downwards (-12% across 3 weeks)',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    subject: 'Mid-semester progress check & algorithm workshop invite',
    body: `Hi Sophia,\n\nI wanted to share a quick word of encouragement as we head into the second half of CS 301. Your analytical intuition in class discussions is wonderful, but I noticed recent homework scores have shown a slight dip.\n\nWe are hosting an optional interactive problem-solving circle this Wednesday at 4 PM in Turing 304. I think you would find the collaborative dynamic programming puzzles really energizing.\n\nHope to see you there!\nProf. Davis`,
    tone: 'gentle',
    officeHoursOffered: ['Wednesday 4:00 PM Problem Circle'],
    practiceModules: ['Dynamic Programming State Transitions Cheat Sheet'],
    openedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    studentResponse: 'I attended the problem circle and the explanation of 2D grid DP clicked! Score on PS5 was already back up to 88%. Thank you!',
  },
];

export const mockSubmissionsToGrade: SubmissionToGrade[] = [
  {
    id: 'sub-01',
    studentId: 'stu-101',
    studentName: 'Marcus Vance',
    assignmentTitle: 'Problem Set 5: Dynamic Programming & Sequence Alignment',
    sectionCode: 'CS 301 (01)',
    submittedAt: 'Yesterday at 11:42 PM (Late by 2 hrs)',
    content: `// Marcus Vance - CS301 Problem Set 5
// Problem: Longest Common Subsequence & Edit Distance
#include <vector>
#include <string>
#include <algorithm>
#include <iostream>

using namespace std;

// Function to compute Longest Common Subsequence
int computeLCS(const string& text1, const string& text2) {
    int m = text1.size();
    int n = text2.size();
    
    // DP matrix
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}

// Space-optimized Edit Distance
int minEditDistance(string word1, string word2) {
    int m = word1.length(), n = word2.length();
    vector<int> prev(n + 1, 0), curr(n + 1, 0);
    
    for (int j = 0; j <= n; j++) prev[j] = j;
    
    for (int i = 1; i <= m; i++) {
        curr[0] = i;
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + min({prev[j], curr[j - 1], prev[j - 1]});
            }
        }
        prev = curr;
    }
    return prev[n];
}

/*
Proof of Asymptotic Complexity:
For computeLCS, we allocate an (m+1) x (n+1) matrix, resulting in O(m * n) space.
The nested loop iterates m * n times with O(1) state transitions, yielding O(m * n) time.
For minEditDistance, we only maintain two rolling 1D buffers of size (n+1), which reduces
space complexity to O(n) while preserving O(m * n) time.
*/`,
    rubric: [
      { id: 'crit-1', name: 'Algorithmic Correctness & Recurrence Logic', maxPoints: 40, description: 'Correct state transitions for LCS and Edit Distance' },
      { id: 'crit-2', name: 'Space-Optimization & Code Quality', maxPoints: 30, description: 'Proper rolling array implementation and clean modular C++ code' },
      { id: 'crit-3', name: 'Boundary Conditions & Edge Cases', maxPoints: 15, description: 'Handles empty strings, mismatched lengths, unicode' },
      { id: 'crit-4', name: 'Complexity Proof & Asymptotic Rationale', maxPoints: 15, description: 'Formal Big-O proofs for time and space complexities' },
    ],
    status: 'pending',
  },
  {
    id: 'sub-02',
    studentId: 'stu-108',
    studentName: 'Priya Patel',
    assignmentTitle: 'Problem Set 5: Dynamic Programming & Sequence Alignment',
    sectionCode: 'CS 301 (01)',
    submittedAt: '2 days ago at 4:15 PM',
    content: `// Priya Patel - CS301 Problem Set 5
#include <iostream>
#include <vector>
#include <string>
#include <string_view>
#include <cassert>

class SequenceAlignment {
public:
    static int longestCommonSubsequence(std::string_view a, std::string_view b) noexcept {
        if (a.empty() || b.empty()) return 0;
        const size_t m = a.size(), n = b.size();
        std::vector<int> dp(n + 1, 0);

        for (size_t i = 1; i <= m; ++i) {
            int prevDiag = 0;
            for (size_t j = 1; j <= n; ++j) {
                int temp = dp[j];
                if (a[i - 1] == b[j - 1]) {
                    dp[j] = prevDiag + 1;
                } else {
                    dp[j] = std::max(dp[j], dp[j - 1]);
                }
                prevDiag = temp;
            }
        }
        return dp[n];
    }
};`,
    rubric: [
      { id: 'crit-1', name: 'Algorithmic Correctness & Recurrence Logic', maxPoints: 40, description: 'Correct state transitions for LCS and Edit Distance' },
      { id: 'crit-2', name: 'Space-Optimization & Code Quality', maxPoints: 30, description: 'Proper rolling array implementation and clean modular C++ code' },
      { id: 'crit-3', name: 'Boundary Conditions & Edge Cases', maxPoints: 15, description: 'Handles empty strings, mismatched lengths, unicode' },
      { id: 'crit-4', name: 'Complexity Proof & Asymptotic Rationale', maxPoints: 15, description: 'Formal Big-O proofs for time and space complexities' },
    ],
    status: 'graded',
    score: 98,
    letterGrade: 'A+',
    feedback: 'Flawless implementation. Exceptional use of single-array O(N) space reduction with temp diagonal cache.',
    criteriaScores: [
      { name: 'Algorithmic Correctness & Recurrence Logic', score: 40, maxScore: 40, feedback: 'Optimal DP formulation' },
      { name: 'Space-Optimization & Code Quality', score: 30, maxScore: 30, feedback: 'C++20 string_view, const-correctness, noexcept' },
      { name: 'Boundary Conditions & Edge Cases', score: 14, maxScore: 15, feedback: 'Handles empty sequences seamlessly' },
      { name: 'Complexity Proof & Asymptotic Rationale', score: 14, maxScore: 15, feedback: 'Concise, rigorous invariant proof' },
    ],
    aiIntegrityScore: 8,
    strengths: ['Single-row O(min(m, n)) optimization', 'Industrial C++ practices'],
    weaknesses: ['Minor: Could add assertion on maximum input lengths.'],
  },
  {
    id: 'sub-03',
    studentId: 'stu-104',
    studentName: 'Sophia Chen',
    assignmentTitle: 'Problem Set 5: Dynamic Programming & Sequence Alignment',
    sectionCode: 'CS 301 (01)',
    submittedAt: '3 days ago at 8:30 PM',
    content: `// Sophia Chen - CS301 PS5
// Recursive memoized approach
#include <vector>
#include <string>

using namespace std;

class Solution {
    vector<vector<int>> memo;
    int solve(int i, int j, const string& s1, const string& s2) {
        if (i < 0 || j < 0) return 0;
        if (memo[i][j] != -1) return memo[i][j];
        if (s1[i] == s2[j]) {
            return memo[i][j] = 1 + solve(i - 1, j - 1, s1, s2);
        }
        return memo[i][j] = max(solve(i - 1, j, s1, s2), solve(i, j - 1, s1, s2));
    }
public:
    int longestCommonSubsequence(string text1, string text2) {
        memo.assign(text1.size(), vector<int>(text2.size(), -1));
        return solve(text1.size() - 1, text2.size() - 1, text1, text2);
    }
};`,
    rubric: [
      { id: 'crit-1', name: 'Algorithmic Correctness & Recurrence Logic', maxPoints: 40, description: 'Correct state transitions for LCS and Edit Distance' },
      { id: 'crit-2', name: 'Space-Optimization & Code Quality', maxPoints: 30, description: 'Proper rolling array implementation and clean modular C++ code' },
      { id: 'crit-3', name: 'Boundary Conditions & Edge Cases', maxPoints: 15, description: 'Handles empty strings, mismatched lengths, unicode' },
      { id: 'crit-4', name: 'Complexity Proof & Asymptotic Rationale', maxPoints: 15, description: 'Formal Big-O proofs for time and space complexities' },
    ],
    status: 'pending',
  },
];
