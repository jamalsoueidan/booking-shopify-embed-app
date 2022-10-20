import { Shopify } from "@shopify/shopify-api";
import * as Staff from "../../../database/models/staff.js";
import * as Schedule from "../../../database/models/schedule.js";

export default function applyAdminStaffScheduleMiddleware(app) {
  app.get("/api/admin/staff/:staff/schedules", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const { staff } = req.params;

    try {
      if (await Staff.findById(staff)) {
        payload = await Schedule.find({ staff, ...req.query });
      } else {
        throw "user doesn't exist";
      }
    } catch (e) {
      console.log(
        `Failed to process api/metafields:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.post("/api/admin/staff/:staff/schedules", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const { staff } = req.params;

    try {
      if (await Staff.findById(staff)) {
        payload = await Schedule.create({ staff, ...req.body });
      } else {
        throw "user doesn't exist";
      }
    } catch (e) {
      console.log(
        `Failed to process api/metafields:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.put("/api/admin/staff/:staff/schedules/:schedule", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const { staff, schedule } = req.params;

    try {
      if (await Staff.findById(staff)) {
        payload = await Schedule.findByIdAndUpdate(schedule, req.body);
      } else {
        throw "user doesn't exist";
      }
    } catch (e) {
      console.log(
        `Failed to process api/metafields:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.delete(
    "/api/admin/staff/:staff/schedules/:schedule",
    async (req, res) => {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      let status = 200;
      let error = null;
      let payload = null;

      const { staff, schedule } = req.params;

      try {
        if (await Staff.findById(staff)) {
          payload = await Schedule.remove(schedule);
        } else {
          throw "user doesn't exist";
        }
      } catch (e) {
        console.log(
          `Failed to process api/metafields:
         ${e}`
        );
        status = 500;
        error = JSON.stringify(e, null, 2);
      }
      res.status(status).send({ success: status === 200, error, payload });
    }
  );
}
