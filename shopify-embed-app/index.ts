import express from "express";
import { readFileSync } from "fs";
import { join } from "path";
import serveStatic from "serve-static";

import GDPRWebhookHandlers from "./gdpr.js";
import shopify from "./shopify.js";

import { NotificationTemplateModel, mongodb } from "@jamalsoueidan/pkg.bsb";
import { bookingRoutes } from "@libs/booking/booking.routes";
import { collectionRoutes } from "@libs/collection/collection.routes";
import { customerRoutes } from "@libs/customer/customer.routes";
import { notificationRoutes } from "@libs/notification/notification.routes";
import { productRoutes } from "@libs/product/product.routes";
import { settingNotificationTemplatesRoutes } from "@libs/setting-notification-templates/setting-notification-templates.routes";
import { settingRoutes } from "@libs/setting/setting.routes";
import { shopifyMiddleware } from "@libs/shopify/shopify.middleware";
import { staffScheduleRoutes } from "@libs/staff-schedule/staff-schedule.routes";
import { staffRoutes } from "@libs/staff/staff.routes";
import { widgetRoutes } from "@libs/widget/widget.routes";

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

app.use(express.json());

app.use("/api", widgetRoutes);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use("/api/*", shopifyMiddleware(app) as any);

app.use("/api/admin", bookingRoutes);
app.use("/api/admin", collectionRoutes);
app.use("/api/admin", customerRoutes);
app.use("/api/admin", notificationRoutes);
app.use("/api/admin", productRoutes);
app.use("/api/admin", settingRoutes);
app.use("/api/admin", settingNotificationTemplatesRoutes);
app.use("/api/admin", staffRoutes);
app.use("/api/admin", staffScheduleRoutes);
app.use("/api/admin", widgetRoutes);

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
