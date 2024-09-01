const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(404);
        return next(new Error("User not found"));
      }

      next();
    } catch (error) {
      console.error("Token verification failed", error);
      res.status(401);
      return next(new Error("Not authorized, token failed"));
    }
  } else {
    res.status(401);
    return next(new Error("Not authorized, no token"));
  }
};

// Middleware to check for specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error("User role not authorized"));
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
