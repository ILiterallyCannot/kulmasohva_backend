import authJwt from "../middleware/authjwt";
import * as controller from "../controllers/apartment.controller";
import { Router, Req, Res, Next } from "express";

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
      "/api/test/apartments",
      [authJwt.verifyToken],
      controller.getAllApartments
    );
    this.router.post(
      "/api/test/apartments",
      [authJwt.verifyToken],
      controller.listApartment
    );
    this.router.delete(
      "/api/test/apartments/:id",
      [authJwt.verifyToken],
      controller.deleteApartment
    );
  }
}

export default new ApartmentRouter().router;
