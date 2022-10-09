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

import { Shopify } from "@shopify/shopify-api";
import collectionsList from "../helpers/collections.js";

/*
  Merchants need to be able to scan the QR Codes.
  This file provides the publicly available URLs to do that.
*/
export default function applyCollectionsMiddleware(app) {
  app.get("/api/collections/list", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    try {
      payload = await collectionsList(session);
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
