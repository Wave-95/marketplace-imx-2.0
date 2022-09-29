import React from 'react';
import cx from 'classnames';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}
const Header: React.FC<HeaderProps> = ({ className, children }) => {
  return (
    <div className={cx('header border-b border-normal flex justify-between items-center', className)}>{children}</div>
  );
};

export default Header;
