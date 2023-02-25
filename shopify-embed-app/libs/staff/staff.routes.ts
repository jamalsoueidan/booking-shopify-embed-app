import { handleController } from "@jamalsoueidan/pkg.bsb";
import { Router } from "express";
import { checkSchema } from "express-validator";
import * as controller from "./staff.controller";

const router = Router();

router.get("/staff", handleController(controller.get));

router.post("/staff", handleController(controller.create));

router.get(
  "/staff/:id",
  checkSchema({
    id: { notEmpty: true },
  }),
  handleController(controller.getById),
);

router.put("/staff/:id", handleController(controller.update));

export { router as staffRoutes };
