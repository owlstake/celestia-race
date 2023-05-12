import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NFT_COLLECTION_ADDRESS, RPC_URLS } from "../../const/contractAddresses";
import { NextApiRequest, NextApiResponse } from "next";

export default async function generateMintSignature(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  // De-construct body from request
  let { address, name, description, image } = JSON.parse(req.body);

  if (!address || !name || !image) {
    return res.status(400).json({ message: 'Name and image is required' })
  }

  const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY || '', RPC_URLS[0]);

  const nftContract = await sdk.getContract(
    NFT_COLLECTION_ADDRESS,
    "nft-collection"
  );

  const signedPayload = await nftContract.signature.generate({
    metadata: {
      name: name,
      description: description || '',
      image,
    },
    to: address,
    // mintStartTime: new Date(),
  });

  // return 200 and signedpayload
  res.status(200).json({
    signedPayload: JSON.parse(JSON.stringify(signedPayload)),
  });
}
