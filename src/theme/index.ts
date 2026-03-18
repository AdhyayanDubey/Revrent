// Colors and Theme Configuration
export const colors = {
  background: {
    light: '#FFFFFF',
    dark: '#121212',
    secondaryLight: '#F5F5F7',
    secondaryDark: '#1E1E1E',
  },
  text: {
    primaryLight: '#000000',
    primaryDark: '#FFFFFF',
    secondaryLight: '#666666',
    secondaryDark: '#A0A0A0',
  },
  primary: '#E63946',
  secondary: '#1D3557',
  accent: '#457B9D',
  success: '#2A9D8F',
  warning: '#E9C46A',
  error: '#E63946',
  border: {
    light: '#E0E0E0',
    dark: '#333333',
  },
  card: {
    light: '#FFFFFF',
    dark: '#1C1C1E',
  },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  round: 9999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
};
