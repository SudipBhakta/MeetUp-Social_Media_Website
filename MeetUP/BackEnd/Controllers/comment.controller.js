//import Sharp from "sharp";
import Post from "../Models/post.model.js";
//import User from "../Models/user.model.js";
//import cloudinary from "../Utils/cloudinary.js";
import Comment from "../Models/comment.model.js";

//Add Comment Logic
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentBy = req.id;
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
export const allComments = async (req, res) => {
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

//Edit Comment Logic
export const editComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const author = req.id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }
    if (comment.author.toString() !== author) {
      return res.status(401).json({
        message: "You are not authorized to edit this comment",
        success: false,
      });
    }
    comment.text = content;
    await comment.save();
    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
      success: true,
    });
  } catch (error) {
    console.log("Edit Comment Error:", error);
  }
};

//Delete Comment Logic
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const author = req.id;
    if (!comment) {
      return res.status(404).json({
        message: "Comment Not Found",
        success: false,
      });
    }
    if (comment.author.toString() !== author) {
      return res.status(401).json({
        message: "You are not authorized to delete this comment",
        success: false,
      });
    }
    // find post delete the comment for comments
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });
    // delete comment from database
    await Comment.findByIdAndDelete(comment._id);
    return res.status(200).json({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Comment Delete Error:", error);
  }
};
