import { Router } from "express";
import { checkSchema } from "express-validator";
import { expressHandleRoute } from "../express-helpers/handle-route";
import controller, { ControllerMethods } from "./staff.controller";

export const staffRoutes = (app) => {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.get("/staff", async (req, res) => {
    handleRoute(req, res, ControllerMethods.get);
  });

  router.post("/staff", async (req, res) => {
    handleRoute(req, res, ControllerMethods.create);
  });

  router.get(
    "/staff/:id",
    checkSchema({
      id: { notEmpty: true },
    }),
    async (req, res) => {
      handleRoute(req, res, ControllerMethods.getById);
    }
  );

  router.put("/staff/:id", async (req, res) => {
    handleRoute(req, res, ControllerMethods.update);
  });

  return router;
};
