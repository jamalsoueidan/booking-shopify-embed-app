import { Router } from "express";
import { body } from "express-validator";
import { expressHandleRoute } from "./../express-helpers/handle-route";
import controller, { ControllerMethods } from "./admin-booking.controller";

export default function adminBookingRoutes(app) {
  const handleRoute = expressHandleRoute(app, controller);

  const router = Router();

  router.get("/bookings", async (req, res) => {
    handleRoute(req, res, ControllerMethods.get);
  });

  router.get("/bookings/:id", async (req, res) => {
    handleRoute(req, res, ControllerMethods.getById);
  });

  router.put(
    "/bookings/:id",
    body("start").notEmpty(),
    body("end").notEmpty(),
    body("staff").notEmpty(),
    async (req, res) => {
      handleRoute(req, res, ControllerMethods.update);
    }
  );

  return router;
}
