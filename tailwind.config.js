/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-', // Optional: Prevents conflicts with MUI classes
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Scans your React files
  theme: {
    extend: {
      colors: {
        primary: '#1565c0', // Matches your MUI blue[700]
        secondary: '#f44336', // Matches your MUI red[500]
        background: '#f4f6f8', // Matches your MUI background
      },
      fontFamily: {
        roboto: ['Roboto', 'Arial', 'sans-serif'], // Matches MUI typography
      },
    },
  },
  plugins: [],
};