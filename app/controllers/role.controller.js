const User = require("../models/user.model");
const Role = require("../models/role.model");

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

      const roleIds = roles.map(role => role.id);
      const user = await User.findByIdAndUpdate(
        userId,
        { roles: roleIds },
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

  async function getAllRoles(req, res) {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

  module.exports = {
    updateUserRoles,
    getRoleByUserId,
    getAllRoles
  };