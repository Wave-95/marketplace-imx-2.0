import { ENVIRONMENTS } from '@imtbl/wallet-sdk-web';

export const imx_env = process.env.NEXT_PUBLIC_IMX_ENV || 'SANDBOX';

export const collection_name = process.env.NEXT_PUBLIC_COLLECTION_NAME || 'Gods Unchained';

export const chain_id = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 3;

export const wallet_sdk_environment = (process.env.NEXT_PUBLIC_WALLET_SDK_ENVIRONMENT as ENVIRONMENTS) || 'staging';

export const token_address = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0xc6185055ea9891d5d9020c927ff65229baebdef2';

export const marketplace_royalty_address = process.env.NEXT_PUBLIC_MARKETPLACE_ROYALTY_ADDRESS || null;

export const marketplace_royalty_percentage = process.env.NEXT_PUBLIC_MARKETPLACE_ROYALTY_PERCENTAGE || null;

export const magic_public_api_key = process.env.NEXT_PUBLIC_MAGIC_PUBLIC_API_KEY || 'pk_live_B95A9794EED1E24C';

export const base_path = process.env.NEXT_PUBLIC_BASE_PATH || 'https://marketplace-imx.rippin.io';
