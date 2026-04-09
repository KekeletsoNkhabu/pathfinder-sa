export interface SubjectOption {
  name: string;
  group: 'Core' | 'Sciences' | 'Commerce' | 'Humanities' | 'Languages' | 'Technology';
  isLanguage?: boolean;
}

export const AVAILABLE_SUBJECTS: SubjectOption[] = [
  // Core / Languages
  { name: 'English Home Language', group: 'Languages', isLanguage: true },
  { name: 'English First Additional Language', group: 'Languages', isLanguage: true },
  { name: 'Afrikaans Home Language', group: 'Languages', isLanguage: true },
  { name: 'Afrikaans First Additional Language', group: 'Languages', isLanguage: true },
  { name: 'isiZulu Home Language', group: 'Languages', isLanguage: true },
  { name: 'isiXhosa Home Language', group: 'Languages', isLanguage: true },
  { name: 'Sesotho Home Language', group: 'Languages', isLanguage: true },
  { name: 'Sepedi Home Language', group: 'Languages', isLanguage: true },

  // Mathematics
  { name: 'Mathematics', group: 'Core' },
  { name: 'Mathematical Literacy', group: 'Core' },

  // Sciences
  { name: 'Physical Sciences', group: 'Sciences' },
  { name: 'Life Sciences', group: 'Sciences' },
  { name: 'Geography', group: 'Sciences' },
  { name: 'Agricultural Sciences', group: 'Sciences' },
  { name: 'Computer Applications Technology', group: 'Technology' },
  { name: 'Information Technology', group: 'Technology' },

  // Commerce
  { name: 'Accounting', group: 'Commerce' },
  { name: 'Business Studies', group: 'Commerce' },
  { name: 'Economics', group: 'Commerce' },

  // Humanities
  { name: 'History', group: 'Humanities' },
  { name: 'Religion Studies', group: 'Humanities' },
  { name: 'Visual Arts', group: 'Humanities' },
  { name: 'Music', group: 'Humanities' },
  { name: 'Dramatic Arts', group: 'Humanities' },
  { name: 'Consumer Studies', group: 'Humanities' },
  { name: 'Tourism', group: 'Humanities' },
];

// NSC requires a minimum of 7 subjects: 2 languages + LO + 4 electives
export const REQUIRED_SUBJECTS = [
  'English Home Language',
  'English First Additional Language',
  'Afrikaans Home Language',
];

// Normalise subject names for matching
export const normaliseSubjectName = (name: string): string => {
  const map: Record<string, string> = {
    'English Home Language': 'English',
    'English First Additional Language': 'English',
    'Afrikaans Home Language': 'Afrikaans',
    'Afrikaans First Additional Language': 'Afrikaans',
    'isiZulu Home Language': 'IsiZulu',
    'isiXhosa Home Language': 'IsiXhosa',
    'Sesotho Home Language': 'Sesotho',
    'Sepedi Home Language': 'Sepedi',
    'Physical Sciences': 'Physical Sciences',
    'Life Sciences': 'Life Sciences',
    'Computer Applications Technology': 'IT',
    'Information Technology': 'IT',
    'Mathematical Literacy': 'Mathematical Literacy',
  };
  return map[name] || name;
};

export const DEFAULT_SUBJECTS = [
  'English Home Language',
  'Afrikaans First Additional Language',
  'Mathematics',
  'Physical Sciences',
  'Life Sciences',
  'Accounting',
  'Business Studies',
];
