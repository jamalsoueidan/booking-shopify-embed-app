import { Router } from "express";
import { expressHandleRoute } from "../express-helpers/handle-route";
import controller, { ControllerMethods } from "./admin-collection.controller";

export default function adminCollectionRoutes(app) {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.get("/collections", async (req, res) => {
    handleRoute(req, res, ControllerMethods.get);
  });

  router.delete("/collections/:id", async (req, res) => {
    handleRoute(req, res, ControllerMethods.remove);
  });

  router.post("/collections", async (req, res) => {
    handleRoute(req, res, ControllerMethods.create);
  });

  return router;
}
