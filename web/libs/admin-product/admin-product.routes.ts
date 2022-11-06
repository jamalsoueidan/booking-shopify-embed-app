import { Router } from "express";
import { expressHandleRoute } from "../express-helpers/handle-route";
import controller, { ControllerMethods } from "./admin-product.controller";

export default function adminProductRoutes(app) {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.get("/products/:id", async (req, res) => {
    handleRoute(req, res, ControllerMethods.getById);
  });

  router.put("/products/:id", async (req, res) => {
    handleRoute(req, res, ControllerMethods.update);
  });

  router.get("/products/:id/staff", async (req, res) => {
    handleRoute(req, res, ControllerMethods.getStaff);
  });

  router.get("/products/:id/staff-to-add", async (req, res) => {
    handleRoute(req, res, ControllerMethods.getStaffToAdd);
  });

  router.post("/products/:id/staff", async (req, res) => {
    handleRoute(req, res, ControllerMethods.addStaff);
  });

  router.delete("/products/:id/staff/:staffId", async (req, res) => {
    handleRoute(req, res, ControllerMethods.removeStaff);
  });

  return router;
}
