import { Shopify } from "@shopify/shopify-api";
import { Router } from "express";
import controller, { ControllerMethods } from "./admin-product.controller";

const router = Router();

const handleRoute = async (req, res, methodName: ControllerMethods) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res, true);

  try {
    res.status(202).send({
      success: true,
      payload: await controller[methodName]({
        query: {
          shop: req.query.shop || session.shop,
          ...req.query,
          ...req.params,
        },
        body: req.body,
      }),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

router.get("/products/:productId", async (req, res) => {
  handleRoute(req, res, ControllerMethods.getById);
});

router.put("/products/:productId", async (req, res) => {
  handleRoute(req, res, ControllerMethods.update);
});

router.get("/products/:productId/staff", async (req, res) => {
  handleRoute(req, res, ControllerMethods.getStaff);
});

router.get("/products/:productId/staff-to-add", async (req, res) => {
  handleRoute(req, res, ControllerMethods.getStaffToAdd);
});

router.post("/products/:productId/staff", async (req, res) => {
  handleRoute(req, res, ControllerMethods.addStaff);
});

router.delete("/products/:productId/staff/:staffId", async (req, res) => {
  handleRoute(req, res, ControllerMethods.removeStaff);
});

export default router;
