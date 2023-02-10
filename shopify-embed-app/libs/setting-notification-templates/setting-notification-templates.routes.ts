import { handleRoute } from "@jamalsoueidan/pkg.bsb";
import { Router } from "express";
import * as controller from "./setting-notification-templates.controller";

const router = Router();

router.get("/setting/notification-templates", handleRoute(controller.get));

router.put("/setting/notification-templates", handleRoute(controller.update));

export { router as settingNotificationTemplatesRoutes };
