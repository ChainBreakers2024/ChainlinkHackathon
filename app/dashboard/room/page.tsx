"use client"

import { motion } from "framer-motion"

import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design"
import { Card } from "@/components/ui/card"
import { WalletAddress } from "@/components/blockchain/wallet-address"
import { WalletBalance } from "@/components/blockchain/wallet-balance"
import { WalletNonce } from "@/components/blockchain/wallet-nonce"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import CoinFlip from "@/components/app/coinflip"
import ChatRoomPage from "@/components/app/chat"
import RoomPage from "@/components/app/room"

const data = [
  { option: '0', style: { backgroundColor: 'green', textColor: 'black' } },
  { option: '1', style: { backgroundColor: 'white' } },
  { option: '2' },
]
export default function PageDashboardAccount() {

  useEffect(() => {
  }, []);

  return (
    <motion.div
      animate="show"
      className="flex h-full w-full py-6 lg:py-8 flex-col lg:flex-row items-start"
      initial="hidden"
      variants={FADE_DOWN_ANIMATION_VARIANTS}
      viewport={{ once: true }}
      whileInView="show"
    >
      <IsWalletConnected>
        <div className="flex flex-col lg:flex-row flex-grow">
          <div className="flex-grow h-full">
            <CoinFlip style={{ height: "100%" }}></CoinFlip>
          </div>
          <div className="lg:ml-auto">
            <RoomPage></RoomPage>
            <ChatRoomPage></ChatRoomPage>
          </div>
        </div>
      </IsWalletConnected>
      <IsWalletDisconnected>
        <h3 className="text-lg font-normal">
          Connect Wallet to view your personalized dashboard.
        </h3>
      </IsWalletDisconnected>
    </motion.div>
  )
    
}
