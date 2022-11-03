import { Shopify } from "@shopify/shopify-api";
import { IncomingMessage, ServerResponse } from "http";
import Setting from "../../database/models/setting.js";
import express from "express";

interface StandardResponse {
  success: boolean;
  error: any;
  payload: any;
}

export default (app: express.Application) => {
  app.get(
    "/api/admin/setting",
    async (
      req: express.Request<IncomingMessage>,
      res: express.Response<StandardResponse>
    ) => {
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
        payload = await Setting.findOne({ shop });
      } catch (e) {
        console.log(
          `Failed to process api/admin/setting:
         ${e}`
        );
        status = 500;
        error = JSON.stringify(e, null, 2);
      }
      res.status(status).send({ success: status === 200, error, payload });
    }
  );

  app.put(
    "/api/admin/setting",
    async (
      req: express.Request<IncomingMessage>,
      res: express.Response<StandardResponse>
    ) => {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      let status = 200;
      let error = null;
      let payload = null;

      const shop = req.query?.shop || session?.shop;

      try {
        payload = await Setting.findOneAndUpdate({ shop }, req.body, {
          upsert: true,
          returnNewDocument: true,
        });
      } catch (e) {
        console.log(
          `Failed to process /api/admin/setting
         ${e}`
        );
        status = 500;
        error = JSON.stringify(e);
      }
      res.status(status).send({ success: status === 200, error, payload });
    }
  );
};
