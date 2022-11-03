import { Shopify } from "@shopify/shopify-api";
import mongoose from "mongoose";
import * as Product from "../../database/models/product";
import * as Schedule from "../../database/models/schedule";

export default function applyAdminProductMiddleware(app) {
  app.get("/api/admin/products/:productId", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;
    const { productId } = req.params;

    try {
      payload = await Product.findOne({ shop, productId });
    } catch (e) {
      console.log(
        `Failed to process api/products/:productId:
         ${JSON.stringify(e, null, 2)}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.put("/api/admin/products/:productId", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;
    const { productId } = req.params;

    try {
      if (Object.keys(req.body).length > 0) {
        payload = await Product.findByIdAndUpdate(productId, {
          shop,
          ...req.body,
        });
      }
    } catch (e) {
      console.log(
        `Failed to process api/products/:productId:
         ${JSON.stringify(e, null, 2)}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.get("/api/admin/products/:productId/staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;
    const { productId } = req.params;

    try {
      payload = await Product.Model.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(productId), shop },
        },
        {
          $unwind: { path: "$staff" },
        },
        {
          $lookup: {
            from: "Staff",
            localField: "staff.staff",
            foreignField: "_id",
            as: "staff.staff",
          },
        },
        {
          $unwind: {
            path: "$staff.staff",
          },
        },
        {
          $addFields: {
            "staff.staff.tag": "$staff.tag",
            "staff.staff.staff": "$staff.staff._id",
            "staff.staff._id": "$staff._id",
          },
        },
        {
          $addFields: {
            "_id.staff": "$staff.staff",
          },
        },
        {
          $replaceRoot: {
            newRoot: "$_id",
          },
        },
        {
          $replaceRoot: {
            newRoot: "$staff",
          },
        },
      ]);
    } catch (e) {
      console.log(e);
      console.log(
        `Failed to process api/products/:productId:
         ${JSON.stringify(e, null, 2)}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.get("/api/admin/products/:productId/staff-to-add", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;
    const { productId } = req.params;

    try {
      payload = await Schedule.Model.aggregate([
        {
          $group: {
            _id: {
              staff: "$staff",
              tag: "$tag",
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ staff: "$_id.staff", tag: "$_id.tag" }],
            },
          },
        },
        {
          $group: {
            _id: "$staff",
            tags: { $push: "$tag" },
          },
        },
        {
          $project: {
            _id: "$_id",
            tags: "$tags",
          },
        },
        {
          $lookup: {
            from: "Staff",
            localField: "_id",
            foreignField: "_id",
            as: "staffs",
          },
        },
        {
          $unwind: "$staffs", //explode array
        },
        {
          $addFields: {
            "staffs.tags": "$tags",
          },
        },
        {
          $replaceRoot: {
            newRoot: "$staffs",
          },
        },
        {
          $lookup: {
            from: "Product",
            localField: "_id",
            foreignField: "staff.staff",
            let: {
              staffId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  _id: new mongoose.Types.ObjectId(productId),
                },
              },
            ],
            as: "products",
          },
        },
        { $match: { products: { $size: 0 } } },
        {
          $project: {
            products: 0,
          },
        },
      ]);
    } catch (e) {
      console.log(
        `Failed to process api/products/:productId:
         ${JSON.stringify(e, null, 2)}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.post("/api/admin/products/:productId/staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    let status = 200;
    let error = null;
    let payload = null;

    const shop = req.query.shop || session.shop;
    const { productId } = req.params;

    const { staff, tag } = req.body;

    try {
      const product = await Product.findOne({
        productId,
        shop,
        staff: { $elemMatch: { staff, tag } },
      });

      if (!product) {
        payload = await Product.Model.findByIdAndUpdate(
          {
            shop,
            _id: productId,
          },
          {
            $addToSet: {
              staff: { ...req.body },
            },
          }
        );
      } else {
        throw "staff already exist";
      }
    } catch (e) {
      console.log(e);
      console.log(
        `Failed to process api/products/:productId:
         ${JSON.stringify(e, null, 2)}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.delete(
    "/api/admin/products/:productId/staff/:staffId",
    async (req, res) => {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      let status = 200;
      let error = null;
      let payload = null;

      const shop = req.query.shop || session.shop;
      const { productId, staffId } = req.params;

      try {
        payload = await Product.Model.updateOne(
          { shop, _id: productId },
          { $pull: { staff: { _id: staffId } } }
        );
      } catch (e) {
        console.log(
          `Failed to process api/products/:productId:
         ${JSON.stringify(e, null, 2)}`
        );
        status = 500;
        error = JSON.stringify(e, null, 2);
      }
      res.status(status).send({ success: status === 200, error, payload });
    }
  );
}
