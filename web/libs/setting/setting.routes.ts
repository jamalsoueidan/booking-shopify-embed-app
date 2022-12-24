import { Router } from "express";
import { expressHandleRoute } from "../express-helpers/handle-route";
import controller, { ControllerMethods } from "./setting.controller";

export const settingRoutes = (app) => {
  const handleRoute = expressHandleRoute(app, controller);

  const router = Router();

  router.get("/setting", async (req, res) => {
    handleRoute(req, res, ControllerMethods.get);
  });

  router.put("/setting", async (req, res) => {
    handleRoute(req, res, ControllerMethods.create);
  });

  return router;
};
