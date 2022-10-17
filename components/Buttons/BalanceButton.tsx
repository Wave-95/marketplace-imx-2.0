import React, { useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { formatBalances, formatWeiToNumber } from '@/helpers/formatters';
import { EthIcon } from '../Icons';
import { client } from '@/helpers/imx';
import numeral from 'numeral';
import { Contract } from 'ethers';
import { erc20_contract_addresses } from '@/constants/configs';
import erc20ABI from '../../abis/erc20.json';

const Balance = ({ ...props }) => {
  const {
    state: {
      address,
      balances: { l2: l2Balance },
      connection,
    },
    dispatch,
  } = useUser();

  const l2BalanceETH = l2Balance?.ETH?.balance || '0';
  const l2BalanceETHFormatted = numeral(formatWeiToNumber(l2BalanceETH)).format('0[.]0[00]a');

  const fetchAndSetL1Balances = async () => {
    const l1BalanceETH = await connection?.ethSigner.getBalance();
    const contractUSDC = new Contract(erc20_contract_addresses['USDC'], erc20ABI, connection?.ethSigner);
    const contractIMX = new Contract(erc20_contract_addresses['IMX'], erc20ABI, connection?.ethSigner);
    const contractGODS = new Contract(erc20_contract_addresses['GODS'], erc20ABI, connection?.ethSigner);

    const l1BalanceUSDC = await contractUSDC.balanceOf(address);
    const l1BalanceIMX = await contractIMX.balanceOf(address);
    const l1BalanceGODS = await contractGODS.balanceOf(address);

    dispatch({
      type: 'set_l1_balances',
      payload: {
        ETH: l1BalanceETH?.toString(),
        USDC: l1BalanceUSDC?.toString(),
        IMX: l1BalanceIMX?.toString(),
        GODS: l1BalanceGODS?.toString(),
      },
    });
  };

  //Fetches L2 balances
  useEffect(() => {
    if (address) {
      client
        .listBalances({ owner: address })
        .then((response) => dispatch({ type: 'set_l2_balances', payload: formatBalances(response.result) }));
    }
  }, [address]);

  //Fetches L1 balances
  useEffect(() => {
    if (connection?.ethSigner) {
      fetchAndSetL1Balances();
    }
  }, [connection?.ethSigner]);

  if (!address) return null;

  return (
    <div className="h-10 border rounded-lg border-normal box-content" {...props}>
      <div className="flex items-center justify-center px-4 pr-0 space-x-2">
        <span>{l2BalanceETHFormatted}</span>
        <EthIcon />
        <Link href="/balances">
          <a>
            <button className="btn-secondary text-xs lg:text-base h-10">{'Balances'}</button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Balance;
