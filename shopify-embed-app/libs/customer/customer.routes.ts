import { handleController } from "@jamalsoueidan/pkg.backend";
import { Router } from "express";
import { query } from "express-validator";
import * as controller from "./customer.controller";

const router = Router();

router.get(
  "/customers",
  query("name").notEmpty(),
  handleController(controller.get),
);

export { router as customerRoutes };
