import { Shopify } from "@shopify/shopify-api";
import { getCollections, updateCollections } from "../helpers/collections.js";
import { deleteMetafield } from "../helpers/metafields.js";

export default function applyCollectionsMiddleware(app) {
  app.post("/api/collections/update", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = [];

    try {
      /** @type {(Array<string>)} */
      const selection = req.body.selection;
      payload = await Promise.all(
        selection.map((s) => updateCollections(session, { id: s }))
      );
    } catch (e) {
      console.log(
        `Failed to process api/collections/update:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }

    res.status(status).send({ success: status === 200, error, payload });
  });

  app.delete("/api/collections/remove", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;

    try {
      const collectionId = req.body.id;
      const collection = await updateCollections(session, { id: collectionId });
      const metafield = collection.metafields.nodes[0];
      deleteMetafield(session, { id: metafield.id });
    } catch (e) {
      console.log(
        `Failed to process api/collections/update:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }

    res.status(status).send({ success: status === 200, error });
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
