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
      fontFamily: {
        sans: ['openhuninn', 'ui-sans-serif', 'system-ui'],
        custom: ['Alkatra', 'sans-serif'],
      },
      textColor: {
        default: '#3F3A3A',
      },
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
          100: '#9879704D',
          200: '#98797080',
          300: '#987970',
        },
        'theme-2': {
          100: '#577BAD4D',
          200: '#577BAD80',
          300: '#577BAD',
        },
        'theme-3': {
          100: '#7584674D',
          200: '#75846780',
          300: '#758467',
        },
        'theme-4': {
          100: '#DD8A624D',
          200: '#DD8A6280',
          300: '#DD8A62',
        },
        'theme-5': {
          100: '#9D91A74D',
          200: '#9D91A780',
          300: '#9D91A7',
        },
        'theme-6': {
          100: '#8FBBC14D',
          200: '#8FBBC180',
          300: '#8FBBC1',
        },
        'theme-7': {
          100: '#E7B7524D',
          200: '#E7B75280',
          300: '#E7B752',
        },
        'theme-8': {
          100: '#D984814D',
          200: '#D9848180',
          300: '#D98481',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
