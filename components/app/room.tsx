"use client";
import React, { useEffect, useState } from "react";
import style from "./chat.module.css";
import { useAccount } from "wagmi";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Card } from "@/components/ui/card"
import { WalletAddress } from "../blockchain/wallet-address";
import { WalletBalance } from "../blockchain/wallet-balance";
import { WalletNonce } from "../blockchain/wallet-nonce";
import { emit } from "process";

const RoomPage = ({ socket }: any) => {
  const [userRoom, setuserRoom] = useState([]);
  const [userRoomId, setuserRoomId] = useState([]);
  const [userList, setUserList] = useState([]);
  const address = useAccount().address;

  useEffect(() => {
    socket.emit("get_userroom", address);
    socket.on("get_userroom", (data: any) => {
      if (data) {socket.emit("get_room", data)}
      setuserRoomId(data);
    });
  }, [socket]);
  socket.on("get_room", (data: any) => {
    setuserRoom(data)
  });

  const leaveRoom = (roomId: any) => {
    socket.emit("leave_room", { id: roomId, name: address });
  };

  return (
    <Card className="w-[420px] p-6">
    <h3 className="text-2xl font-normal">{userRoom.roomName}</h3>
    <hr className="my-3 dark:opacity-30" />
    <div className="mt-3">
      <span className="mr-1 font-bold">Id:</span>{" "}
      {userRoom.roomId}
    </div>
    <div className="mt-3">
      <span className="mr-1 font-bold">Game:</span> {userRoom.game}
    </div>
    <div className="mt-3">
    <span className="mr-1 font-bold">Users:</span>
    <div
  style={{
    height:"150px",
    maxHeight: "150px", // Set your desired maximum height here
    overflowY: "auto", // Enable vertical scrolling
  }}
>
  {userRoom.users &&
    userRoom.users.map((user, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "left",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <p>{user}</p>
        </div>
      </div>
    ))}
</div>

    </div>
    <div className="mt-3">
    <Link
              href={"/dashboard"}
              onClick={() => leaveRoom(userRoom.roomId)}
              rel="noreferrer noopener"
              className={buttonVariants({ variant: "secondary" })}
            >
              Leave Room
            </Link>
    </div>
    <hr className="my-3 dark:opacity-30" />
  </Card>
  );
};

export default RoomPage;
