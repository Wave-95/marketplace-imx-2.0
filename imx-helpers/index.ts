import { getConfig, AssetsApi, CollectionsApi, OrdersApi, TradesApi, TransfersApi, Workflows } from '@imtbl/core-sdk';
import { WalletSDK } from '@imtbl/wallet-sdk-web';
import {
  base_path,
  chain_id,
  core_contract_address,
  registration_contract_address,
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
const COLLECTION_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

export const getWalletSDK = async () =>
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
