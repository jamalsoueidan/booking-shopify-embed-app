import { handleController } from "@jamalsoueidan/pkg.bsb";
import { Router } from "express";
import * as controller from "./setting.controller";

const router = Router();

router.get("/setting", handleController(controller.get));

router.put("/setting", handleController(controller.create));

export { router as settingRoutes };
