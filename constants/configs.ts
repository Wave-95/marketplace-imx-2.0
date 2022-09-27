import { ENVIRONMENTS } from '@imtbl/wallet-sdk-web';

export const collection_name_default = 'Gods Unchained';
export const collection_name = process.env.NEXT_PUBLIC_COLLECTION_NAME || collection_name_default;

export const chain_id_default = 3;
export const chain_id = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || chain_id_default;

export const wallet_sdk_environment_default = 'staging';
export const wallet_sdk_environment =
  (process.env.NEXT_PUBLIC_WALLET_SDK_ENVIRONMENT as ENVIRONMENTS) || wallet_sdk_environment_default;

export const token_address_default = '0xc6185055ea9891d5d9020c927ff65229baebdef2';
export const token_address = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || token_address_default;

export const core_contract_address_default = '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef';
export const core_contract_address = process.env.NEXT_PUBLIC_CORE_CONTRACT_ADDRESS || core_contract_address_default;

export const registration_contract_address_default = '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864';
export const registration_contract_address =
  process.env.NEXT_PUBLIC_REGISTRATION_CONTRACT_ADDRESS || registration_contract_address_default;

export const base_path_default = 'https://api.ropsten.x.immutable.com';
export const base_path = process.env.NEXT_PUBLIC_BASE_PATH || base_path_default;
