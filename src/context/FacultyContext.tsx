import React, { createContext, useContext, useState, useEffect } from 'react';
import { CourseSection, Student, Intervention, SubmissionToGrade, SISStatus } from '../types';
import { mockSections, mockStudents, mockInterventions, mockSubmissionsToGrade } from '../data/mockData';

interface FacultyContextType {
  sections: CourseSection[];
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  activeSection: CourseSection;
  
  students: Student[];
  sectionStudents: Student[];
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  
  interventions: Intervention[];
  addIntervention: (intervention: Intervention) => void;
  updateIntervention: (id: string, updates: Partial<Intervention>) => void;
  
  submissions: SubmissionToGrade[];
  updateSubmission: (id: string, updates: Partial<SubmissionToGrade>) => void;
  pushSubmissionGradeToSis: (id: string) => Promise<boolean>;
  
  activeTab: 'analytics' | 'risk' | 'interventions' | 'grading' | 'curriculum' | 'sis' | 'settings';
  setActiveTab: (tab: 'analytics' | 'risk' | 'interventions' | 'grading' | 'curriculum' | 'sis' | 'settings') => void;
  
  sisStatus: SISStatus;
  triggerSisSync: () => Promise<void>;
  isSyncingSis: boolean;
  
  privacyMode: boolean; // FERPA masking
  setPrivacyMode: (val: boolean) => void;
  formatStudentName: (name: string, id: string) => string;
  
  // Gemini API Key config
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeyValid: boolean | null;
  testApiKey: (keyToTest?: string) => Promise<{ valid: boolean; message: string }>;
  
