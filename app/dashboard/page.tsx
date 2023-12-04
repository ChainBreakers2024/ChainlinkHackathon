"use client";

import { motion } from "framer-motion";

import Link from "next/link"
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design";
import { WalletAddress } from "@/components/blockchain/wallet-address";
import { useAccount } from "wagmi";
import LobbyPage from "@/components/app/lobbies"
import { WalletBalance } from "@/components/blockchain/wallet-balance";
import { WalletEnsName } from "@/components/blockchain/wallet-ens-name";
import { IsWalletConnected } from "@/components/shared/is-wallet-connected";
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected";
import { useState, useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { p } from "@bgd-labs/aave-address-book/dist/AaveV2EthereumAssets-3fdcb680";
import { socket } from "@/lib/socketio"


export default function PageDashboard() {
  const address = useAccount();

  useEffect(() => {
  }, []);

  return (
    <motion.div
      animate="show"
      className="flex h-full w-full items-center justify-center lg:py-8"
      initial="hidden"
      variants={FADE_DOWN_ANIMATION_VARIANTS}
      viewport={{ once: true }}
      whileInView="show"
    >
      <IsWalletConnected>
        <div className="col-span-12 flex flex-col items-center justify-center lg:col-span-9">
          <div className="text-center">
            <h3 className="text-2xl font-bold lg:text-6xl">
              <span className="bg-gradient-to-br from-indigo-600 to-purple-700 bg-clip-text text-transparent dark:from-indigo-100 dark:to-purple-200">
                Welcome! <WalletEnsName />
              </span>
            </h3>
            <h4 className="bg-gradient-to-br from-indigo-600 to-purple-700 bg-clip-text text-transparent dark:from-indigo-100 dark:to-purple-200">
              <WalletAddress />
            </h4>
            <span className="font-light">
              <div className="mt-4">
                <span className="text-3xl font-light">
                  Balance: <WalletBalance decimals={7} /> ETH
                </span>
              </div>
            </span>
            <br></br>

            <LobbyPage socket = {socket}></LobbyPage>

          </div>
        </div>
      </IsWalletConnected>
      <IsWalletDisconnected>
        <h3 className="text-lg font-normal">
          Connect Wallet to view your personalized dashboard.
        </h3>
      </IsWalletDisconnected>
    </motion.div>
  );
}
