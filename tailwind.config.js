/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FEF5FB',
          100: '#FDEAF7',
          200: '#FCD6EF',
          300: '#FBB7E3',
          400: '#FA9AD7',
          500: '#FA82D1',
          600: '#F94BC0',
          700: '#F814AF',
          800: '#D7039A',
          900: '#A5027A',
          DEFAULT: '#FA82D1',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          DEFAULT: '#FA82D1',
        },
      },
      borderColor: {
        'custom': {
          light: '#FA82D1',
          DEFAULT: '#FA82D1',
          dark: '#FA82D1',
        },
      },
      // borderWidth: {
      //   'thin': '1px',
      //   DEFAULT: '2px',
      //   'thick': '3px',
      // },
    },
  },
  plugins: [],
  darkMode: 'class'
}

