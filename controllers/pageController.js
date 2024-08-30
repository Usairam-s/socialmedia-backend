const Page = require("../models/Page");

exports.createPage = async (req, res) => {
  try {
    const page = new Page({
      name: req.body.name,
      description: req.body.description,
      owner: req.user._id,
      members: [req.user._id],
    });

    const createdPage = await page.save();
    res.status(201).json(createdPage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.joinPage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.pageId);

    if (!page.members.includes(req.user._id)) {
      page.members.push(req.user._id);
      await page.save();
      res.json({ message: "Joined page" });
    } else {
      res.status(400).json({ message: "Already a member" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.managePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.pageId);

    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized as page owner" });
    }

    const { memberId, role } = req.body;

    const member = page.members.find(
      (member) => member._id.toString() === memberId
    );
    if (member) {
      member.role = role;
      await page.save();
      res.json({ message: "Page role updated" });
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
