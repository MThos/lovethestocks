import { createTheme } from '@mui/material/styles';

const global_theme = createTheme({
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
    "fontFamily": `"Nanum Gothic Coding", Helvetica, sans-serif`,
  }
});

export default global_theme;