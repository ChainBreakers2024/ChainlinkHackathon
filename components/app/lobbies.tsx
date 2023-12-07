"use client";
import React, { useEffect, useState } from "react";
import style from "./chat.module.css";
import { useAccount } from "wagmi";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { getSocket, disconnectSocket, initSocket } from "@/lib/socketio";
import room from "./room";

const LobbyPage = () => {
  const [lobiler, setLobi] = useState([]);
  const [clickedRoom, setClickedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search term
  const address = useAccount().address;
  const socket = initSocket();

  socket.emit("get_rooms", "temp");
  socket.on("get_room", (data: any) => {
    setClickedRoom(data)
  });
  socket.on("get_rooms", (data: any) => {
    const lobiList = data;
    setLobi(lobiList);
  });

  socket.on("connect", () => {
  });

  const listRooms = (roomId: any) => {
    socket.emit("get_room", roomId);
  };

  const refreshRooms = () => {
    socket.emit("get_rooms", "temp");
  };

  const joinRoom = (roomId: any) => {
    socket.emit("join_room", { id: roomId, name: address });
  };  
  const createRoom = (roomId: any) => {
    socket.emit("new_room", address);
    socket.emit("get_rooms", roomId);
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value); // Update search term state
  };

  return (
<div className="two-column-container">
  <div className="column">
  <div style={{ display: "flex", alignItems: "center" }}>
  <input
    type="text"
    placeholder="Search..."
    onChange={(e) => handleSearch(e.target.value)}
    style={{
      flex: "1", // Take up remaining space
      marginRight: "10px",
      border: "1px solid #737373",
      borderRadius: "5px",
      padding: "8px 12px",
      outline: "none",
      boxSizing: "border-box",
    }}
  />
  <div>
    <button
      onClick={() => createRoom(room.roomId)}
      className={buttonVariants({ variant: "secondary" })}
      style={{ marginRight: "10px", height:"45px" }}
    >
      Create
    </button>
    <button
      onClick={() => refreshRooms()}
      className={buttonVariants({ variant: "secondary" })}
      style={{ marginRight: "0px", height:"45px" }}
    >
      Refresh
    </button>
  </div>
</div>


    <hr style={{ margin: "15px 0" }} /> {/* Horizontal line as divider */}
    
    <div
      style={{
        height: "250px",
        maxHeight: "200px", // Set your desired maximum height here
        overflowY: "auto", // Enable vertical scrolling
      }}
    >
      {lobiler
        .filter((room) =>
          room.roomName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((room, index) => (
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
            {index < lobiler.length - 1 && (
              <hr style={{ margin: "15px 0" }} />
            )}
            {/* Add <hr> except for the last room */}
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
