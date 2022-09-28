import { CollectionFilter, Order } from '@imtbl/core-sdk';
import { weiToNumber } from '@/helpers';
import { FilterOption, OrderByKey, SelectedFilters } from '@/providers/FiltersProvider';
import { ParsedUrlQuery } from 'querystring';
import { order_by_keys, order_by_key_default } from '../constants';

/**
 * IMX API Response ➡️ React State
 * ------------------------------
 * These are formatters that convert the raw data from IMX API responses into usable
 * formats for the application to render.
 */

export type FormattedActiveOrder = {
  orderId: number;
  tokenId?: string;
  name?: string;
  imgUrl: string;
  buyAmount: string;
  buyType: string;
  user: string;
  timestamp: string | null;
};

export const formatActiveOrders = (activeOrders: Array<Order>): Array<FormattedActiveOrder> => {
  const activeOrdersFormatted = activeOrders.map((order) => {
    return {
      orderId: order.order_id,
      tokenId: order.sell.data.token_id,
      name: order?.sell?.data?.properties?.name,
      imgUrl: order?.sell?.data?.properties?.image_url || '',
      buyAmount: weiToNumber(order.buy.data.quantity),
      buyType: order.buy.type,
      timestamp: order.timestamp,
      user: order.user,
    };
  });
  return activeOrdersFormatted;
};

export const formatAvailableFilters = (availableFiltersResponse: Array<CollectionFilter>) => {
  const availableFiltersFormatted = availableFiltersResponse.map((filter) => ({
    key: filter.key,
    values: filter?.value?.sort((a, b) => Number(a) - Number(b)) || [],
  }));
  return availableFiltersFormatted;
};

/**
 *
 * React State ➡️ IMX API Request
 * -----------------------------
 * These are formatters that convert the application's state (e.g. context objects)
 * into a useable API request format.
 */

/**
 *
 * Next Query Object ➡️ React State
 * -----------------------------
 * These are formatters that convert the application's query object into a format that
 * the React application can use.
 */

/**
 * This function takes in the ParsedUrlQuery object and returns an object containing the selected filters and the orderByKey.
 * If no orderByKey was provided, then default to 'newestListing'. If no availableList is provided, honor every query param with
 * the exception of the exclusionList.
 */

type FormatQueryToFilterStateResponse = {
  selected: SelectedFilters;
  orderByKey: OrderByKey;
};

export const formatQueryToFilterState = ({
  query,
  availableFilters,
  exclusionList,
}: {
  query: ParsedUrlQuery;
  availableFilters?: Array<FilterOption>;
  exclusionList?: string[];
}): FormatQueryToFilterStateResponse => {
  let { orderBy, ...rest } = query;
  const newQueryObj = convertObjectValuesToArrays(rest);

  //Get orderByKey
  if (Array.isArray(orderBy)) {
    orderBy = orderBy.pop();
  }
  const orderByKey = orderBy && order_by_keys.includes(orderBy) ? (orderBy as OrderByKey) : order_by_key_default;

  //Remove any query params that should not be filters
  if (exclusionList && exclusionList.length) {
    exclusionList.forEach((key) => delete newQueryObj[key]);
  }

  //Prevent any query params from becoming a filter if it does not belong in the availableFilters array
  if (availableFilters && availableFilters.length) {
    const availableKeys = availableFilters.map((filter) => filter.key);
    //Remove any invalid filter values
    for (const [key, values] of Object.entries(newQueryObj)) {
      if (!availableKeys.includes(key)) {
        delete newQueryObj[key];
      } else {
        const filteredValues = values.filter((value) => {
          const index = availableKeys.indexOf(key);
          const availableValues = availableFilters[index].values;
          return availableValues.includes(value);
        });
        newQueryObj[key] = filteredValues;
      }
    }
  }

  return {
    selected: newQueryObj,
    orderByKey,
  };
};

/**
 * Crypto Price API Response ➡️ React State
 * ------------------------------
 * These are formatters that convert the raw data from crypto price responses into usable
 * formats for the application to render.
 */

type CoinbasePriceResponse = {
  amount: string;
  base: string;
  currency: string;
};
export const formatCryptoPricesToState = (pricesResponse: CoinbasePriceResponse[]) => {
  const pricesFormatted: { [key: string]: number } = {};
  pricesResponse.forEach((priceObj) => {
    const { amount, base, currency } = priceObj;
    const key = base.concat(currency);
    pricesFormatted[key] = Number(amount);
  });
  return pricesFormatted;
};

/**
 *
 * Generic Formatters
 * -----------------------------
 */

type ObjectWithArrayValues = {
  [key: string]: any[];
};

export const convertObjectValuesToArrays = (obj: Object): ObjectWithArrayValues => {
  const newObj: ObjectWithArrayValues = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      newObj[key as keyof typeof obj] = [value];
    }
    if (Array.isArray(value)) {
      newObj[key] = value;
    }
  }
  return newObj;
};
