import cx from 'classnames';
import React from 'react';

interface CenteredProps {
  className: string;
  children: React.ReactNode;
  direction?: 'row' | 'col';
}
const Centered: React.FC<CenteredProps> = ({ className, children, direction = 'row', ...props }) => {
  return (
    <div className={cx('flex justify-center items-center', className, `flex-${direction}`)} {...props}>
      {children}
    </div>
  );
};

export default Centered;
