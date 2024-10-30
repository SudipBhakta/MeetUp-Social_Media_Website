import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", require: true },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
