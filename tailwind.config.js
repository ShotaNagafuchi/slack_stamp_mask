/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Slack color palette
        'slack-primary': '#4A154B',
        'slack-primary-hover': '#3A0F3A',
        'slack-surface': '#F8F9FA',
        'slack-border': '#DDDDDD',
        'slack-text-primary': '#1D1C1D',
        'slack-text-secondary': '#616061',
        'slack-text-tertiary': '#9E9EA0',
        'slack-success': '#007C5E',
        'slack-error': '#E01E5A',
        'slack-warning': '#ECB22E',
      },
      spacing: {
        'slack-sm': '0.25rem',
        'slack-md': '0.5rem',
        'slack-lg': '1rem',
        'slack-xl': '1.5rem',
        'slack-2xl': '2rem',
      },
      borderRadius: {
        'slack': '0.25rem',
        'slack-lg': '0.5rem',
      },
      boxShadow: {
        'slack': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'slack-md': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}