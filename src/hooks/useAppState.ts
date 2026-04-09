'use client';
import { useState, useEffect, useCallback } from 'react';
import { AppState, StudentProfile } from '@/types';
import { getCareerMatches } from '@/utils/aps';
import {
  loadSavedData,
  saveProfile,
  toggleSavedCareer,
  toggleSavedUniversity,
  toggleCompareList,
  clearAllData,
} from '@/utils/storage';

const initialState: AppState = {
  profile: null,
  careerMatches: [],
  savedCareers: [],
  savedUniversities: [],
  compareList: [],
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadSavedData();
    const careerMatches = saved.profile ? getCareerMatches(saved.profile) : [];
    setState({
      profile: saved.profile,
      careerMatches,
      savedCareers: saved.savedCareers,
      savedUniversities: saved.savedUniversities,
      compareList: saved.compareList,
    });
    setHydrated(true);
  }, []);

  const setProfile = useCallback((profile: StudentProfile) => {
    saveProfile(profile);
    const careerMatches = getCareerMatches(profile);
    setState(prev => ({ ...prev, profile, careerMatches }));
  }, []);

  const toggleCareer = useCallback((careerId: string) => {
    const savedCareers = toggleSavedCareer(careerId);
    setState(prev => ({ ...prev, savedCareers }));
  }, []);

  const toggleUniversity = useCallback((universityId: string) => {
    const savedUniversities = toggleSavedUniversity(universityId);
    setState(prev => ({ ...prev, savedUniversities }));
  }, []);

  const toggleCompare = useCallback((universityId: string) => {
    const compareList = toggleCompareList(universityId);
    setState(prev => ({ ...prev, compareList }));
  }, []);

  const resetAll = useCallback(() => {
    clearAllData();
    setState(initialState);
  }, []);

  return {
    ...state,
    hydrated,
    setProfile,
    toggleCareer,
    toggleUniversity,
    toggleCompare,
    resetAll,
  };
};
