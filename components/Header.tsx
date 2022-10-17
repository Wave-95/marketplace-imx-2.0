import React from 'react';
import cx from 'classnames';

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Header: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <div className={cx('h-[4rem] lg:h-[5rem] px-4 lg:px-6 bg-header flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
};

export default Header;
