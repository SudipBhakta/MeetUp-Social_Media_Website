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
import { isAuthenticat } from "../middlewere/auth.middleware.js";
import { upload } from "../Middlewere/multer.middleware.js";

const userRouter = express.Router();
//define routes
userRouter.route("/signup").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/profile/edit").post(isAuthenticat, upload.single("avatar"), editProfile);
userRouter.route("/suggestedusers").get(isAuthenticat, suggestedUsers);
userRouter.route("/profile/:id").get(isAuthenticat, getProfile);
userRouter.route("/follow/:id").post(isAuthenticat, followAndUnllow);
userRouter.route("/unfollow/:id").post(isAuthenticat, followAndUnllow);


export default userRouter;
