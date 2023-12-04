"use client";

import { motion } from "framer-motion";

import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design";
import { WalletAddress } from "@/components/blockchain/wallet-address";
import { useAccount } from "wagmi";
import { WalletBalance } from "@/components/blockchain/wallet-balance";
import { WalletEnsName } from "@/components/blockchain/wallet-ens-name";
import { IsWalletConnected } from "@/components/shared/is-wallet-connected";
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected";
import { useState, useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
const ws = new WebSocket("wss://chainbreakers.cloud/aws");

export default function PageDashboard() {
  const [lobiler, setLobi] = useState([]);
  const [clickedRoom, setClickedRoom] = useState(null);
  const address = useAccount();

  useEffect(() => {
    const ws = new WebSocket("wss://chainbreakers.cloud/aws");

    ws.onopen = (e) => {
      ws.send("get_lobiler");
      console.log("WebSocket bağlantısı sağlandı.");
    };

    ws.onmessage = (event) => {
      const dataArray = event.data.toString().split("_");

      if (dataArray[0] == "lobiler") {
        const lobiList = JSON.parse(dataArray[1] || "[]");
        setLobi(lobiList);
      }
    };
  }, []);

  const turaLobiye = () => {
    ws.send("tails_" + address.address);
  };

  const joinRoom = (roomId) => {
    const clickedRoom = lobiler.find(room => room.roomId === roomId);
    console.log(clickedRoom)
    console.log(lobiler)
    setClickedRoom(clickedRoom)
    console.log(`Joining room: ${roomId}`);
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
            <div className="two-column-container">
              <div className="column">
                <button
                  onClick={turaLobiye}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Lobiye Katıl
                </button>

                
                <h1>Lobiler</h1>
                <h2>
                  {lobiler.map((room, index) => (
                    <div
                      key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div>
                        <p>Room Name: {room.roomName}</p>
                        <p>User Count: {room.userCount}</p>
                      </div>
                      <button onClick={() => joinRoom(room.roomId)} style={{ marginRight: "10px" }} className={buttonVariants({ variant: "secondary" })}>
                        Join Room
                      </button>
                    </div>
                  ))}
                </h2>
              </div>

              <div className="column">
                <h2>Oda İçeriği</h2>
                {clickedRoom && (
                  <div>
                    <p>ID: {clickedRoom.roomId}</p>
                    <p>Name: {clickedRoom.roomName}</p>
                    <p>User Count: {clickedRoom.userCount}</p>
                    <p>Game: {clickedRoom.game}</p>
                  </div>
                )}
              </div>
            </div>
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
