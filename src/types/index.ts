// ─── Student & APS Types ────────────────────────────────────────────────────

export interface Subject {
  name: string;
  mark: number;
  apsPoints: number;
  isRequired?: boolean;
}

export interface StudentProfile {
  name: string;
  subjects: Subject[];
  totalAPS: number;
  interests: string[];
  savedAt?: string;
}

export interface SubjectInput {
  name: string;
  mark: string;
}

// ─── Career Types ────────────────────────────────────────────────────────────

export type CareerCategory = 'IT' | 'Health' | 'Business' | 'Engineering' | 'Law' | 'Education' | 'Arts' | 'Science';
export type MatchType = 'strong' | 'possible' | 'reach';

export interface CareerRequirement {
  subject: string;
  minimumMark: number;
}

export interface Career {
  id: string;
  title: string;
  category: CareerCategory;
  description: string;
  longDescription: string;
  requiredSubjects: CareerRequirement[];
  minAPS: number;
  maxAPS: number;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  universities: string[];
  nsfasFunded: boolean;
  demandLevel: 'High' | 'Medium' | 'Growing';
  emoji: string;
  alternativeCareers: string[];
  improvementSubject?: string;
}

export interface CareerMatch {
  career: Career;
  matchType: MatchType;
  matchPercentage: number;
  missingRequirements: string[];
  meetsAPSRequirement: boolean;
}

// ─── University Types ─────────────────────────────────────────────────────────

export interface UniversityProgram {
  careerId: string;
  careerTitle: string;
  minAPS: number;
  programName: string;
  duration: string;
  nsfasAvailable: boolean;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  province: string;
  type: 'Traditional' | 'Comprehensive' | 'University of Technology';
  ranking: number;
  overallRating: number;
  nsfasAvailable: boolean;
  tags: string[];
  strengths: string[];
  website: string;
  color: string;
  programs: UniversityProgram[];
  minAPS: number;
  description: string;
}

export interface UniversityComparison {
  universities: University[];
  careerId?: string;
}

// ─── App State Types ──────────────────────────────────────────────────────────

export interface SavedData {
  profile: StudentProfile | null;
  savedCareers: string[];
  savedUniversities: string[];
  compareList: string[];
  lastUpdated: string;
}

export interface AppState {
  profile: StudentProfile | null;
  careerMatches: CareerMatch[];
  savedCareers: string[];
  savedUniversities: string[];
  compareList: string[];
}

// ─── Chart Types ─────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  subject: string;
  mark: number;
  aps: number;
}
