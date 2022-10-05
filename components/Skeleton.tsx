import React from 'react';
import cx from 'classnames';

type SkeletonProps = {
  className?: string;
};
const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return <div className={cx('animate-pulse bg-card-secondary-normal', className)}></div>;
};

export default Skeleton;
