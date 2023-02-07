import { handleRoute } from "@jamalsoueidan/bsb.bsb-pkg";
import { Router } from "express";
import { body, check, query } from "express-validator";
import * as controller from "./notification.controller";

const router = Router();

router.get(
  "/notifications",
  query("orderId").notEmpty(),
  query("orderId").isDecimal(),
  query("lineItemId").notEmpty(),
  query("lineItemId").isDecimal(),
  handleRoute(controller.get),
);

router.post(
  "/notifications",
  body("orderId").notEmpty(),
  body("orderId").isDecimal(),
  body("lineItemId").notEmpty(),
  body("lineItemId").isDecimal(),
  body("message").notEmpty(),
  body("to").notEmpty(),
  body("to").isIn(["customer", "staff"]),
  handleRoute(controller.sendCustom),
);

router.post(
  "/notifications/:id",
  check("id").notEmpty(),
  handleRoute(controller.resend),
);

router.delete(
  "/notifications/:id",
  check("id").notEmpty(),
  handleRoute(controller.cancel),
);

export { router as notificationRoutes };
