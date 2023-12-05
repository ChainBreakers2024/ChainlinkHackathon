// socketClient.ts

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io("http://80.208.221.81:8080");

    // Example: Listen for 'chat_message' event (Ensure this is set up only once)
    socket.on('chat_message', (message) => {
      console.log('Received message:', message);
      // Handle the received message
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket.io is not initialized");
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // Reset the socket instance
  }
};
