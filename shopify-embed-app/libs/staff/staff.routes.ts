import { handleRoute } from "@jamalsoueidan/bsb.bsb-pkg";
import { Router } from "express";
import { checkSchema } from "express-validator";
import * as controller from "./staff.controller";

const router = Router();

router.get("/staff", handleRoute(controller.get));

router.post("/staff", handleRoute(controller.create));

router.get(
  "/staff/:id",
  checkSchema({
    id: { notEmpty: true },
  }),
  handleRoute(controller.getById),
);

router.put("/staff/:id", handleRoute(controller.update));

export { router as staffRoutes };
