import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import GlobalTheme from './components/GlobalTheme';
import Header from './components/Header';
import Details from './components/Details';
import Test from './components/Test';
import Error from './components/Error';

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
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Details />} />
            <Route path="/details" element={<Details />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>    
  );
}

export default App;