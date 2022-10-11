import React, { useEffect } from 'react';
import Link from 'next/link';
import { UserContextType, useUser } from '@/providers/UserProvider';
import { formatBalances, formatWeiToNumber } from '@/helpers/formatters';
import { EthIcon } from '../Icons';
import { client } from '@/helpers/imx';
import numeral from 'numeral';
import { Contract } from 'ethers';
import { erc20_contract_addresses } from '@/constants/configs';
import erc20 from '../../abis/erc20.json';

const Balance: React.FC = ({ ...props }) => {
  const {
    state: { address, balances, connection },
    dispatch,
  } = useUser();

  const balanceETHL2 = balances?.l2?.ETH?.balance || '0';
  const balanceETHL2Formatted = numeral(formatWeiToNumber(balanceETHL2)).format('0[.]0[00]a');

  const fetchAndSetL1Balances = async () => {
    const balanceETHL1 = await connection?.ethSigner.getBalance();
    const contractUSDC = new Contract(erc20_contract_addresses['USDC'], erc20, connection?.ethSigner);
    const contractIMX = new Contract(erc20_contract_addresses['IMX'], erc20, connection?.ethSigner);
    const contractGODS = new Contract(erc20_contract_addresses['GODS'], erc20, connection?.ethSigner);

    const balanceUSDCL1 = await contractUSDC.balanceOf(address);
    const balanceIMXL1 = await contractIMX.balanceOf(address);
    const balanceGODSL1 = await contractGODS.balanceOf(address);

    dispatch({
      type: 'set_l1_balances',
      payload: {
        ETH: balanceETHL1?.toString(),
        USDC: balanceUSDCL1?.toString(),
        IMX: balanceIMXL1?.toString(),
        GODS: balanceGODSL1?.toString(),
      },
    });
  };

  useEffect(() => {
    if (address) {
      client
        .listBalances({ owner: address })
        .then((response) => dispatch({ type: 'set_l2_balances', payload: formatBalances(response.result) }));

      fetchAndSetL1Balances();
    }
  }, [address]);

  if (!address) return null;

  return (
    <div className="h-10 border rounded-lg border-normal" {...props}>
      <div className="flex items-center justify-center px-4 pr-0 space-x-2">
        <span>{balanceETHL2Formatted}</span>
        <EthIcon />
        <Link href="/balances">
          <a>
            <button className="btn-secondary text-xs lg:text-base h-10">Balances</button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Balance;
