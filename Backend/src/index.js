import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDb } from "./lib/db.js";
import { startCleanupService } from "./lib/cleanup.js";

import authRoutes from "./routes/auth.routes.js";
import messagesRoutes from "./routes/messages.routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

// Socket.IO connection
const userSocketMap = {}; // {userId: socketId}
const typingUsers = {}; // {conversationId: [userIds]}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins
  socket.on("user_online", (userId) => {
    userSocketMap[userId] = socket.id;
    io.emit("user_status", { userId, status: "online", userSocketMap });
    console.log(`User ${userId} is online. Active users:`, Object.keys(userSocketMap));
  });

  // Typing indicator
  socket.on("typing", ({conversationId, userId, isTyping}) => {
    if (isTyping) {
      if (!typingUsers[conversationId]) {
        typingUsers[conversationId] = [];
      }
      if (!typingUsers[conversationId].includes(userId)) {
        typingUsers[conversationId].push(userId);
      }
    } else {
      if (typingUsers[conversationId]) {
        typingUsers[conversationId] = typingUsers[conversationId].filter(id => id !== userId);
      }
    }
    io.emit("typing_status", {conversationId, typingUsers: typingUsers[conversationId] || []});
  });

  // Receive message from client and relay to receiver
  socket.on("send_message", (message) => {
    console.log(`Message event received from ${message.senderId} to ${message.receiverId}`);
    const receiverSocketId = userSocketMap[message.receiverId];
    
    if (receiverSocketId) {
      // Send to receiver
      io.to(receiverSocketId).emit("receive_message", message);
      console.log(`Message delivered to receiver ${message.receiverId}`);
    } else {
      console.log(`Receiver ${message.receiverId} not online`);
    }
    
    // Also send confirmation back to sender for optimistic update
    socket.emit("message_sent", { messageId: message._id });
  });

  // Message reactions
  socket.on("message_reaction", ({messageId, userId, emoji, receiverId}) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("reaction_update", {messageId, userId, emoji});
    }
  });

  // User disconnects
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Find and remove user
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        io.emit("user_status", { userId, status: "offline", userSocketMap });
        console.log(`User ${userId} went offline. Active users:`, Object.keys(userSocketMap));
        break;
      }
    }
  });

});

httpServer.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDb();
    // Start cleanup service
    startCleanupService();
    console.log('🧹 Auto-cleanup service started (runs daily at 2 AM)');
});