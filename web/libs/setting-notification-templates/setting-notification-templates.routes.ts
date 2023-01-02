import { Router } from "express";
import { expressHandleRoute } from "../express-helpers/handle-route";
import controller, {
  ControllerMethods,
} from "./setting-notification-templates.controller";

export const settingNotificationTemplatesRoutes = (app) => {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.get("/setting/notification-templates", async (req, res) => {
    handleRoute(req, res, ControllerMethods.get);
  });

  router.put("/setting/notification-templates", async (req, res) => {
    handleRoute(req, res, ControllerMethods.update);
  });

  return router;
};
