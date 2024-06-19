import {
  NextFunction as Next,
  Request as Req,
  Response as Res,
  Router,
} from "express";
import * as controller from "../controllers/post.controller";
import { authJwt } from "../middleware";

export class PostRouter {
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
      "/api/v1/posts",
      [authJwt.verifyToken],
      controller.getAllPosts
    );

    this.router.post(
      "/api/v1/posts",
      [authJwt.verifyToken],
      controller.createPost
    );

    this.router.delete(
      "/api/v1/posts/:id",
      [authJwt.verifyToken, authJwt.isModerator, authJwt.isAdmin],
      controller.deletePost
    );

    this.router.get(
      "/api/v1/posts/user/:userID",
      [authJwt.verifyToken],
      controller.getPostsByUser
    );
  }
}

export default new PostRouter().router;
