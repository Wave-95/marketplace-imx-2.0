import Dialog from '.';
import PrimaryButton from '../Buttons/PrimaryButton';
import { useUser } from '@/providers/UserProvider';
import LogInButton from '../Buttons/LogInButton';
import { useCart } from '@/providers/CartProvider';
import { fromWei, isAddress, toBN } from 'web3-utils';
import { formatWeiToNumber } from '@/utils/formatters';
import { createOrder } from 'lib/sdk';
import { useState } from 'react';
import cx from 'classnames';
import { CheckSquare, Loader } from 'react-feather';
import Centered from '../Containers/Centered';
import Loading from '../Loading';
import { client } from 'lib/imx';
import { toast } from 'react-toastify';
import { treasury_address } from '@/constants/configs';

type Props = {
  isOpen: boolean;
  closeDialog: () => void;
};

const CheckoutDialog: React.FC<Props> = ({ isOpen, closeDialog }) => {
  const {
    state: { items },
  } = useCart();
  const {
    state: { address, connection },
  } = useUser();
  const [checkoutStep, setCheckoutStep] = useState(0);

  const totalCost = items.reduce((prev, curr) => {
    const cost = curr.price ? toBN(curr.quantity).mul(toBN(curr.price)) : toBN(0);
    return prev.add(cost);
  }, toBN(0));

  const handlePurchase = async () => {
    if (!treasury_address || !isAddress(treasury_address)) {
      return toast.error('Issue with purchasing items due to configuration, please contact admin.');
    }

    if (!connection) {
      return toast.error('Please make sure your wallet is connected.');
    }

    const payload = { items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })) };
    setCheckoutStep(1);
    const order = await createOrder(payload);
    setCheckoutStep(2);

    const { status, transfer_id } = await client.transfer(connection, {
      receiver: treasury_address,
      type: 'ETH',
      amount: order.total_cost,
    });

    if (transfer_id) {
      setCheckoutStep(3);
      //TODO: Update order to show payment received, and kick off purchase event with order ID & payment ID
      //TODO: Clear cart
    }
  };

  const LineItem = ({ name, price, quantity, ...props }: { name: string; price: string | null; quantity: number }) => {
    const subtotal = price && toBN(price).mul(toBN(quantity));
    return (
      <div className="flex justify-between" {...props}>
        <span className="text-sm">{`${name} (${quantity}):`}</span>
        <span className="text-sm">{subtotal ? `${formatWeiToNumber(subtotal.toString())} ETH` : 'FREE'}</span>
      </div>
    );
  };

  const ProgressRow = ({ step, onStep, title, description }: { step: number; onStep: number; title: string; description: string }) => {
    return (
      <div className="flex space-x-4 items-center">
        <CheckSquare className={onStep > step ? 'text-accent' : 'text-secondary'} size={30} />
        <div>
          <div className="flex space-x-2">
            <h4 className={cx({ '!text-page': checkoutStep === step }, 'text-secondary font-bold')}>{title}</h4>
            {onStep === step ? <Loading /> : null}
          </div>
          <p className="text-sm text-tertiary">{description}</p>
        </div>
      </div>
    );
  };
  return (
    <Dialog title="Confirm Checkout" isOpen={isOpen} closeDialog={closeDialog}>
      <div className="space-y-6 p-4">
        {checkoutStep === 0 ? (
          <>
            <div>
              <h4 className="font-semibold mb-4">{'Order Summary'}</h4>
              <div>
                {items.map(({ name, price, quantity }, idx) => {
                  return <LineItem name={name} price={price} quantity={quantity} key={`line-item-${idx}`} />;
                })}
              </div>
              <div className="flex justify-between mt-4 border-t border-normal pt-2">
                <h4 className="font-semibold ">{'Order Total'}</h4>
                <span className="font-bold">{`${fromWei(totalCost.toString())} ETH`}</span>
              </div>
            </div>
            {address ? (
              <PrimaryButton className="w-full font-semibold !max-h-12 h-12" onClick={handlePurchase}>
                {'Place order'}
              </PrimaryButton>
            ) : (
              <LogInButton className="w-full font-semibold !max-h-12 h-12" />
            )}
          </>
        ) : (
          <div className="space-y-8">
            <ProgressRow onStep={checkoutStep} step={1} title="Preparing Order" description="Double checking a few things..." />
            <ProgressRow onStep={checkoutStep} step={2} title="Sending Payment" description="Confirm payment using your wallet provider." />
            <ProgressRow onStep={checkoutStep} step={3} title="Minting Asset(s)" description="Your asset(s) are being minted." />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default CheckoutDialog;
