import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

import { magic_public_api_key } from '@/constants/configs';

export const buildMagicAndProvider = () => {
  const magic = new Magic(magic_public_api_key, { testMode: true });
  const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);
  return { magic, provider };
};
