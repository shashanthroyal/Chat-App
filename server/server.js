import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from './routes/authRoutes.js'
import messageRoutes from './routes/messageRoutes.js';
import { Server } from "socket.io";
import Message from './models/Message.js';
import http from 'http';

dotenv.config();
const app = express();
const server = http.createServer(app);


const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);



const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);
  
    
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });
  
    
    socket.on("send_message", async (data) => {
      const { senderId, receiverId, text } = data;
  
      try {
        const newMessage = new Message({ senderId, receiverId, text });
        await newMessage.save();
    
        io.to(receiverId).emit("receive_message", newMessage);
      } catch (error) {
        console.error("Error saving or emitting message:", error);
        // Optionally, emit an error back to the sender
        socket.emit("message_error", "Failed to send message.");
      }
    });
  
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    server.listen(PORT,()=>{
        console.log(`Server is running on port number ${PORT}`)
    })
})
.catch((err) => console.error(err))