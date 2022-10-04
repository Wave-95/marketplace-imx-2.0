import Link from 'next/link';
import React from 'react';
import { formatAddressEllipse } from '@/helpers/formatters';
import { useUser } from '../providers';
import { UserContextType } from '@/providers/UserProvider';

interface ByUserProps {
  label: string;
  user: string;
}

const ByUser: React.FC<ByUserProps> = ({ label, user, ...props }) => {
  const {
    state: { address },
  } = useUser() as UserContextType;
  const isSame = address?.toLowerCase() === user.toLowerCase();
  const text = isSame ? 'You' : formatAddressEllipse(user);

  return (
    <div {...props}>
      <div className="text-xs font-medium tracking-wider text-secondary">{label}</div>
      <div className="block">
        <div className="flex items-center max-w-full space-x-1">
          <span className="text-base font-medium leading-normal truncate">
            <Link href={`/users/${user}`}>
              <a className="hover:text-accent text-primary focusring decoration-1" target="_blank" rel="noreferrer">
                {text}
              </a>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ByUser;
