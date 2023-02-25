import { handleController } from "@jamalsoueidan/pkg.bsb";
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
  handleController(controller.get),
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
  handleController(controller.sendCustom),
);

router.post(
  "/notifications/:id",
  check("id").notEmpty(),
  handleController(controller.resend),
);

router.delete(
  "/notifications/:id",
  check("id").notEmpty(),
  handleController(controller.cancel),
);

export { router as notificationRoutes };
