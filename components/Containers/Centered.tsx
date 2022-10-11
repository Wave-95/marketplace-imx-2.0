import cx from 'classnames';
import React from 'react';

type Props = {
  className?: string;
  children: React.ReactNode;
  direction?: 'row' | 'col';
};
const Centered: React.FC<Props> = ({ className, children, direction = 'row', ...props }) => {
  return (
    <div className={cx('flex justify-center items-center', className, `flex-${direction}`)} {...props}>
      {children}
    </div>
  );
};

export default Centered;
