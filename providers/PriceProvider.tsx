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

export type PriceContextType = {
  state: State;
  dispatch: Dispatch;
};

const INITIAL_STATE = {};

const priceReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'update_price':
      return { ...state, ...action.payload };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const PriceContext = createContext<PriceContextType | null>(null);

export const PriceProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(priceReducer, INITIAL_STATE);

  const fetchPrices = async () => {
    const fetchEthPricePromise = fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy');
    const responses = await Promise.all([fetchEthPricePromise]);
    const dataPromises = responses.map((response) => response.json());
    const dataObjects = await Promise.all(dataPromises);
    const prices = dataObjects.map((obj) => obj.data);
    const pricesFormatted = formatCryptoPricesToState(prices);
    dispatch({ type: 'update_price', payload: pricesFormatted });
  };

  //Builds wallet SDK on mount and checks for existing wallet connection
  useEffect(() => {
    fetchPrices();
  }, []);

  const value = { state, dispatch };
  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>;
};

export const usePrice = () => {
  return useContext(PriceContext);
};
