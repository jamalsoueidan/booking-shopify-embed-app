import { Shopify } from "@shopify/shopify-api";
import { getCollections, updateCollections } from "../helpers/collections.js";

export default function applyCollectionsMiddleware(app) {
  app.get("/api/collections/update", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    try {
      payload = await updateCollections(session);
    } catch (e) {
      console.log(
        `Failed to process api/collections/update:
         ${JSON.stringify(e, null, 2)}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.get("/api/collections", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    try {
      payload = await getCollections(session);
    } catch (e) {
      console.log(
        `Failed to process api/collections/list:
         ${JSON.stringify(e, null, 2)}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });
}
