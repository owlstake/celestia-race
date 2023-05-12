# NFT Marketplace

Create an NFT marketplace on top of your NFT collection on ethermint rollup.

Demo link: https://nft.owlstake.com

## Features

- View all NFTs from your collection and their status on the marketplace on the [buy](/pages/buy.tsx) page.

- Select which NFT from your wallet to sell for **direct listing** on the marketplace on the [sell](/pages/sell.tsx) page.

- View all NFTs a user owns from your collection on the [profile](/pages/profile/%5Baddress%5D.tsx) pages.

- Buy NFTs directly from the marketplace on the [item](/pages/token/%5BcontractAddress%5D/%5BtokenId%5D.tsx) pages.

<br/>

## Using this repo

1. Deploy a [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract
2. Deploy a [NFT Collection](https://thirdweb.com/thirdweb.eth/TokenERC721) contract
3. Clone this repository
4. Create an .env file
```
cp env.example .env
nano .env
```
4. Plug your contract addresses and chain in the .env file.
5. Install the dependencies, build and run
```
npm install
npm run build
npm run start
```
<br/>

_Note: This requires [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [Git](https://git-scm.com/downloads). [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) is also recommended._

<br/>

Here is some screenshot of the project:

![Home page](screenshot/home.png)

![Buy page](screenshot/buy.png)