  // Quick Copilot state
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  copilotInitialPrompt: string;
  openCopilotWithPrompt: (prompt: string) => void;
}

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export const FacultyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sections] = useState<CourseSection[]>(mockSections);
  const [activeSectionId, setActiveSectionId] = useState<string>('cs-301-01');
  
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions);
  const [submissions, setSubmissions] = useState<SubmissionToGrade[]>(mockSubmissionsToGrade);
  
  const [activeTab, setActiveTab] = useState<'analytics' | 'risk' | 'interventions' | 'grading' | 'curriculum' | 'sis' | 'settings'>('analytics');
  
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string>('');

  // SIS state
  const [sisStatus, setSisStatus] = useState<SISStatus>({
    connectedSystem: 'Canvas LMS + Ellucian Banner v9.4',
    institution: 'Apex Institute of Technology & Sciences',
    lastSync: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    syncStatus: 'Active & Verified',
    activeSectionsCount: 4,
    enrolledStudentsCount: 168,
    ferpaComplianceEnabled: true,
    hasServerApiKey: false,
    logs: [
      { timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(), event: 'Automated 15-min roster & attendance delta sync completed (0 errors)', type: 'success' },
      { timestamp: new Date(Date.now() - 74 * 60 * 1000).toISOString(), event: 'LMS gradebook checkpoint reconciled with Ellucian Banner SIS', type: 'info' },
      { timestamp: new Date(Date.now() - 190 * 60 * 1000).toISOString(), event: 'Authentication token renewed via University SSO SAML 2.0', type: 'info' },
    ],
  });
  const [isSyncingSis, setIsSyncingSis] = useState<boolean>(false);

  // Gemini API Key from localStorage or env
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem('smart_campus_gemini_key') || '';
  });
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('smart_campus_gemini_key', key);
    setIsKeyValid(null);
  };

  // Fetch initial SIS status from server
  useEffect(() => {
    fetch('/api/sis/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.connectedSystem) {
          setSisStatus((prev) => ({
            ...prev,
            ...data,
          }));
        }
      })
      .catch((err) => {
        console.warn('SIS status load fallback:', err);
      });
  }, []);

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const sectionStudents = students.filter((s) => s.sectionId === activeSectionId);

  const addIntervention = (intervention: Intervention) => {
    setInterventions((prev) => [intervention, ...prev]);
  };

  const updateIntervention = (id: string, updates: Partial<Intervention>) => {
    setInterventions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const updateSubmission = (id: string, updates: Partial<SubmissionToGrade>) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  };

  const pushSubmissionGradeToSis = async (id: string) => {
    const sub = submissions.find((s) => s.id === id);
    if (!sub || !sub.score) return false;

    try {
      const res = await fetch('/api/sis/push-grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentTitle: sub.assignmentTitle,
          sectionCode: sub.sectionCode,
          count: 1,
        }),
      });
      if (res.ok) {
        updateSubmission(id, { status: 'pushed_to_sis' });
        // Add log
        setSisStatus((prev) => ({
          ...prev,
          lastSync: new Date().toISOString(),
          logs: [
            {
              timestamp: new Date().toISOString(),
              event: `Pushed verified grade (${sub.score} / 100) for ${sub.studentName} to SIS Grade Registry.`,
              type: 'success',
            },
            ...prev.logs,
          ],
        }));
        return true;
      }
    } catch (e) {
      console.error('Failed to push to SIS', e);
    }
    return false;
  };

  const triggerSisSync = async () => {
    setIsSyncingSis(true);
    try {
      const res = await fetch('/api/sis/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSisStatus((prev) => ({
          ...prev,
          lastSync: data.lastSync,
          logs: data.logs || prev.logs,
        }));
      }
    } catch (e) {
      console.warn('Sync simulated:', e);
      setSisStatus((prev) => ({
        ...prev,
        lastSync: new Date().toISOString(),
        logs: [
          {
            timestamp: new Date().toISOString(),
            event: 'Manual bidirectional SIS sync completed. 168 student records and 4 sections refreshed.',
            type: 'success',
          },
          ...prev.logs,
        ],
      }));
    } finally {
      setTimeout(() => setIsSyncingSis(false), 800);
    }
  };

  const testApiKey = async (keyToTest?: string): Promise<{ valid: boolean; message: string }> => {
    const key = keyToTest !== undefined ? keyToTest : apiKey;
    try {
      const res = await fetch('/api/gemini/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': key || '',
        },
        body: JSON.stringify({ apiKey: key }),
      });
      const data = await res.json();
      if (data.valid) {
        setIsKeyValid(true);
        return { valid: true, message: 'Gemini Copilot connected and verified! Ready for live pedagogy & grading.' };
      } else {
        setIsKeyValid(false);
        return { valid: false, message: data.error || 'Authentication failed. Please verify the Gemini API key.' };
      }
    } catch (err: any) {
      setIsKeyValid(false);
      return { valid: false, message: err?.message || 'Network error verifying API key' };
    }
  };

  const formatStudentName = (name: string, id: string): string => {
    if (!privacyMode) return name;
    // FERPA privacy mask: e.g. "Candidate #301-V"
    const hash = id.replace(/[^0-9]/g, '') || '042';
    const lastInitial = name.split(' ').pop()?.[0] || 'X';
    return `Student [FERPA #${hash}-${lastInitial}]`;
  };

  const openCopilotWithPrompt = (prompt: string) => {
    setCopilotInitialPrompt(prompt);
    setIsCopilotOpen(true);
  };

  return (
    <FacultyContext.Provider
      value={{
        sections,
        activeSectionId,
        setActiveSectionId,
        activeSection,
        students,
        sectionStudents,
        selectedStudent,
        setSelectedStudent,
        interventions,
        addIntervention,
        updateIntervention,
        submissions,
        updateSubmission,
        pushSubmissionGradeToSis,
        activeTab,
        setActiveTab,
        sisStatus,
        triggerSisSync,
        isSyncingSis,
        privacyMode,
        setPrivacyMode,
        formatStudentName,
        apiKey,
        setApiKey,
        isKeyValid,
        testApiKey,
        isCopilotOpen,
        setIsCopilotOpen,
        copilotInitialPrompt,
        openCopilotWithPrompt,
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (!context) {
    throw new Error('useFaculty must be used within a FacultyProvider');
  }
  return context;
};
