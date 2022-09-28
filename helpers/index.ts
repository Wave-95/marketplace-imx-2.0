import { utils } from 'ethers';
import numeral from 'numeral';

export const ellipse = (address: string | null, width: number = 4) => {
  if (!address) {
    return '';
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`;
};

export const formatCurrency = (amount: string, currency = 'ETH') => {
  switch (currency) {
    case 'ETH':
      return numeral(amount).format('0[.]0[00]');
    default:
      throw new Error(`Unsupported currency type: ${currency}`);
  }
};

export const weiToNumber = (num: string) => {
  return utils.formatEther(num);
};
