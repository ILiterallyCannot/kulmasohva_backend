import * as controller from "../controllers/auth.controller";
import { verifySignUp } from "../middleware";
import { Router, Request as Req, Response as Res, NextFunction as Next } from "express";

export class AuthRouter {
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

    this.router.post(
      "/api/auth/signup",
      [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted,
      ],
      controller.signup
    );

    this.router.post("/api/auth/signin", controller.signin);
  }
}

export default new AuthRouter().router;
