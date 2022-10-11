import React from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';
import { ArrowLeft } from 'react-feather';

type Props = {
  referer?: string;
  className?: string;
};

const Back: React.FC<Props> = ({ referer, className, ...props }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(referer || '/');
  };

  return (
    <button
      className={cx(
        'inline-flex items-center font-medium will-change-transform btn-secondary active:scale-[0.98] text-base justify-center rounded-lg p-2 pr-3',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <ArrowLeft size={20} />
        <span>{'Back'}</span>
      </div>
    </button>
  );
};

export default Back;
