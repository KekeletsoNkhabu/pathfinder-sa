import { Subject, StudentProfile, CareerMatch, Career } from '@/types';
import { CAREERS } from '@/data/careers';
import { normaliseSubjectName } from '@/data/subjects';

// ─── APS Conversion ───────────────────────────────────────────────────────────

export const markToAPS = (mark: number): number => {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 1;
};

export const apsToLabel = (aps: number): string => {
  if (aps >= 7) return 'Outstanding';
  if (aps >= 6) return 'Meritorious';
  if (aps >= 5) return 'Substantial';
  if (aps >= 4) return 'Adequate';
  if (aps >= 3) return 'Moderate';
  if (aps >= 2) return 'Elementary';
  return 'Not Achieved';
};

export const apsToColor = (aps: number): string => {
  if (aps >= 7) return '#CAFF00';
  if (aps >= 6) return '#86efac';
  if (aps >= 5) return '#6ee7b7';
  if (aps >= 4) return '#fbbf24';
  if (aps >= 3) return '#fb923c';
  if (aps >= 2) return '#f87171';
  return '#ef4444';
};

// ─── Total APS Calculation ────────────────────────────────────────────────────
// NSC APS: Add up best 6 subjects (excluding Life Orientation which counts 0 or as a bonus)

export const calculateTotalAPS = (subjects: Subject[]): number => {
  const points = subjects.map(s => s.apsPoints).sort((a, b) => b - a);
  // Take top 6 subjects
  const top6 = points.slice(0, 6);
  return top6.reduce((sum, p) => sum + p, 0);
};

export const buildSubjects = (inputs: { name: string; mark: string }[]): Subject[] => {
  return inputs
    .filter(i => i.name && i.mark && !isNaN(Number(i.mark)))
    .map(i => {
      const mark = Math.min(100, Math.max(0, Number(i.mark)));
      return {
        name: i.name,
        mark,
        apsPoints: markToAPS(mark),
      };
    });
};

// ─── Career Matching ──────────────────────────────────────────────────────────

const getSubjectMark = (subjects: Subject[], subjectName: string): number | null => {
  const normalised = normaliseSubjectName(subjectName);
  const subject = subjects.find(s => {
    const sNorm = normaliseSubjectName(s.name);
    return sNorm.toLowerCase() === normalised.toLowerCase() ||
      s.name.toLowerCase().includes(subjectName.toLowerCase()) ||
      subjectName.toLowerCase().includes(s.name.toLowerCase());
  });
  return subject ? subject.mark : null;
};

export const matchCareer = (career: Career, profile: StudentProfile): CareerMatch => {
  const { totalAPS, subjects } = profile;
  const missingRequirements: string[] = [];

  // Check subject requirements
  let subjectScore = 0;
  let totalRequirements = career.requiredSubjects.length;

  for (const req of career.requiredSubjects) {
    const mark = getSubjectMark(subjects, req.subject);
    if (mark === null) {
      missingRequirements.push(`${req.subject} not found`);
    } else if (mark < req.minimumMark) {
      missingRequirements.push(`${req.subject}: need ${req.minimumMark}%, have ${mark}%`);
    } else {
      subjectScore++;
    }
  }

  const meetsAPSRequirement = totalAPS >= career.minAPS;
  const subjectPercentage = totalRequirements > 0 ? (subjectScore / totalRequirements) * 100 : 100;

  // APS match factor (0–100)
  let apsMatchFactor = 0;
  if (totalAPS >= career.minAPS) {
    const rangeSize = career.maxAPS - career.minAPS;
    const positionInRange = Math.min(totalAPS - career.minAPS, rangeSize);
    apsMatchFactor = rangeSize > 0 ? (positionInRange / rangeSize) * 100 : 100;
  } else {
    // How close are they?
    const deficit = career.minAPS - totalAPS;
    apsMatchFactor = Math.max(0, 100 - deficit * 10);
  }

  // Combined match percentage
  const matchPercentage = Math.round(
    (subjectPercentage * 0.6 + apsMatchFactor * 0.4)
  );

  // Determine match type
  let matchType: CareerMatch['matchType'];
  if (meetsAPSRequirement && missingRequirements.length === 0) {
    matchType = matchPercentage >= 70 ? 'strong' : 'possible';
  } else if (totalAPS >= career.minAPS - 3 && missingRequirements.length <= 1) {
    matchType = 'possible';
  } else {
    matchType = 'reach';
  }

  return { career, matchType, matchPercentage, missingRequirements, meetsAPSRequirement };
};

export const getCareerMatches = (profile: StudentProfile): CareerMatch[] => {
  return CAREERS
    .map(career => matchCareer(career, profile))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
};

// ─── "Can I Get In?" ──────────────────────────────────────────────────────────

export type AdmissionLikelihood = 'Likely' | 'Borderline' | 'Unlikely';

export const getAdmissionLikelihood = (
  studentAPS: number,
  requiredAPS: number
): AdmissionLikelihood => {
  if (studentAPS >= requiredAPS + 2) return 'Likely';
  if (studentAPS >= requiredAPS - 2) return 'Borderline';
  return 'Unlikely';
};

// ─── NSFAS Eligibility ────────────────────────────────────────────────────────

export const getNSFASEligibilityNote = (): string =>
  'NSFAS eligibility is based on household income below R350,000/year. Apply at nsfas.org.za.';

// ─── Improvement Suggestions ──────────────────────────────────────────────────

export interface ImprovementSuggestion {
  subject: string;
  currentMark: number;
  targetMark: number;
  newAPS: number;
  careersUnlocked: string[];
}

export const getImprovementSuggestions = (
  profile: StudentProfile
): ImprovementSuggestion[] => {
  const suggestions: ImprovementSuggestion[] = [];
  const reachCareers = getCareerMatches(profile).filter(m => m.matchType === 'reach');

  for (const subject of profile.subjects) {
    const currentMark = subject.mark;
    const currentAPS = markToAPS(currentMark);

    // Find what next threshold unlocks
    const thresholds = [30, 40, 50, 60, 70, 80];
    const nextThreshold = thresholds.find(t => t > currentMark);
    if (!nextThreshold) continue;

    const newAPS = markToAPS(nextThreshold);
    if (newAPS <= currentAPS) continue;

    // Simulate improvement
    const improvedSubjects = profile.subjects.map(s =>
      s.name === subject.name
        ? { ...s, mark: nextThreshold, apsPoints: markToAPS(nextThreshold) }
        : s
    );
    const improvedProfile: StudentProfile = {
      ...profile,
      subjects: improvedSubjects,
      totalAPS: calculateTotalAPS(improvedSubjects),
    };

    const newMatches = getCareerMatches(improvedProfile);
    const careersUnlocked = newMatches
      .filter(m => m.matchType !== 'reach')
      .map(m => m.career.title)
      .filter(title => {
        const wasReach = reachCareers.some(r => r.career.title === title);
        return wasReach;
      });

    if (careersUnlocked.length > 0) {
      suggestions.push({
        subject: subject.name,
        currentMark,
        targetMark: nextThreshold,
        newAPS: improvedProfile.totalAPS,
        careersUnlocked,
      });
    }
  }

  return suggestions.slice(0, 3);
};
