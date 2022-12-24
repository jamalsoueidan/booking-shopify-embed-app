import { Router } from "express";
import { body, check, query } from "express-validator";
import { expressHandleRoute } from "../express-helpers/handle-route";
import controller, { ControllerMethods } from "./notification.controller";

export const notificationRoutes = (app) => {
  const handleRoute = expressHandleRoute(app, controller);

  const router = Router();

  router.get(
    "/notifications",
    query("orderId").notEmpty(),
    query("orderId").isDecimal(),
    query("lineItemId").notEmpty(),
    query("lineItemId").isDecimal(),
    async (req, res) => {
      handleRoute(req, res, ControllerMethods.get);
    }
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
    async (req, res) => {
      handleRoute(req, res, ControllerMethods.sendCustom);
    }
  );

  router.post(
    "/notifications/:id",
    check("id").notEmpty(),
    async (req, res) => {
      handleRoute(req, res, ControllerMethods.resend);
    }
  );

  return router;
};
