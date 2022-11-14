import { expressHandleRoute } from "@libs/express-helpers/handle-route";
import { Router } from "express";
import { checkSchema } from "express-validator";
import controller, { ControllerMethods } from "./widget.controller";

declare global {
  interface String {
    toCamelCase: () => string;
  }
}

// https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
String.prototype.toCamelCase = function () {
  return this.replace(/^([A-Z])|\s(\w)/g, function (match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

export default function widgetRoutes(app) {
  const router = Router();

  const handleRoute = expressHandleRoute(app, controller);

  router.use(async (req, res, next) => {
    const methodName = req.path.slice(1).replace("-", " ").toCamelCase();
    if (controller[methodName]) {
      handleRoute(req, res, methodName);
    } else {
      next();
    }
  });

  router.post("/cart", async (req, res) => {
    handleRoute(req, res, ControllerMethods.addCart);
  });

  router.delete("/cart", async (req, res) => {
    handleRoute(req, res, ControllerMethods.removeCart);
  });

  router.get(
    "/availability-range",
    checkSchema({
      start: { notEmpty: true },
      end: { notEmpty: true },
      productId: { notEmpty: true },
    }),
    async (req, res) => {
      const { staffId } = req.query;
      const methodName = staffId
        ? ControllerMethods.availabilityRangeByStaff
        : ControllerMethods.availabilityRangeByAll;
      handleRoute(req, res, methodName);
    }
  );

  return router;
}
