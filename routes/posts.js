const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  likePost,
  commentOnPost,
} = require("../controllers/postController");
const router = express.Router();

// Create a post
router.post("/", protect, createPost);

// Get all posts
router.get("/", protect, getPosts);

// Like a post
router.put("/:postId/like", protect, likePost);

// Comment on a post
router.post("/:postId/comment", protect, commentOnPost);

module.exports = router;
