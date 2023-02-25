import { ShopifySession } from "@jamalsoueidan/pkg.bsb";
import { Express, NextFunction, Request, Response } from "express";
import shopify from "../../shopify";
interface SessionRequest extends Request {
  session: ShopifySession;
}

export const shopifyMiddleware =
  (app: Express) =>
  async (req: SessionRequest, res: Response, next: NextFunction) => {
    req.query.shop = res.locals.shopify.session.shop;
    req.session = {
      ...res.locals.shopify.session,
      shopify,
    };

    next();
  };
