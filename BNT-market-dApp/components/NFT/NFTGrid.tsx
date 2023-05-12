import type { NFT as NFTType } from "@thirdweb-dev/sdk";
// import Link from "next/link";
import React from "react";
// import { NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";
import Skeleton from "../Skeleton/Skeleton";
import NFT from "./NFT";
import styles from "../../styles/Buy.module.css";

type Props = {
  isDisplayZeroPrice?: boolean;
  isLoading: boolean;
  data: NFTType[] | undefined;
  overrideOnclickBehavior?: (nft: NFTType) => void;
  emptyText?: string;
};

export default function NFTGrid({
  isLoading,
  isDisplayZeroPrice = false,
  data,
  overrideOnclickBehavior,
  emptyText = "No NFTs found for this collection.",
}: Props) {
 
  return (
    <div className={styles.nftGridContainer}>
      {isLoading ? (
        [...Array(20)].map((_, index) => (
          <div key={index} className={styles.nftContainer}>
            <Skeleton key={index} width={"100%"} height="312px" />
          </div>
        ))
      ) : data && data.length > 0 ? (
        data.map((nft) => (          
            <React.Fragment key={nft.metadata.id}>
              <NFT 
                nft={nft}
                isDisplayDirectLink={!overrideOnclickBehavior}            
                isDisplayZeroPrice={isDisplayZeroPrice} 
                onOverrideClickBehavior={overrideOnclickBehavior} 
              />
            </React.Fragment>
          )
        )
      ) : (
        <p>{emptyText}</p>
      )}
    </div>
  );
}
