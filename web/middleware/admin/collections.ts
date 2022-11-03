import { Shopify } from "@shopify/shopify-api";
import * as Collection from "../../database/models/collection";
import * as Product from "../../database/models/product";
import { getCollection } from "../../helpers/collections";

export default function applyAdminCollectionsMiddleware(app) {
  app.post("/api/admin/collections", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = {};

    const shop = session?.shop || req.query.shop;

    const currentSession = {
      shop,
      accessToken:
        session?.accessToken || req.headers["x-shopify-access-token"],
    };

    try {
      /** @type {(Array<string>)} */
      const selections = req.body.selections;
      const collections = await Promise.all(
        selections.map((id) => getCollection(currentSession, id))
      );

      const collectionBulkWrite = collections.map((c) => {
        return {
          updateOne: {
            filter: { collectionId: c.id },
            update: {
              $set: { shop, title: c.title, collectionId: c.id },
            },
            upsert: true,
          },
        };
      });

      const products = collections.reduce((products, currentCollection) => {
        currentCollection.products.nodes.forEach((n) => {
          products.push({
            shop,
            collectionId: currentCollection.id,
            productId: n.id,
            title: n.title,
          });
        });
        return products;
      }, []);

      const productsBulkWrite = products.map((product) => {
        return {
          updateOne: {
            filter: { productId: product.productId },
            update: {
              $set: product,
            },
            upsert: true,
          },
        };
      });

      payload = {
        collections: await Collection.Model.bulkWrite(collectionBulkWrite),
        products: await Product.Model.bulkWrite(productsBulkWrite),
      };
    } catch (e) {
      console.log(
        `Failed to process api/collections:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }

    res.status(status).send({ success: status === 200, error, payload });
  });

  app.delete("/api/admin/collections/:collection", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const shop = session?.shop || req.query.shop;
    const { collection: _id } = req.params;

    try {
      const collection = await Collection.findOne({ shop, _id });

      if (collection) {
        payload = {
          collection: await Collection.Model.deleteOne({ _id }),
          products: await Product.Model.deleteMany({
            collectionId: collection.collectionId,
          }),
        };
      } else {
        payload = {};
      }
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

  app.get("/api/admin/collections", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    try {
      payload = await Collection.findAll();
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
