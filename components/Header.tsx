import React from 'react';
import cx from 'classnames';

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Header: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <div className={cx('app-header', className)} {...props}>
      {children}
    </div>
  );
};

export default Header;
