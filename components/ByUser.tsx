import Link from 'next/link';
import React from 'react';
import { formatAddressEllipse } from '@/helpers/formatters';

interface ByUserProps {
  text: string;
  user: string;
}

const ByUser: React.FC<ByUserProps> = ({ text, user, ...props }) => {
  return (
    <div {...props}>
      <div className="text-xs font-medium tracking-wider text-secondary">{text}</div>
      <div className="block">
        <div className="flex items-center max-w-full space-x-1">
          <span className="text-base font-medium leading-normal truncate">
            <Link href={`/users/${user}`}>
              <a className="hover:text-accent text-primary focusring decoration-1" target="_blank" rel="noreferrer">
                {formatAddressEllipse(user)}
              </a>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ByUser;
