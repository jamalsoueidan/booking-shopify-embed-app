import { Router } from "express";
import {
  CustomValidator,
  Schema,
  body,
  checkSchema,
  param,
} from "express-validator";

import {
  ScheduleServiceCreateGroupBodyProps,
  handleRoute,
} from "@jamalsoueidan/pkg.bsb";
import { ValidatorsSchema } from "express-validator/src/middlewares/schema";
import { isValidObjectId } from "mongoose";
import * as controller from "./staff-schedule.controller";

const router = Router();

const isValidObject: ValidatorsSchema["custom"] = {
  options: (value: CustomValidator) => isValidObjectId(value),
  errorMessage: "not valid objectId",
};

const staffSchema: Schema = {
  staff: {
    in: ["query"],
    notEmpty: true,
    custom: isValidObject,
  },
};

const scheduleSchema: Schema = {
  schedule: {
    in: ["params"],
    notEmpty: true,
    custom: isValidObject,
  },
};

const groupSchema: Schema = {
  groupId: {
    in: ["params"],
    notEmpty: true,
  },
};

router.get(
  "/schedules",
  checkSchema(staffSchema),
  checkSchema({
    start: {
      in: ["query"],
      notEmpty: true,
      toDate: true,
    },
    end: {
      in: ["query"],
      notEmpty: true,
      toDate: true,
    },
  }),
  handleRoute(controller.get),
);

router.post(
  "/schedules/group",
  checkSchema(staffSchema),
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
  "/schedules/group/:groupId",
  checkSchema(staffSchema),
  checkSchema(groupSchema),
  checkSchema({
    start: {
      in: ["body"],
      notEmpty: true,
      toDate: true,
    },
    end: {
      in: ["body"],
      notEmpty: true,
      toDate: true,
    },
    tag: {
      in: ["body"],
      notEmpty: true,
    },
  }),
  handleRoute(controller.updateGroup),
);

router.delete(
  "/schedules/group/:groupId",
  checkSchema(staffSchema),
  checkSchema(groupSchema),
  handleRoute(controller.destroyGroup),
);

router.post(
  "/schedules",
  checkSchema(staffSchema),
  body("start").notEmpty().toDate(),
  body("end").notEmpty().toDate(),
  handleRoute(controller.create),
);

router.put(
  "/schedules/:schedule",
  param("schedule")
    .notEmpty()
    .custom((value: CustomValidator) => isValidObjectId(value))
    .withMessage("invalid objectid"),
  body("start").notEmpty().toDate(),
  body("end").notEmpty().toDate(),
  handleRoute(controller.update),
);

router.delete(
  "/schedules/:schedule",
  checkSchema(scheduleSchema),
  checkSchema(staffSchema),
  handleRoute(controller.destroy),
);

export { router as staffScheduleRoutes };
