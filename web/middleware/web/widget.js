import { Shopify } from "@shopify/shopify-api";
import { addHours, formatISO, setMilliseconds, setMinutes } from "date-fns";

export default function applyWidgetMiddleware(app) {
  app.get("/api/web/widget/staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    try {
      payload = [
        {
          id: 1,
          fullname: "Fida Soueidan",
        },
        {
          id: 2,
          fullname: "Sara Soueidan",
        },
        {
          id: 3,
          fullname: "Trejde person",
        },
      ];
    } catch (e) {
      console.log(
        `Failed to process api/web/widget/staff:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.get("/api/web/widget/availability", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    console.log(req.query);

    try {
      payload = Array.from(Array(10)).map((_, i) => ({
        start_time: formatISO(
          addHours(setMinutes(setMilliseconds(new Date(), 0), 0), i)
        ),
        duration: 60,
        user_id: req.query.user_id,
      }));
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
