const Message = require("../models/Message");
const User = require("../models/User");

exports.sendMessage = async (req, res, next) => {
  const { recipientId, content } = req.body;

  try {
    if (!recipientId) {
      res.status(400);
      return next(new Error("Recipient ID is required"));
    }

    if (!content || content.trim() === "") {
      res.status(400);
      return next(new Error("Message content is required"));
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(404);
      return next(new Error("Recipient not found"));
    }

    const message = new Message({
      content,
      sender: req.user._id,
      recipient: recipientId,
    });

    const createdMessage = await message.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401);
      return next(new Error("User not authenticated"));
    }

    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    }).populate("sender recipient", "username");

    if (!messages.length) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.json(messages);
  } catch (error) {
    next(error);
  }
};
