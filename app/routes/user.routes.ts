import * as controller from "../controllers/user.controller";
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

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get("/api/test/users/:id", [authJwt.verifyToken], controller.getUserById);
  app.get(
    "/api/test/users/username/:username",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getUserByUsername
  );
  app.delete(
    "/api/test/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUserById
  );
  app.put(
    "/api/test/users/:id",
    [authJwt.verifyToken],
    controller.updateUserProfile
  );

  app.get(
    "/api/test/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.searchUsers
  );
};
