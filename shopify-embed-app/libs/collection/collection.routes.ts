import { handleRoute } from "@jamalsoueidan/pkg.bsb";
import { Router } from "express";
import { body, param } from "express-validator";
import { isValidObjectId } from "mongoose";
import * as controller from "./collection.controller";

const router = Router();

router.get("/collections", handleRoute(controller.get));

router.delete(
  "/collections/:id",
  param("id")
    .custom((value) => isValidObjectId(value))
    .withMessage("not valid objectId"),
  handleRoute(controller.destroy),
);

router.post(
  "/collections",
  body("selections").notEmpty(),
  handleRoute(controller.create),
);

export { router as collectionRoutes };
