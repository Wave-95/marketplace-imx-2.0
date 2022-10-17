import React from 'react';
import cx from 'classnames';
import TertiaryButton from '../Buttons/TertiaryButton';

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: (param: any) => void;
  icon?: React.ReactNode;
};

const MenuItem: React.FC<Props> = ({ children, onClick, icon, className, ...props }) => {
  return (
    <TertiaryButton
      className={cx('text-base h-10 rounded-lg !justify-start px-2 space-x-4 flex-1 w-full', className)}
      onClick={onClick}
      {...props}
    >
      {icon}
      {children}
    </TertiaryButton>
  );
};

export default MenuItem;
