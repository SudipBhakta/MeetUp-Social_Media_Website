//import Sharp from "sharp";
import Post from "../Models/post.model.js";
//import User from "../Models/user.model.js";
//import cloudinary from "../Utils/cloudinary.js";
import Comment from "../Models/comment.model.js";

//Add Comment Logic
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentBy = re.id;
    const { content } = req.body;
    const post = Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    const newComment = await Comment.create({
      text: content,
      author: commentBy,
      post: postId,
    }).populate({
      path: "author",
      select: "username,avatar",
    });
    await post.comments.push(newComment._id);
    await post.save();
    return res.status(200).json({
      message: "New Comment Added",
      newComment,
      success: true,
    });
  } catch (error) {
    console.log("Add Commite Error:", error);
  }
};

// Get Post All Comment logic
export const postComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username,avatar"
    );
    if (!comments) {
      return res
        .status(404)
        .json({ message: "No comments found", success: false });
    }
    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
      success: true,
    });
  } catch (error) {
    console.log("Get post comments:", error);
  }
};
