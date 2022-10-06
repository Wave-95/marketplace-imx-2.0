import { useRouter } from 'next/router';
import React from 'react';
import { ArrowLeft } from 'react-feather';

type BackProps = {
  referer?: string;
  className?: string;
};

const Back: React.FC<BackProps> = ({ referer, ...props }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(referer || '/');
  };

  return (
    <div {...props}>
      <button
        className="inline-flex items-center font-medium will-change-transform btn-secondary active:scale-[0.98] text-base justify-center rounded-lg p-2 pr-3"
        onClick={handleClick}
      >
        <div className="flex items-center space-x-2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </div>
      </button>
    </div>
  );
};

export default Back;
