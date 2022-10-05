import { formatAddressEllipse } from '@/helpers/formatters';
import Link from 'next/link';
import cx from 'classnames';

type UserLinkProps = {
  user: string;
  accentOn?: boolean;
};
const UserLink: React.FC<UserLinkProps> = ({ user, accentOn = false, ...props }) => {
  return (
    <Link {...props} href={`/users/${user}`} passHref>
      <a
        className={cx('leading-normal truncate hover:text-accent text-base font-semibold text-primary decoration-1', {
          'text-accent': accentOn,
        })}
        target="_blank"
        rel="noreferrer"
      >
        {formatAddressEllipse(user)}
      </a>
    </Link>
  );
};

export default UserLink;
