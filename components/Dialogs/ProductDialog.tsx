import Image from 'next/image';
import { Product } from '@prisma/client';
import Dialog from '.';
import PrimaryButton from '../Buttons/PrimaryButton';
import { useUser } from '@/providers/UserProvider';
import ConnectWallet from '../Buttons/ConnectWalletButton';

type Props = {
  product: Product;
  isOpen: boolean;
  closeDialog: () => void;
};

const ProductDialog: React.FC<Props> = ({ product, isOpen, closeDialog }) => {
  const { id, image, price, total_supply } = product;
  const {
    state: { address },
  } = useUser();

  const handlePurchase = () => {};

  const ProductImage = () => (
    <div className="space-y-2">
      <div className="relative min-h-[175px]">
        <Image src={image} quality={100} objectFit="contain" objectPosition="center" layout="fill" alt={`product-id-${id}`} />
      </div>
    </div>
  );

  const ProductDetails = () => {
    return (
      <div>
        <h2 className="mb-2 text-md font-semibold">{'Sale Details'}</h2>
        <div className="flex justify-between items-center">
          <span className="text-xs text-secondary">{'Price'}</span>
          <span className="text-sm text-primary">{price ? `${price} ETH` : 'Free'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-secondary">{'Quantity'}</span>
          <span className="text-sm">{'x 1'}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-secondary font-semibold">{'Total Cost'}</span>
          <span className="text-md font-semibold rounded-lg border border-normal px-2">{price ? `${price} ETH` : 'Free'}</span>
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
        <ProductImage />
        <ProductDetails />
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

export default ProductDialog;
