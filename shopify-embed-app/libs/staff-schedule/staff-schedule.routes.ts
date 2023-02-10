import { Router } from "express";
import { query } from "express-validator";

import { handleRoute } from "@jamalsoueidan/pkg.bsb";
import * as controller from "./staff-schedule.controller";

const router = Router();

router.get(
  "/staff/:staff/schedules",
  query("start").notEmpty(),
  query("end").notEmpty(),
  handleRoute(controller.get),
);

router.post(
  "/staff/:staff/schedules/group",
  handleRoute(controller.createGroup),
);

router.put(
  "/staff/:staff/schedules/:schedule/group/:groupId",
  handleRoute(controller.updateGroup),
);

router.delete(
  "/staff/:staff/schedules/:schedule/group/:groupId",
  handleRoute(controller.destroyGroup),
);

router.post("/staff/:staff/schedules", handleRoute(controller.create));
router.put("/staff/:staff/schedules", handleRoute(controller.update));

router.delete(
  "/staff/:staff/schedules/:schedule",
  handleRoute(controller.destroy),
);

export { router as staffScheduleRoutes };
