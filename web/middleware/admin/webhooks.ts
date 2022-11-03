import { Shopify } from "@shopify/shopify-api";
import { Webhook } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";

export default function applyAdminWebhooksMiddleware(app) {
  app.get("/api/admin/webhooks", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    try {
      const webhook = new Webhook({ session });
      webhook.address =
        "https://ae511afdd320.eu.ngrok.io/api/web/widget/createProduct";
      webhook.topic = "orders/create";
      webhook.format = "json";
      const reponse = await webhook.save({
        update: true,
      });
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
