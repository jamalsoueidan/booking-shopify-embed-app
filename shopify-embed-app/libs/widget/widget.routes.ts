import { checkSchema } from "express-validator";

import { handleController } from "@jamalsoueidan/pkg.bsb";
import { Router } from "express";
import * as controller from "./widget.controller";

const router = Router();

router.get(
  "/widget/staff",
  checkSchema({
    productId: {
      notEmpty: true,
      isInt: true,
      toInt: true,
    },
  }),
  handleController(controller.staff),
);

router.get(
  "/widget/availability",
  checkSchema({
    start: { notEmpty: true, toDate: true },
    end: { notEmpty: true, toDate: true },
    productId: { notEmpty: true, isInt: true, toInt: true },
  }),
  handleController(controller.availability),
);

router.get("/widget/settings", handleController(controller.settings));

export { router as widgetRoutes };
