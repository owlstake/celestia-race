import type { AppProps } from "next/app";
import { ThirdwebProvider, ThirdwebSDKProvider } from "@thirdweb-dev/react";
import {
  ThirdwebStorage,
  StorageDownloader,
  IpfsUploader,
} from "@thirdweb-dev/storage";
import { Navbar } from "../components/Navbar/Navbar";
import NextNProgress from "nextjs-progressbar";
import { DAPP_META_CONFIG, IPFS, THIRDWEB_NETWORK_CONFIG } from "../const/contractAddresses";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { useMemo } from "react";
import { useRouter } from "next/router";

// Configure a custom ThirdwebStorage instance
const gatewayUrls = {
  "ipfs://": IPFS,
};
const downloader = new StorageDownloader();
const uploader = new IpfsUploader();
const storage = new ThirdwebStorage({ uploader, downloader, gatewayUrls });

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const currentYear = useMemo(() => {
    const curDate = new Date()
    return curDate.getFullYear()
  }, [])

  return (
    <ThirdwebSDKProvider 
      activeChain={THIRDWEB_NETWORK_CONFIG} 
      storageInterface={storage}
    >
      <ThirdwebProvider 
        activeChain={THIRDWEB_NETWORK_CONFIG}
        dAppMeta={DAPP_META_CONFIG}
      >
        {/* Progress bar when navigating between pages */}
        <NextNProgress
          color="var(--color-tertiary)"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />

        {/* Render the navigation menu above each component */}
        <Navbar />
        {/* Render the actual component (page) */}
        <Component {...pageProps} />        
        <div className="footer" style={{ backgroundColor: router.pathname === '/' ? '#010101' : '' }}>
          <a href="https://owlstake.com" target="_blank">Owlstake</a> &copy; {currentYear}
        </div>
      </ThirdwebProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
    </ThirdwebSDKProvider>
  );
}

export default MyApp;
