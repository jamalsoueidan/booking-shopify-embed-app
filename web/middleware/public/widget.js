import { Shopify } from "@shopify/shopify-api";
import { addMinutes, differenceInMinutes, format, isBefore } from "date-fns";
import mongoose from "mongoose";
import * as Booking from "../../database/models/booking.js";
import * as Product from "../../database/models/product.js";
import * as Schedule from "../../database/models/schedule.js";
import * as Staff from "../../database/models/staff.js";

/**
 * @typedef ScheduleHour
 * @type {object}
 * @property {date} start
 * @property {date} end
 * @property {staff} staff
 */

/**
 * @typedef ScheduleDate
 * @type {object}
 * @property {string} date
 * @property {ScheduleHour[]} hours
 */

/**
 * @return {Array<ScheduleDate>}
 */
const scheduleReduce = (product) => (previous, current) => {
  const end = new Date(current.end);
  const duration = product.duration || 60;
  const buffertime = product.buffertime || 0;

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
};

const scheduleCalculateBooking = (book) => {
  const { start, end, staff } = book;
  return (schedule) => {
    return {
      ...schedule,
      hours: schedule.hours.filter((hour) => {
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
  };
};

export default function applyPublicWidgetMiddleware(app) {
  app.get("/api/widget/staff", async (req, res) => {
    let status = 200;
    let error = null;
    let payload = null;
    const { productId, shop } = req.query;

    try {
      const staff = await Product.getAllStaff({ shop, productId });
      if (staff.length === 0) {
        error = "no staff or product exist";
      } else {
        payload = staff;
      }
    } catch (e) {
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
    let status = 200;
    let error = null;
    let payload = null;
    const { staffId, date, productId, shop } = req.query;

    try {
      const product = await Product.getProductWithSelectedStaffId({
        shop,
        productId,
        staffId,
      });

      if (!product) {
        throw "no staff or product";
      }

      const schedules = await Schedule.getByStaffAndTag({
        tag: product.staff.tag,
        staff: product.staff.staff,
        available: true,
        start: date,
        end: date,
      });

      const bookings = await Booking.getBookingsByProductAndStaff({
        shop,
        productId,
        start: date,
        end: date,
        staff: product.staff.staff,
      });

      /** @type {CustomSchedules[]} */
      let scheduleDates = schedules.reduce(scheduleReduce(product), []);

      bookings.forEach(
        (book) =>
          (scheduleDates = scheduleDates.map(scheduleCalculateBooking(book)))
      );

      payload = scheduleDates;
    } catch (e) {
      console.log(
        `Failed to process api/web/widget/day:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.get("/api/widget/availability/range", async (req, res) => {
    let status = 200;
    let error = null;
    let payload = null;

    const { staffId, start, end, shop, productId } = req.query;

    try {
      const product = await Product.getProductWithSelectedStaffId({
        shop,
        productId,
        staffId,
      });

      if (!product) {
        throw "no staff or product";
      }

      const schedules = await Schedule.getByStaffAndTag({
        tag: product.staff.tag,
        staff: product.staff.staff,
        available: true,
        start,
        end,
      });

      const bookings = await Booking.getBookingsByProductAndStaff({
        shop,
        productId,
        staffId,
        start,
        end,
      });

      /** @type {CustomSchedules[]} */
      let scheduleDates = schedules.reduce(scheduleReduce(product), []);

      bookings.forEach(
        (book) =>
          (scheduleDates = scheduleDates.map(scheduleCalculateBooking(book)))
      );

      payload = scheduleDates;
    } catch (e) {
      console.log(
        `Failed to process api/web/widget/range:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.get("/api/widget/availability/any", async (req, res) => {
    let status = 200;
    let error = null;
    let payload = null;

    const { start, end, shop, productId } = req.query;

    try {
      const product = await Product.findOne({
        shop,
        productId: "gid://shopify/Product/" + productId,
        active: true,
      });

      const schedules = await Schedule.getByTag({
        tag: product.staff.map((s) => s.tag),
        start,
        end,
      });

      const bookings = await Booking.getBookingsByProduct({
        shop,
        productId,
        start,
        end,
      });

      /** @type {CustomSchedules[]} */
      let scheduleDates = schedules.reduce(scheduleReduce(product), []);

      bookings.forEach(
        (book) =>
          (scheduleDates = scheduleDates.map(scheduleCalculateBooking(book)))
      );

      payload = scheduleDates;
    } catch (e) {
      console.log(
        `Failed to process api/web/widget/any:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });
}
