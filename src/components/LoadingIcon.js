import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingIcon = () => {
  return (
    <section>
      <div className="flex flex-col items-center justify-center -m-16 h-screen">
        <CircularProgress style={{ color: 'white' }} size={50} />
      </div>
    </section>
  )
}

export default LoadingIcon;