import { io } from "socket.io-client";

const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL;

export const socket = io(`${CHAT_SERVER_URL}`, {
  path: "/users-chat",
  transports: ["websocket"],
  withCredentials: true,
});
