import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Head from "next/head";

/**
 * Landing page with a simple gradient background and a hero asset.
 * Free to customize as you see fit.
 */
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>The largest NFT Marketplace | Owl Market</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.hero}>
            <div className={styles.heroBackground}>
              <div className={styles.heroBackgroundInner} />            
            </div>
            <div className={styles.heroAssetFrame}>
              <Image
                src="/hero-asset.png"
                width={466}
                height={476}
                alt="NFT marketplace"
                quality={100}
                className={styles.heroAsset}
              />
            </div>
            <div className={styles.heroBodyContainer}>
              <div className={styles.heroBody}>
                <h1 className={styles.heroTitle}>
                  <span className={styles.heroTitleGradient}>
                    The largest NFT Marketplace
                  </span>                
                </h1>
                <p className={styles.heroSubtitle}>                
                  Owl Market is the largest marketplace for NFTs and crypto collectibles. Mint, buy, sell, and auction NFTs today.                
                </p>

                <div className={styles.heroCtaContainer}>
                  <Link className={styles.heroCta} href="/buy">
                    Buy
                  </Link>
                  <Link className={styles.secondaryCta} href="/sell">
                    Sell
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
