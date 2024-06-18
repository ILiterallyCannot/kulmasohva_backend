import RoleModel, { IRole } from "../models/role.model";
import UserModel from "../models/user.model";
import { Req, Res } from "express";

export const getRoleByUserId = async (req: Req, res: Res): Promise<void> => {
  try {
    const user = await UserModel.findById(req.params.id).populate("roles");
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    res.json({ roles: user ? user.roles : null });
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
};

export const updateUserRoles = async (req: Req, res: Res): Promise<void> => {
  try {
    const userId = req.params.id;
    const { roles } = req.body;

    if (!Array.isArray(roles)) {
      res.status(400).send({ message: "Roles should be an array" });
    }

    const roleIds = roles.map((role: IRole) => role.id);
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { roles: roleIds } },
      { new: true }
    ).populate("roles");

    if (!user) {
      res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User roles updated successfully!", user });
  } catch (error) {
    console.error("Error updating user roles", error);
    res.status(500).send({ message: "Error updating user roles" });
  }
};

export const getAllRoles = async (req: Req, res: Res): Promise<void> => {
  try {
    const roles = await RoleModel.find();
    res.json(roles);
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
};

module.exports = {
  updateUserRoles,
  getRoleByUserId,
  getAllRoles,
};
