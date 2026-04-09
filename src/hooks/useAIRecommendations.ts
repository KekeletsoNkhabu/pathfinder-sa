import { useState, useCallback } from "react";

export interface AIRecommendation {
  id: string;
  title: string;
  universityId: string;
  universityName: string;
  faculty: string;
  degree: string;
  duration: string;
  minAPS: number;
  subjectRequirements: { subject: string; minimumMark: number }[];
  careerOutcomes: string[];
  salaryRange: { min: number; max: number };
  demandLevel: "High" | "Growing" | "Medium" | "Low";
  nsfasAvailable: boolean;
  matchScore: number;
  matchReason: string;
  category: string;
  emoji: string;
  description: string;
}

export interface UniversityPrograms {
  universityId: string;
  universityName: string;
  lastUpdated: string;
  programs: {
    id: string;
    name: string;
    degree: string;
    faculty: string;
    duration: string;
    minAPS: number;
    subjectRequirements: { subject: string; minimumMark: number }[];
    nsfasAvailable: boolean;
    description: string;
    careerOutcomes: string[];
    applicationDeadline: string;
  }[];
}

export interface CourseDetails {
  title: string;
  universityName: string;
  degree: string;
  faculty: string;
  duration: string;
  minAPS: number;
  overview: string;
  subjectRequirements: { subject: string; minimumMark: number }[];
  careerOutcomes: string[];
  salaryRange: { min: number; max: number };
  nsfasAvailable: boolean;
  applicationDeadline: string;
  modules: string[];
  admissionProcess: string;
  campusLife: string;
  contactInfo: string;
}

// ── Recommendations ───────────────────────────────────────────────────────────

export function useAIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = useCallback(
    async (
      subjects: { name: string; mark: number }[],
      apsScore: number,
      interests: string[],
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjects, apsScore, interests }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setRecommendations(data.recommendations);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to get recommendations",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { recommendations, loading, error, getRecommendations };
}

// ── University prospector ─────────────────────────────────────────────────────

export function useUniversityProspector() {
  const [programs, setPrograms] = useState<UniversityPrograms | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(
    async (
      universityId: string,
      universityName: string,
      apsScore?: number,
      interests?: string[],
    ) => {
      setLoading(true);
      setError(null);
      setPrograms(null);
      try {
        const res = await fetch("/api/university-programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            universityId,
            universityName,
            apsScore,
            interests,
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setPrograms(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch programs",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { programs, loading, error, fetchPrograms };
}

// ── Course details (Read More) ────────────────────────────────────────────────

export function useCourseDetails() {
  const [details, setDetails] = useState<Record<string, CourseDetails>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});

  const fetchDetails = useCallback(
    async (courseId: string, courseTitle: string, universityName: string) => {
      // Already fetched — no refetch
      if (details[courseId]) return;

      setLoading((prev) => ({ ...prev, [courseId]: true }));
      setError((prev) => ({ ...prev, [courseId]: null }));

      try {
        const res = await fetch("/api/course-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, courseTitle, universityName }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setDetails((prev) => ({ ...prev, [courseId]: data }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          [courseId]:
            err instanceof Error ? err.message : "Failed to load details",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, [courseId]: false }));
      }
    },
    [details],
  );

  return { details, loading, error, fetchDetails };
}
