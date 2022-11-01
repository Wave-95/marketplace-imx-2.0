import { useCart } from '@/providers/CartProvider';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart } from 'react-feather';
import Counter from '../Counter';
import SecondaryButton from './SecondaryButton';

const CartButton = () => {
  const {
    state: { items: cartItems },
  } = useCart();
  const [numItems, setNumItems] = useState<number>(0);

  useEffect(() => {
    const num = cartItems.reduce((prev, curr) => {
      return prev + curr.quantity;
    }, 0);
    setNumItems(num);
  }, [cartItems]);
  return (
    <Link href="/cart">
      <a>
        <SecondaryButton className="!px-2 !py-2 relative">
          <ShoppingCart size={20} />
          {numItems ? <Counter number={numItems} className="absolute -top-2 -right-2" /> : null}
        </SecondaryButton>
      </a>
    </Link>
  );
};

export default CartButton;
