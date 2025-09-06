// src/theme.js
export const theme = {
  colors: {
    primary: '#4F46E5', // A nice modern blue/purple, adjust to match Figma
    primaryHover: '#4338CA',
    background: '#F9FAFB', // Light grey background
    cardBackground: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7281',
    border: '#E5E7EB',
  },
  fonts: {
    family: "'Inter', sans-serif", // Make sure to import this font
    size: {
      small: '14px',
      medium: '16px',
      large: '24px',
      xlarge: '36px',
    },
    weight: {
      regular: 400,
      bold: 700,
    }
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
};