/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
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
        accent: {
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        'poppins': ['var(--font-poppins)', 'sans-serif'],
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'lato': ['var(--font-lato)', 'sans-serif'],
      },
      borderRadius: {
        'brand': '12px',
        'brand-lg': '16px',
        'brand-xl': '20px',
      },
      boxShadow: {
        'brand': '0 4px 20px rgba(242, 140, 40, 0.1)',
        'brand-hover': '0 8px 30px rgba(242, 140, 40, 0.2)',
        'brand-blue': '0 4px 20px rgba(43, 58, 103, 0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}

