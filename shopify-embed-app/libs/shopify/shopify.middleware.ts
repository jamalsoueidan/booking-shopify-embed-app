import Shopify from "@shopify/shopify-api";
import { Session } from "@shopify/shopify-api/dist/auth/session";
import { Express, NextFunction, Request, Response } from "express";

interface SessionRequest extends Request {
  session: Session | undefined;
}

export const shopifyMiddleware =
  (app: Express) =>
  async (req: SessionRequest, res: Response, next: NextFunction) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens"),
    );

    req.query.shop = session?.shop;
    req.session = session;

    next();
  };
