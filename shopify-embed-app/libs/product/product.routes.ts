import { Router } from "express";
import { body, param } from "express-validator";

import { handleController } from "@jamalsoueidan/pkg.bsb";
import { isValidObjectId } from "mongoose";
import * as controller from "./product.controller";

const router = Router();

router.get("/products", handleController(controller.get));

router.get(
  "/products/:id",
  param("id")
    .custom((value) => isValidObjectId(value))
    .withMessage("not valid objectId"),
  handleController(controller.getById),
);

router.get(
  "/products/getOrderFromShopify/:id",
  handleController(controller.getOrderFromShopify),
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

  handleController(controller.update),
);
