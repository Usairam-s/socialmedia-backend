const Page = require("../models/Page");

exports.createPage = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400);
      return next(new Error("Page name is required"));
    }

    if (!description) {
      res.status(400);
      return next(new Error("Page description is required"));
    }

    const page = new Page({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    const createdPage = await page.save();

    res.status(201).json({
      message: "Page created successfully",
      page: createdPage,
    });
  } catch (error) {
    next(error);
  }
};

exports.joinPage = async (req, res, next) => {
  try {
    const { pageId } = req.params;

    if (!pageId) {
      res.status(400);
      return next(new Error("Page ID is required"));
    }

    const page = await Page.findById(pageId);

    if (!page) {
      res.status(404);
      return next(new Error("Page not found"));
    }

    if (!req.user || !req.user._id) {
      res.status(400);
      return next(new Error("User is not authenticated"));
    }

    // Ensure page.followers is an array
    if (!Array.isArray(page.followers)) {
      page.followers = [];
    }

    if (page.followers.includes(req.user._id)) {
      res.status(400);
      return next(new Error("Already a member of this page"));
    }

    page.followers.push(req.user._id);
    await page.save();

    res.json({ message: "Joined page successfully" });
  } catch (error) {
    next(error);
  }
};

exports.managePage = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const { memberId, role } = req.body;

    if (!pageId) {
      res.status(400);
      return next(new Error("Page ID is required"));
    }

    if (!memberId) {
      res.status(400);
      return next(new Error("Member ID is required"));
    }

    if (!role) {
      res.status(400);
      return next(new Error("Role is required"));
    }

    const page = await Page.findById(pageId);

    if (!page) {
      res.status(404);
      return next(new Error("Page not found"));
    }

    if (page.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error("Not authorized as page owner"));
    }

    const member = page.followers.find(
      (follower) => follower.user.toString() === memberId
    );

    if (member) {
      member.role = role;
      await page.save();
      res.json({ message: "Page role updated" });
    } else {
      res.status(404);
      return next(new Error("Member not found"));
    }
  } catch (error) {
    next(error);
  }
};
