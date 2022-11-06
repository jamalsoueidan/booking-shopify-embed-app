import { Router } from "express";
import { expressHandleRoute } from "./../express-helpers/handle-route";
import controller, { ControllerMethods } from "./admin-booking.controller";

export default function adminBookingRoutes(app) {
  const handleRoute = expressHandleRoute(app, controller);

  const router = Router();

  router.get("/bookings", async (req, res) => {
    handleRoute(req, res, ControllerMethods.get);
  });

  return router;
}
