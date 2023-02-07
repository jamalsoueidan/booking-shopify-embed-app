import { Router } from "express";
import { body } from "express-validator";

import { handleRoute } from "@jamalsoueidan/bsb.bsb-pkg";
import * as controller from "./product.controller";

const router = Router();

router.get("/products", handleRoute(controller.get));

router.get("/products/:id", handleRoute(controller.getById));

router.get(
  "/products/getOrderFromShopify/:id",
  handleRoute(controller.getOrderFromShopify),
);

router.put(
  "/products/:id",
  body("_id").isEmpty(),
  body("shop").isEmpty(),
  body("collectionId").isEmpty(),
  body("productId").isEmpty(),

  handleRoute(controller.update),
);

router.get("/products/:id/staff", handleRoute(controller.getStaff));

export { router as productRoutes };
