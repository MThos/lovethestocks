import React from 'react';

const Error = () => {  
  return (
    <section className="fade-in">
      <div className="flex flex-col items-center justify-center -mt-16 h-screen font-custom font-semibold text-light-purple-800 text-center">
        <div className="text-5xl">404</div>
        <div className="text-lg uppercase">That page cannot be found</div>
      </div>      
    </section>
  )
}

export default Error;