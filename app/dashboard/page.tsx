"use client"

import { motion } from "framer-motion"

import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design"
import { WalletAddress } from "@/components/blockchain/wallet-address"
import { WalletBalance } from "@/components/blockchain/wallet-balance"
import { WalletEnsName } from "@/components/blockchain/wallet-ens-name"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"
import { useState, useEffect } from "react"

const ws = new WebSocket('ws://localhost:8080');
export default function PageDashboard() {
  const [users, setUsers] = useState([]);
  const [tails, setTails] = useState([]);
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    ws.onopen = () => {
      console.log('WebSocket bağlantısı sağlandı.');
    };
    ws.onmessage = (event) => {
      if (event.data.toString().split("_")[0] == "tails") {
        const tailList = JSON.parse(event.data.toString().split("_")[1]);
        setTails(tailList);
      } if (event.data.toString().split("_")[0] == "head") {
        const headList = JSON.parse(event.data.toString().split("_")[1]);
        setHeads(headList);
      } if (event.data.toString().split("_")[0] == "spec") {
        const userList = JSON.parse(event.data.toString().split("_")[1]);
        setUsers(userList);
      } 

    };
  }, []);
  const yaziLobiye = () => {
    ws.send("heads_0x3B3F0527684C167Feb0C71bcd4F0c16329049d56")
  };
  const turaLobiye = () => {
    ws.send("tails_0x3B3F0527684C167Feb0C71bcd4F0c16329049d56")
  };
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
                You Are 👋 <WalletEnsName />
              </span>
            </h3>
            <h4 className="bg-gradient-to-br from-indigo-600 to-purple-700 bg-clip-text text-transparent dark:from-indigo-100 dark:to-purple-200"><WalletAddress/></h4>
            <button onClick={turaLobiye}>Turaya Katıl</button>
            <button onClick={yaziLobiye}>Yazıya Katıl</button>
            <div>
              <h2>Çevrimiçi Kullanıcılar</h2>
              <h2>{users}</h2>
              <h2>Yazı Kullanıcılar</h2>
              <h2>{tails}</h2>
              <h2>Tura Kullanıcılar</h2>
              <h2>{heads}</h2>
            </div>            
            <span className="font-light">
              <div className="mt-4">
                <span className="text-3xl font-light">
                  Balance: <WalletBalance decimals={7} /> ETH
                </span>
              </div>
            </span>
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
