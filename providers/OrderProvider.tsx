import { Order } from '@imtbl/core-sdk';
import { createContext, useContext, useReducer } from 'react';

export type OrderState = {
  order: Order;
};

type Action = {
  type: 'set_order' | 'clear_order';

  payload?: any;
};

type Dispatch = (action: Action) => void;

export type OrderContextType = {
  state: OrderState;
  dispatch: Dispatch;
};

const INITIAL_STATE = {
  order: null,
};

const orderReducer = (state: OrderState, action: Action) => {
  switch (action.type) {
    case 'set_order':
      return { ...state, order: action.payload };
    case 'clear_order':
      return { ...state, ...INITIAL_STATE };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(orderReducer, INITIAL_STATE);

  const value = { state, dispatch };
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  return useContext(OrderContext);
};
