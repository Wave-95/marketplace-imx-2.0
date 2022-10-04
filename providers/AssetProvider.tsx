import { Asset } from '@imtbl/core-sdk';
import { createContext, useContext, useReducer } from 'react';

export type AssetState = {
  asset: Asset;
};

type Action = {
  type: 'set_asset' | 'clear_asset';

  payload?: any;
};

type Dispatch = (action: Action) => void;

export type AssetContextType = {
  state: AssetState;
  dispatch: Dispatch;
};

const INITIAL_STATE = {
  asset: {} as Asset,
};

const assetReducer = (state: AssetState, action: Action) => {
  switch (action.type) {
    case 'set_asset':
      return { ...state, asset: action.payload };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const AssetContext = createContext<AssetContextType | null>(null);

export const AssetProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(assetReducer, INITIAL_STATE);

  const value = { state, dispatch };
  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};

export const useAsset = () => {
  return useContext(AssetContext);
};
