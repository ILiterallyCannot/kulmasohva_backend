const { authJwt } = require("../middleware");
const controller = require("../controllers/apartment.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/apartments", [authJwt.verifyToken], controller.getAllApartments);
  app.post("/api/test/apartments", [authJwt.verifyToken], controller.listApartment);
};