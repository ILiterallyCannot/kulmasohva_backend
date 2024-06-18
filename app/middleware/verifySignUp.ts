import { Next, Req, Res } from "express";
import RoleModel from "../models/role.model";
import UserModel from "../models/user.model";

const ROLES = ["user", "admin", "moderator"];

const checkDuplicateUsernameOrEmail = (req: Req, res: Res, next: Next) => {
  // Check if username exists
  UserModel.findOne({
    username: req.body.username,
  }).then((user) => {
    if (user) {
      res.status(400).send({ message: "Username is already taken!" });
      return;
    }

    // Check if email exists
    UserModel.findOne({
      email: req.body.email,
    }).then((user) => {
      if (user) {
        res.status(400).send({ message: "Email is already in use!" });
        return;
      }

      next();
    });
  });
};

const checkRolesExisted = async (req: Req, res: Res, next: Next) => {
  if (req.body.roles) {
    const roles = await RoleModel.find().exec();
    const roleNames = roles.map((role) => role.name);
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!roleNames.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

export default verifySignUp;
