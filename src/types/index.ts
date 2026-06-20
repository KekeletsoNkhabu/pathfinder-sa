export interface Subject {
  name: string;
  mark: number;
  apsPoints: number;
}

export interface StudentProfile {
  name: string;
  subjects: Subject[];
  totalAPS: number;
  interests: string[];
  savedAt: string;
}

export interface Career {
  id: string;
  title: string;
  emoji: string;
  category: string;
  description: string;
  longDescription: string;
  minAPS: number;
  requiredSubjects: { subject: string; minimumMark: number }[];
  salaryRange: { min: number; max: number };
  demandLevel: "High" | "Growing" | "Medium" | "Low";
  nsfasFunded: boolean;
  universities: string[];
  careerOutcomes: string[];
  alternativeCareers: string[];
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  province: string;
  type: "Traditional" | "Comprehensive" | "University of Technology";
  ranking: number;
  overallRating: number;
  minAPS: number;
  nsfasAvailable: boolean;
  color: string;
  description: string;
  strengths: string[];
  tags: string[];
  programs: { careerId: string; minAPS: number }[];
}

export interface CareerMatch {
  career: Career;
  matchPercentage: number;
  matchType: "perfect" | "strong" | "possible" | "stretch";
  missingRequirements: string[];
}

export interface AppState {
  profile: StudentProfile | null;
  careerMatches: CareerMatch[];
  savedCareers: string[];
  savedUniversities: string[];
  compareList: string[];
}
