import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { Deposit, WalletConnection, Withdrawal } from '@imtbl/core-sdk';
import { buildWalletSDK } from 'lib/imx';
import { FormattedBalances } from '@/helpers/formatters';
import { token_symbols } from '../constants';
import { ValueOf } from 'types';

type BalanceL1 = {
  [key in ValueOf<typeof token_symbols>]?: string;
};
type State = {
  connection: WalletConnection | null;
  address: string | null;
  isConnected: boolean;
  balances: { l1: BalanceL1; l2: FormattedBalances };
  deposits: Deposit[] | null;
  withdrawals: Withdrawal[] | null;
};

type Action = {
  type: 'connect' | 'disconnect' | 'set_address' | 'set_l1_balances' | 'set_l2_balances' | 'set_deposits' | 'set_withdrawals';
  payload?: any;
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
  balances: { l1: {}, l2: {} },
  deposits: null,
  withdrawals: null,
};

const userReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'connect':
      return { ...state, connection: action.payload, isConnected: true };
    case 'disconnect':
      return { ...state, ...INITIAL_STATE };
    case 'set_address':
      return { ...state, address: action.payload };
    case 'set_l1_balances':
      return { ...state, balances: { ...state.balances, l1: action.payload } };
    case 'set_l2_balances':
      return { ...state, balances: { ...state.balances, l2: action.payload } };
    case 'set_deposits':
      return { ...state, deposits: action.payload };
    case 'set_withdrawals':
      return { ...state, withdrawals: action.payload };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const UserContext = createContext<UserContextType>({ state: INITIAL_STATE, dispatch: () => null });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);

  const silentConnect = async () => {
    const walletSDK = await buildWalletSDK();
    const walletConnection = await walletSDK.getWalletConnection();
    if (walletConnection) {
      const walletConnectionNew: WalletConnection = {
        ethSigner: walletConnection.l1Signer,
        starkSigner: walletConnection.l2Signer,
      };
      const address = await walletConnectionNew?.ethSigner?.getAddress();
      dispatch({ type: 'connect', payload: walletConnectionNew });
      dispatch({ type: 'set_address', payload: address });
    }
  };

  //Builds wallet SDK on mount and checks for existing wallet connection
  useEffect(() => {
    silentConnect();
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
