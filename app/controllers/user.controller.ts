import UserModel from "../models/user.model";
import { Request as Req, Response as Res } from 'express';

export const allAccess = (req: Req, res: Res): void => {
  res.status(200).send("Public Content visible to anyone.");
};

export const userBoard = (req: Req, res: Res): void => {
  res.status(200).send("Registered User only Area.");
};

export const adminBoard = (req: Req, res: Res): void => {
  res.status(200).send("Admin Content only visible to admins.");
};

export const moderatorBoard = (req: Req, res: Res): void => {
  res.status(200).send("Content only visible to moderators.");
};

export const searchUsers = async (
  req: Req<{}, {}, {}, { criteria: string }>,
  res: Res
): Promise<void> => {
  try {
    const { criteria } = req.query;
    const users = await UserModel.find(JSON.parse(criteria));
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).send({ message: "Error searching users" });
  }
};

export const getUserById = async (
  req: Req<{ id: string }>,
  res: Res
): Promise<void> => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ message: "Error fetching user" });
  }
};

export const getUserByUsername = async (
  req: Req<{ username: string }>,
  res: Res
): Promise<void> => {
  try {
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ message: "Error fetching user" });
  }
};

export const deleteUserById = async (
  req: Req<{ id: string }>,
  res: Res
): Promise<void> => {
  try {
    const user = await UserModel.findByIdAndDelete({ _id: req.params.id });
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ message: "Error deleting user" });
  }
};

export const updateUserProfile = async (
  req: Req<{ id: string }>,
  res: Res
): Promise<void> => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );

    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    res.json({ message: "User profile updated successfully", user: user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send({ message: "Error updating user profile" });
  }
};

module.exports = {
  userBoard,
  allAccess,
  adminBoard,
  moderatorBoard,
  searchUsers,
  getUserById,
  getUserByUsername,
  deleteUserById,
  updateUserProfile,
};
