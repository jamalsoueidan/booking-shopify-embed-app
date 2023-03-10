import express from "express";
import { readFileSync } from "fs";
import { join } from "path";
import serveStatic from "serve-static";

import GDPRWebhookHandlers from "./gdpr";
import shopify from "./shopify";

import {
  NotificationTemplateModel,
  ShopifySessionModel,
  bookingRouter,
  collectionRouter,
  customerRouter,
  mongodb,
  productRouter,
  scheduleRouter,
  staffRouter,
  widgetRouter,
} from "@jamalsoueidan/pkg.backend";
import { notificationRoutes } from "@libs/notification/notification.routes";
import { settingNotificationTemplatesRoutes } from "@libs/setting-notification-templates/setting-notification-templates.routes";
import { settingRoutes } from "@libs/setting/setting.routes";
import { shopifyMiddleware } from "@libs/shopify/shopify.middleware";

const morgan = require("morgan");

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "8000",
  10,
);

mongodb.connect(() => NotificationTemplateModel.count());

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());

app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot(),
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers as any }),
);

/* Register webhooks */
const register = async () => {
  const sessions = await ShopifySessionModel.find().lean();
  sessions.forEach(async (session) => {
    try {
      const response = await shopify.api.webhooks.register({
        session: session as any,
      });

      console.log(response);
    } catch (error) {
      console.error(JSON.stringify(error)); // in practice these should be handled more gracefully
    }
  });
};

register();
/* ------------------- */

app.use(express.json());
app.use("/api", widgetRouter);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(morgan("dev"));
app.use("/api/*", shopifyMiddleware(app) as any);

app.use("/api/admin", bookingRouter);
app.use("/api/admin", collectionRouter);
app.use("/api/admin", customerRouter);
app.use("/api/admin", notificationRoutes);
app.use("/api/admin", productRouter);
app.use("/api/admin", settingRoutes);
app.use("/api/admin", settingNotificationTemplatesRoutes);
app.use("/api/admin", scheduleRouter);
app.use("/api/admin", staffRouter);
app.use("/api/admin", widgetRouter);

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
