import { io } from "socket.io-client";
var socket2: any;
socket2 = io("http://80.208.221.81:8080");

export const socket = socket2