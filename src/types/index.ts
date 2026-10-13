export type RiskLevel = 'critical' | 'elevated' | 'moderate' | 'on_track';

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  sectionId: string;
  major: string;
  academicYear: string;
  currentGrade: number;
  letterGrade: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  attendanceRate: number; // %
  lmsActivityHoursPerWeek: number;
  assignmentsSubmittedCount: number;
  totalAssignmentsCount: number;
  riskFactors: string[];
  historicalGrades: { week: number; grade: number }[];
  predictedGpaImpact: number; // e.g. -0.6
  lastInterventionDate?: string;
  notes?: string;
  flaggedTopic?: string;
}

export interface CourseSection {
  id: string;
  code: string;
  title: string;
  term: string;
  room: string;
  schedule: string;
  totalEnrolled: number;
  averageGrade: number;
  attendanceAvg: number;
  retentionRiskCount: {
    critical: number;
    elevated: number;
    moderate: number;
    on_track: number;
  };
  masteryBreakdown: {
    remembering: number;
    understanding: number;
    applying: number;
    analyzing: number;
    evaluating: number;
  };
  topics: {
    name: string;
    masteryRate: number;
    frictionScore: number; // 0-100 high friction = students struggle
    bloomLevel: string;
  }[];
}

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  sectionCode: string;
  riskLevel: RiskLevel;
  triggerReason: string;
  createdAt: string;
  status: 'draft' | 'pending_review' | 'dispatched' | 'opened' | 'engaged' | 'resolved';
  subject: string;
  body: string;
  tone: 'empathetic' | 'structured' | 'gentle';
  officeHoursOffered: string[];
  practiceModules: string[];
  openedAt?: string;
  studentResponse?: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  maxPoints: number;
  description: string;
}

export interface SubmissionToGrade {
  id: string;
  studentId: string;
  studentName: string;
  assignmentTitle: string;
  sectionCode: string;
  submittedAt: string;
  content: string;
  rubric: RubricCriterion[];
  status: 'pending' | 'graded' | 'pushed_to_sis';
  score?: number;
  letterGrade?: string;
  feedback?: string;
  criteriaScores?: { name: string; score: number; maxScore: number; feedback: string }[];
  aiIntegrityScore?: number;
  strengths?: string[];
  weaknesses?: string[];
}

export interface SISSyncLog {
  timestamp: string;
  event: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface SISStatus {
  connectedSystem: string;
  institution: string;
  lastSync: string;
  syncStatus: string;
  activeSectionsCount: number;
  enrolledStudentsCount: number;
  ferpaComplianceEnabled: boolean;
  logs: SISSyncLog[];
  hasServerApiKey: boolean;
}
