import {
  getConfig,
  AssetsApi,
  BalancesApi,
  CollectionsApi,
  OrdersApi,
  TradesApi,
  TransfersApi,
  Workflows,
  OrdersApiListOrdersRequest,
} from '@imtbl/core-sdk';
import { WalletSDK } from '@imtbl/wallet-sdk-web';
import {
  base_path,
  chain_id,
  core_contract_address,
  registration_contract_address,
  token_address,
  wallet_sdk_environment,
} from '@/constants/configs';

/*
IMX Config & SDK Setup
---------
*/
export const config = getConfig({
  coreContractAddress: core_contract_address,
  registrationContractAddress: registration_contract_address,
  chainID: chain_id,
  basePath: base_path,
});

export const coreSdkWorkflows = new Workflows(config);

const assetsApi = new AssetsApi(config.apiConfiguration);
const collectionsApi = new CollectionsApi(config.apiConfiguration);
const ordersApi = new OrdersApi(config.apiConfiguration);
const tradesApi = new TradesApi(config.apiConfiguration);
const transfersApi = new TransfersApi(config.apiConfiguration);
const balancesApi = new BalancesApi(config.apiConfiguration);

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
  const response = await collectionsApi.listCollectionFilters({ address: token_address });
  return response.data;
};

export const listActiveOrders = async (queryParams?: Partial<OrdersApiListOrdersRequest>) => {
  const response = await ordersApi.listOrders({
    sellTokenAddress: token_address,
    buyTokenType: 'ETH',
    includeFees: true,
    status: 'active',
    ...queryParams,
  });
  return response.data;
};
