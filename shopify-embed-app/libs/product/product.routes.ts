import { Router } from "express";
import { body, param } from "express-validator";

import { handleRoute } from "@jamalsoueidan/pkg.bsb";
import { isValidObjectId } from "mongoose";
import * as controller from "./product.controller";

const router = Router();

router.get("/products", handleRoute(controller.get));

router.get(
  "/products/:id",
  param("id")
    .custom((value) => isValidObjectId(value))
    .withMessage("not valid objectId"),
  handleRoute(controller.getById),
);

router.get(
  "/products/getOrderFromShopify/:id",
  handleRoute(controller.getOrderFromShopify),
);

router.put(
  "/products/:id",
  param("id")
    .custom((value) => isValidObjectId(value))
    .withMessage("not valid objectId"),
  body("_id").isEmpty(),
  body("shop").isEmpty(),
  body("collectionId").isEmpty(),
  body("productId").isEmpty(),

  handleRoute(controller.update),
);

router.get(
  "/products/staff/get-available",
  handleRoute(controller.getAvailableStaff),
);

export { router as productRoutes };
