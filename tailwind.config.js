/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false, // keep class-based dark mode

  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        background: 'var(--color-bg)',
        foreground: 'var(--color-foreground)',
        header: 'var(--header-bg)',

        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },

        secondary: 'var(--color-secondary)',

        card: 'var(--color-card)',
        muted: 'var(--color-muted)',

        // Semantic colors (for real apps)
        success: {
          DEFAULT: '#16a34a',
          light: '#dcfce7',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        error: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
        },
        info: {
          DEFAULT: '#0ea5e9',
          light: '#e0f2fe',
        },
      },

      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04)',
        medium: '0 4px 12px rgba(0,0,0,0.06)',
        large: '0 10px 30px rgba(0,0,0,0.08)',
        glow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
      },

      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.8rem + 2.25vw, 3rem)',
        'fluid-5xl': 'clamp(3rem, 2.4rem + 3vw, 4rem)',
        'fluid-6xl': 'clamp(3.75rem, 3rem + 3.75vw, 5rem)',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      transitionDuration: {
        400: '400ms',
      },
    },
  },

  plugins: [],
}
