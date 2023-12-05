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
import RoomPage from "@/components/app/room"
import ChatRoomPage from "@/components/app/chat"
import { socket } from "@/lib/socketio"

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
      className="flex h-full w-full py-6 lg:py-8 flex-col-reverse lg:flex-row-reverse items-start lg:items-end"
      initial="hidden"
      variants={FADE_DOWN_ANIMATION_VARIANTS}
      viewport={{ once: true }}
      whileInView="show"
    >
      <IsWalletConnected>
        <div className="lg:ml-auto">
        <RoomPage socket={socket}></RoomPage>
        <ChatRoomPage socket={socket}></ChatRoomPage>
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
