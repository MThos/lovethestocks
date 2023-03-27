import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Header from './components/Header';
import Theme from './components/Theme';

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
    <ThemeProvider theme={Theme}>
      <div className="App bg-dark-purple-800">
        <Header />
      </div>
    </ThemeProvider>    
  );
}

export default App;