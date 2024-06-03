const { authJwt } = require("../middleware");
const roleController = require("../controllers/role.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("api/test/roles", [authJwt.verifyToken, authJwt.isAdmin], roleController.getAllRoles);
  app.get("/api/test/users/:id/roles", [authJwt.verifyToken, authJwt.isAdmin], roleController.getRoleByUserId);
  app.put("/api/test/users/:id/roles", [authJwt.verifyToken, authJwt.isAdmin], roleController.updateUserRoles);
};