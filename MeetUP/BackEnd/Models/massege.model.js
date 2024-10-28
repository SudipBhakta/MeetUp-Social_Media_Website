import mongoose from "mongoose";

const massegeSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reciver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    massege: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Massege = mongoose.model("Massege", massegeSchema);
