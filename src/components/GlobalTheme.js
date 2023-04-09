import { createTheme } from '@mui/material/styles';

const global_theme = createTheme({
  breakpoints: {
    values: {
      sm: 350,
      md: 768,
      lg: 976,
      xl: 1440,
    },
  },
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f94484',
    },
    text: {
      main: "#fff",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ffa726",
    },
    success: {
      main: "#66bb6a",
    },
    info: {
      main: "#29b6f6",
    },
    background: {
      default: '#18142f',
      paper: '#3d3477',
    },
  },
  typography: {
    "fontFamily": `"Ubuntu Mono", Helvetica, sans-serif`,
  }
});

export default global_theme;