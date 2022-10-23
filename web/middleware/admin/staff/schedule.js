import { Shopify } from "@shopify/shopify-api";
import { getHours, parseISO, setHours } from "date-fns";
import * as Schedule from "../../../database/models/schedule.js";
import * as Staff from "../../../database/models/staff.js";

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

    const shop = req.query.shop || session.shop;
    const { staff } = req.params;

    try {
      if (await Staff.findOne(staff, { shop })) {
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

    const shop = req.query.shop || session.shop;
    const { staff } = req.params;

    try {
      if (await Staff.findOne(staff, { shop })) {
        if (Array.isArray(req.body)) {
          const groupId = new Date().getTime();
          const schedules = req.body.map((b) => {
            b.groupId = groupId;
            b.staff = staff;
            return b;
          });
          payload = await Schedule.insertMany(schedules);
        } else {
          payload = await Schedule.create({ staff, ...req.body });
        }
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

    const shop = req.query.shop || session.shop;

    const { staff, schedule } = req.params;

    try {
      if (await Staff.findOne(staff, { shop })) {
        payload = await Schedule.findByIdAndUpdate(schedule, {
          groupId: "",
          ...req.body,
        });
      } else {
        throw "User doesn't exist";
      }
    } catch (e) {
      console.log(
        `Failed to process /api/admin/staff/:staff/schedules/:schedule:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.put(
    "/api/admin/staff/:staff/schedules/:schedule/group/:groupId",
    async (req, res) => {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      let status = 200;
      let error = null;
      let payload = null;

      const shop = req.query.shop || session.shop;

      const { staff, schedule, groupId } = req.params;

      try {
        const documents = await Schedule.find({
          _id: schedule,
          staff,
          groupId,
        });

        if (documents.length > 0) {
          const bulk = documents.map((d) => {
            const startHour = parseISO(req.body.start);
            const endHour = parseISO(req.body.end);
            return {
              updateOne: {
                filter: { _id: d._id },
                update: {
                  $set: {
                    start: d.start.setHours(getHours(startHour)),
                    end: d.end.setHours(getHours(endHour)),
                  },
                },
              },
            };
          });

          payload = await Schedule.Model.bulkWrite(bulk);
        } else {
          throw "Groupid doesn't exist";
        }
      } catch (e) {
        console.log(
          `Failed to process /api/admin/staff/:staff/schedules/:schedule:
         ${e}`
        );
        status = 500;
        error = JSON.stringify(e, null, 2);
      }
      res.status(status).send({ success: status === 200, error, payload });
    }
  );

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

      const shop = req.query.shop || session.shop;

      const { staff, schedule } = req.params;

      try {
        if (await Staff.findOne(staff, { shop })) {
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
