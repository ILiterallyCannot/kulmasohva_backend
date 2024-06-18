import { Router } from "express";
import * as controller from "../controllers/auth.controller";
import { verifySignUp } from "../middleware";
import { Next, Req, Res } from "express";

module.exports = function (app: Router) {
  app.use(function (req: Req, res: Res, next: Next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};
