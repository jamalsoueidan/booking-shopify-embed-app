import { Shopify } from "@shopify/shopify-api";
import {
  addHours,
  getHours,
  isAfter,
  isBefore,
  parseISO,
  setHours,
  subHours,
} from "date-fns";
import * as Schedule from "../../../database/models/schedule";
import * as Staff from "../../../database/models/staff";

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
        `Failed to process api/admin/staff/:staff/schedules:
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
        `Failed to process api/admin/staff/:staff/schedules:
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
          groupId: null,
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
          `Failed to process api/admin/staff/:staff/schedules/:schedule:
         ${e}`
        );
        status = 500;
        error = JSON.stringify(e, null, 2);
      }
      res.status(status).send({ success: status === 200, error, payload });
    }
  );

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
            const startDateTime = parseISO(req.body.start);
            const endDateTime = parseISO(req.body.end);

            let start = new Date(d.start.setHours(getHours(startDateTime)));
            let end = new Date(d.end.setHours(getHours(endDateTime)));

            // startDateTime is before 30 oct
            if (
              isBefore(startDateTime, new Date(d.start.getFullYear(), 9, 30)) &&
              isAfter(start, new Date(d.start.getFullYear(), 9, 30)) // 9 is for october
            ) {
              start = addHours(start, 1);
              end = addHours(end, 1);
            }
            // startDateTime is after 30 oct, and current is before subs
            else if (
              isAfter(startDateTime, new Date(d.start.getFullYear(), 9, 30)) && // 9 is for october
              isBefore(start, new Date(d.start.getFullYear(), 9, 30))
            ) {
              start = subHours(start, 1);
              end = subHours(end, 1);
            }
            // startDateTime is before 27 march, and current is after
            else if (
              isBefore(startDateTime, new Date(d.start.getFullYear(), 2, 27)) &&
              isAfter(start, new Date(d.start.getFullYear(), 2, 27)) // 2 is for march
            ) {
              start = subHours(start, 1);
              end = subHours(end, 1);
            }
            // startDateTime is after 27 march, and current is before
            else if (
              isAfter(startDateTime, new Date(d.start.getFullYear(), 2, 27)) &&
              isBefore(start, new Date(d.start.getFullYear(), 2, 27))
              // 2 is for march
            ) {
              start = addHours(start, 1);
              end = addHours(end, 1);
            }

            return {
              updateOne: {
                filter: { _id: d._id },
                update: {
                  $set: {
                    start,
                    end,
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
        const documents = await Schedule.Model.countDocuments({
          _id: schedule,
          staff,
          groupId,
        });

        if (documents > 0) {
          payload = await Schedule.Model.deleteMany({ groupId });
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
}
