import Conversation from "../Models/conversation.model.js";
import Message from "../Models/massege.model.js";
import { getReceiverSocketID, io } from "../socket/soket.js"; 

export const sendMessage = async (req, res) => {
  try {
    const sendBy = req.id;
    const receiveBy = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [sendBy, receiveBy] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sendBy, receiveBy],
      });
    }

    const newMessage = await Message.create({
      sender: sendBy,
      receiver: receiveBy,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketID
    (receiveBy);
    if (receiverSocketId) {
      console.log("Emitting message to receiver socket:", receiverSocketId);
      io.to(receiverSocketId).emit("newMessage", newMessage);
      console.log(newMessage)
    } else {
      console.log("Receiver is not connected, unable to send message.");
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Conversation Messages
export const getMessage = async (req, res) => {
  try {
    const sendBy = req.id;
    const receiveBy = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [sendBy, receiveBy] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }
    return res.status(200).json({
      success: true,
      messages: conversation?.messages,
    });
  } catch (error) {
    console.log("Get Message Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
