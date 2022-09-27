import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { WalletConnection } from '@imtbl/core-sdk';
import { getWalletSDK } from '@/imx-helpers';

interface State {
  connection: WalletConnection | null;
  address: string | null;
  isConnected: boolean;
}

type Action = {
  type: 'connect' | 'disconnect' | 'set_address';
  payload: any;
};

type Dispatch = (action: Action) => void;

export type UserContextType = {
  state: State;
  dispatch: Dispatch;
};

const INITIAL_STATE = {
  connection: null,
  address: null,
  isConnected: false,
};

const userReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'connect':
      return { ...state, connection: action.payload, isConnected: true };
    case 'disconnect':
      return { ...state, isConnected: false };
    case 'set_address':
      return { ...state, address: action.payload };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);

  const silentConnect = async () => {
    const walletSDK = await getWalletSDK();
    const walletConnection = await walletSDK.getWalletConnection();
    if (walletConnection) {
      const address = await walletConnection?.l1Signer?.getAddress();
      dispatch({ type: 'connect', payload: walletConnection });
      dispatch({ type: 'set_address', payload: address });
    }
  };

  //Builds wallet SDK on mount and checks for existing wallet connection
  useEffect(() => {
    silentConnect();
  }, []);

  const value = { state, dispatch };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
