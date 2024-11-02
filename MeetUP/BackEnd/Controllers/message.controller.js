import Conversation from "../Models/conversation.model.js";
import Massege from "../Models/massege.model.js";

export const sendMessage = async (req, res) => {
  try {
    const sendBy = req.id;
    const receiveBy = req.params.id;
    const { message } = req.body;
    let convertation = await Conversation.findOne({
      participants: { $all: [sendBy, receiveBy] },
    });
    if (!convertation) {
      convertation = new Conversation({});
    }
    const newMessage = await Massege.creat({
      sendBy,
      receiveBy,
      message,
    });
    if (newMessage) {
      await convertation.messages.push(newMessage._id);
    }
    await Promise.all([convertation.save(), newMessage.save()]);

    // socket io
    res.status(200).json({
      message: "Message sent successfully",
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
  }
};

// Get Conversation Messages
export const getMessage = async (req, res) => {
  try {
    const sendBy = req.id;
    const receiveBy = req.params.id;
    const conversation = await Conversation.find({
      participants: { $all: [sendBy, receiveBy] },
    });
    if (!conversation) {
      return res
       .status(404)
       .json({ message: "No conversation found", success: false ,});
    }
    return res.status(200).json({
        success: true,
        conversation: conversation?.messages,
      });
    }
   catch (error) {
    console.log("Get Message Error");
  }
};
