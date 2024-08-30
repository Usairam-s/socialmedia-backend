const Message = require("../models/Message");
const User = require("../models/User");

exports.sendMessage = async (req, res) => {
  const { recipientId, content } = req.body;

  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    const message = new Message({
      content,
      sender: req.user._id,
      recipient: recipientId,
    });

    const createdMessage = await message.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    }).populate("sender recipient", "username");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
