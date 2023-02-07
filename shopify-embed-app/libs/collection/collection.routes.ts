import { handleRoute } from "@jamalsoueidan/bsb.bsb-pkg";
import { Router } from "express";
import { body } from "express-validator";
import * as controller from "./collection.controller";

const router = Router();

router.get("/collections", handleRoute(controller.get));

router.delete("/collections/:id", handleRoute(controller.remove));

router.post(
  "/collections",
  body("selections").notEmpty(),
  handleRoute(controller.create),
);

export { router as collectionRoutes };
