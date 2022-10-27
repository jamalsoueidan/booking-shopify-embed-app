import { Shopify } from "@shopify/shopify-api";
import * as Booking from "../../database/models/booking.js";

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

    try {
      payload = await Booking.find(shop);
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
