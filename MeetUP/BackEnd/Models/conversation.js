import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  massege: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});
export default Conversation = mongoose.model("Conversation",conversationSchema);
