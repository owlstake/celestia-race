import { ethers } from 'ethers';
import getConfig from 'next/config';
/** Replace the values below with the addresses of your smart contracts. */

const { publicRuntimeConfig } = getConfig();

function slugify(str: string) {
  return str.toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '');
}


// 1. Set up the network your smart contracts are deployed to.
export const RPC_URLS = publicRuntimeConfig.rpcUrls || []

export const CHAIN_ID = Number(publicRuntimeConfig.chainId)

export const CHAIN_NAME = publicRuntimeConfig.chainName || ''

export const CURRENCY = publicRuntimeConfig.currency || {}

const NATIVE_CURRENCY = {
  decimals: Number(CURRENCY.decimals || 0),
  name: CURRENCY.name || '',
  symbol: CURRENCY.symbol || '',
}

export const THIRDWEB_NETWORK_CONFIG = {
  chainId: CHAIN_ID,
  rpc: RPC_URLS,
  nativeCurrency: NATIVE_CURRENCY,
  shortName: CHAIN_NAME, // Display value shown in the wallet UI
  slug: slugify(CHAIN_NAME), // Display value shown in the wallet UI
  testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
  chain: CHAIN_NAME, // Name of the network
  name: CHAIN_NAME, // Name of the network
}

export const DAPP_META_CONFIG = {
  name: CHAIN_NAME,
  description: `${CHAIN_NAME} is blockchain`,
  url: 'https://owlstake.com/',
  isDarkMode: true,
}

export const ADD_NETWORK_CONFIG = {
  chainId: ethers.utils.hexlify(CHAIN_ID).replace('0x0', '0x'),
  chainName: CHAIN_NAME,
  rpcUrls: RPC_URLS,
  nativeCurrency: NATIVE_CURRENCY,
  blockExplorerUrls: null, // Custom block explorer URL
}

// 2. The address of the marketplace V3 smart contract.
// Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
export const MARKETPLACE_ADDRESS = publicRuntimeConfig.marketplaceAddress;

// 3. The address of your NFT collection smart contract.
export const NFT_COLLECTION_ADDRESS = publicRuntimeConfig.nftCollectionAddress;

export const IPFS = publicRuntimeConfig.ipfs;
