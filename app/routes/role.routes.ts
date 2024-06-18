import * as roleController from "../controllers/role.controller";
import { authJwt } from "../middleware";
import { Next, Req, Res } from "express";

module.exports = function (app: any) {
  app.use(function (req: Req, res: Res, next: Next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/test/roles",
    [authJwt.verifyToken, authJwt.isAdmin],
    roleController.getAllRoles
  );
  app.get(
    "/api/test/users/:id/roles",
    [authJwt.verifyToken, authJwt.isAdmin],
    roleController.getRoleByUserId
  );
  app.put(
    "/api/test/users/:id/roles",
    [authJwt.verifyToken, authJwt.isAdmin],
    roleController.updateUserRoles
  );
};
