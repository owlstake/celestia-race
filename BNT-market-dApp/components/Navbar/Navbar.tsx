import { useEffect, useRef, useState } from "react";
import { ConnectWallet, useAddress, useNetworkMismatch, useBalance } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import styles from "./Navbar.module.css";
import toastStyle from "../../util/toastConfig";
import useSwitchNetwork from "../../hooks/useSwitchNetwork";
import useEventListener from "../../hooks/useEventListener";


const REQUEST_SWITCH_NETWORK = 'REQUEST_SWITCH_NETWORK'

const createCustomEvent = (event: string, detail: any) => {
  return new CustomEvent(event, { detail })
}

export const navbarAction = {
  requestSwitchingNetwork: () => {    
    const ev = createCustomEvent(REQUEST_SWITCH_NETWORK, { status: true })
    document.dispatchEvent(ev)
  },
  doneSwitchNetwork: () => {
    const ev = createCustomEvent(REQUEST_SWITCH_NETWORK, { status: false })
    document.dispatchEvent(ev)
  }
}

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const documentRef = useRef<Document|null>(null)
  const address = useAddress();
  const balance: any = useBalance()
  const networkMisMatch = useNetworkMismatch()
  const switchNetwork = useSwitchNetwork()

  const [loadingFaucet, setLoadingFaucet] = useState<boolean>(false)
  const [disabledFaucet, setDisabledFaucet] = useState<boolean>(false)
  const [isDisplaySwitchNetwork, setIsDisplaySwitchNetwork] = useState<boolean>(false)
  const [isSwitchingNetwork, setSwitchingNetwork] = useState<boolean>(false)

  const handleSwitchNetwork = async () => {
    if (loadingFaucet || !address || isSwitchingNetwork) return false 
    setSwitchingNetwork(true)
    await switchNetwork()
    setSwitchingNetwork(false)
  }

  const handleFaucet = async () => {
    if (loadingFaucet || !address || disabledFaucet || isSwitchingNetwork) {
      return;
    }
      
    if (!window.ethereum || !address) {
      toast(`MetaMask is not installed`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      return;
    }

    setLoadingFaucet(true);  

    if (networkMisMatch) { 
      const isSwitchedNetwork  = await switchNetwork()
      if (!isSwitchedNetwork) {
        setLoadingFaucet(false);  
        return
      };
    }


    try {          
      const response = await fetch('/api/faucet', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },             
        body: JSON.stringify({ address })         
      });
      const data = await response.json();
      if (data?.message === "Transaction successfully") {
        toast(`Faucet success!`, {
          icon: "✅",
          style: toastStyle,
          position: "bottom-center",
        });        
        setDisabledFaucet(true);
        localStorage.setItem("faucet", `${new Date().getTime()}`);
      }
      setLoadingFaucet(false);
    } catch (e) {
      console.log(e);
      toast(`Faucet failed!`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });  
      setLoadingFaucet(false);
    }
  }

  useEffect(() => {
    documentRef.current = document
  }, [])

  useEffect(() => {
    const faucetTime = localStorage.getItem("faucet");
    if (faucetTime) {
      const currentTime = new Date().getTime();
      if (currentTime < parseInt(faucetTime) + 5 * 60 * 1000) {
        setDisabledFaucet(true);
      }
    }
  }, [])

  useEffect(() => {
    if (address) {
      setIsDisplaySwitchNetwork(window.ethereum !== undefined && networkMisMatch)
    } else {
      setIsDisplaySwitchNetwork(true)
    }
  }, [address, networkMisMatch])

  useEffect(() => {
    // disabled faucet when user balance gte 10eth
    if (balance?.data?.value > 1 * 10 ** 18) {
      setDisabledFaucet(true)
    }
  }, [balance])

  const requestSwitchHandler = ({ detail: { status } }: any) => {   
    setSwitchingNetwork(status)
  }

  useEventListener(REQUEST_SWITCH_NETWORK, requestSwitchHandler, documentRef.current)

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link href="/" className={`${styles.homeLink} ${styles.navLeft}`}>
            <Image
              src="/logo.png"
              width={48}
              height={48}
              alt="NFT marketplace sample logo"
            />
          </Link>

          <div className={styles.navMiddle}>
            <Link href="/buy" className={styles.link}>
              Buy
            </Link>
            <Link href="/sell" className={styles.link}>
              Sell
            </Link>
            <Link href="/mint" className={styles.link}>
              Mint
            </Link>
            <Link href="https://owlstake.com" target="_blank" className={styles.link}>
              About Us
            </Link>
          </div>
        </div>

        <div className={styles.navRight}>
          {isDisplaySwitchNetwork && (
            <div className={styles.navConnect}>
              <button 
                className={styles.switchNetworkButton} 
                onClick={handleSwitchNetwork}
                disabled={loadingFaucet || isSwitchingNetwork || !address}
              >
                  {isSwitchingNetwork ? 'Loading...' : 'Switch Network'}
                </button>
            </div>
          )}
          
          <div className={styles.navConnect}>
            <button 
              className={styles.faucetButton} 
              onClick={handleFaucet} 
              disabled={disabledFaucet || !address || loadingFaucet || isSwitchingNetwork}>
                {loadingFaucet ? 'Loading' : 'Faucet'}
              </button>
          </div>
          <div className={styles.navConnect}>
            <ConnectWallet className={styles.connectButton} theme="dark" btnTitle="Connect Wallet" />
          </div>
          {address && (
            <Link className={styles.link} href={`/profile/${address}`}>
              <Image
                className={styles.profileImage}
                src="/user-icon.png"
                width={42}
                height={42}
                alt="Profile"
              />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
