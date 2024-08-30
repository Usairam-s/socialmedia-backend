const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      author: req.user._id,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Post already liked" });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.json({ message: "Post liked" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    const comment = new Comment({
      content: req.body.content,
      author: req.user._id,
      post: req.params.postId,
    });

    const createdComment = await comment.save();
    post.comments.push(createdComment._id);
    await post.save();

    res.status(201).json(createdComment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
