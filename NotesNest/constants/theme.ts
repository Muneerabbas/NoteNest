export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#8E8E93',
    background: '#F2F2F7',
    tint: '#007AFF',
    icon: '#8E8E93',
    tabIconDefault: '#C7C7CC',
    tabIconSelected: '#007AFF',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    border: '#E5E5EA',
    borderDashed: '#B0D4F1',
    muted: '#AEAEB2',
    accent: '#007AFF',
    accentSoft: '#EBF5FF',
    accentLight: '#D6EBFF',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    white: '#FFFFFF',
    subjectPhysics: '#FF9500',
    subjectCS: '#5856D6',
    subjectMath: '#FF2D55',
    subjectBio: '#34C759',
    subjectArts: '#AF52DE',
    subjectEnglish: '#FF6482',
  },
  dark: {
    text: '#F2F2F7',
    textSecondary: '#8E8E93',
    background: '#000000',
    tint: '#0A84FF',
    icon: '#8E8E93',
    tabIconDefault: '#48484A',
    tabIconSelected: '#0A84FF',
    card: '#1C1C1E',
    cardElevated: '#2C2C2E',
    border: '#38383A',
    borderDashed: '#1E5A8A',
    muted: '#636366',
    accent: '#0A84FF',
    accentSoft: '#0A2540',
    accentLight: '#0D3A66',
    success: '#30D158',
    danger: '#FF453A',
    warning: '#FFD60A',
    white: '#FFFFFF',
    subjectPhysics: '#FFD60A',
    subjectCS: '#BF5AF2',
    subjectMath: '#FF6482',
    subjectBio: '#30D158',
    subjectArts: '#BF5AF2',
    subjectEnglish: '#FF6482',
  },
};

export const Fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const SUBJECTS = [
  { key: 'Physics', icon: 'sparkles', colorKey: 'subjectPhysics' },
  { key: 'CS', icon: 'laptopcomputer', colorKey: 'subjectCS' },
  { key: 'Math', icon: 'function', colorKey: 'subjectMath' },
  { key: 'Bio', icon: 'atom', colorKey: 'subjectBio' },
  { key: 'Arts', icon: 'paintbrush.fill', colorKey: 'subjectArts' },
  { key: 'English', icon: 'text.book.closed.fill', colorKey: 'subjectEnglish' },
] as const;

export const SEMESTERS = [
  'Sem 1',
  'Sem 2',
  'Sem 3',
  'Sem 4',
  'Sem 5',
  'Sem 6',
  'Sem 7',
  'Sem 8',
] as const;

/** Colors for semester cards on home (8 semesters) */
export const SEMESTER_COLORS = [
  '#007AFF',
  '#5856D6',
  '#FF9500',
  '#34C759',
  '#FF2D55',
  '#AF52DE',
  '#FF6482',
  '#00C7BE',
] as const;

export const FILE_TYPES = ['PDF', 'DOCX', 'JPG', 'PNG'] as const;
