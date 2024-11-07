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
    if (!image) {
      return res.status(400).json({
        message: "Image is required to create post",
        success: false,
      });
    }

    // Process the image if it exists
      const sharpImage = await Sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 75 })
        .toBuffer();

      // Convert the image buffer to Data URI format
      const imageUri = `data:image/jpeg;base64,${sharpImage.toString("base64")}`;

      // Upload to Cloudinary
     const cloudinaryRes = await cloudinary.uploader.upload(imageUri);

    // Create a new post
    const post = new Post({
      caption: caption,
      author: authorId,
      image: cloudinaryRes.secure_url
    });
    
    // Save the post
    await post.save();

    // Update the user's posts array
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    // Populate the author field on the post with user details
    const populatedPost = await Post.findById(post._id).populate({
      path: 'author',
      select: '-password', // Exclude the password field from the user details
    });

    return res.status(200).json({ message: "Post created successfully", success: true, post: populatedPost });
  } catch (error) {
    console.error("Post Error:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Get Posts
export const allPosts = async (req, res) => {
  try {
    const allPost = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username avatar" }) // Use space instead of comma
      .populate({ path: "comments", populate: {
        path: 'author',
        select: 'username profilePicture'
    } }); // Assuming comments have a similar structure
    
    // Check if there are no posts found
    if (allPost.length === 0) {
      return res.status(404).json({
        message: "No posts found",
        success: false,
      });
    } 
    
    return res.status(200).json({
      success: true,
      allPost,
    });
  } catch (error) {
    console.error("Get All Post Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
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

// Like a post
export const likePost = async (req, res) => {
  const likedBy = req.id; // User who is liking the post
  const postID = req.params.id; // The post to be liked
  const likedPost = await Post.findById(postID);

  try {
    if (!likedPost) {
      return res.status(404).json({
        message: "Post Not Found",
        success: false,
      });
    }

    // Add user to the "likes" array if not already present
    if (likedPost.likes.includes(likedBy)) {
      return res.status(400).json({
        message: "You have already liked this post",
        success: false,
      });
    }

    // Update the post to add the user to the likes array
    await likedPost.updateOne({ $addToSet: { likes: likedBy } });

    return res.status(200).json({
      message: "Post liked successfully",
      success: true,
    });
  } catch (error) {
    console.log("Like Error:", error);
    return res.status(500).json({
      message: "Error liking post",
      success: false,
    });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  const likedBy = req.id; // User who is unliking the post
  const postID = req.params.id; // The post to be unliked
  const likedPost = await Post.findById(postID);

  try {
    if (!likedPost) {
      return res.status(404).json({
        message: "Post Not Found",
        success: false,
      });
    }

    // Check if the user has already liked the post
    if (!likedPost.likes.includes(likedBy)) {
      return res.status(400).json({
        message: "You have not liked this post yet",
        success: false,
      });
    }

    // Remove user from the "likes" array
    await likedPost.updateOne({ $pull: { likes: likedBy } });

    return res.status(200).json({
      message: "Post unliked successfully",
      success: true,
    });
  } catch (error) {
    console.log("Unlike Error:", error);
    return res.status(500).json({
      message: "Error unliking post",
      success: false,
    });
  }
};


// Edit Post Logic
export const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    let post = await Post.findById(postId);
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

    // Remove the post comments from comment module
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

//Save Posts
export const savePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.id);
    if (!post) {
      return res.status(404).json({
        message: "Post Not Found",
        success: false,
      });
    }
    //check save post already exist then unsave
    if (user.savedposts.includes(post._id)) {
      await user.updateOne({ $pull: { savedposts: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsave",
        message: "Post Unsave Successfully",
        success: true,
      });
    } else {
      //else save the post
      await user.updateOne({ $push: { savedposts: post._id } });
      await user.save();
      return res.status(200).json({
        type: "save",
        message: "Post Save Successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log("Save Posts Error:", error);
  }
};
