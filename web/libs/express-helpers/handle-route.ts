import Shopify from "@shopify/shopify-api";

export const expressHandleRoute =
  (app, controller) =>
  async <T>(req, res, methodName: T) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    try {
      res.status(202).send({
        success: true,
        payload: await controller[methodName]({
          query: {
            shop: req.query.shop || session.shop,
            ...req.query,
            ...req.params,
          },
          body: req.body,
        }),
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  };
