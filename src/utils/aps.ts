import { Subject, StudentProfile, Career, CareerMatch } from "@/types";
import { CAREERS } from "@/data/careers";

export function markToAPS(mark: number): number {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 1;
}

export function buildSubjects(entries: { name: string; mark: string }[]): Subject[] {
  return entries
    .filter((e) => e.name && e.mark && !isNaN(Number(e.mark)))
    .map((e) => {
      const mark = Math.min(100, Math.max(0, Number(e.mark)));
      return { name: e.name, mark, apsPoints: markToAPS(mark) };
    });
}

export function calculateTotalAPS(subjects: Subject[]): number {
  const sorted = [...subjects].sort((a, b) => b.apsPoints - a.apsPoints);
  return sorted.slice(0, 6).reduce((sum, s) => sum + s.apsPoints, 0);
}

export function matchCareer(career: Career, profile: StudentProfile): CareerMatch {
  const apsOk = profile.totalAPS >= career.minAPS;
  const apsRatio = Math.min(profile.totalAPS / Math.max(career.minAPS, 1), 1);

  let subjectsMet = 0;
  const missing: string[] = [];
  for (const req of career.requiredSubjects) {
    const found = profile.subjects.find(
      (s) => s.name.toLowerCase().includes(req.subject.toLowerCase())
    );
    if (found && found.mark >= req.minimumMark) {
      subjectsMet++;
    } else {
      missing.push(`${req.subject} ≥${req.minimumMark}%`);
    }
  }

  const subjectRatio =
    career.requiredSubjects.length > 0
      ? subjectsMet / career.requiredSubjects.length
      : 1;

  const matchPercentage = Math.round(apsRatio * 60 + subjectRatio * 40);

  let matchType: CareerMatch["matchType"] = "stretch";
  if (matchPercentage >= 90 && missing.length === 0) matchType = "perfect";
  else if (matchPercentage >= 75) matchType = "strong";
  else if (matchPercentage >= 55) matchType = "possible";

  return { career, matchPercentage, matchType, missingRequirements: missing };
}

export function getCareerMatches(profile: StudentProfile): CareerMatch[] {
  return CAREERS.map((c) => matchCareer(c, profile)).sort(
    (a, b) => b.matchPercentage - a.matchPercentage
  );
}

export function getAdmissionLikelihood(
  studentAPS: number,
  minAPS: number
): "very-likely" | "likely" | "borderline" | "unlikely" {
  const diff = studentAPS - minAPS;
  if (diff >= 6) return "very-likely";
  if (diff >= 2) return "likely";
  if (diff >= -2) return "borderline";
  return "unlikely";
}

export function getImprovementSuggestions(profile: StudentProfile) {
  const suggestions: {
    subject: string;
    currentMark: number;
    targetMark: number;
    careersUnlocked: string[];
  }[] = [];

  for (const subject of profile.subjects) {
    const thresholds = [50, 60, 70, 80];
    for (const target of thresholds) {
      if (subject.mark < target) {
        const hypothetical: Subject[] = profile.subjects.map((s) =>
          s.name === subject.name
            ? { ...s, mark: target, apsPoints: markToAPS(target) }
            : s
        );
        const newAPS = calculateTotalAPS(hypothetical);
        const newProfile = { ...profile, subjects: hypothetical, totalAPS: newAPS };
        const unlocked = CAREERS.filter((c) => {
          const wasBlocked = matchCareer(c, profile).matchType === "stretch";
          const nowOk = matchCareer(c, newProfile).matchType !== "stretch";
          return wasBlocked && nowOk;
        }).map((c) => c.title);

        if (unlocked.length > 0) {
          suggestions.push({
            subject: subject.name,
            currentMark: subject.mark,
            targetMark: target,
            careersUnlocked: unlocked,
          });
          break;
        }
      }
    }
  }
  return suggestions.slice(0, 4);
}
