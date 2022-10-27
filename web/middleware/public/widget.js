import { Shopify } from "@shopify/shopify-api";
import {
  addHours,
  addMinutes,
  differenceInHours,
  differenceInMinutes,
  eachMinuteOfInterval,
  formatDistance,
  isAfter,
  isBefore,
} from "date-fns";
import mongoose from "mongoose";
import * as Product from "../../database/models/product.js";
import * as Schedule from "../../database/models/schedule.js";
import * as Booking from "../../database/models/booking.js";

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

  app.get("/api/widget/calendar", async (req, res) => {
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
}
