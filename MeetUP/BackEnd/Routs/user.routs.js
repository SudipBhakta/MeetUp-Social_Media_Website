import express from "express";
import {
  editProfile,
  followAndUnllow,
  getProfile,
  login,
  logout,
  register,
  suggestedUsers,
} from "../Controllers/user.controller.js";
import { isAuthanticat } from "../middlewere/auth.middleware.js";
import { upload } from "../Middlewere/multer.middleware.js";

const userRouter = express.Router();
//define routes
userRouter.route("/resgister").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/:id/profile").get(isAuthanticat, getProfile);
userRouter
  .route("/profile/edit")
  .post(isAuthanticat, upload.single("avatar"), editProfile);
userRouter.route("/suggestedUser").get(isAuthanticat, suggestedUsers);
userRouter.route("/followAndUnfollow/:id").post(isAuthanticat, followAndUnllow);

export default userRouter;
