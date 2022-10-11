import React from 'react';
import cx from 'classnames';

type Props = {
  icon: React.ReactNode;
  text: string;
  handleClick?: () => void;
  className?: string;
};

const IconButton: React.FC<Props> = ({ icon, text, handleClick, className, ...props }) => {
  return (
    <button onClick={handleClick} className={cx('btn-secondary flex space-x-2 items-center justify-start', className)} {...props}>
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default IconButton;
