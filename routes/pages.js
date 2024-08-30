const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createPage,
  managePage,
  joinPage,
} = require("../controllers/pageController");
const router = express.Router();

// Create a page
router.post("/", protect, createPage);

// Join a page
router.put("/:pageId/join", protect, joinPage);

// Manage page roles
router.put("/:pageId/manage", protect, managePage);

module.exports = router;
