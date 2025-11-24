import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./lib/db.js";

import authRoutes from "./routes/auth.routes.js";
import messagesRoutes from "./routes/messages.routes.js";



dotenv.config();


const PORT = process.env.PORT ;


const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],// frontend url 
    credentials: true,
}));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);


app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDb();
});