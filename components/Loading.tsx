import React from 'react';
import { Loader } from 'react-feather';

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-5 h-5 animate-spin">
      <Loader />
    </div>
  );
};

export default Loading;
