import {
  NextFunction as Next,
  Request as Req,
  Response as Res,
  Router,
} from "express";
import * as controller from "../controllers/user.controller";
import { authJwt } from "../middleware";

export class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.use("/", (req: Req, res: Res, next: Next) => {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    this.router.get("/api/v1/all", controller.allAccess);

    this.router.get(
      "/api/v1/user",
      [authJwt.verifyToken],
      controller.userBoard
    );

    this.router.get(
      "/api/v1/mod",
      [authJwt.verifyToken, authJwt.isModerator],
      controller.moderatorBoard
    );

    this.router.get(
      "/api/v1/admin",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.adminBoard
    );

    this.router.get(
      "/api/v1/users/:id",
      [authJwt.verifyToken],
      controller.getUserById
    );
    this.router.get(
      "/api/v1/users/username/:username",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.getUserByUsername
    );
    this.router.delete(
      "/api/v1/users/:id",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.deleteUserById
    );
    this.router.put(
      "/api/v1/users/:id",
      [authJwt.verifyToken],
      controller.updateUserProfile
    );

    this.router.get(
      "/api/v1/users",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.searchUsers
    );
  }
}

export default new UserRouter().router;
