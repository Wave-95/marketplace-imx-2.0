import { formatAddress } from '@/helpers/formatters';
import Link from 'next/link';
import cx from 'classnames';
import { isSameAddress } from '@/helpers/index';
import { useUser } from '@/providers/UserProvider';

type UserLinkProps = {
  user: string;
  accentOn?: boolean;
};
const UserLink: React.FC<UserLinkProps> = ({ user, accentOn = false, ...props }) => {
  const {
    state: { address },
  } = useUser();
  const isSame = isSameAddress(address, user);
  const text = isSame ? 'You' : formatAddress(user);
  return (
    <Link {...props} href={`/users/${user}`} passHref>
      <a
        className={cx('leading-normal truncate hover:text-accent text-base font-semibold text-primary decoration-1', {
          'text-accent': accentOn,
        })}
        target="_blank"
        rel="noreferrer"
      >
        {text}
      </a>
    </Link>
  );
};

export default UserLink;
