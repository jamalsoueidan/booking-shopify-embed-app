import { Shopify } from "@shopify/shopify-api";
import { createMetafield, getMetafield } from "../../helpers/metafields";

export default function applyAdminMetafieldsMiddleware(app) {
  app.get("/api/admin/metafields", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    try {
      payload = await createMetafield(session);
    } catch (e) {
      console.log(
        `Failed to process api/metafields:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });
}
