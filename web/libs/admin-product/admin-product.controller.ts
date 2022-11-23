import ProductModel, { IProductModel } from "@models/product.model";
import ScheduleModel from "@models/schedule.model";
import ProductService from "@services/product.service";
import mongoose, { Document, Types } from "mongoose";
import { IStaffModel } from "../../database/models/staff.model";

export enum ControllerMethods {
  getById = "getById",
  update = "update",
  getStaff = "getStaff",
  getStaffToAdd = "getStaffToAdd",
  addStaff = "addStaff",
  removeStaff = "removeStaff",
}

interface Query extends Pick<IProductModel, "shop"> {
  id: string;
}

const getById = async ({ query }: { query: Query }) => {
  const { shop, id } = query;

  const product = await ProductModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
    shop,
    "staff.0": { $exists: false },
  }).lean();

  if (product) {
    return product;
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

interface UpdateStaffBody {
  _id: string;
  tag: string;
}
interface UpdateBody {
  staff?: UpdateStaffBody[];
  duration?: number;
  buffertime?: number;
  active?: boolean;
}

const update = async ({ query, body }: { query: Query; body: UpdateBody }) => {
  const { staff, ...properties } = body;

  const newStaffier =
    staff?.map((s) => {
      return {
        staff: s._id,
        tag: s.tag,
      };
    }) || [];

  const active = newStaffier.length === 0 ? false : properties.active;

  return await ProductModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(query.id),
      shop: query.shop,
    },
    {
      $set: { ...properties, staff: newStaffier, active },
    },
    {
      new: true,
    }
  ).lean();
};

interface GetStaffReturn extends IStaffModel, Document {
  tags: string[];
}

// @description return all staff that don't belong yet to the product
const getStaff = async ({
  query,
}: {
  query: Query;
}): Promise<Array<GetStaffReturn>> => {
  const { shop, id } = query;

  return await ScheduleModel.aggregate([
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
              _id: new mongoose.Types.ObjectId(id),
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
};

export default {
  getById,
  update,
  getStaff,
};
