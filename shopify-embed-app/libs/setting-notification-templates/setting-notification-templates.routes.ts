import { handleController } from "@jamalsoueidan/pkg.backend";
import { Router } from "express";
import * as controller from "./setting-notification-templates.controller";

const router = Router();

router.get("/setting/notification-templates", handleController(controller.get));

router.put(
  "/setting/notification-templates",
  handleController(controller.update),
);

export { router as settingNotificationTemplatesRoutes };
