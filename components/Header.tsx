import React from 'react';
import cx from 'classnames';

interface HeaderProps {
  className?: string;
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ className, children, ...props }) => {
  return (
    <div className={cx('app-header', className)} {...props}>
      {children}
    </div>
  );
};

export default Header;
