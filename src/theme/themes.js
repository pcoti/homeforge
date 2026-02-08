export const darkTheme = {
  name: 'dark',
  bg: {
    primary: '#0a0f1a',
    secondary: '#111827',
    card: '#111827',
    cardHover: '#1f2937',
  },
  text: {
    primary: '#f9fafb',
    secondary: '#9ca3af',
    muted: '#6b7280',
  },
  border: {
    default: '#1f2937',
    strong: '#374151',
  },
  accent: '#f59e0b',
  accentHover: '#d97706',
}

export const lightTheme = {
  name: 'light',
  bg: {
    primary: '#f5f0eb',
    secondary: '#ede5db',
    card: '#ffffff',
    cardHover: '#f9fafb',
  },
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    muted: '#6b7280',
  },
  border: {
    default: '#e5e7eb',
    strong: '#d1d5db',
  },
  accent: '#b45309',
  accentHover: '#92400e',
}

export const themes = { dark: darkTheme, light: lightTheme }
