import express from "express";
import {
  allPosts,
  deletePost,
  editPost,
  likePost,
  newPost,
  savePost,
  unlikePost,
  userPosts,
} from "../Controllers/post.controller.js";
import { isAuthenticat } from "../middlewere/auth.middleware.js";
import { upload } from "../Middlewere/multer.middleware.js";
import {
  addComment,
  allComments,
  deleteComment,
  editComment,
} from "../Controllers/comment.controller.js";
const postRouter = express.Router();
//Post Routs
postRouter
  .route("/addpost")
  .post(isAuthenticat, upload.single("image"), newPost);
postRouter.route("/allposts").get(allPosts);
postRouter.route("/userposts").get(isAuthenticat, userPosts);
postRouter
  .route("/:id/editpost")
  .post(isAuthenticat, upload.single("image"), editPost);
postRouter.route("/:id/like").post(isAuthenticat, likePost);
postRouter.route("/:id/unlike").post(isAuthenticat, unlikePost);

postRouter.route("/:id/deletepost").post(isAuthenticat, deletePost);
postRouter.route("/:id/savepost").post(isAuthenticat, savePost);
// Comments Routs
postRouter.route("/:id/addcomment").post(isAuthenticat, addComment);
postRouter.route("/:id/allcomments").post(isAuthenticat, allComments);
postRouter.route("/:id/editcomment").post(isAuthenticat, editComment);
postRouter.route("/:id/deletecomment").post(isAuthenticat, deleteComment);

export default postRouter;
