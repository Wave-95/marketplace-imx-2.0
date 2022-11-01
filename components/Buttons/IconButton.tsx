import React from 'react';
import cx from 'classnames';
import SecondaryButton from './SecondaryButton';

type Props = {
  icon: React.ReactNode;
  text?: string;
  handleClick?: (param: any) => void;
  className?: string;
};

const IconButton: React.FC<Props> = ({ icon, text, handleClick, className, ...props }) => {
  return (
    <SecondaryButton onClick={handleClick} className={cx('space-x-2', className)} {...props}>
      {icon}
      {text ? <span>{text}</span> : null}
    </SecondaryButton>
  );
};

export default IconButton;
