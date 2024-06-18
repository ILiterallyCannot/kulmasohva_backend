import * as controller from "../controllers/post.controller";
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

  app.get("/api/test/posts", [authJwt.verifyToken], controller.getAllPosts);

  app.post("/api/test/posts", [authJwt.verifyToken], controller.createPost);

  app.delete(
    "/api/test/posts/:id",
    [authJwt.verifyToken, authJwt.isModerator, authJwt.isAdmin],
    controller.deletePost
  );

  app.get(
    "/api/test/posts/user/:userID",
    [authJwt.verifyToken],
    controller.getPostsByUser
  );
};
