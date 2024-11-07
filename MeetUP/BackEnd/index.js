import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./Utils/db.js";
import userRouter from "./Routs/user.routs.js";
import postRouter from "./Routs/post.routs.js";
import messageRouter from "./Routs/message.routs.js";

dotenv.config();
const app = express();

// Assigned Environment Variables
const PORT = process.env.PORT || 3000;

// Send response to browser
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Response coming",
    success: true,
  });
});

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
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server Listening on Port ${PORT}`);
});
