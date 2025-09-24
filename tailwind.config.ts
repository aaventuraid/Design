import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#F28C28',
          blue: '#2B3A67',
        },
        neutral: {
          dark: '#1E1E1E',
          gray: '#4A4A4A',
        },
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
