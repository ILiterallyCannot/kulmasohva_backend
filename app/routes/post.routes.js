const { authJwt } = require("../middleware");
const controller = require("../controllers/post.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/posts", [authJwt.verifyToken], controller.getAllPosts);

  app.post("/api/test/posts", [authJwt.verifyToken], controller.createPost);

  app.delete("/api/test/posts/:id", [authJwt.verifyToken, authJwt.isModerator, authJwt.isAdmin], controller.deletePost);

  app.get(
    "/api/test/posts/user/:userID",
    [authJwt.verifyToken],
    controller.getPostsByUser
  );
};
