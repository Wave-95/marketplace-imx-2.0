import { MouseEventHandler } from 'react';
import { Check, ChevronDown } from 'react-feather';
import Menu from '.';
import SecondaryButton from '../Buttons/SecondaryButton';

type TokenMenuProps = {
  selectedToken: string;
  handleTokenChange: (index: number) => MouseEventHandler<HTMLDivElement>;
  tokenOptions: string[];
};

const TokenMenu: React.FC<TokenMenuProps> = ({ selectedToken, handleTokenChange, tokenOptions }) => {
  const ButtonChild = (
    <SecondaryButton className="min-w-[75px] space-x-2 pr-2 h-10" as="div">
      <span>{selectedToken}</span>
      <ChevronDown size={15} />
    </SecondaryButton>
  );

  const MenuItems = tokenOptions.map((label, index) => {
    const isSelected = label === selectedToken;
    return (
      <div className="px-2 py-0 menu-item w-full" onClick={handleTokenChange(index)} key={`token-option-${index}`}>
        <div className="flex justify-start items-center space-x-3 text-xs lg:text-sm">
          <span className="whitespace-nowrap">{label}</span>
          {isSelected ? (
            <div className="text-accent">
              <Check />
            </div>
          ) : null}
        </div>
      </div>
    );
  });

  return <Menu buttonChild={ButtonChild} menuItems={MenuItems} menuItemsClassName="left-0 space-y-0" />;
};

export default TokenMenu;
