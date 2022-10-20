import { Shopify } from "@shopify/shopify-api";
import {
  addHours,
  formatISO,
  parseISO,
  setHours,
  setMilliseconds,
  setMinutes,
} from "date-fns";

export default function applyPublicWidgetMiddleware(app) {
  app.get("/api/widget/staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    const { productId } = req.query;

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

  app.get("/api/widget/availability", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let status = 200;
    let error = null;
    let payload = null;

    const { userId, date, shop } = req.query;

    try {
      const dateObj = parseISO(date);

      payload = Array.from(Array(10)).map((_, i) => ({
        start_time: formatISO(
          addHours(setHours(setMinutes(setMilliseconds(dateObj, 0), 0), 10), i)
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
