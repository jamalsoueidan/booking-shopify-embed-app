import { handleRoute } from "@jamalsoueidan/pkg.bsb";
import { Router } from "express";
import { body } from "express-validator";
import * as controller from "./booking.controller";

const router = Router();

router.get("/bookings", handleRoute(controller.getAll));

router.get(
  "/bookings/:_id",
  body("productId").notEmpty(),
  body("customerId").notEmpty(),
  body("start").notEmpty(),
  body("end").notEmpty(),
  body("staff").notEmpty(),
  handleRoute(controller.getById),
);

router.post(
  "/bookings",

  handleRoute(controller.create),
);

router.put(
  "/bookings/:_id",
  body("start").notEmpty(),
  body("end").notEmpty(),
  body("staff").notEmpty(),
  handleRoute(controller.update),
);

export { router as bookingRoutes };
