import {
  ControllerProps,
  ProductModel,
  ScheduleModel,
  ShopQuery,
  ShopifyControllerProps,
} from "@jamalsoueidan/bsb.bsb-pkg";
import ProductService from "@services/product.service";
import Shopify from "@shopify/shopify-api";
import mongoose from "mongoose";

interface GetOrderFromShopify {
  id: string;
}

interface ClientQueryShopifyOrder {
  body: {
    data: {
      order: {
        name: string;
      };
    };
  };
}

export const getOrderFromShopify = async ({
  query,
  session,
}: ShopifyControllerProps<GetOrderFromShopify>) => {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  const data: ClientQueryShopifyOrder = await client.query({
    data: `query {
      order(id: "gid://shopify/Order/${query.id}") {
        name,
        note,
      }
    }`,
  });

  return data?.body?.data?.order;
};

export const get = ({ query }: ControllerProps<ShopQuery>) => {
  return ProductModel.find({ shop: query.shop });
};

interface Query {
  id: string;
}

export const getById = async ({
  query,
}: ControllerProps<Query>): Promise<Product | null> => {
  const { shop, id } = query;

  const product = await ProductModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
    shop,
    "staff.0": { $exists: false },
  });

  if (product) {
    return product as any;
  }

  const products = await ProductModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id), shop },
    },
    {
      $unwind: { path: "$staff", preserveNullAndEmptyArrays: true },
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
      },
    },
    {
      $addFields: {
        staff: "$staff.staff",
      },
    },
    { $sort: { "staff.fullname": 1 } },
    {
      $group: {
        _id: "$_id",
        product: { $first: "$$ROOT" },
        staff: { $push: "$staff" },
      },
    },
    {
      $addFields: {
        "product.staff": "$staff",
      },
    },
    { $replaceRoot: { newRoot: "$product" } },
  ]);

  return products.length > 0 ? products[0] : null;
};

export const update = ({
  query,
  body,
}: ControllerProps<Query, ProductUpdateBody>): Promise<Product> => {
  return ProductService.update({ query, body });
};

// @description return all staff that don't belong yet to the product
export const getStaff = ({ query }: ControllerProps<ShopQuery>) => {
  const { shop } = query;

  return ScheduleModel.aggregate<ProductAddStaff>([
    /*{
      //TODO: should we only show staff who have schedule after today?
      $match: {
        start: {
          $gte: startOfDay(new Date()),
        },
      },
    },*/
    {
      $group: {
        _id: {
          shop: shop,
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
    { $sort: { fullname: 1 } },
  ]);
};
