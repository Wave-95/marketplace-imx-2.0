import Link from 'next/link';
import React from 'react';
import { formatAddress } from '@/helpers/formatters';
import { useUser } from '../providers';
import { isSameAddress } from '../helpers';

type Props = {
  label: string;
  user?: string;
};

const ByUser: React.FC<Props> = ({ label, user, ...props }) => {
  const {
    state: { address },
  } = useUser();
  if (!user) {
    return null;
  }
  const isSame = isSameAddress(address, user);
  const text = isSame ? 'You' : formatAddress(user);

  return (
    <div {...props}>
      <div className="text-xs font-medium tracking-wider text-secondary">{label}</div>
      <span className="text-base font-medium leading-normal truncate">
        <Link href={`/users/${user}`}>
          <a className="hover:text-accent text-primary focusring decoration-1" target="_blank" rel="noreferrer">
            {text}
          </a>
        </Link>
      </span>
    </div>
  );
};

export default ByUser;
