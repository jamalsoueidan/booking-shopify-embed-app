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
  return await ProductService.findOne({
    shop,
    _id: new mongoose.Types.ObjectId(id),
  });
};

interface UpdateBody extends Partial<IProductModel> {
  staff?: never;
}

const update = async ({ query, body }: { query: Query; body: UpdateBody }) => {
  const { shop, id } = query;

  // security, should not be able to update staff or other properties then buffertime or duration etc.
  return await ProductService.findByIdAndUpdate(
    new mongoose.Types.ObjectId(id),
    {
      shop,
      ...body,
    }
  );
};

interface GetStaffReturn extends IStaffModel, Document {
  tag: string;
  staff: Types.ObjectId;
}

const getStaff = async ({
  query,
}: {
  query: Query;
}): Promise<Array<GetStaffReturn>> => {
  const { shop, id } = query;

  return await ProductModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id), shop },
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
};

interface GetStaffToAddReturn extends IStaffModel, Document {
  tags: string[];
}

const getStaffToAdd = async ({
  query,
}: {
  query: Query;
}): Promise<Array<GetStaffToAddReturn>> => {
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

interface AddStaffBody {
  staff: string;
  tag: string;
}

const addStaff = async ({
  query,
  body,
}: {
  query: Query;
  body: AddStaffBody;
}): Promise<IProductModel> => {
  const { shop, id } = query;
  const { staff, tag } = body;

  return await ProductService.addStaff({ id, shop, staff, tag });
};

interface RemoveStaffQuery extends Query {
  staffId: string;
}
const removeStaff = async ({ query }: { query: RemoveStaffQuery }) => {
  const { shop, id, staffId } = query;

  return await ProductModel.updateOne(
    { shop, _id: new mongoose.Types.ObjectId(id) },
    { $pull: { staff: { _id: staffId } } }
  );
};

export default {
  getById,
  update,
  addStaff,
  removeStaff,
  getStaff,
  getStaffToAdd,
};
