/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Slack Official Color Palette
        slack: {
          'primary': '#4A154B',      // Slack Purple
          'primary-hover': '#3c0e40',
          'secondary': '#ECF3E7',    // Light Green
          'accent': '#E01E5A',       // Slack Pink
          'accent-hover': '#c91b50',
          'success': '#007A5A',      // Success Green
          'warning': '#ECB22E',      // Warning Yellow
          'error': '#E01E5A',        // Error Red
          'background': '#FFFFFF',   // White Background
          'surface': '#F8F8F8',      // Light Gray Surface
          'border': '#E1E1E1',       // Border Gray
          'text-primary': '#1D1C1D', // Dark Text
          'text-secondary': '#616061', // Gray Text
          'text-tertiary': '#868686', // Light Gray Text
        }
      },
      fontFamily: {
        'slack': ['Lato', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
      },
      borderRadius: {
        'slack': '0.375rem', // 6px - Slack's standard border radius
        'slack-lg': '0.5rem', // 8px
        'slack-xl': '0.75rem', // 12px
      },
      boxShadow: {
        'slack': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'slack-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'slack-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        'slack-xs': '0.25rem',  // 4px
        'slack-sm': '0.5rem',   // 8px
        'slack-md': '0.75rem',  // 12px
        'slack-lg': '1rem',     // 16px
        'slack-xl': '1.5rem',   // 24px
        'slack-2xl': '2rem',    // 32px
      }
    },
  },
  plugins: [],
}