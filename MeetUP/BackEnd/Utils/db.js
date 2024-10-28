import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MongoDB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MongoDB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
