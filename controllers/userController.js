const User = require("../models/User");

exports.getUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400);
      return next(new Error("User ID is missing from the request"));
    }

    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        message: "User Found",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(404);
      return next(new Error("User not found"));
    }
  } catch (err) {
    next(err);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400);
      return next(new Error("User ID is missing from the request"));
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    if (req.body.email && !/\S+@\S+\.\S+/.test(req.body.email)) {
      res.status(400);
      return next(new Error("Invalid email format"));
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        res.status(400);
        return next(new Error("Password must be at least 6 characters long"));
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      message: "User Updated Successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
