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
userRouter.route("/signup").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/profile/edit").post(isAuthanticat, upload.single("avatar"), editProfile);
userRouter.route("/suggestedusers").get(isAuthanticat, suggestedUsers);
userRouter.route("/profile/:id").get(isAuthanticat, getProfile);
userRouter.route("/follow/:id").post(isAuthanticat, followAndUnllow);
userRouter.route("/unfollow/:id").post(isAuthanticat, followAndUnllow);


export default userRouter;
