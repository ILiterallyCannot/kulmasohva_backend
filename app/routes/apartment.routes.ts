import {
  NextFunction as Next,
  Request as Req,
  Response as Res,
  Router,
} from "express";
import * as controller from "../controllers/apartment.controller";
import authJwt from "../middleware/authjwt";

export class ApartmentRouter {
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
      "/api/v1/apartments",
      [authJwt.verifyToken],
      controller.getAllApartments
    );
    this.router.post(
      "/api/v1/apartments",
      [authJwt.verifyToken],
      controller.listApartment
    );
    this.router.delete(
      "/api/v1/apartments/:id",
      [authJwt.verifyToken, authJwt.isModerator, authJwt.isAdmin],
      controller.deleteApartment
    );
  }
}

export default new ApartmentRouter().router;
