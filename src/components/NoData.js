import React from 'react';

const NoData = () => {
  const active = localStorage.getItem('active');
  
  return (
    <section className="fade-in">
      <div className="flex flex-col items-center justify-center -m-16 h-screen font-custom font-semibold text-light-purple-800 text-center">
        <div className="text-5xl">404</div>
        <div className="text-lg uppercase">No data found for {active}</div>
      </div>      
    </section>
  )
}

export default NoData;