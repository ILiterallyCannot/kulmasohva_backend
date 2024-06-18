import { Next, Req, Res } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as secret from "../config/auth.config";
import RoleModel from "../models/role.model";
import UserModel from "../models/user.model";

interface DecodedToken extends JwtPayload {
  id: string;
}

interface CustomRequest extends Req {
  userId?: string;
}

const verifyToken = (
  req: Req,
  res: Res,
  next: Next
): void => {
  let token = req.headers["x-access-token"] as string;

  if (!token) {
    res.status(403).send({ message: "No token provided!" });
    return;
  }
  try {
    const decoded = jwt.verify(token, secret.JWT_SECRET) as DecodedToken;
    req.body.id = decoded.id;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).send({ message: "Unauthorized! Token expired." });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).send({ message: "Unauthorized! Invalid token." });
    } else {
      // For other potential errors during verification
      res.status(500).send({ message: "Token verification failed." });
    }
  }
};

const isAdmin = async (
  req: Req,
  res: Res,
  next: Next
): Promise<void> => {
  try {
    const user = await UserModel.findById(req.body.id).populate("roles");

    if (!user) {
      res.status(404).send({ message: "User not found." });
      return;
    }

    const roles = await RoleModel.find({ _id: { $in: user.roles } });

    if (roles.some((role) => role.name === "admin")) {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

const isModerator = async (
  req: Req,
  res: Res,
  next: Next
): Promise<void> => {
  try {
    const user = await UserModel.findById(req.body.id).populate("roles");

    if (!user) {
      res.status(404).send({ message: "User not found." });
      return;
    }

    const roles = await RoleModel.find({ _id: { $in: user.roles } });

    if (
      roles.some((role) => role.name === "moderator" || role.name === "admin")
    ) {
      next();
      return;
    }

    res.status(403).send({ message: "Requires Moderator Role!" });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
export default authJwt;
