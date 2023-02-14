import { Router } from "express";
import { body, checkSchema, param } from "express-validator";

import {
  ScheduleServiceCreateGroupBodyProps,
  handleRoute,
} from "@jamalsoueidan/pkg.bsb";
import { isValidObjectId } from "mongoose";
import * as controller from "./staff-schedule.controller";

const router = Router();

router.get(
  "/staff/:staff/schedules",
  param("staff")
    .custom((value) => isValidObjectId(value))
    .withMessage("not valid objectId"),
  checkSchema({
    start: {
      notEmpty: true,
      toDate: true,
    },
    end: {
      notEmpty: true,
      toDate: true,
    },
  }),
  handleRoute(controller.get),
);

router.post(
  "/staff/:staff/schedules/group",
  body()
    .isArray({ min: 1 })
    .customSanitizer((value: ScheduleServiceCreateGroupBodyProps) =>
      value.map((v) => ({
        ...v,
        start: new Date(v.start),
        end: new Date(v.end),
      })),
    ),
  handleRoute(controller.createGroup),
);

router.put(
  "/staff/:staff/schedules/:schedule/group/:groupId",
  body("id")
    .custom((value) => isValidObjectId(value))
    .withMessage("not valid objectId"),
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
