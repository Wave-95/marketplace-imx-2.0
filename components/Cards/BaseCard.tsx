import React from 'react';
import cx from 'classnames';

type Props = {
  className?: string;
  children: React.ReactNode;
};

const BaseCard: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <div className={cx('bg-card-secondary-normal border border-card-secondary-normal rounded-2xl flex flex-col', className)} {...props}>
      {children}
    </div>
  );
};

export default BaseCard;
