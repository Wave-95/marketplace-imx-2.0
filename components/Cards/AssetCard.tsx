import React from 'react';
import cx from 'classnames';
import BaseCard from './BaseCard';

interface AssetCardProps {
  className?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ className, ...props }) => {
  return (
    <BaseCard
      className={cx(
        'hover:-translate-y-0.5 active:translate-y-0 hover:bg-card-secondary-hover active:bg-card-secondary-active',
        className
      )}
      {...props}
    >
      <div className="h-[200px]">Hello</div>
    </BaseCard>
  );
};

export default AssetCard;
