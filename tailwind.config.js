/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        weeklyHeader: '80px repeat(7, 1fr) 16px',
        weeklyTimeTable: '80px repeat(7, 1fr)',
      },
      gridTemplateRows: {
        weeklyHeader: '1fr 1fr 3fr',
        weeklyTimeTable: 'repeat(48, 48px)',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
