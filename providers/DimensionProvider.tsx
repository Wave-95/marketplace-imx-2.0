import { useIsomorphicLayoutEffect } from 'hooks';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

interface State {
  availHeight: string;
  availWidth: string;
}

type Action = {
  type: 'update_dimension';
  payload?: any;
};

type Dispatch = (action: Action) => void;

export type DimensionContextType = {
  state: State;
  dispatch: Dispatch;
};

const INITIAL_STATE = {
  availHeight: '0',
  availWidth: '0',
};

const dimensionReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'update_dimension':
      return { ...state, ...action.payload };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const DimensionContext = createContext<DimensionContextType | null>(null);

export const DimensionProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(dimensionReducer, INITIAL_STATE);

  const handleResize = () => {
    const availHeight = window.innerHeight.toString();
    const availWidth = window.innerWidth.toString();
    dispatch({ type: 'update_dimension', payload: { availHeight, availWidth } });
  };

  useIsomorphicLayoutEffect(() => {
    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const value = { state, dispatch };
  return (
    <DimensionContext.Provider value={value}>
      {children}
      <style global jsx>{`
        div#__next {
          height: ${state.availHeight}px;
        }
      `}</style>
    </DimensionContext.Provider>
  );
};

export const useDimension = () => {
  return useContext(DimensionContext);
};
