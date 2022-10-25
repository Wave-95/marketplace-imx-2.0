import { useUser } from '@/providers/UserProvider';
import { useState } from 'react';
import web3utils from 'web3-utils';
import TokenMenu from '../Menus/TokenMenu';
import TextField from '../TextField';
import Dialog from '.';
import { formatCurrency, formatWeiToNumber } from '@/utils/formatters';
import { client } from 'lib/imx';
import { erc20_contract_addresses } from '@/constants/configs';
import { ERC20Amount, ETHAmount } from '@imtbl/core-sdk';
import { toast } from 'react-toastify';
import { token_symbols } from '@/constants/index';
import Loading from '../Loading';
import { ValueOf } from 'types';
import PrimaryButton from '../Buttons/PrimaryButton';
import SecondaryButton from '../Buttons/SecondaryButton';

type Props = {
  isOpen: boolean;
  closeDialog: () => void;
};

type WithdrawTokenTypes = ValueOf<typeof token_symbols>;

const WithdrawDialog: React.FC<Props> = ({ isOpen, closeDialog }) => {
  const [selectedToken, setSelectedToken] = useState<WithdrawTokenTypes>('ETH');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const token_options: WithdrawTokenTypes[] = ['ETH', 'IMX', 'USDC'];
  const {
    state: {
      balances: { l2: balancesL2 },
      connection,
    },
  } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleTokenChange = (index: number) => () => {
    setSelectedToken(token_options[index]);
  };

  const handleMax = () => {
    setAmount(formatWeiToNumber(availableAmount));
  };

  const availableAmount = balancesL2[selectedToken as WithdrawTokenTypes]?.balance || '0';
  const availableAmountFormatted = formatCurrency(formatWeiToNumber(availableAmount));

  const handleWithdraw = async () => {
    setLoading(true);
    const amountWei = web3utils.toWei(amount);
    const inputAmount = web3utils.toBN(amountWei);
    const availAmount = web3utils.toBN(availableAmount);

    if (availAmount.lt(inputAmount)) {
      return toast.error('You do not have that amount of tokens to deposit.');
    }

    if (connection?.ethSigner) {
      try {
        const tokenAmountPayload =
          selectedToken === 'ETH'
            ? ({ type: 'ETH', amount: amountWei } as ETHAmount)
            : ({
                type: 'ERC20',
                tokenAddress: erc20_contract_addresses[selectedToken],
                amount: amountWei,
              } as ERC20Amount);
        await client.prepareWithdrawal(connection, tokenAmountPayload);
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        if (e.message.match(/user rejected transaction/)) {
          return toast.error('You have rejected the transaction.');
        }
        if (e.message.match(/error quantizing deposit amount/)) {
          return toast.error('Withdraw amount precision too high. Try truncating the amount.');
        }
        toast.error('There was an issue depositing.');
      }
    } else {
      toast.error('Please make sure your wallet is connected.');
      setLoading(false);
    }
  };

  return (
    <Dialog title="Withdraw token" isOpen={isOpen} closeDialog={closeDialog}>
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-secondary text-sm">Select token</span>
          <TokenMenu selectedToken={selectedToken} tokenOptions={token_options} handleTokenChange={handleTokenChange} />
        </div>
        <TextField label="Amount" value={amount} onChange={handleChange} />
        <div className="flex justify-between">
          <span className="text-xs text-secondary">{`Available: ${availableAmountFormatted} ${selectedToken}`}</span>
          <SecondaryButton className="text-xs font-normal px-2 py-1" onClick={handleMax}>
            {'Max'}
          </SecondaryButton>
        </div>
        <PrimaryButton className="w-full font-semibold !max-h-12 h-12" onClick={handleWithdraw}>
          {loading ? <Loading /> : 'Withdraw'}
        </PrimaryButton>
      </div>
    </Dialog>
  );
};

export default WithdrawDialog;
