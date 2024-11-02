import express from "express";
import {
  allPosts,
  deletePost,
  editPost,
  likeAndUnlike,
  newPost,
  savePost,
  userPosts,
} from "../Controllers/post.controller.js";
import { isAuthanticat } from "../middlewere/auth.middleware.js";
import { upload } from "../Middlewere/multer.middleware.js";
import {
  addComment,
  allComments,
  deleteComment,
  editComment,
} from "../Controllers/comment.controller.js";
const postRouter = express.Router();
//Post Routs
postRouter.route("/addpost").post(isAuthanticat, upload.single("image"), newPost);
postRouter.route("/allposts").get(isAuthanticat, allPosts);
postRouter.route("/userposts").get(isAuthanticat, userPosts);
postRouter.route("/:id/editpost").post(isAuthanticat, upload.single("image"), editPost);
postRouter.route("/:id/likepost").post(isAuthanticat, likeAndUnlike);
postRouter.route("/:id/unlikepost").post(isAuthanticat, likeAndUnlike);
postRouter.route("/:id/deletepost").delete(isAuthanticat, deletePost);
postRouter.route("/:id/savepost").post(isAuthanticat, savePost);
// Comments Routs
postRouter.route("/:id/addcomment").post(isAuthanticat, addComment);
postRouter.route("/:id/allcomments").post(isAuthanticat, allComments);
postRouter.route("/:id/editcomment").post(isAuthanticat, editComment);
postRouter.route("/:id/deletecomment").post(isAuthanticat, deleteComment);

export default postRouter;
