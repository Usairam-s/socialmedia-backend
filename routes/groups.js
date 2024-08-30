const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createGroup,
  joinGroup,
  manageGroup,
} = require("../controllers/groupController");
const router = express.Router();

// Create a group
router.post("/", protect, createGroup);

// Join a group
router.put("/:groupId/join", protect, joinGroup);

// Manage group roles
router.put("/:groupId/manage", protect, manageGroup);

module.exports = router;
