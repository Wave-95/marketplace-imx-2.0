import React from 'react';
import { formatCurrency } from '@/helpers/formatters';
import { EthIcon } from './Icons';

type PriceProps = {
  amount: string;
  symbol: string;
  showRate?: boolean;
  rate?: number;
  showLabel?: boolean;
  className?: string;
};

const Price: React.FC<PriceProps> = ({ amount, symbol, showRate = true, rate, showLabel = true, ...props }) => {
  const priceFormatted = amount && formatCurrency(amount, symbol);
  const convertedRate = rate && Number(amount) * rate;
  const priceUSDFormatted = convertedRate && formatCurrency(convertedRate.toString(), 'USD');

  let CurrencyIcon = null;

  switch (symbol) {
    case 'ETH':
      CurrencyIcon = <EthIcon />;
      break;
    default:
      break;
  }

  const PriceUSD = () =>
    priceUSDFormatted ? <div className="mr-1 text-xs leading-none text-secondary">{`≃${priceUSDFormatted}`}</div> : null;

  return (
    <div {...props}>
      <div className="flex flex-col items-end">
        {showLabel ? <div className="text-xs font-medium tracking-wider text-secondary">Price</div> : null}
        <div className="flex h-6 items-center justify-end space-x-1.5">
          <div className="-ml-2.5 -mr-1 flex items-center space-x-1 font-normal">
            <div className="flex items-center leading-none text-primary tabular-nums">
              <span className="text-primary text-sm">{priceFormatted}</span>
              {CurrencyIcon}
              {showRate ? <PriceUSD /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Price;
