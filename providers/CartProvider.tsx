import { Product } from '@prisma/client';
import { createContext, useContext, useEffect, useReducer } from 'react';

export type CartItemType = Product & { quantity: number };

export type CartState = {
  items: CartItemType[];
};

type Action = {
  type: 'set_cart' | 'clear_cart';
  payload?: any;
};

type Dispatch = (action: Action) => void;

export type CartContextType = {
  state: CartState;
  dispatch: Dispatch;
};

const INITIAL_STATE = { items: [] };

const cartReducer = (state: CartState, action: Action) => {
  switch (action.type) {
    case 'set_cart':
      localStorage.setItem('marketplace:CART_INFO', JSON.stringify(action.payload));
      return { ...state, items: action.payload };
    case 'clear_cart':
      return { ...state, ...INITIAL_STATE };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const CartContext = createContext<CartContextType>({ state: INITIAL_STATE, dispatch: () => null });

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  useEffect(() => {
    const cart = localStorage.getItem('marketplace:CART_INFO');
    if (cart) {
      const cartObj = JSON.parse(cart);
      dispatch({ type: 'set_cart', payload: cartObj });
    }
  }, []);

  const value = { state, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
