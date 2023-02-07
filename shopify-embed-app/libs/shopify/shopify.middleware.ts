import Shopify from "@shopify/shopify-api";

export const shopifyMiddleware = (app) => async (req, res, next) => {
  const session = await Shopify.Utils.loadCurrentSession(
    req,
    res,
    app.get("use-online-tokens"),
  );

  req.query.shop = session.shop;
  req.session = session;

  next();
};
