import { Router } from "express";
import controller, {
  ControllerMethods,
} from "./admin-staff-schedule.controller";
import { expressHandleRoute } from "../express-helpers/handle-route";

export default function adminStaffScheduleRoutes(app) {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.get("/staff/:staff/schedules", async (req, res) => {
    handleRoute(req, res, ControllerMethods.get);
  });

  router.post("/staff/:staff/schedules", async (req, res) => {
    handleRoute(req, res, ControllerMethods.create);
  });

  router.put("/staff/:staff/schedules", async (req, res) => {
    handleRoute(req, res, ControllerMethods.update);
  });

  router.delete("/staff/:staff/schedules", async (req, res) => {
    handleRoute(req, res, ControllerMethods.remove);
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
      handleRoute(req, res, ControllerMethods.removeGroup);
    }
  );

  return router;
}
