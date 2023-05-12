import {
  ThirdwebNftMedia,
  useContract,
  useValidDirectListings,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React, { ReactNode, useMemo } from "react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses";
import Skeleton from "../Skeleton/Skeleton";
import styles from "./NFT.module.css";
import buyStyles from "../../styles/Buy.module.css";
import Link from "next/link";

type Props = {
  nft: NFT;
  isDisplayDirectLink?: boolean;
  isDisplayZeroPrice?: boolean;
  onOverrideClickBehavior?: (nft: NFT) => void;
};

type GridItemProps = {
  nftId: string;
  isDisplayDirectLink?: boolean;
  children: ReactNode;
  onClick: () => void;
}

function GridItem({ nftId, isDisplayDirectLink, onClick, children }: GridItemProps) {
    if (!isDisplayDirectLink) {
      return (
        <div className={buyStyles.nftContainer} onClick={onClick}>
          {children}
        </div>
      )
    }

    return (
      <Link
        className={buyStyles.nftContainer}
        href={`/token/${NFT_COLLECTION_ADDRESS}/${nftId}`}                
      >
        {children}
      </Link>
    )
}

export default function NFTComponent({ nft, isDisplayDirectLink, isDisplayZeroPrice = false, onOverrideClickBehavior = () => {} }: Props) {
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  // 1. Load if the NFT is for direct listing
  const { data: directListing, isLoading: loadingDirect } =
    useValidDirectListings(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  const gridMetadataContent = useMemo(() => (
    <>
      
      <ThirdwebNftMedia className={styles.nftImage} metadata={nft.metadata} />
            
      <p className={styles.nftTokenId}>Token ID #{nft.metadata.id}</p>
      <p className={styles.nftName}>{nft.metadata.name}</p>
    </>
  ), [nft.metadata])

  // 2. Load if the NFT is for auction
  // const { data: auctionListing, isLoading: loadingAuction } =
  //   useValidEnglishAuctions(marketplace, {
  //     tokenContract: NFT_COLLECTION_ADDRESS,
  //     tokenId: nft.metadata.id,
  //   });


  
  if (loadingContract || loadingDirect) {
    return (
      <GridItem nftId={nft.metadata.id} isDisplayDirectLink={isDisplayDirectLink} onClick={() => onOverrideClickBehavior(nft)}>
        
        <Skeleton width="100%" height="312px" /> 
      </GridItem>
       
    )
  }

  if (directListing && directListing[0]) {
    return (
      <GridItem nftId={nft.metadata.id} isDisplayDirectLink={isDisplayDirectLink} onClick={() => onOverrideClickBehavior(nft)}>
        {gridMetadataContent}
        <div className={styles.priceContainer}>
          <div className={styles.nftPriceContainer}>
              <div>
                <p className={styles.nftPriceLabel}>Price</p>
                <p className={styles.nftPriceValue}>
                  {`${directListing[0]?.currencyValuePerToken.displayValue}
            ${directListing[0]?.currencyValuePerToken.symbol}`}
                </p>
              </div>
          </div>
        </div>
      </GridItem>
    )
  }

  if (isDisplayZeroPrice) {
    return (
      <GridItem nftId={nft.metadata.id} isDisplayDirectLink={isDisplayDirectLink} onClick={() => onOverrideClickBehavior(nft)}>
        {gridMetadataContent}
        <div className={styles.priceContainer}>
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price</p>
              <p className={styles.nftPriceValue}>Not for sale</p>
            </div>
          </div>
        </div>
      </GridItem> 
    )
  }

  return null
 
}
