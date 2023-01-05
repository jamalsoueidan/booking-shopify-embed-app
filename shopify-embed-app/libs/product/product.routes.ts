import { Router } from "express";
import { body } from "express-validator";
import { expressHandleRoute } from "../express-helpers/handle-route";
import controller, { ControllerMethods } from "./product.controller";

export const productRoutes = (app) => {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.get("/products", async (req, res) => {
    handleRoute(req, res, ControllerMethods.get);
  });

  router.get("/products/:id", async (req, res) => {
    handleRoute(req, res, ControllerMethods.getById);
  });

  router.get("/products/getOrderFromShopify/:id", async (req, res) => {
    handleRoute(req, res, ControllerMethods.getOrderFromShopify);
  });

  router.put(
    "/products/:id",
    body("_id").isEmpty(),
    body("shop").isEmpty(),
    body("collectionId").isEmpty(),
    body("productId").isEmpty(),
    async (req, res) => {
      handleRoute(req, res, ControllerMethods.update);
    }
  );

  router.get("/products/:id/staff", async (req, res) => {
    handleRoute(req, res, ControllerMethods.getStaff);
  });

  return router;
};
