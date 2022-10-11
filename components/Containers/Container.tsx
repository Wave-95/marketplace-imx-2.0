import cx from 'classnames';
import React from 'react';

type Props = {
  className: string;
  children: React.ReactNode;
};
const Container: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <div className={cx('mx-auto flex', className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
