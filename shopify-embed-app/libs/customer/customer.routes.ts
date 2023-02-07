import { handleRoute } from "@jamalsoueidan/bsb.bsb-pkg";
import { Router } from "express";
import { query } from "express-validator";
import * as controller from "./customer.controller";

const router = Router();

router.get("/customers", query("name").notEmpty(), handleRoute(controller.get));

export { router as customerRoutes };
