/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    screens: {
      sm: '350px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'black': '#000',
      'white': '#fff',
      'yellow': {
        DEFAULT: '#F59E0B',
        50: '#FCE4BB',
        100: '#FBDCA8',
        200: '#FACD81',
        300: '#F8BD59',
        400: '#F7AE32',
        500: '#F59E0B',
        600: '#C07C08',
        700: '#8A5906',
        800: '#543603',
        900: '#1E1401',
        950: '#030200'
      },
      'green': {
        DEFAULT: '#66DDAA',
        50: '#FCFEFD',
        100: '#ECFBF4',
        200: '#CAF3E2',
        300: '#A9ECCF',
        400: '#87E4BD',
        500: '#66DDAA',
        600: '#38D391',
        700: '#26AC73',
        800: '#1C7F54',
        900: '#125136',
        950: '#0D3A26'
      },
      'red': {
        DEFAULT: '#FF0000',
        50: '#FFB8B8',
        100: '#FFA3A3',
        200: '#FF7A7A',
        300: '#FF5252',
        400: '#FF2929',
        500: '#FF0000',
        600: '#C70000',
        700: '#8F0000',
        800: '#570000',
        900: '#1F0000',
        950: '#030000'
      },
      'pink': {
        DEFAULT: '#F6CFFC',
        100: "#FDF5FE",
        200: "#FBECFE",
        300: "#FAE2FD",
        400: "#F8D9FD",
        500: "#F6CFFC",
        600: "#C5A6CA",
        700: "#947C97",
        800: "#625365",
        900: "#312932"
      },
      'purple': {
        DEFAULT: '#8B5CF6',
        50: '#B496F9',
        100: '#A783F8',
        200: '#8B5CF6',
        300: '#6527F3',
        400: '#4A0CD6',
        500: '#3709A1',
        600: '#25066C',
        700: '#130336',
      },
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      mono: ['Menlo', 'Consolas'],
      custom: ['Ubuntu Mono', 'Menlo', 'sans-serif']
    },
    extend: {
      
    },
  },
  plugins: [],
}
