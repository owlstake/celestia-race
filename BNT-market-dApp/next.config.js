/** @type {import('next').NextConfig} */

function getListConfigFromPrefix(prefix) {
  let i = 1
  const listConfig = []
  while (true) {
    const envKey = `${prefix}${i}`
    if (!process.env[envKey]) {
      break;
    }
    listConfig.push(process.env[envKey])
    i++
  }
  return listConfig
}

const nextConfig = {  
  reactStrictMode: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    marketplaceAddress: process.env.MARKETPLACE_ADDRESS,
    nftCollectionAddress: process.env.NFT_COLLECTION_ADDRESS,    
    chainId: process.env.CHAIN_ID,
    ipfs: getListConfigFromPrefix('IPFS_'),
    rpcUrls: getListConfigFromPrefix('RPC_URL_'),
    chainName: process.env.CHAIN_NAME,
    currency: {
      decimals: process.env.CURRENCY_DECIMALS,
      name: process.env.CURRENCY_NAME,
      symbol: process.env.CURRENCY_SYMBOL
    }
  },
  basePath: "", 
};

module.exports = nextConfig;
