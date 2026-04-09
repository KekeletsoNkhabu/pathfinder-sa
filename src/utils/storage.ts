import { SavedData, StudentProfile, CareerMatch } from '@/types';

const STORAGE_KEY = 'pathfinder-sa-data';

export const defaultSavedData: SavedData = {
  profile: null,
  savedCareers: [],
  savedUniversities: [],
  compareList: [],
  lastUpdated: new Date().toISOString(),
};

export const loadSavedData = (): SavedData => {
  if (typeof window === 'undefined') return defaultSavedData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSavedData;
    return JSON.parse(raw) as SavedData;
  } catch {
    return defaultSavedData;
  }
};

export const saveData = (data: Partial<SavedData>): void => {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadSavedData();
    const updated: SavedData = {
      ...existing,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

export const saveProfile = (profile: StudentProfile): void => {
  saveData({ profile });
};

export const toggleSavedCareer = (careerId: string): string[] => {
  const data = loadSavedData();
  const savedCareers = data.savedCareers.includes(careerId)
    ? data.savedCareers.filter(id => id !== careerId)
    : [...data.savedCareers, careerId];
  saveData({ savedCareers });
  return savedCareers;
};

export const toggleSavedUniversity = (universityId: string): string[] => {
  const data = loadSavedData();
  const savedUniversities = data.savedUniversities.includes(universityId)
    ? data.savedUniversities.filter(id => id !== universityId)
    : [...data.savedUniversities, universityId];
  saveData({ savedUniversities });
  return savedUniversities;
};

export const toggleCompareList = (universityId: string): string[] => {
  const data = loadSavedData();
  let compareList: string[];
  if (data.compareList.includes(universityId)) {
    compareList = data.compareList.filter(id => id !== universityId);
  } else if (data.compareList.length < 3) {
    compareList = [...data.compareList, universityId];
  } else {
    compareList = [...data.compareList.slice(1), universityId];
  }
  saveData({ compareList });
  return compareList;
};

export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
