// @ts-check
import { LATEST_API_VERSION, Shopify } from "@shopify/shopify-api";
import cookieParser from "cookie-parser";
import express from "express";
import { readFileSync } from "fs";
import { join } from "path";
import { AppInstallations } from "./app_installations.js";
import * as database from "./database/database.js";
import { setupGDPRWebHooks } from "./gdpr.js";
import redirectToAuth from "./helpers/redirect-to-auth.js";
import adminBookingRoutes from "./libs/admin-booking/admin-booking.routes.js";
import adminCollectionRoutes from "./libs/admin-collection/admin-collection.routes.js";
import adminProductRoutes from "./libs/admin-product/admin-product.routes";
import adminSettingRoutes from "./libs/admin-setting/admin-setting.routes";
import adminStaffScheduleRoutes from "./libs/admin-staff-schedule/admin-staff-schedule.routes.js";
import adminStaffRoutes from "./libs/admin-staff/admin-staff.routes";
import widgetRoutes from "./libs/widget/widget.routes";
import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import OrderWebhook from "./libs/webhooks/order.webhook.js";
import cors from "cors";

const USE_ONLINE_TOKENS = false;

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10) || 8000;

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

database.connect();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES?.split(","),
  HOST_NAME: process.env.HOST?.replace(/https?:\/\//, ""),
  HOST_SCHEME: process.env.HOST?.split("://")[0],
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MongoDBSessionStorage(
    new URL(process.env.MONGODB_URI),
    "book-appointment-app"
  ),
  ...(process.env.SHOP_CUSTOM_DOMAIN && {
    CUSTOM_SHOP_DOMAINS: [process.env.SHOP_CUSTOM_DOMAIN],
  }),
});

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/api/webhooks",
  webhookHandler: async (_topic, shop, _body) => {
    await AppInstallations.delete(shop);
  },
});

Shopify.Webhooks.Registry.addHandler("ORDERS_PAID", {
  path: "/api/webhooks",
  webhookHandler: async (_topic, shop, _body) => {
    OrderWebhook.create({ ...JSON.parse(_body), shop });
    console.log("orders/paid");
  },
});

Shopify.Webhooks.Registry.addHandler("ORDERS_UPDATED", {
  path: "/api/webhooks",
  webhookHandler: async (_topic, shop, _body) => {
    //OrderWebhook.create({ ...JSON.parse(_body), shop });
    console.log("order/update");
  },
});

Shopify.Webhooks.Registry.addHandler("ORDERS_CANCELLED", {
  path: "/api/webhooks",
  webhookHandler: async (_topic, shop, _body) => {
    //delete
    OrderWebhook.cancel({ ...JSON.parse(_body), shop });
    console.log("order/cancelled");
  },
});

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
  required: false,
  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  // chargeName: "My Shopify One-Time Charge",
  // amount: 5.0,
  // currencyCode: "USD",
  // interval: BillingInterval.OneTime,
};

// This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint
// in the “GDPR mandatory webhooks” section in the “App setup” tab, and customize
// the code when you store customer data.
//
// More details can be found on shopify.dev:
// https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
setupGDPRWebHooks("/api/webhooks");

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  billingSettings = BILLING_SETTINGS
) {
  const app = express();

  app.use(cors());
  app.set("use-online-tokens", USE_ONLINE_TOKENS);
  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app, {
    billing: billingSettings,
  });

  // Do not call app.use(express.json()) before processing webhooks with
  // Shopify.Webhooks.Registry.process().
  // See https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers
  // for more details.
  app.post("/api/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (e) {
      console.log(`Failed to process webhook: ${e.message}`);
      if (!res.headersSent) {
        res.status(500).send(e.message);
      }
    }
  });

  // All endpoints after this point will have access to a request.body
  // attribute, as a result of the express.json() middleware
  app.use(express.json({ limit: "1mb", extended: true } as any));

  app.use("/api/widget", widgetRoutes(app));

  // All endpoints after this point will require an active session
  app.use(
    "/api/*",
    verifyRequest(app, {
      billing: billingSettings,
    })
  );

  app.use("/api/admin", adminBookingRoutes(app));
  app.use("/api/admin", adminCollectionRoutes(app));
  app.use("/api/admin", adminProductRoutes(app));
  app.use("/api/admin", adminStaffRoutes(app));
  app.use("/api/admin", adminStaffScheduleRoutes(app));
  app.use("/api/admin", adminSettingRoutes(app));

  app.use((req, res, next) => {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop as any);
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${encodeURIComponent(
          shop
        )} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  if (isProd) {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
  }

  app.use("/*", async (req, res, next) => {
    if (typeof req.query.shop !== "string") {
      res.status(500);
      return res.send("No shop provided");
    }

    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    const appInstalled = await AppInstallations.includes(shop);
    if (!appInstalled && !req.originalUrl.match(/^\/exitiframe/i)) {
      return redirectToAuth(req, res, app);
    }

    if (Shopify.Context.IS_EMBEDDED_APP && req.query.embedded !== "1") {
      const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req);

      return res.redirect(embeddedUrl + req.path);
    }

    const htmlFile = join(
      isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
      "index.html"
    );

    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(readFileSync(htmlFile));
  });

  return { app };
}

createServer().then(({ app }) => app.listen(PORT));
