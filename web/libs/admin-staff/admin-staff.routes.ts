import { Router } from "express";
import controller, { ControllerMethods } from "./admin-staff.controller";
import { expressHandleRoute } from "../express-helpers/handle-route";

export default function adminSettingRoutes(app) {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.get("/staff", async (req, res) => {
    handleRoute(req, res, ControllerMethods.get);
  });

  router.post("/staff", async (req, res) => {
    handleRoute(req, res, ControllerMethods.create);
  });

  router.get("/staff/:staff", async (req, res) => {
    handleRoute(req, res, ControllerMethods.getById);
  });

  router.put("/staff/:staff", async (req, res) => {
    handleRoute(req, res, ControllerMethods.update);
  });

  return router;
}
