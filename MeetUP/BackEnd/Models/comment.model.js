import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },  // corrected 'require' to 'required'
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  // corrected 'require' to 'required'
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },  // corrected 'require' to 'required'
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

