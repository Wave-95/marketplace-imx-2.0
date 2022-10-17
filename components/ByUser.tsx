import React from 'react';
import UserLink from './Links/UserLink';

type Props = {
  label: string;
  user?: string;
};

const ByUser: React.FC<Props> = ({ label, user, ...props }) => {
  if (!user) {
    return null;
  }

  return (
    <div {...props}>
      <div className="text-xs font-medium text-secondary">{label}</div>
      <span className="text-base font-medium leading-normal truncate">
        <UserLink user={user} />
      </span>
    </div>
  );
};

export default ByUser;
