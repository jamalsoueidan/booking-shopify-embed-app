import { handleRoute } from "@jamalsoueidan/bsb.bsb-pkg";
import { Router } from "express";
import { body } from "express-validator";
import * as controller from "./booking.controller";

const router = Router();

router.get("/bookings", handleRoute(controller.get));

router.get("/bookings/:id", handleRoute(controller.getById));

router.post(
  "/bookings",
  body("productId").notEmpty(),
  body("customerId").notEmpty(),
  body("start").notEmpty(),
  body("end").notEmpty(),
  body("staff").notEmpty(),
  handleRoute(controller.create),
);

router.put(
  "/bookings/:id",
  body("start").notEmpty(),
  body("end").notEmpty(),
  body("staff").notEmpty(),
  handleRoute(controller.update),
);

export { router as bookingRoutes };
