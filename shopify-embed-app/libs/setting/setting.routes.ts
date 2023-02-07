import { handleRoute } from "@jamalsoueidan/bsb.bsb-pkg";
import { Router } from "express";
import * as controller from "./setting.controller";

const router = Router();

router.get("/setting", handleRoute(controller.get));

router.put("/setting", handleRoute(controller.create));

export { router as settingRoutes };
