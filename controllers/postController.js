const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.createPost = async (req, res, next) => {
  try {
    if (!req.body.content) {
      res.status(400);
      return next(new Error("Post content is required"));
    }

    // Handle file upload
    let mediaUrl;
    if (req.file) {
      mediaUrl = req.file.path;
    }

    // Create a new post
    const post = new Post({
      content: req.body.content,
      author: req.user._id,
      mediaUrl: mediaUrl,
    });

    const createdPost = await post.save();

    res.status(201).json({
      message: "Post created successfully",
      post: createdPost,
    });
  } catch (error) {
    next(error); // Pass the error to the custom error handler middleware
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author", "username");

    if (!posts) {
      res.status(404);
      return next(new Error("No posts found"));
    }

    res.json({ message: "All post fetched successfully", posts });
  } catch (error) {
    next(error);
  }
};

//get All post by user id
// exports.getPosts = async (req, res, next) => {
//   try {
//     const posts = await Post.find({ author: req.user._id }).populate(
//       "author",
//       "username"
//     );

//     if (!posts) {
//       res.status(404);
//       return next(new Error("No posts found for the user"));
//     }

//     res.json(posts);
//   } catch (error) {
//     next(error);
//   }
// };

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      res.status(404);
      return next(new Error("Post not found"));
    }

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Post already liked" });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.json({ message: "Post liked" });
  } catch (error) {
    next(error);
  }
};

exports.commentOnPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!postId) {
      res.status(400);
      return next(new Error("Post ID is required"));
    }

    if (!content) {
      res.status(400);
      return next(new Error("Comment content is required"));
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      return next(new Error("Post not found"));
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      post: postId,
    });

    const createdComment = await comment.save();

    post.comments.push(createdComment._id);
    await post.save();

    res.status(201).json({
      message: "Comment created successfully",
      comment: createdComment,
    });
  } catch (error) {
    next(error);
  }
};
