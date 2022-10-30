import { Shopify } from "@shopify/shopify-api";
import { addMinutes, differenceInMinutes, format, isBefore } from "date-fns";
import mongoose from "mongoose";
import * as Booking from "../../database/models/booking.js";
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

  app.get("/api/widget/availability/day", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    const { staffId, date, shop, productId } = req.query;

    try {
      const products = await Product.Model.aggregate([
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
            "staff.staff": new mongoose.Types.ObjectId(staffId),
          },
        },
      ]);

      const currentProduct = products?.length > 0 ? products[0] : {};

      const schedules = await Schedule.Model.aggregate([
        {
          $match: {
            tag: currentProduct.staff.tag,
            staff: currentProduct.staff.staff,
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

      const bookings = await Booking.Model.aggregate([
        {
          $match: {
            shop,
            productId: "gid://shopify/Product/" + productId,
            start: {
              $gte: new Date(`${date}T00:00:00.0Z`),
            },
            end: {
              $lt: new Date(`${date}T23:59:59.0Z`),
            },
            staff: currentProduct.staff.staff,
          },
        },
        {
          $project: {
            _id: 0,
            shop: 0,
            staff: 0,
            productId: 0,
          },
        },
      ]);

      let scheduleHourly = schedules.reduce((previous, current) => {
        const end = new Date(current.end);
        const duration = currentProduct.duration || 60;
        const buffertime = currentProduct.buffertime || 0;

        // we push start time everytime
        let start = new Date(current.start);

        while (isBefore(start, end)) {
          previous.push({
            start: start,
            end: addMinutes(start, duration),
          });
          start = addMinutes(start, duration + buffertime);
        }

        return previous;
      }, []);

      bookings.forEach((book) => {
        const { start, end } = book;

        scheduleHourly = scheduleHourly.filter((schedule) => {
          if (
            differenceInMinutes(start, schedule.start) <= 0 &&
            differenceInMinutes(end, schedule.start) >= 0
          ) {
            return false;
          }
          if (
            differenceInMinutes(start, schedule.end) <= 0 &&
            differenceInMinutes(end, schedule.end) >= 0
          ) {
            return false;
          }
          return true;
        });
      });

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

  app.get("/api/widget/availability/range", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    const { staffId, start, end, shop, productId } = req.query;

    try {
      const products = await Product.Model.aggregate([
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
            "staff.staff": new mongoose.Types.ObjectId(staffId),
          },
        },
      ]);

      const currentProduct = products?.length > 0 ? products[0] : null;

      if (!currentProduct) {
        throw "staff does not exists on this product";
      }

      const schedules = await Schedule.Model.aggregate([
        {
          $match: {
            tag: currentProduct?.staff?.tag,
            staff: currentProduct?.staff?.staff,
            available: true,
            start: {
              $gte: new Date(`${start}T00:00:00.0Z`),
            },
            end: {
              $lt: new Date(`${end}T23:59:59.0Z`),
            },
          },
        },
        {
          $lookup,
        },
      ]);

      /* convert the schedules to available hours */
      let scheduleDates = schedules.reduce((previous, current) => {
        const end = new Date(current.end);
        const duration = currentProduct.duration || 60;
        const buffertime = currentProduct.buffertime || 0;

        // we push start time everytime
        let start = new Date(current.start);
        let hours = [];
        while (isBefore(start, end)) {
          hours.push({
            start: start,
            end: addMinutes(start, duration),
          });
          start = addMinutes(start, duration + buffertime);
        }
        previous.push({ date: start, hours });
        return previous;
      }, []);

      const bookings = await Booking.Model.aggregate([
        {
          $match: {
            shop,
            productId: "gid://shopify/Product/" + productId,
            start: {
              $gte: new Date(`${start}T00:00:00.0Z`),
            },
            end: {
              $lt: new Date(`${end}T23:59:59.0Z`),
            },
            staff: staffId,
          },
        },
        {
          $project: {
            _id: 0,
            shop: 0,
            staff: 0,
            productId: 0,
          },
        },
      ]);

      bookings.forEach((book) => {
        const { start, end } = book;
        scheduleDates = scheduleDates.map((scheduleDate) => {
          return {
            ...scheduleDate,
            hours: scheduleDate.hours.filter((schedule) => {
              if (
                differenceInMinutes(start, schedule.start) <= 0 &&
                differenceInMinutes(end, schedule.start) >= 0
              ) {
                return false;
              }
              if (
                differenceInMinutes(start, schedule.end) <= 0 &&
                differenceInMinutes(end, schedule.end) >= 0
              ) {
                return false;
              }
              return true;
            }),
          };
        });
      });

      payload = scheduleDates;
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

  app.get("/api/widget/availability/calendar", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    const { start, end, shop, productId } = req.query;

    try {
      const currentProduct = await Product.Model.findOne({
        shop,
        productId: "gid://shopify/Product/" + productId,
      });

      const schedules = await Schedule.Model.aggregate([
        {
          $match: {
            tag: {
              $in: currentProduct.staff.map((s) => s.tag),
            },
            available: true,
            start: {
              $gte: new Date(`${start}T00:00:00.0Z`),
            },
            end: {
              $lt: new Date(`${end}T23:59:59.0Z`),
            },
          },
        },
        {
          $lookup: {
            from: "Staff",
            localField: "staff",
            foreignField: "_id",
            as: "staff",
          },
        },
        {
          $unwind: {
            path: "$staff",
          },
        },
        {
          $match: {
            "staff.active": true,
          },
        },
        {
          $project: {
            "staff.email": 0,
            "staff.active": 0,
            "staff.shop": 0,
            "staff.phone": 0,
            "staff.__v": 0,
          },
        },
      ]);

      /* convert the schedules to available hours */
      let scheduleDates = schedules.reduce((previous, current) => {
        const end = new Date(current.end);
        const duration = currentProduct.duration || 60;
        const buffertime = currentProduct.buffertime || 0;

        // we push start time everytime
        let start = new Date(current.start);
        const date = format(start, "yyyy-MM-dd");

        let hours = previous.find((p) => p.date === date)?.hours || [];
        while (isBefore(start, end)) {
          hours.push({
            start: start,
            end: addMinutes(start, duration),
            staff: current.staff,
          });
          start = addMinutes(start, duration + buffertime);
        }
        previous.push({ date, hours });
        return previous;
      }, []);

      const bookings = await Booking.Model.aggregate([
        {
          $match: {
            shop,
            productId: "gid://shopify/Product/" + productId,
            start: {
              $gte: new Date(`${start}T00:00:00.0Z`),
            },
            end: {
              $lt: new Date(`${end}T23:59:59.0Z`),
            },
          },
        },
        {
          $project: {
            _id: 0,
            shop: 0,
            productId: 0,
          },
        },
      ]);

      bookings.forEach((book) => {
        const { start, end, staff } = book;
        scheduleDates = scheduleDates.map((scheduleDate) => {
          return {
            ...scheduleDate,
            hours: scheduleDate.hours.filter((hour) => {
              if (hour.staff._id.toString() !== staff.toString()) {
                return true;
              }

              if (
                differenceInMinutes(start, hour.start) <= 0 &&
                differenceInMinutes(end, hour.start) >= 0
              ) {
                return false;
              }
              if (
                differenceInMinutes(start, hour.end) <= 0 &&
                differenceInMinutes(end, hour.end) >= 0
              ) {
                return false;
              }

              return true;
            }),
          };
        });
      });

      payload = scheduleDates;
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
}
