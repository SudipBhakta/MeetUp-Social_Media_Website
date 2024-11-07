import express from "express";
import { isAuthenticat } from "../middlewere/auth.middleware.js";
import { getMessage, sendMessage } from "../Controllers/message.controller.js";

const messageRouter=express.Router()

// Define routes

messageRouter.route("/sendMessage/:id").post(isAuthenticat,sendMessage)
messageRouter.route("/getMessage/:id").get(isAuthenticat,getMessage)

export default messageRouter;

