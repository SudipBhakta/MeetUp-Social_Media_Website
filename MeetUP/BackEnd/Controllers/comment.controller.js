import Post from "../Models/post.model.js";
import Comment from "../Models/comment.model.js";

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentBy = req.id;
    const { content } = req.body;

    // Validate input
    if (!content || content.trim() === "") {
      return res
        .status(400)
        .json({ message: "Comment content is required", success: false });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    // Create the new comment
    const comment = await Comment.create({
      text: content,
      author: commentBy,
      post: postId,
    });

    // Now populate the author field
    const populatedComment = await Comment.findById(comment._id).populate({
      path: "author",
      select: "username avatar",
    });
    post.comments.push(populatedComment._id);
    await post.save();
    return res.status(200).json({
      message: "New Comment Added",
      comment: populatedComment,
      success: true,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);
    return res.status(500).json({
      message: "An error occurred while adding the comment.",
      success: false,
    });
  }
};

// Get Post All Comment logic
export const allComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username avatar"
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
