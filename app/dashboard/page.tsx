"use client";

import { motion } from "framer-motion";

import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design";
import { WalletAddress } from "@/components/blockchain/wallet-address";
import { WalletBalance } from "@/components/blockchain/wallet-balance";
import { WalletEnsName } from "@/components/blockchain/wallet-ens-name";
import { IsWalletConnected } from "@/components/shared/is-wallet-connected";
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected";
import { useState, useEffect } from "react";
import { buttonVariants } from "@/components/ui/button"
import $ from 'jquery'; // jQuery'yi projeye eklemiş olduğunuz varsayılıyor

const ws = new WebSocket("wss://chainbreakers.cloud/aws");
export default function PageDashboard() {
  const [users, setUsers] = useState([]);
  const [tails, setTails] = useState([]);
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket bağlantısı sağlandı.");
    };
    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data.toString());
      if (parsed[0].includes("tails")) {
        const tailList = parsed;
        setTails(tailList);
      }
      if (parsed[0].includes("head")) {
        const headList = parsed;
        setHeads(headList);
      }
      if (parsed[0].includes("specs")) {
        const userList = parsed;
        setUsers(userList);
        $(document).ready(function() {
          $('#coin').on('click', function() {
            const flipResult: number = Math.random();
            $('#coin').removeClass();
        
            setTimeout(function() {
              if (flipResult <= 0.5) {
                $('#coin').addClass('heads');
                console.log('it is head');
              } else {
                $('#coin').addClass('tails');
                console.log('it is tails');
              }
            }, 100);
          });
        });
      }
    };
  }, []);
  const yaziLobiye = () => {
    ws.send("head_0x3B3F0527684C167Feb0C71bcd4F0c16329049d56");
  };
  const turaLobiye = () => {
    ws.send("tails_0x3B3F0527684C167Feb0C71bcd4F0c16329049d56");
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
            <div id="coin">
            <div className="side-a"></div>
            <div className="side-b"></div>
          </div>
            <div className="two-column-container"><div className="column">
            <button onClick={turaLobiye} className={buttonVariants({ variant: "secondary" })}>Turaya Katıl</button>
              <h2>Yazı Kullanıcılar</h2>
              <h2>
                {" "}
                <ul>
                  {tails.map((tail, index) => (
                    <li key={index}>{tail}</li>
                  ))}
                </ul>
              </h2></div>

              <div className="column">              <button onClick={yaziLobiye} className={buttonVariants({ variant: "secondary" })}>Yazıya Katıl</button> 
<h2>Tura Kullanıcılar</h2>
              <h2>
                {" "}
                <ul>
                  {heads.map((head, index) => (
                    <li key={index}>{head}</li>
                  ))}
                </ul>
              </h2></div>
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
