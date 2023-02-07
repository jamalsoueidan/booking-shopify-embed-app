import { checkSchema } from "express-validator";

import { handleRoute } from "@jamalsoueidan/bsb.bsb-pkg";
import { Router } from "express";
import * as controller from "./widget.controller";

const router = Router();

router.get("/staff", handleRoute(controller.staff));

router.get(
  "/availability",
  checkSchema({
    start: { notEmpty: true },
    end: { notEmpty: true },
    productId: { notEmpty: true },
  }),
  handleRoute(controller.availability),
);

router.get("/settings", handleRoute(controller.settings));

export { router as widgetRoutes };
