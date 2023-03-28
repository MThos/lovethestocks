import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import GlobalTheme from './components/GlobalTheme';
import Header from './components/Header';
import Details from './components/Details';

const App = () => {
  const [active, setActive] = useState('AAPL');

  useEffect(() => {
    try {
      if (localStorage.getItem('active') === null) {
        localStorage.setItem('active', active);
        setActive(localStorage.getItem('active'));
      };
    } catch (error) {
      console.log(error);
    }    
  }, [active]);

  return (
    <ThemeProvider theme={GlobalTheme}>
      <div className="App bg-dark-purple-800">
        <Header />
        <Details />
      </div>
    </ThemeProvider>    
  );
}

export default App;