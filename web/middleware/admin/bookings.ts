import { Shopify } from "@shopify/shopify-api";
import * as Booking from "../../database/models/booking";

export default function applyAdminBookingsMiddleware(app) {
  app.get("/api/admin/bookings", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;

    const { start, end } = req.query;

    try {
      payload = await Booking.Model.aggregate([
        {
          $match: {
            shop,
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
          $unwind: "$staff",
        },
        {
          $lookup: {
            from: "Product",
            localField: "productId",
            foreignField: "productId",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
      ]);
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
}
