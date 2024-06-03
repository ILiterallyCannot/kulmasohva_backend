const User = require("../models/user.model");

function allAccess(req, res) {
  res.status(200).send("Public Content visible to anyone.");
}

function userBoard(req, res) {
  res.status(200).send("Registered User only Area.");
}

function adminBoard(req, res) {
  res.status(200).send("Admin Content only visible to admins.");
}

function moderatorBoard(req, res) {
  res.status(200).send("Content only visible to moderators.");
}

async function searchUsers(req, res) {
  const criteria = req.query;
  const users = await User.find(criteria);
  res.json(users);
}

async function updateUserRoles(req, res) {
  const { userId, newRoles } = req.body;
  await User.findByIdAndUpdate(userId, { roles: newRoles });
  res.send({ message: "User roles updated successfully!" });
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function getUserByUsername(req, res) {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function getRoleByUserId(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json({ roles: user.roles });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function updateUserRoles(req, res) {
  try {
    const userId = req.params.id;
    const { roles } = req.body;

    if (!Array.isArray(roles)) {
      return res.status(400).send({ message: "Roles should be an array" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { roles },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User roles updated successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating user roles" });
  }
}

module.exports = {
  userBoard,
  allAccess,
  adminBoard,
  moderatorBoard,
  searchUsers,
  updateUserRoles,
  getUserById,
  getUserByUsername,
  getRoleByUserId,
  updateUserRoles
};
