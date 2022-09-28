import React from 'react';
import cx from 'classnames';

interface BaseCardProps {
  className?: string;
  children: React.ReactNode;
}

const BaseCard: React.FC<BaseCardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cx(
        'bg-card-secondary-normal border border-card-secondary-normal rounded-card flex flex-col',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BaseCard;
