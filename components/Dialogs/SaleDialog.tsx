import Image from 'next/image';
import { SaleDetailResponse } from 'pages/api/sale-details';
import Dialog from '.';
import { formatWeiToNumber } from '@/utils/formatters';
import PrimaryButton from '../Buttons/PrimaryButton';
import { useUser } from '@/providers/UserProvider';
import ConnectWallet from '../Buttons/ConnectWalletButton';

type Props = {
  saleDetail: SaleDetailResponse;
  isOpen: boolean;
  closeDialog: () => void;
};

const SaleDialog: React.FC<Props> = ({ saleDetail, isOpen, closeDialog }) => {
  const { id, metadata, price, total_supply } = saleDetail;
  const {
    state: { address },
  } = useUser();

  const handlePurchase = () => {};

  const ItemImage = () => (
    <div className="space-y-2">
      <div className="relative min-h-[175px]">
        <Image
          src={metadata.image}
          quality={100}
          objectFit="contain"
          objectPosition="center"
          layout="fill"
          alt={`metadata-id-${metadata.id}`}
        />
      </div>
    </div>
  );

  const ItemDetails = () => {
    const { id, created_at, updated_at, image, token_address, ...rest } = metadata;
    return (
      <div>
        <h2 className="mb-2 text-md font-semibold">{'Item Details'}</h2>
        <div className="grid gap-x-10 gap-y-1 grid-cols-1">
          {Object.entries(rest).map(([key, value], idx) => (
            <div className="flex justify-between items-center" key={`metadata-${idx}`}>
              <div className="text-secondary capitalize text-sm">{key}</div>
              <div className="capitalize text-sm">{value || 'n/a'}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SaleDetails = () => {
    return (
      <div>
        <h2 className="mb-2 text-md font-semibold">{'Sale Details'}</h2>
        <div className="flex justify-between items-center">
          <span className="text-xs text-secondary">{'Price'}</span>
          <span className="text-sm text-primary">{price ? `${formatWeiToNumber(price)} ETH` : 'Free'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-secondary">{'Quantity'}</span>
          <span className="text-sm">{'x 1'}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-secondary font-semibold">{'Total Cost'}</span>
          <span className="text-md font-semibold rounded-lg border border-normal px-2">
            {price ? `${formatWeiToNumber(price)} ETH` : 'Free'}
          </span>
        </div>
        {total_supply ? (
          <div className="flex justify-between items-center">
            <span className="text-xs text-secondary">{'Total Supply'}</span>
            <span className="text-sm">{total_supply}</span>
          </div>
        ) : null}
      </div>
    );
  };
  return (
    <Dialog title="Confirm Purchase" isOpen={isOpen} closeDialog={closeDialog}>
      <div className="space-y-6 p-4">
        <ItemImage />
        <ItemDetails />
        <SaleDetails />
        {address ? (
          <PrimaryButton className="w-full font-semibold !max-h-12 h-12" onClick={handlePurchase}>
            {'Confirm Purchase'}
          </PrimaryButton>
        ) : (
          <ConnectWallet className="w-full font-semibold !max-h-12 h-12" />
        )}
      </div>
    </Dialog>
  );
};

export default SaleDialog;
