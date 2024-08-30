const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const router = express.Router();

// Send a message
router.post("/", protect, sendMessage);

// Get all messages
router.get("/", protect, getMessages);

module.exports = router;
