import RoleModel, { IRole } from "../models/role.model";
import UserModel from "../models/user.model";
import { Request as Req, Response as Res } from 'express';
import * as config from "../config/auth.config";

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

export const signup = async (req: Req, res: Res): Promise<void> => {
  try {
    const user = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    const savedUser = await user.save();
    const userCount = await UserModel.countDocuments();

    if (userCount === 1) {
      const role = await RoleModel.findOne({ name: "admin" });
      if (role) {
        savedUser.roles = [role._id];
        await savedUser.save();
        res.send({
          message: "First user was registered successfully as admin!",
        });
      } else {
        res.status(500).send({ message: "Admin role not found." });
      }
    } else {
      if (req.body.roles && req.body.roles.length > 0) {
        const roles: IRole[] = await RoleModel.find({
          name: { $in: req.body.roles },
        });
        user.roles = roles.map((role: IRole) => role._id);
      } else {
        const role = await RoleModel.findOne({ name: "user" });
        user.roles = role?.id;
      }
      await savedUser.save();
      res.send({ message: "User was registered successfully!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: (err as Error).message });
  }
};

export const signin = async (req: Req, res: Res): Promise<void> => {
  let token: string;
  let authorities: string[] = [];
  UserModel.findOne({ username: req.body.username })
    .populate<{ roles: IRole[] }>("roles", "-__v")
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    });
};
