import { NFT as NFTType } from "@thirdweb-dev/sdk";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import {
  useAddress,
  useContract,
  useCreateDirectListing,
  useNetworkMismatch,
  Web3Button,
} from "@thirdweb-dev/react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import toastStyle from "../../util/toastConfig";
import useSwitchNetwork from "../../hooks/useSwitchNetwork";
import { navbarAction } from "../Navbar/Navbar";

type Props = {
  nft: NFTType;
};

type DirectFormData = {
  nftContractAddress: string;
  tokenId: string;
  price: string;
  startDate: Date;
  endDate: Date;
};

export default function SaleInfo({ nft }: Props) {
  const router = useRouter();
  const address = useAddress()
  // Connect to marketplace contract
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const networkMisMatch = useNetworkMismatch()
  const switchNetwork = useSwitchNetwork()
  const [isSwitchingNetwork, setSwitchingNetwork] = useState<boolean>(false)

  // useContract is a React hook that returns an object with the contract key.
  // The value of the contract key is an instance of an NFT_COLLECTION on the blockchain.
  // This instance is created from the contract address (NFT_COLLECTION_ADDRESS)
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  // Hook provides an async function to create a new direct listing
  const { mutateAsync: createDirectListing } =
    useCreateDirectListing(marketplace);

  // Manage form submission state using tabs and conditional rendering
  const [tab, setTab] = useState("direct");
  
  // User requires to set marketplace approval before listing
  async function checkAndProvideApproval() {
    // Check if approval is required
    const hasApproval = await nftCollection?.call("isApprovedForAll", [
      nft.owner,
      MARKETPLACE_ADDRESS,
    ]);

    // If it is, provide approval
    if (!hasApproval) {
      const txResult = await nftCollection?.call("setApprovalForAll", [
        MARKETPLACE_ADDRESS,
        true,
      ]);

      if (txResult) {
        toast.success("Marketplace approval granted", {
          icon: "👍",
          style: toastStyle,
          position: "bottom-center",
        });
      }
    }

    return true;
  }

  // Manage form values using react-hook-form library: Direct form
  const { register: registerDirect, handleSubmit: handleSubmitDirect } =
    useForm<DirectFormData>({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        price: "0",
      },
    });

  async function handleSubmissionDirect(data: DirectFormData) {
    await checkAndProvideApproval();
    const txResult = await createDirectListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: data.tokenId,
      pricePerToken: data.price,
      startTimestamp: new Date(data.startDate),
      endTimestamp: new Date(data.endDate),
    });

    return txResult;
  }

  const handleSwitchNetwork = async () => {
    setSwitchingNetwork(true)
    navbarAction.requestSwitchingNetwork()
    await switchNetwork()
    setSwitchingNetwork(false)
    navbarAction.doneSwitchNetwork()
  }

  return (
    
    
      <div className={styles.saleInfoContainer} style={{ marginTop: -42 }}>
        <div className={profileStyles.tabs}>
          <h3
            className={`${profileStyles.tab} 
        ${tab === "direct" ? profileStyles.activeTab : ""}`}
            onClick={() => setTab("direct")}
          >
            Direct Listing
          </h3>          
        </div>

        {/* Direct listing fields */}
        <div
          className={`${
            tab === "direct"
              ? styles.activeTabContent
              : profileStyles.tabContent
          }`}
          style={{ flexDirection: "column" }}
        >
          <h4 className={styles.formSectionTitle}>When </h4>

          {/* Input field for auction start date */}
          <legend className={styles.legend}> Listing Starts on </legend>
          <input
            className={styles.input}
            type="datetime-local"
            {...registerDirect("startDate")}
            aria-label="Auction Start Date"
          />

          {/* Input field for auction end date */}
          <legend className={styles.legend}> Listing Ends on </legend>
          <input
            className={styles.input}
            type="datetime-local"
            {...registerDirect("endDate")}
            aria-label="Auction End Date"
          />
          <h4 className={styles.formSectionTitle}>Price </h4>

          {/* Input field for buyout price */}
          <legend className={styles.legend}> Price per token</legend>
          <input
            className={styles.input}
            type="number"
            step={0.000001}
            {...registerDirect("price")}
          />
          {networkMisMatch && address ? (
            <button className={styles.switchNetworkButton} onClick={handleSwitchNetwork} disabled={isSwitchingNetwork}>
              {isSwitchingNetwork ? 'Loading...' : 'Switch Network'}
            </button>
          ) : (
            <Web3Button
              contractAddress={MARKETPLACE_ADDRESS}
              action={async () => {
                await handleSubmitDirect(handleSubmissionDirect)();
              }}
              onError={(error) => {              
                toast(`Listed Failed! Reason: ${error.cause}`, {
                  icon: "❌",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
              onSuccess={() => {
                toast("Listed Successfully!", {
                  icon: "🥳",
                  style: toastStyle,
                  position: "bottom-center",
                });
                router.push(
                  `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`
                );
              }}
            >
              Create Direct Listing
            </Web3Button>
          )}
          
        </div>

      </div>
    
  );
}
