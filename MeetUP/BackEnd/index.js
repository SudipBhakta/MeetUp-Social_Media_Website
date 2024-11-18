import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./Utils/db.js";
import userRouter from "./Routs/user.routs.js";
import postRouter from "./Routs/post.routs.js";
import messageRouter from "./Routs/message.routs.js";
import { app, server} from "./socket/soket.js";

dotenv.config();
// Assigned Environment Variables
const PORT = process.env.PORT || 3000;

// Middle Wares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));


// Define Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/message", messageRouter);

// PORT Assigned
server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server Listening on Port ${PORT}`);
});
