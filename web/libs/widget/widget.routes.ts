import { Router } from "express";
import controller from "./widget.controller";

const router = Router();

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

const handleRoute = async (req, res, methodName) => {
  try {
    res.status(202).send({
      success: true,
      payload: await controller[methodName]({
        query: req.query,
        body: req.body,
      }),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
router.use(async (req, res, next) => {
  const methodName = req.path.slice(1).replace("-", " ").toCamelCase();
  if (controller[methodName]) {
    handleRoute(req, res, methodName);
  } else {
    next();
  }
});

router.get("/availability-range", async (req, res) => {
  const { staffId } = req.query;
  const methodName = staffId
    ? "availabilityRangeByStaff"
    : "availabilityRangeByAll";
  handleRoute(req, res, methodName);
});

export default router;
