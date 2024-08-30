const Group = require("../models/Group");

exports.createGroup = async (req, res) => {
  try {
    const group = new Group({
      name: req.body.name,
      description: req.body.description,
      owner: req.user._id,
      members: [req.user._id],
    });

    const createdGroup = await group.save();
    res.status(201).json(createdGroup);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
      res.json({ message: "Joined group" });
    } else {
      res.status(400).json({ message: "Already a member" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.manageGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (group.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized as group owner" });
    }

    const { memberId, role } = req.body;

    const member = group.members.find(
      (member) => member._id.toString() === memberId
    );
    if (member) {
      member.role = role;
      await group.save();
      res.json({ message: "Group role updated" });
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
