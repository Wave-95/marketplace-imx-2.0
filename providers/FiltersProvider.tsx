import { formatAvailableFilters, formatQueryToFilterState } from 'utils/formatters';
import { getAvailableFilters } from 'lib/imx';
import { CollectionFilter } from '@imtbl/core-sdk';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { order_by_mapping } from '../constants';
import { removeStringFromArray } from '@/utils';

export type FilterValues = string[];

export type FilterOption = {
  key?: string;
  values: FilterValues;
};

export type Available = Array<FilterOption>;

export type SelectedFilters = {
  [key: string]: FilterValues;
};

export type OrderByKey = keyof typeof order_by_mapping;

export type FilterState = {
  available: FilterOption[];
  selected: SelectedFilters;
  orderByKey: OrderByKey;
};

type Action = {
  type:
    | 'set_available_filters'
    | 'set_initial_selected_filters'
    | 'set_order_by_key'
    | 'select_filter'
    | 'deselect_filter'
    | 'clear_selected_filters';
  payload?: any;
};

type Dispatch = (action: Action) => void;

export type FiltersContextType = {
  state: FilterState;
  dispatch: Dispatch;
};

const INITIAL_STATE = {
  available: [] as FilterOption[],
  selected: {} as SelectedFilters,
  orderByKey: 'newestListing' as OrderByKey,
};

const filtersReducer = (state: FilterState, action: Action) => {
  switch (action.type) {
    case 'set_available_filters':
      return { ...state, available: action.payload };

    case 'set_initial_selected_filters':
      return { ...state, selected: action.payload };

    case 'set_order_by_key':
      return { ...state, orderByKey: action.payload };

    case 'select_filter': {
      const { label, value } = action.payload;
      if (Array.isArray(state.selected[label])) {
        const newValues = new Array(...state.selected[label]);
        !newValues.includes(value) && newValues.push(value);
        return { ...state, selected: { ...state.selected, [label]: newValues } };
      } else {
        return { ...state, selected: { ...state.selected, [label]: [value] } };
      }
    }

    case 'deselect_filter': {
      const { label, value } = action.payload;
      if (Array.isArray(state.selected[label])) {
        const newValues = new Array(...state.selected[label]);
        if (newValues.includes(value)) {
          removeStringFromArray(newValues, value);
        }
        return { ...state, selected: { ...state.selected, [label]: newValues } };
      }
    }

    case 'clear_selected_filters':
      return { ...state, selected: {} };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const FiltersContext = createContext<FiltersContextType>({ state: INITIAL_STATE, dispatch: () => null });

export const FiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(filtersReducer, INITIAL_STATE);
  const router = useRouter();
  const { query } = router;

  const initializeFilters = async () => {
    //Set available filters
    const availableFiltersResponse = (await getAvailableFilters()) as Array<CollectionFilter>;
    const availableFiltersFormatted = formatAvailableFilters(availableFiltersResponse);
    dispatch({ type: 'set_available_filters', payload: availableFiltersFormatted });

    //Set selected filters
    const filterState = formatQueryToFilterState({ query, availableFilters: availableFiltersFormatted });
    dispatch({ type: 'set_initial_selected_filters', payload: filterState.selected });
    dispatch({ type: 'set_order_by_key', payload: filterState.orderByKey });
  };

  useEffect(() => {
    if (router.isReady) {
      initializeFilters();
    }
  }, [router.isReady]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};

export const useFilters = () => {
  return useContext(FiltersContext);
};
