import { Config, ImmutableX, OrdersApiListOrdersRequest } from '@imtbl/core-sdk';
import { WalletSDK } from '@imtbl/wallet-sdk-web';
import { chain_id, imx_env, token_address, wallet_sdk_environment } from '@/constants/configs';

/*
IMX Config & SDK Setup
---------
*/
let config = null;
switch (imx_env) {
  case 'PRODUCTION':
    config = Config.PRODUCTION;
    break;
  case 'ROPSTEN':
    config = Config.ROPSTEN;
    break;
  default:
    config = Config.SANDBOX;
    break;
}

const client = new ImmutableX(config);

export const buildWalletSDK = async () =>
  await WalletSDK.build({
    env: wallet_sdk_environment,
    /*
          RPC config is only required if the WalletConnect provider (L1_PROVIDERS.WALLET_CONNECT)
          is being used. Follow this reference for the RPC config:
          https://docs.walletconnect.com/quick-start/dapps/web3-provider#provider-options
        */
    rpc: {
      [chain_id]: 'https://ropsten.mycustomnode.com',
    },
    /*
          Will switch the chain based on this configured chainID when connecting to the wallet.(Optional)
          Following the table below to get the chainID and name mapping. 
          Consult https://chainlist.org/ for more.
          ChainId   | Network
          --- --- | --- --- 
          1       | Ethereum Main Network (Mainnet)
          3       | Ropsten Test Network
          5       | Goerli Test Network
        */
    chainID: chain_id,
  });

/*
IMX Calls
-----------
*/

export const getAvailableFilters = async () => {
  const response = await client.listCollectionFilters({ address: token_address });
  return response;
};

export const listActiveOrders = async (queryParams?: Partial<OrdersApiListOrdersRequest>) => {
  const response = await client.listOrders({
    sellTokenAddress: token_address,
    buyTokenType: 'ETH',
    includeFees: true,
    status: 'active',
    ...queryParams,
  });
  return response;
};
