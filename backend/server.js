import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from 'http';
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import cookieParser from "cookie-parser";
import goalRoutes from "./routes/goals.routes.js";
import calendarRoutes from "./routes/calender.routes.js";
import roomRoutes from "./routes/room.routes.js";
import initializeSocket from "./socket.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // Allow credentials (cookies) to be sent with CORS requests
  })
);

app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/rooms", roomRoutes);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

initializeSocket(io);

server.listen(process.env.PORT || 5000, () => {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(error => console.error('MongoDB connection error:', error));
    
  console.log(`Server is running on port: ${process.env.PORT || 5000}`);
});
