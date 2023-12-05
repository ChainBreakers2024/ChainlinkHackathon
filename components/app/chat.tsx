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
import { initSocket } from "@/lib/socketio";

// Import necessary dependencies

const ChatRoomPage = () => {
  const socket = initSocket();

  const [userRoom, setUserRoom] = useState({ roomName: '', roomId: '', game: '', users: [] });
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const address = useAccount().address;

  useEffect(() => {
    // Get the initial room details for the user
    socket.emit("get_userroom", address);
    socket.on("get_userroom", (data: any) => {
      if (data) {
        socket.emit("get_room", data);
      }
    });
  }, [socket]);

  useEffect(() => {
    // Listen for room details and set userRoom state
    socket.on("get_room", (data: any) => {
      setUserRoom(data);
    });
  }, [socket]);
  
  useEffect(() => {
    const handleNewMessage = (message: { sender: string; text: string; }) => {
      // Update state with the new message
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  
    // Subscribe to 'chat_message' event only once
    socket.on('chat_message', handleNewMessage);
  
    // Clean up event listener when component unmounts
    return () => {
      socket.off('chat_message', handleNewMessage);
    };
  }, [socket]);
  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      socket.emit("send_message", {message: messageInput, address: address});
      setMessageInput('');
    }
  };

  return (
    <Card className="w-[420px] p-6">
      {/* Display room details */}
      {/* ... (existing room details code) ... */}

      {/* Display chat messages */}
      <div className="mt-3">
        <div style={{ height: "200px", overflowY: "auto" }}>
          {messages.map((message, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <p>{message.sender}: {message.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Input box for sending messages */}
      <div className="mt-3">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 rounded border"
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded ml-2">
          Send
        </button>
      </div>
    </Card>
  );
};

export default ChatRoomPage;

