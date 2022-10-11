import { OrderByKey } from '@/providers/FiltersProvider';

export const order_by_mapping = {
  lowestPrice: { label: 'Lowest Price', orderBy: 'buy_quantity', direction: 'asc' },
  highestPrice: { label: 'Highest Price', orderBy: 'buy_quantity', direction: 'desc' },
  newestListing: { label: 'Newest Listing', orderBy: 'created_at', direction: 'desc' },
  oldestListing: { label: 'Oldest Listing', orderBy: 'created_at', direction: 'asc' },
};

export const order_by_keys = Object.keys(order_by_mapping);

export const order_by_key_default: OrderByKey = 'newestListing';

export const deposit_token_types = {
  ETH: 'ETH',
  USDC: 'USDC',
  IMX: 'IMX',
  GODS: 'GODS',
} as const;
