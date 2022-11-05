import Shopify from "@shopify/shopify-api";
import { Router } from "express";
import controller, { ControllerMethods } from "./admin-staff.controller";

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
        },
        body: req.body,
        params: req.params,
      }),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

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

export default router;
