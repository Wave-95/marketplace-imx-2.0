import { base_path } from '@/constants/configs';
import { formatAddressEllipse } from '@/helpers/formatters';
import { useRouter } from 'next/router';
import { Copy, Link, MoreHorizontal } from 'react-feather';
import { toast } from 'react-toastify';

type UserHeaderProps = {
  address: string;
};

const UserHeader: React.FC<UserHeaderProps> = ({ address }) => {
  const router = useRouter();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied.');
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${base_path}${router.asPath}`);
    toast.success('User link copied.');
  };

  return (
    <div className="px-4 lg:px-6 flex flex-col justify-center items-start min-h-[300px] space-y-4">
      <h1 className="font-semibold text-2xl">{formatAddressEllipse(address, 6)}</h1>
      <div className="flex space-x-4">
        <button className="btn-secondary p-2 flex items-center space-x-2" onClick={handleCopyAddress}>
          <Copy size={20} />
          <span>Copy Address</span>
        </button>
        <button className="btn-secondary p-2" aria-label="user-link" onClick={handleCopyLink}>
          <Link size={20} />
        </button>
        <button className="btn-secondary p-2">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default UserHeader;
