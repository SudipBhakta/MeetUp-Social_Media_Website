import express from "express";
import { isAuthanticat } from "../middlewere/auth.middleware.js";
import { getMessage, sendMessage } from "../Controllers/message.controller.js";

const messageRouter=express.Router()

// Define routes

messageRouter.route("/sendMessage/:id").post(isAuthanticat,sendMessage)
messageRouter.route("/getMessage/:id").get(isAuthanticat,getMessage)

export default messageRouter;

