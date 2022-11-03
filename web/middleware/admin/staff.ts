import { Shopify } from "@shopify/shopify-api";
import * as Staff from "../../database/models/staff";

export default function applyAdminStaffMiddleware(app) {
  app.get("/api/admin/staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;

    try {
      payload = await Staff.find(shop);
    } catch (e) {
      console.log(
        `Failed to process api/admin/staff:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.post("/api/admin/staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;

    try {
      payload = await Staff.create({ shop, ...req.body });
    } catch (e) {
      console.log(
        `Failed to process /api/admin/staff:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.get("/api/admin/staff/:staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;
    const { staff } = req.params;

    try {
      payload = await Staff.findOne(staff, { shop });
    } catch (e) {
      console.log(
        `Failed to process /api/admin/staff/:staff:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.put("/api/admin/staff/:staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;
    const { staff } = req.params;

    try {
      payload = await Staff.findByIdAndUpdate(staff, req.body);
    } catch (e) {
      console.log(
        `Failed to process /api/admin/staff/:staff:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });
}
