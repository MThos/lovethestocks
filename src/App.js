import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import GlobalTheme from './components/GlobalTheme';
import Header from './components/Header';
import News from './components/News';
import Details from './components/Details';
import Financials from './components/Financials';
import Analysis from './components/Analysis';
import Company from './components/Company';
import Indexes from './components/Indexes';
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
      <div className="App flex flex-col min-h-screen">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Indexes />} />
            <Route path="/indexes" element={<Indexes />} />
            <Route path="/news" element={<News />} />
            <Route path="/details" element={<Details />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/company" element={<Company />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>    
  );
}

export default App;