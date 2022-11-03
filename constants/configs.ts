import { ENVIRONMENTS } from '@imtbl/wallet-sdk-web';

export const imx_env = process.env.NEXT_PUBLIC_IMX_ENV || 'SANDBOX';

export const collection_name = process.env.NEXT_PUBLIC_COLLECTION_NAME || 'Test';

export const chain_id = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 5;

export const wallet_sdk_environment = (process.env.NEXT_PUBLIC_WALLET_SDK_ENVIRONMENT as ENVIRONMENTS) || 'staging';

export const token_address = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0xc6185055ea9891d5d9020c927ff65229baebdef2';

export const marketplace_royalty_address =
  process.env.NEXT_PUBLIC_MARKETPLACE_ROYALTY_ADDRESS || '0xf57e7e7c23978c3caec3c3548e3d615c346e79ff';

export const marketplace_royalty_percentage = process.env.NEXT_PUBLIC_MARKETPLACE_ROYALTY_PERCENTAGE || null;

export const magic_public_api_key = process.env.NEXT_PUBLIC_MAGIC_PUBLIC_API_KEY || 'pk_live_B95A9794EED1E24C';

export const base_path = process.env.NEXT_PUBLIC_BASE_PATH || 'https://marketplace-imx.rippin.io';

export const erc20_contract_addresses = {
  IMX: process.env.NEXT_PUBLIC_IMX_TOKEN_ADDRESS || '0xf57e7e7c23978c3caec3c3548e3d615c346e79ff',
  USDC: process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS || '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  GODS: process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS || '0xccc8cb5229b0ac8069c51fd58367fd1e622afd97',
};

export const server_base_uri = process.env.SERVER_BASE_URI || 'http://localhost:3000/api';

export const treasury_address = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;
