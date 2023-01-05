import { Router } from "express";
import { query } from "express-validator";
import { expressHandleRoute } from "../express-helpers/handle-route";
import controller, { ControllerMethods } from "./customer.controller";

export const customerRoutes = (app) => {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.get("/customers", query("name").notEmpty(), async (req, res) => {
    handleRoute(req, res, ControllerMethods.get);
  });

  return router;
};
