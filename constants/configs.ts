import { ENVIRONMENTS } from '@imtbl/wallet-sdk-web';

export const imx_env_default = 'SANDBOX';
export const imx_env = process.env.NEXT_PUBLIC_IMX_ENV || imx_env_default;

export const collection_name_default = 'Gods Unchained';
export const collection_name = process.env.NEXT_PUBLIC_COLLECTION_NAME || collection_name_default;

export const chain_id_default = 3;
export const chain_id = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || chain_id_default;

export const wallet_sdk_environment_default = 'staging';
export const wallet_sdk_environment =
  (process.env.NEXT_PUBLIC_WALLET_SDK_ENVIRONMENT as ENVIRONMENTS) || wallet_sdk_environment_default;

export const token_address_default = '0xc6185055ea9891d5d9020c927ff65229baebdef2';
export const token_address = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || token_address_default;
