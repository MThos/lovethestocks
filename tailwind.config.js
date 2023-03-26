/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'black': '#000',
      'white': '#fff',
      'purple': '#7b68ee',
      'dark-purple': {
        100: '#6e5dd6',
        200: '#6253be',
        300: '#5648a6',
        400: '#493e8e',
        500: '#3d3477',
        600: '#31295f',
        700: '#241f47',
        800: '#18142f'
      },
      'light-purple': {
        100: '#8877ef',
        200: '#9586f1',
        300: '#a295f3',
        400: '#afa4f4',
        500: '#bdb3f6',
        600: '#cac2f8',
        700: '#d7d1f9',
        800: '#e4e0fb'
      }
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      mono: ['Menlo', 'Consolas']
    },
    extend: {},
  },
  plugins: [],
}
