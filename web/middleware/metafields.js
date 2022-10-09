/*
mutation {
  metafieldDefinitionCreate(definition: {
    namespace: "book-appointment",
    key:"category",
    name: "booking-app-category",
    ownerType: COLLECTION
    type: "boolean"
  }) {
    createdDefinition {
      id,
      key,
      name,
    }
  }
}
*/

import Shopify from "@shopify/shopify-api";
import productCreator from "../helpers/product-creator";

/*
  Merchants need to be able to scan the QR Codes.
  This file provides the publicly available URLs to do that.
*/
export default function applyMetafieldPublicEndpoints(app) {
  app.get("/api/products/create", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;

    try {
      await productCreator(session);
    } catch (e) {
      console.log(`Failed to process products/create: ${e.message}`);
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });
}
