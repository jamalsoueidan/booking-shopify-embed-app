import Shopify from "@shopify/shopify-api";
import { validationResult } from "express-validator";

export const expressHandleRoute =
  (app, controller) =>
  async <T>(req, res, methodName: T) => {
    try {
      const { errors } = validationResult(req) as any;
      if (errors.length) {
        throw errors;
      }

      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      res.status(202).send({
        success: true,
        payload: await controller[methodName]({
          query: {
            shop: req.query.shop || session.shop,
            ...req.query,
            ...req.params,
            session: {
              ...session,
              shop: req.query.shop || session.shop,
              accessToken:
                session?.accessToken || req.headers["x-shopify-access-token"],
            },
          },
          body: req.body,
        }),
      });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error: error instanceof Error ? `${error}` : error,
        });
    }
  };
