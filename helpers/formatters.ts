import { Balance, CollectionFilter, Fee, Order, OrdersApiListOrdersRequest } from '@imtbl/core-sdk';
import { FilterOption, FilterValues, OrderByKey, SelectedFilters } from '@/providers/FiltersProvider';
import { ParsedUrlQuery } from 'querystring';
import { order_by_config, order_by_keys, order_by_key_default } from '../constants';
import numeral from 'numeral';
import web3utils from 'web3-utils';

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
      buyAmount: formatWeiToNumber(order.buy.data.quantity),
      buyType: order.buy.type,
      timestamp: order.timestamp,
      user: order.user,
    };
  });
  return activeOrdersFormatted;
};

export const formatAvailableFilters = (availableFiltersResponse: Array<CollectionFilter>): FilterOption[] => {
  const availableFiltersFormatted = availableFiltersResponse.map((filter) => ({
    key: filter.key,
    values: filter?.value?.sort((a, b) => Number(a) - Number(b)) || [],
  }));
  return availableFiltersFormatted;
};

export type FormattedBalances = {
  [key: string]: Omit<Balance, 'symbol'>;
};
export const formatBalances = (balancesResponse: Balance[]): FormattedBalances => {
  const balancesObj = {} as any;
  balancesResponse.forEach(({ symbol, ...rest }) => {
    balancesObj[symbol] = { ...rest };
  });
  return balancesObj;
};

export const formatFees = (fees: Fee[]) => {
  const results = {
    royalty: { label: 'IMX Royalty Fees', value: 0 },
    protocol: { label: 'IMX Transfer Fees', value: 0 },
    ecosystem: { label: 'Marketplace Commission', value: 0 },
  };

  fees.forEach((fee) => {
    if (Object.keys(results).includes(fee.type)) {
      results[fee.type as keyof typeof results].value += fee.percentage;
    }
  });

  const formattedFees = Object.values(results).filter((fee) => fee.value > 0);

  return formattedFees;
};

/**
 *
 * React State ➡️ IMX API Request
 * -----------------------------
 * These are formatters that convert the application's state (e.g. context objects)
 * into a useable API request format.
 */

export const formatFiltersToApiRequest = ({ selected, orderByKey }: { selected: SelectedFilters; orderByKey: OrderByKey }) => {
  const newSelected: { [key: string]: FilterValues } = {};
  Object.assign(newSelected, selected);

  //Delete any filter keys that have empty arrays
  for (const [key, value] of Object.entries(newSelected)) {
    if (Array.isArray(value) && value.length === 0) {
      delete newSelected[key];
    }
  }
  const sellMetadata = Object.keys(newSelected).length > 0 ? JSON.stringify(newSelected) : undefined;

  const orderBy = order_by_config[orderByKey].orderBy as OrdersApiListOrdersRequest['orderBy'];
  const direction = order_by_config[orderByKey].direction as OrdersApiListOrdersRequest['direction'];

  return { ...(sellMetadata && { sellMetadata }), orderBy, direction };
};

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
  availableFilters?: FilterOption[];
  exclusionList?: string[];
}): FormatQueryToFilterStateResponse => {
  let { orderBy, ...rest } = query;
  const newQueryObj = formatObjValsToArrays(rest);

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
    selected: newQueryObj as SelectedFilters,
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

export const formatObjValsToArrays = (obj: Object): ObjectWithArrayValues => {
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

export const formatAddressEllipse = (address: string | null, width: number = 4) => {
  if (!address) {
    return '';
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`;
};

export const formatCurrency = (amount: string, currency = 'ETH') => {
  switch (currency) {
    case 'ETH':
      return numeral(amount).format('0[.]0[0000]a');
    case 'USD':
      return `$${numeral(amount).format('0.00a')}`;
    default:
      throw new Error(`Unsupported currency type: ${currency}`);
  }
};

export const formatWeiToNumber = (num: string) => {
  return web3utils.fromWei(num);
};
