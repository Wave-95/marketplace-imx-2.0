import React, { ReactNode, useEffect, useState } from 'react';
import cx from 'classnames';
import BaseCard from './BaseCard';
import Image from 'next/image';
import { Product } from '@prisma/client';
import PrimaryButton from '../Buttons/PrimaryButton';
import ProductDialog from '../Dialogs/ProductDialog';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import Countdown, { CountdownRenderProps } from 'react-countdown';
import Price from '../Price';
import SecondaryButton from '../Buttons/SecondaryButton';
import { isAddedToCart } from '@/utils/index';
import IconButton from '../Buttons/IconButton';
import { Trash, Trash2 } from 'react-feather';
import { useRouter } from 'next/router';
import { useCart } from '@/providers/CartProvider';
import { fromWei } from 'web3-utils';

type Props = {
  product: Product;
  className?: string;
  type: 'upcoming' | 'ongoing' | 'ended';
};

const ProductCard: React.FC<Props> = ({ product, className, type, ...props }) => {
  const {
    id,
    name,
    description,
    image,
    price,
    currency_token_address,
    sale_start_at,
    sale_end_at,
    total_supply,
    quantity_sold,
    treasury_address,
  } = product;
  const [addedToCart, setAddedToCart] = useState(false);
  const {
    state: { items: cartItems },
    dispatch,
  } = useCart();
  console.log(cartItems);
  const router = useRouter();

  useEffect(() => {
    if (!cartItems || !cartItems.length) {
      setAddedToCart(false);
    } else {
      const ids = cartItems.map(({ id }: { id: string }) => id);
      if (ids.includes(id)) {
        setAddedToCart(true);
      }
    }
  }, [cartItems]);

  const addProductToCart = (product: Product) => () => {
    let newCart;
    if (!cartItems.length) {
      newCart = [{ ...product, quantity: 1 }];
    } else {
      newCart = [{ ...product, quantity: 1 }, ...cartItems];
    }
    dispatch({ type: 'set_cart', payload: newCart });
    setAddedToCart(true);
  };

  const removeProductFromCart = (productId: string) => () => {
    if (!cartItems) {
      return;
    } else {
      const newCart = cartItems.filter(({ id }: { id: string }) => id !== productId);
      dispatch({ type: 'set_cart', payload: newCart });
      setAddedToCart(false);
    }
  };

  const goToCart = () => {
    router.push('/cart');
  };

  const goToProduct = (id: string) => () => {
    router.push(`/products/${id}`);
  };

  const Item = () => (
    <div className="p-4">
      <div className="relative min-h-[300px]">
        <Image src={image} quality={100} objectFit="contain" objectPosition="center" layout="fill" alt={`product-id-${id}`} />
      </div>
    </div>
  );

  const ProductDetails = () => {
    return (
      <div className="p-4 border-t border-card-secondary-normal">
        <div className="flex items-center justify-between py-4">
          <h4 className="font-semibold">{name}</h4>
          {price ? <Price amount={fromWei(price)} symbol="ETH" /> : null}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <PrimaryButton
              className="font-semibold w-full !max-h-12 !h-12"
              onClick={addedToCart ? goToCart : addProductToCart(product)}
              disabled={type !== 'ongoing'}
            >
              {addedToCart ? 'Go to cart' : 'Add to cart'}
            </PrimaryButton>
            {addedToCart ? <IconButton icon={<Trash2 />} className="!max-h-12 !h-12" handleClick={removeProductFromCart(id)} /> : null}
          </div>
          <SecondaryButton className="font-semibold w-full !max-h-12 !h-12" onClick={goToProduct(id)}>
            {'View details'}
          </SecondaryButton>
        </div>
      </div>
    );
  };

  return (
    <BaseCard className={className} {...props}>
      <div>
        <Item />
        <ProductDetails />
      </div>
    </BaseCard>
  );
};

export default ProductCard;
