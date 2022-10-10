import cx from 'classnames';
import React from 'react';

interface ContainerProps {
  className: string;
  children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ className, children, ...props }) => {
  return (
    <div className={cx('mx-auto flex', className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
