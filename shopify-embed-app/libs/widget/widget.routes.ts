import { checkSchema } from "express-validator";

import { handleRoute } from "@jamalsoueidan/pkg.bsb";
import { Router } from "express";
import * as controller from "./widget.controller";

const router = Router();

router.get(
  "/widget/staff",
  checkSchema({
    productId: { notEmpty: true },
  }),
  handleRoute(controller.staff),
);

router.get(
  "/widget/availability",
  checkSchema({
    start: { notEmpty: true },
    end: { notEmpty: true },
    productId: { notEmpty: true },
  }),
  handleRoute(controller.availability),
);

router.get("/widget/settings", handleRoute(controller.settings));

export { router as widgetRoutes };
