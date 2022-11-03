import PrimaryButton from '@/components/Buttons/PrimaryButton';
import QuarternaryButton from '@/components/Buttons/QuarternaryButton';
import SecondaryButton from '@/components/Buttons/SecondaryButton';
import Centered from '@/components/Containers/Centered';
import LayoutDefault from '@/components/LayoutDefault';
import Price from '@/components/Price';
import { useCart, CartItemType } from '@/providers/CartProvider';
import Image from 'next/image';
import { ChangeEventHandler } from 'react';
import { fromWei, toBN } from 'web3-utils';

const Cart = () => {
  const {
    state: { items: cartItems },
    dispatch,
  } = useCart();

  const clearAllItems = () => {
    dispatch({ type: 'clear_cart' });
  };

  const totalCost = cartItems.reduce((prev, curr) => {
    const cost = curr.price ? toBN(curr.quantity).mul(toBN(curr.price)) : toBN(0);
    return prev.add(cost);
  }, toBN(0));

  const CartItem = ({ cartItem }: { cartItem: CartItemType }) => {
    const options = [];
    for (let i = 1; i < 11; i++) {
      options.push(
        <option value={i} key={`qty-option-${i}`}>
          {i}
        </option>
      );
    }

    const handleQtyChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
      const newCartItems = cartItems.map((existingCartItem) => {
        if (existingCartItem.id !== cartItem.id) {
          return existingCartItem;
        } else {
          return { ...existingCartItem, quantity: parseInt(e.currentTarget.value, 10) };
        }
      });
      dispatch({ type: 'set_cart', payload: newCartItems });
    };

    const handleRemoveItem = () => {
      const newCartItems = cartItems.filter((existingCartItem) => {
        if (existingCartItem.id !== cartItem.id) {
          return existingCartItem;
        }
      });
      dispatch({ type: 'set_cart', payload: newCartItems });
    };

    const subtotal = cartItem.price && toBN(cartItem.price).mul(toBN(cartItem.quantity));

    return (
      <div className="p-4 flex border border-normal rounded-lg">
        <div className="relative min-h-[150px] min-w-[150px]">
          <Image
            src={cartItem.image}
            quality={100}
            objectFit="contain"
            objectPosition="center"
            layout="fill"
            alt={`product-id-${cartItem.id}`}
          />
        </div>
        <Centered className="grow ml-8 space-y-2 !items-start" direction="col">
          <div>
            <h4 className="font-semibold">{cartItem.name}</h4>
            <p className="text-accent text-sm">{'Available'}</p>
          </div>
          <div className="flex space-x-4">
            <div className="space-x-1">
              <span className="text-sm">{'Qty'}</span>
              <select
                className="text-page text-base bg-popover border-popover border px-3 py-1.5 rounded-lg hover:cursor-pointer min-w-[65px]"
                onChange={handleQtyChange}
                value={cartItem.quantity}
              >
                {options}
              </select>
            </div>
            <SecondaryButton className="!text-xs" onClick={handleRemoveItem}>
              {'Remove'}
            </SecondaryButton>
          </div>
        </Centered>
        {cartItem.price && subtotal ? (
          <Centered className="space-y-4 !items-end" direction="col">
            <Price amount={fromWei(cartItem.price)} symbol="ETH" />
            <div className="flex-col flex items-end">
              <span className="text-sm font-medium tracking-wider text-secondary">{`Subtotal (${cartItem.quantity} items)`}</span>
              <span>{`${fromWei(subtotal)} ETH`}</span>
            </div>
          </Centered>
        ) : null}
      </div>
    );
  };
  return (
    <div className="p-4 lg:p-6 flex space-x-4">
      <div className="bg-card-secondary-normal p-4 border border-normal rounded-lg grow">
        <h2 className="font-bold text-xl">{'Shopping Cart'}</h2>
        {cartItems.length ? (
          <>
            <QuarternaryButton className="h-8 text-sm font-medium !px-0 !py-0 mb-8" onClick={clearAllItems}>
              {'Remove all items'}
            </QuarternaryButton>
            {cartItems.map((cartItem, idx) => (
              <CartItem cartItem={cartItem} key={`cart-item-${idx}`} />
            ))}
          </>
        ) : (
          <div className="mt-8">
            <h4 className="font-semibold text-lg">{'Your Shopping Cart is empty.'}</h4>
            <p className="text-secondary">{'What are you waiting for? Go fill up that cart!'}</p>
          </div>
        )}
      </div>
      <div>
        <div className="bg-card-secondary-normal p-4 border border-normal rounded-lg space-y-4 min-w-[250px]">
          <div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{`${fromWei(totalCost)} ETH`}</span>
            </div>
          </div>
          <PrimaryButton className="w-full font-semibold !h-12 !max-h-12">{'Checkout'}</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

Cart.getLayout = (page: React.ReactNode) => {
  return <LayoutDefault>{page}</LayoutDefault>;
};

export default Cart;
