import { formatCryptoPricesToState } from '@/helpers/formatters';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

interface State {
  [key: string]: number;
}

type Action = {
  type: 'update_price';
  payload?: any;
};

type Dispatch = (action: Action) => void;

export type PricesContextType = {
  state: State;
  dispatch: Dispatch;
};

const INITIAL_STATE = {};

const pricesReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'update_price':
      return { ...state, ...action.payload };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const PricesContext = createContext<PricesContextType | null>(null);

export const PricesProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(pricesReducer, INITIAL_STATE);

  const fetchAndSetPrices = async () => {
    const fetchEthPricePromise = fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy');
    try {
      const responses = await Promise.all([fetchEthPricePromise]);
      const dataPromises = responses.map((response) => response.json());
      const dataObjects = await Promise.all(dataPromises);
      const prices = dataObjects.map((obj) => obj.data);
      const pricesFormatted = formatCryptoPricesToState(prices);
      dispatch({ type: 'update_price', payload: pricesFormatted });
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    setInterval(fetchAndSetPrices, 1000 * 60);
  }, []);

  const value = { state, dispatch };
  return <PricesContext.Provider value={value}>{children}</PricesContext.Provider>;
};

export const usePrices = () => {
  return useContext(PricesContext);
};
