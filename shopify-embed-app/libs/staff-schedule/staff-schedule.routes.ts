import { Router } from "express";
import { query } from "express-validator";
import { expressHandleRoute } from "../express-helpers/handle-route";
import controller, { ControllerMethods } from "./staff-schedule.controller";

export const staffScheduleRoutes = (app) => {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.get(
    "/staff/:staff/schedules",
    query("start").notEmpty(),
    query("end").notEmpty(),
    async (req, res) => {
      handleRoute(req, res, ControllerMethods.get);
    }
  );

  router.post("/staff/:staff/schedules", async (req, res) => {
    handleRoute(req, res, ControllerMethods.create);
  });

  router.put("/staff/:staff/schedules", async (req, res) => {
    handleRoute(req, res, ControllerMethods.update);
  });

  router.delete("/staff/:staff/schedules/:schedule", async (req, res) => {
    handleRoute(req, res, ControllerMethods.destroy);
  });

  router.put(
    "/staff/:staff/schedules/:schedule/group/:groupId",
    async (req, res) => {
      handleRoute(req, res, ControllerMethods.updateGroup);
    }
  );

  router.delete(
    "/staff/:staff/schedules/:schedule/group/:groupId",
    async (req, res) => {
      handleRoute(req, res, ControllerMethods.destroyGroup);
    }
  );

  return router;
};
