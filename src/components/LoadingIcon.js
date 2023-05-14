import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingIcon = (props) => {
  return (
    <section>
      <div className="flex flex-col items-center justify-center ml-4 -mt-6 h-[calc(100vh-74px)]">
        <CircularProgress style={{ color: 'white' }} size={50} />
        <div className="text-white mt-4 capitalize">{props.message}</div>
      </div>
    </section>
  )
}

export default LoadingIcon;