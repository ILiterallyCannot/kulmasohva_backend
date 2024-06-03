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

module.exports = {
  userBoard,
  allAccess,
  adminBoard,
  moderatorBoard,
  searchUsers,
  getUserById,
  getUserByUsername,
};
