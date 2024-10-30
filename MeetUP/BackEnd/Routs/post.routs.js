import express from "express";
import { allPosts, deletePost, editPost, likeAndUnlike, newPost, userPosts } from "../Controllers/post.controller.js";
import { isAuthanticat } from "../middlewere/auth.middleware.js";
import { upload } from "../Middlewere/multer.middleware.js";
const postRouter = express.Router();
//define routes
postRouter.route("/:id/newPost").post(isAuthanticat, upload.single("image"), newPost);
postRouter.route("/allPosts").get(allPosts)
postRouter.route("/userPosts").get(isAuthanticat,userPosts)
postRouter.route("/:id/editPost").post(isAuthanticat,editPost)
postRouter.route("/:id/likeAndUnlike").post(isAuthanticat,likeAndUnlike)
postRouter.route("/:id/deletePost").delete(isAuthanticat,deletePost);
export default postRouter;