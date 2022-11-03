import React from 'react';
import { Loader } from 'react-feather';

type Props = {
  size?: number;
};
const Loading: React.FC<Props> = ({ size }) => {
  return (
    <div className="flex items-center justify-center w-5 h-5 animate-spin">
      <Loader size={size} />
    </div>
  );
};

export default Loading;
