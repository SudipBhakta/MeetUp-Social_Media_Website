import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, 
  },
});

// Store active socket IDs for users
const usersSocketId = {};

// Function to get the socket ID for a specific user
export const getReceiverSocketID = (receiverId) => {
  return usersSocketId[receiverId]; 
};

// Handle new connections from clients
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId; 

  if (userId) {
 
    usersSocketId[userId] = socket.id;
    console.log(`User connected: UserId = ${userId}, SocketId = ${socket.id}`);
  }

  io.emit("onlineUsers", Object.keys(usersSocketId));

  socket.on("disconnect", () => {
    if (userId) {
      delete usersSocketId[userId];
      console.log(`User disconnected: UserId = ${userId}`);
    }
    io.emit("onlineUsers", Object.keys(usersSocketId));
  });
});
export { app, server, io };
