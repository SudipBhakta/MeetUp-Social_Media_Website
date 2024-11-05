import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../Utils/dataUri.js";
import cloudinary from "../Utils/cloudinary.js";
import Post from "../Models/post.model.js";

//Registration Logic
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Registration details are missing",
        success: false,
      });
    }
    // Check for existing user
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(401).json({
        message: "Email id already exist, try different email id",
        success: false,
      });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(401).json({
        message: "User Name already exist, try different email id",
        success: false,
      });
    }
    //hash pasword using bycript js
    const hashedPassword = await bcrypt.hash(password, 10);
    // creat user in DB
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({
      message: "Registration successfull",
      success: true,
    });
  } catch (error) {
    console.log("Registration Error:", error);
  }
};

//Login Logic
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Email & Password both are required",
        success: false,
      });
    }
    //check valid  user or not
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email id, enter correct email id",
        success: false,
      });
    }
    // check valid password or not
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({
        message: "Invalid password, enter correct passsword",
        success: false,
      });
    }
    //genrate jwt token
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    //get all posts of user
    const userPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );
    //update user
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followers: user.followers,
      following: user.followings,
      posts: userPosts,
    };

    console.log(token);
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log("Login Error", error);
  }
};

//Logout Logic
export const logout = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logout Successfull",
      success: true,
    });
  } catch (error) {
    console.log("Logout Error:", error);
  }
};

// Get Profile Logic
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");
    res.json({
      message: "Profile fetching successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log("Get Profile Error:", error);
  }
};

//Edit Profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { username, gender, bio } = req.body;
    const avatar = req.file;
    let cloudinaryRes;
    // upload file to cludinary
    if (avatar) {
      const fileUri = getDataUri(avatar);
      cloudinaryRes = await cloudinary.uploader.upload(fileUri);
    }
    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    user.username = username || user.username;
    user.gender = gender || user.gender;
    user.bio = bio || user.bio;
    if (cloudinaryRes) {
      user.avatar = cloudinaryRes.secure_url;
    }
    await user.save();
    return res.json({
      message: "Profile edited successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Edit Profile Error:", error);
  }
};

//Suggested User logic
export const suggestedUsers = async (req, res) => {
  try {
    const user = await User.find({ _id: { $ne: req.id } }).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "No Suggested User Found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("SuggestedUser Error:", error);
  }
};

// Follow And Unflow User Logic
export const followAndUnllow = async (req, res) => {
  try {
    const followBy = await User.findById(req.id);
    const followTo = await User.findById(req.params.id);

    if (!followBy || !followTo) {
      return res.status(404).json({
        message: "User not Found",
        success: false,
      });
    }
    // check if already following or not
    if (followBy.followings.includes(followTo._id)) {
      //unfollow ligic
      await Promise.all([
        User.updateOne(
          { _id: followBy._id },
          { $pull: { followings: followTo._id } }
        ),
        User.updateOne(
          { _id: followTo._id },
          { $pull: { followers: followBy._id } }
        ),
      ]);
      return res.status(200).json({
        message: "Unfollowed Successfully",
        success: true,
      });
    } else {
      // follow logic
      await Promise.all([
        User.updateOne(
          { _id: followBy._id },
          { $push: { followings: followTo._id } }
        ),
        User.updateOne(
          { _id: followTo._id },
          { $push: { followers: followBy._id } }
        ),
      ]);
      return res.status(200).json({
        message: "Followed Successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log("Follow Unfollow Error:", error);
  }
};
