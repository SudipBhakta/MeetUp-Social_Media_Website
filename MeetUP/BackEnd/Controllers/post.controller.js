import Sharp from "sharp";
import Post from "../Models/post.model.js";
import User from "../Models/user.model.js";
import cloudinary from "../Utils/cloudinary.js";
import Comment from "../Models/comment.model.js";

//Create New Post
export const newPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    // Check if at least one of the fields is provided
    if (!caption && !image) {
      return res.status(400).json({
        message: "At least an image or caption required",
        success: false,
      });
    }

    let cloudinaryRes = null;

    // Process the image if it exists
    if (image) {
      const sharpImage = await Sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 75 })
        .toBuffer();

      // Convert the image buffer to Data URI format
      const imageUri = `data:image/jpeg;base64,${sharpImage.toString(
        "base64"
      )}`;

      // Upload to Cloudinary
      cloudinaryRes = await cloudinary.uploader.upload(imageUri);
    }

    // Create a new post
    const post = new Post({
      caption: caption,
      author: authorId,
      image: cloudinaryRes ? cloudinaryRes.secure_url : "",
    });
    await post.save();

    // Update the user's posts array
    const user = await User.findById(post.author);
    if (user) {
      await user.posts.push(post._id);
      await user.save();
      await post.populate({ path: "author", select: "-password" });
      await post.save();
    }

    return res
      .status(200)
      .json({ message: "Post created successfully", success: true, post });
  } catch (error) {
    console.error("Post Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// Get Posts
export const allPosts = async (req, res) => {
  try {
    const allPost = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, avatar" })
      .populate({ path: "comments", select: "username , avatar" });
    if (!allPost) {
      return res.status(404).json({
        message: "No Post Found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      allPost,
    });
  } catch (error) {
    console.log("Get All Post Error:", error);
  }
};

// Get user posts
export const userPosts = async (req, res) => {
  try {
    const userPost = await Post.find({ author: req.id })
      .sort({
        createdAt: -1,
      })
      .populate({ path: "author", select: "username, avatar" })
      .populate({ path: "comment", select: "username , avatar" });
    if (!userPost) {
      return res
        .status(400)
        .json({ message: "User Post Not Available", success: false });
    }
    return res
      .status(200)
      .json({ message: "User Post Fetching", success: true, userPosts });
  } catch (error) {
    console.log("User Post Error:", error);
  }
};

// Like Unlike Logic
export const likeAndUnlike = async (req, res) => {
  const likedBy = req.id;
  const postID = req.params.id;
  const likedPost = await Post.findById(postID);

  try {
    if (!likedPost || !likedBy) {
      return res.status(404).json({
        message: "Post Not Find",
        success: false,
      });
    }
    if (likedPost.likes.includes(likedBy)) {
      await likedPost.updateOne({ $pull: { likes: likedBy } });
      return res.status(400).json({
        message: "Unlike Successfully",
        success: true,
      });
    }
    await likedPost.updateOne({ $addToSet: { likes: likedBy } });

    return res.status(200).json({
      message: "Like Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Like Unlike Error", error);
  }
};

// Edit Post Logic
export const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { caption } = req.body;
    const image = req.file;
    if (!caption && !image) {
      return res.status(400).json({
        message: "At least an image or caption required to edit",
        success: false,
      });
    }
    // Handle image upload if an image is provided
    let cloudinaryRes;
    if (image) {
      const sharpImage = await Sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 75 })
        .toBuffer();
      const imageUri = `data:image/jpeg;base64,${sharpImage.toString(
        "base64"
      )}`;
      cloudinaryRes = await cloudinary.uploader.upload(imageUri);
    }
    // Find the existing post
    let post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    // Update post fields
    if (cloudinaryRes) {
      // Remove the old image if a new image is uploaded
      await cloudinary.uploader.destroy(post.image.public_id);
      post.image = cloudinaryRes;
    }
    post.caption = caption || post.caption;

    // Save the updated post
    await post.save();

    return res.status(200).json({
      message: "Post edited successfully",
      success: true,
      post,
    });
  } catch (error) {
    console.error("Edit Post Error:", error);
    return res.status(500).json({
      message: "An error occurred while editing the post",
      success: false,
      error: error.message,
    });
  }
};

//Delete Post Logic
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const authorId = req.id;
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    if (post.author.toString() !== authorId) {
      return res.status(401).json({
        message: "You are not valid Author",
      });
    }
    // Remove the post from the user post aray
    await User.findByIdAndUpdate(post.author, { $pull: { posts: post._id } });

    // Remove the post from the comments array
    await Comment.deleteMany({ post: post._id });

    // Delete the post from the database
    await Post.findByIdAndDelete(post._id); // Use findByIdAndDelete instead of post.delete()
    return res
      .status(200)
      .json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    console.log("Delete Post Error:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the post",
      success: false,
    });
  }
};
