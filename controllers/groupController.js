const Group = require("../models/Group");

exports.createGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400);
      return next(new Error("Group name is required"));
    }

    if (!description) {
      res.status(400);
      return next(new Error("Group description is required"));
    }

    const group = new Group({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    const createdGroup = await group.save();

    res.status(201).json({
      message: "Group created successfully",
      group: createdGroup,
    });
  } catch (error) {
    next(error);
  }
};

exports.joinGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      res.status(400);
      return next(new Error("Group ID is required"));
    }

    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404);
      return next(new Error("Group not found"));
    }

    if (group.members.includes(req.user._id)) {
      res.status(400);
      return next(new Error("Already a member of this group"));
    }

    group.members.push(req.user._id);
    await group.save();

    res.json({ message: "Joined group successfully" });
  } catch (error) {
    next(error);
  }
};

exports.manageGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { memberId, role } = req.body;

    if (!groupId) {
      res.status(400);
      return next(new Error("Group ID is required"));
    }

    if (!memberId) {
      res.status(400);
      return next(new Error("Member ID is required"));
    }

    if (!role) {
      res.status(400);
      return next(new Error("Role is required"));
    }

    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404);
      return next(new Error("Group not found"));
    }

    if (group.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error("Not authorized as group owner"));
    }

    const member = group.members.find(
      (member) => member._id.toString() === memberId
    );

    if (member) {
      member.role = role;
      await group.save();
      res.json({ message: "Group role updated successfully" });
    } else {
      res.status(404);
      return next(new Error("Member not found"));
    }
  } catch (error) {
    next(error);
  }
};
