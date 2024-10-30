import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./Utils/db.js";
import userRouter from "./Routs/user.routs.js";
import postRouter from "./Routs/post.routs.js";

dotenv.config();
const app = express();

// Assigned Environment Variables
const PORT = process.env.PORT || 3000;

//send response to browser
app.get("/", (req, res) => {
  res.status(200).json({
    message: "responce comming",
    success: true,
  });
});

//Middle Wares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "https://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

//Routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/post",postRouter)

//PORT Assigned
app.listen(PORT, async() => {
  await connectDB();
  console.log(`Server Listen To Port ${PORT}`);
});
