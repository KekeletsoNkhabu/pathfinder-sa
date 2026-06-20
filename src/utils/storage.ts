import { StudentProfile } from "@/types";

const KEYS = {
  profile: "pf-profile",
  savedCareers: "pf-saved-careers",
  savedUniversities: "pf-saved-unis",
  compareList: "pf-compare",
};

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function saveProfile(profile: StudentProfile) {
  safe(
    () => localStorage.setItem(KEYS.profile, JSON.stringify(profile)),
    undefined,
  );
}

export function loadSavedData() {
  return {
    profile: safe(() => {
      const raw = localStorage.getItem(KEYS.profile);
      return raw ? (JSON.parse(raw) as StudentProfile) : null;
    }, null),
    savedCareers: safe(() => {
      const raw = localStorage.getItem(KEYS.savedCareers);
      return raw ? (JSON.parse(raw) as string[]) : [];
    }, [] as string[]),
    savedUniversities: safe(() => {
      const raw = localStorage.getItem(KEYS.savedUniversities);
      return raw ? (JSON.parse(raw) as string[]) : [];
    }, [] as string[]),
    compareList: safe(() => {
      const raw = localStorage.getItem(KEYS.compareList);
      return raw ? (JSON.parse(raw) as string[]) : [];
    }, [] as string[]),
  };
}

export function toggleSavedCareer(id: string): string[] {
  const data = loadSavedData();
  const next = data.savedCareers.includes(id)
    ? data.savedCareers.filter((c) => c !== id)
    : [...data.savedCareers, id];
  safe(
    () => localStorage.setItem(KEYS.savedCareers, JSON.stringify(next)),
    undefined,
  );
  return next;
}

export function toggleSavedUniversity(id: string): string[] {
  const data = loadSavedData();
  const next = data.savedUniversities.includes(id)
    ? data.savedUniversities.filter((u) => u !== id)
    : [...data.savedUniversities, id];
  safe(
    () => localStorage.setItem(KEYS.savedUniversities, JSON.stringify(next)),
    undefined,
  );
  return next;
}

export function toggleCompareList(id: string): string[] {
  const data = loadSavedData();
  const curr = data.compareList;
  let next: string[];
  if (curr.includes(id)) {
    next = curr.filter((u) => u !== id);
  } else if (curr.length < 3) {
    next = [...curr, id];
  } else {
    next = curr;
  }
  safe(
    () => localStorage.setItem(KEYS.compareList, JSON.stringify(next)),
    undefined,
  );
  return next;
}

export function clearAllData() {
  Object.values(KEYS).forEach((k) =>
    safe(() => localStorage.removeItem(k), undefined),
  );
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
}
