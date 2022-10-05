import React from 'react';
import cx from 'classnames';
import BaseCard from './BaseCard';
import { toLocalTime } from '@/helpers/formatters';

interface EventCardProps {
  icon: React.ReactNode;
  title: string | React.ReactNode;
  timestamp: string;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ icon, title, timestamp, className, ...props }) => {
  return (
    <BaseCard className={cx('!flex-row items-center space-x-5 px-4 py-2 w-full min-h-[5rem]', className)} {...props}>
      {icon}
      <div className="space-y-1.5 w-full">
        <div className="text-sm">{title}</div>
        <div className="items-center space-x-1 text-xs text-secondary">
          <span>{toLocalTime(timestamp)}</span>
        </div>
      </div>
    </BaseCard>
  );
};

export default EventCard;
