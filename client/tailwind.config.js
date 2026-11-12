/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tharcon: {
          50: '#f0f7f6',
          100: '#d9ece9',
          500: '#007a68', // Tharcon Corporate Green
          600: '#006555',
          700: '#005144',
          800: '#004036',
          900: '#002922',
        },
        navy: {
          800: '#0f172a',
          900: '#020617',
        }
      }
    },
  },
  plugins: [],
}
