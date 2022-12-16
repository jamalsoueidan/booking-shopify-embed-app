import { expressHandleRoute } from "@libs/express-helpers/handle-route";
import { Router } from "express";
import { checkSchema } from "express-validator";
import controller, { ControllerMethods } from "./widget.controller";

export default function widgetRoutes(app) {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.get("/staff", async (req, res) => {
    handleRoute(req, res, ControllerMethods.staff);
  });

  router.get(
    "/availability",
    checkSchema({
      start: { notEmpty: true },
      end: { notEmpty: true },
      productId: { notEmpty: true },
    }),
    async (req, res) => {
      handleRoute(req, res, ControllerMethods.availability);
    }
  );

  router.get("/settings", async (req, res) => {
    handleRoute(req, res, ControllerMethods.settings);
  });

  return router;
}
