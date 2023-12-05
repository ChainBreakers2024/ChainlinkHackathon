"use client";
import React, { useEffect, useState } from "react";
import style from "./chat.module.css";
import { useAccount } from "wagmi";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import room from "./room";

const LobbyPage = ({ socket }: any) => {
  const [lobiler, setLobi] = useState([]);
  const [clickedRoom, setClickedRoom] = useState(null);
  const address = useAccount().address;

  useEffect(() => {
    socket.emit("get_rooms", "temp");
    socket.on("get_room", (data: any) => {
      setClickedRoom(data)
    });
    socket.on("get_rooms", (data: any) => {
      const lobiList = data;
      setLobi(lobiList);
    });
  }, [socket]);

  socket.on("connect", () => {
    console.log(address); // x8WIv7-mJelg7on_ALbx
  });

  const listRooms = (roomId: any) => {
    socket.emit("get_room", roomId);
  };

  const refreshRooms = (roomId: any) => {
    socket.emit("get_rooms", roomId);
  };

  const joinRoom = (roomId: any) => {
    socket.emit("join_room", { id: roomId, name: address });
  };  
  const createRoom = (roomId: any) => {
    socket.emit("new_room", address);
    socket.emit("get_rooms", roomId);
  };

  return (
    <div className="two-column-container">
    <div className="column">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
      <h1>Rooms</h1>
      <div style={{ marginLeft: "auto" }}>
        <button
          onClick={() => createRoom(room.roomId)}
          className={buttonVariants({ variant: "secondary" })}
          style={{ marginRight: "10px" }}
        >
          Create Room
        </button>
        <button
          onClick={() => refreshRooms()}
          className={buttonVariants({ variant: "secondary" })}
          style={{ marginRight: "0px" }}
        >
          Refresh Rooms
        </button>
      </div>
    </div>
      <hr style={{ margin: "15px 0" }} /> {/* Horizontal line as divider */}
      <div
  style={{
    height:"250px",
    maxHeight: "200px", // Set your desired maximum height here
    overflowY: "auto", // Enable vertical scrolling
  }}
>
{lobiler.map((room, index) => (
  <div key={index}>
    <div
      style={{
        display: "flex",
        alignItems: "left",
        justifyContent: "space-between",
        marginBottom: "10px",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <p>{room.roomName}</p>
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
    {index < lobiler.length - 1 && <hr style={{ margin: "15px 0" }} />} {/* Add <hr> except for the last room */}
  </div>
))}

    </div>
    </div>
      <div className="column">
      <h1 style={{ fontSize: "24px" }}>Room Content</h1> {/* Adjust the font size as needed */}
        <hr style={{ margin: "15px 0" }} />
        {clickedRoom && (
          <div>
            <p>ID: <b>{clickedRoom.roomId}</b></p>
            <p>Name: <b>{clickedRoom.roomName}</b></p>
            <p>User Count: <b>{clickedRoom.userCount}</b></p>
            <p>Game: <b>{clickedRoom.game}</b></p>
            <Link
              href={"/dashboard/room"}
              onClick={() => joinRoom(clickedRoom.roomId)}
              rel="noreferrer noopener"
              style={{marginTop: "10px"}}
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
