import { OrderByKey } from '@/providers/FiltersProvider';

export const order_by_config = {
  lowestPrice: { label: 'Lowest Price', orderBy: 'buy_quantity', direction: 'asc' },
  highestPrice: { label: 'Highest Price', orderBy: 'buy_quantity', direction: 'desc' },
  newestListing: { label: 'Newest Listing', orderBy: 'created_at', direction: 'desc' },
  oldestListing: { label: 'Oldest Listing', orderBy: 'created_at', direction: 'asc' },
};

export const order_by_config_assets = {
  ascName: { label: 'Name Z-A', orderBy: 'name', direction: 'asc' },
  descName: { label: 'Name A-Z', orderBy: 'name', direction: 'desc' },
};

export const order_by_keys = Object.keys(order_by_config);

export const order_by_key_default: OrderByKey = 'newestListing';

export type ERC20Tokens = 'USDC' | 'IMX' | 'GODS';
