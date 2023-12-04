"use client";
import React, { useEffect, useState } from "react";
import style from "./chat.module.css";
import { useAccount } from "wagmi";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const LobbyPage = ({ socket }: any) => {
  const [lobiler, setLobi] = useState([]);
  const [clickedRoom, setClickedRoom] = useState(null);
  const address = useAccount().address;

  useEffect(() => {
    socket.emit("get_rooms", "temp");
    socket.on("get_rooms", (data: any) => {
      const lobiList = data;
      setLobi(lobiList);
    });
  }, [socket]);

  socket.on("connect", () => {
    console.log(address); // x8WIv7-mJelg7on_ALbx
  });

  const listRooms = (roomId: any) => {
    const clickedRoom = lobiler.find((room) => room.roomId === roomId) || [];
    setClickedRoom(clickedRoom);
  };

  const joinRoom = (roomId: any) => {
    socket.emit("join_room", { id: roomId, name: address });
  };

  return (
    <div className="two-column-container">
      <div className="column">
        <h1>Rooms</h1>
        <h2>
          {lobiler.map((room, index) => (
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
                {" "}
                {/* Updated style to align content left */}
                <p>Room Name: {room.roomName}</p>
                <p>User Count: {room.userCount}</p>
              </div>
              <button
                onClick={() => listRooms(room.roomId)}
                style={{ marginRight: "10px" }}
                className={buttonVariants({ variant: "secondary" })}
              >
                View Room
              </button>
            </div>
          ))}
        </h2>
      </div>

      <div className="column">
        <h2>Room Content</h2>
        {clickedRoom && (
          <div>
            <p>ID: {clickedRoom.roomId}</p>
            <p>Name: {clickedRoom.roomName}</p>
            <p>User Count: {clickedRoom.userCount}</p>
            <p>Game: {clickedRoom.game}</p>
            <Link
              href={"/dashboard/room"}
              onClick={() => joinRoom(clickedRoom.roomId)}
              rel="noreferrer noopener"
              className={buttonVariants({ variant: "secondary" })}
            >
              Join Room
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbyPage;
