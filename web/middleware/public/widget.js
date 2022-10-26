import { Shopify } from "@shopify/shopify-api";
import {
  addHours,
  formatISO,
  isBefore,
  parseISO,
  setHours,
  setMilliseconds,
  setMinutes,
} from "date-fns";
import mongoose from "mongoose";
import * as Product from "../../database/models/product.js";
import * as Schedule from "../../database/models/schedule.js";

export default function applyPublicWidgetMiddleware(app) {
  app.get("/api/widget/staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;
    const { productId } = req.query;

    try {
      payload = await Product.Model.aggregate([
        {
          $match: { productId: "gid://shopify/Product/" + productId, shop },
        },
        {
          $unwind: { path: "$staff" },
        },
        {
          $lookup: {
            from: "Staff",
            localField: "staff.staff",
            foreignField: "_id",
            as: "staff.staff",
          },
        },
        {
          $unwind: {
            path: "$staff.staff",
          },
        },
        {
          $addFields: {
            "staff.staff.tag": "$staff.tag",
            "staff.staff.staff": "$staff.staff._id",
            "staff.staff._id": "$staff._id",
          },
        },
        {
          $addFields: {
            "_id.staff": "$staff.staff",
          },
        },
        {
          $replaceRoot: {
            newRoot: "$_id",
          },
        },
        {
          $replaceRoot: {
            newRoot: "$staff",
          },
        },
        { $match: { active: true } },
        {
          $project: {
            shop: 0,
            email: 0,
            active: 0,
            phone: 0,
            __v: 0,
          },
        },
      ]);
    } catch (e) {
      console.log(e);
      console.log(
        `Failed to process api/products/:productId:
         ${JSON.stringify(e, null, 2)}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.get("/api/widget/availability", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    const { staffId, date, shop, productId } = req.query;

    try {
      const product = await Product.Model.aggregate([
        {
          $match: {
            shop,
            productId: "gid://shopify/Product/" + productId,
          },
        },
        {
          $unwind: "$staff",
        },
        {
          $match: {
            "staff._id": new mongoose.Types.ObjectId(staffId),
          },
        },
      ]);

      const schedules = await Schedule.Model.aggregate([
        {
          $match: {
            tag: product[0].staff.tag,
            staff: product[0].staff.staff,
            available: true,
            start: {
              $gte: new Date(`${date}T00:00:00.0Z`),
            },
            end: {
              $lt: new Date(`${date}T23:59:59.0Z`),
            },
          },
        },
      ]);

      const scheduleHourly = schedules.reduce((previous, current) => {
        const start = new Date(current.start);
        const end = new Date(current.end);
        const hourly = [];

        previous.push(start);
        let count = 1;
        while (isBefore(addHours(start, count), new Date(end))) {
          previous.push(addHours(start, count));
          count += 1;
        }
        previous.push(hourly);
        return previous;
      }, []);

      payload = scheduleHourly;
    } catch (e) {
      console.log(
        `Failed to process api/web/widget/availability:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.get("/api/widget/copyavailability", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    const { staffId, start, end, shop, productId } = req.query;

    try {
      const product = await Product.Model.aggregate([
        {
          $match: {
            shop,
            productId: "gid://shopify/Product/" + productId,
          },
        },
        {
          $unwind: "$staff",
        },
        {
          $match: {
            "staff._id": new mongoose.Types.ObjectId(staffId),
          },
        },
      ]);

      const schedules = await Schedule.Model.aggregate([
        {
          $match: {
            tag: product[0].staff.tag,
            staff: product[0].staff.staff,
            available: true,
            start: {
              $gte: new Date(`${start}T00:00:00.0Z`),
            },
            end: {
              $lt: new Date(`${end}T23:59:59.0Z`),
            },
          },
        },
      ]);

      const scheduleHourly = schedules.reduce((previous, current) => {
        const start = new Date(current.start);
        const end = new Date(current.end);
        const hourly = [];

        hourly.push(start);
        let count = 1;
        while (isBefore(addHours(start, count), new Date(end))) {
          hourly.push(addHours(start, count));
          count += 1;
        }
        previous.push({ date: start, hourly });
        return previous;
      }, []);

      payload = scheduleHourly;

      /*payload = Array.from(Array(10)).map((_, i) => ({
        start_time: formatISO(
          addHours(setHours(setMinutes(setMilliseconds(dateObj, 0), 0), 10), i)
        ),
        duration: 60,
        user_id: req.query.user_id,
      }));*/
    } catch (e) {
      console.log(
        `Failed to process api/web/widget/availability:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  const getCollectionsQuery = `
    query {
      orders(first: 10) {
        nodes {
          lineItems(first: 10) {
            nodes {
              customAttributes {
                key,
                value
              }
            }
          }
        }
      }
    }
  `;

  app.get("/api/widget/test", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    try {
      const client = new Shopify.Clients.Graphql(
        "testeriphone.myshopify.com",
        "shpua_e7362500a3939ff163314ffee79cc395"
      );

      const orders = await client.query({
        data: {
          query: getCollectionsQuery,
        },
      });

      payload = orders.body.data;
    } catch (e) {
      console.log(
        `Failed to process api/web/widget/test:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });
}
