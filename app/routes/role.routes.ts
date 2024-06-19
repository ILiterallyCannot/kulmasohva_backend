import {
  NextFunction as Next,
  Request as Req,
  Response as Res,
  Router,
} from "express";
import * as roleController from "../controllers/role.controller";
import { authJwt } from "../middleware";

export class RoleRouter {
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
    this.router.get(
      "/api/v1/roles",
      [authJwt.verifyToken, authJwt.isAdmin],
      roleController.getAllRoles
    );
    this.router.get(
      "/api/v1/users/:id/roles",
      [authJwt.verifyToken, authJwt.isAdmin],
      roleController.getRoleByUserId
    );
    this.router.put(
      "/api/v1/users/:id/roles",
      [authJwt.verifyToken, authJwt.isAdmin],
      roleController.updateUserRoles
    );
  }
}

export default new RoleRouter().router;
