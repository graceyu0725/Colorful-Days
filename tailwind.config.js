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
        weeklyHeader: '80px repeat(7, 1fr) 14px',
        weeklyTimeTable: '80px repeat(7, 1fr)',
      },
      gridTemplateRows: {
        weeklyHeader: '1fr 1fr 3fr',
        weeklyTimeTable: 'repeat(48, 48px)',
        weeklyOneDayEvents: 'repeat(96, 24px)',
      },
      colors: {
        'theme-1': {
          100: '#b86b434D',
          200: '#b86b4380',
          300: '#b86b43',
        },
        'theme-2': {
          100: '#ec8f3f4D',
          200: '#ec8f3f80',
          300: '#ec8f3f',
        },
        'theme-3': {
          100: '#fec37d4D',
          200: '#fec37d80',
          300: '#fec37d',
        },
        'theme-4': {
          100: '#7982334D',
          200: '#79823380',
          300: '#798233',
        },
        'theme-5': {
          100: '#586d804D',
          200: '#586d8080',
          300: '#586d80',
        },
        'theme-6': {
          100: '#82898d4D',
          200: '#82898d80',
          300: '#82898d',
        },
        'theme-7': {
          100: '#8d6b614D',
          200: '#8d6b6180',
          300: '#8d6b61',
        },
        'theme-8': {
          100: '#aa7d534D',
          200: '#aa7d5380',
          300: '#aa7d53',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
