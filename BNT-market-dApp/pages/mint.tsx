import React, { useState, useRef, FormEvent } from "react";
import {
  useContract,
  useNetworkMismatch,
  useAddress,
  useSDK,  
  ConnectWallet
} from "@thirdweb-dev/react";
import toast from "react-hot-toast";

import { useRouter } from "next/router";

import styles from "../styles/Mint.module.css";
import { NFT_COLLECTION_ADDRESS } from "../const/contractAddresses";

import toastStyle from "../util/toastConfig";
import useSwitchNetwork from "../hooks/useSwitchNetwork";
import { navbarAction } from "../components/Navbar/Navbar";
import Container from "../components/Container/Container";
import Head from "next/head";


const MintNFT = () => {
  const address = useAddress();
  const sdk = useSDK();

  const [nftMinting, setNftMinting] = useState<boolean>(false);  
  const networkMisMatch = useNetworkMismatch();

  const { contract: nftCollection } = useContract(
    NFT_COLLECTION_ADDRESS,
    "signature-drop"
  );

  // Other hooks
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const switchNetwork = useSwitchNetwork()

  // This function gets called when the form is submitted.
  async function handleCreateListing(e: FormEvent<HTMLFormElement>) {
    // Prevent page from refreshing
    e.preventDefault();

    if (nftMinting) return;

    if (!address) {
      toast(`You need conntect to wallet!`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });             
      return;
    }

    if (!file) {
      toast(`Please upload your image before submit form`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      return;
    }
  
    setNftMinting(true);

    if (networkMisMatch) { 
      navbarAction.requestSwitchingNetwork()
      const isSwitchedNetwork  = await switchNetwork()
      navbarAction.doneSwitchNetwork()
      if (!isSwitchedNetwork) {
        setNftMinting(false);
        return;
      } 
    }
     
    try {      
      // De-construct data from form submission
      const { name, description } = (e.target as HTMLFormElement).elements as any;
     
      // Upload image using storage SDK
      const img = await sdk?.storage.upload(file);
      
      // Signature Mint NFT, get info (fetch generate mint signature)
      const req = await fetch("/api/generate-mint-signature", {
        method: "POST",
        body: JSON.stringify({
          address,
          name: name.value,
          description: description.value,
          image: img,
        }),
      });

      const json = await req.json();

      if (!req.ok) {
        toast(json.message || `Mint error`, {
          icon: "❌",
          style: toastStyle,
          position: "bottom-center",
        });
        setNftMinting(false);
        return;
      }

      const signedPayload = json.signedPayload;

      await nftCollection?.signature.mint(signedPayload);
      setNftMinting(false)
      toast(`Mint successfully!`, {
        icon: "✅",
        style: toastStyle,
        position: "bottom-center",
      });
      router.push(`/sell`);
      
    } catch (error) {
      console.error(error);
      toast(`Mint error`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      setNftMinting(false);
    } 
  }

  // Function to store file in state when user uploads it
  const uploadFile = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();

      fileInputRef.current.onchange = () => {
        if (fileInputRef?.current?.files?.length) {
          const file = fileInputRef.current.files[0];
          setFile(file);
        }
      };
    }
  };

  return (
    <>
    <Head>
      <title>Mint NFT | Owl Market</title>
    </Head>
    <Container maxWidth="lg">
        <form onSubmit={handleCreateListing}>
            <div className={styles.container}>
                {/* Form Section */}
                <div className={styles.collectionContainer}>
                <h1 className={styles.ourCollection}>
                    Mint your NFT:
                </h1>
                
                {file ? (
                    <img
                    src={URL.createObjectURL(file)}
                    style={{ cursor: "pointer", maxHeight: 250, borderRadius: 8 }}
                    onClick={() => setFile(undefined)}
                    />
                ) : (
                    <div
                    className={styles.imageInput}
                    onClick={uploadFile}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        setFile(e.dataTransfer.files[0]);
                    }}
                    >
                    Drag and drop an image here to upload it!
                    </div>
                )}
                <input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    id="profile-picture-input"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                />

                {/* Sale Price For Listing Field */}
                <input
                    type="text"
                    name="name"
                    className={styles.textInput}
                    placeholder="Name"
                    style={{ minWidth: "320px" }}
                />

                {/* Sale Price For Listing Field */}
                <input
                    type="text"
                    name="description"
                    className={styles.textInput}
                    placeholder="Description"
                    style={{ minWidth: "320px" }}
                />

                {address ? (
                  <button
                    type="submit"
                    className={styles.mainButton}
                    style={{ marginTop: 32, borderStyle: "none" }}
                    disabled={nftMinting}
                >
                  {nftMinting ? "Loading..." : "Mint"}
                </button>
                ) : (
                  <ConnectWallet style={{ marginTop: 32, borderStyle: "none" }} className={styles.connectButton} theme="dark" btnTitle="Connect Wallet" />
                )}                
                </div>
            </div>
            </form>
    </Container>
    </>
  );
};

export default MintNFT;
