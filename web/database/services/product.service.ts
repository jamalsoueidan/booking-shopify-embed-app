import Product, { IProductModel } from "@models/product.model";
import mongoose, { FilterQuery, Types } from "mongoose";

const findOne = async (document) => {
  return await Product.findOne(document).lean();
};

const findByIdAndUpdate = async (_id, document) => {
  return await Product.findByIdAndUpdate(_id, document, {
    new: true,
  });
};

export interface GetProductWithSelectedStaffReturn
  extends Omit<IProductModel, "staff"> {
  staff: {
    tag: string;
    staff: Types.ObjectId;
  };
}

export interface GetProductWithSelectedStaffProps
  extends Pick<IProductModel, "shop" | "productId"> {
  staff: Types.ObjectId;
}

const getProductWithSelectedStaffId = async ({
  shop,
  productId,
  staff,
}: GetProductWithSelectedStaffProps): Promise<GetProductWithSelectedStaffReturn> => {
  const products = await Product.aggregate([
    {
      $match: {
        shop,
        productId,
        active: true,
      },
    },
    {
      $unwind: "$staff",
    },
    {
      $match: {
        "staff.staff": new mongoose.Types.ObjectId(staff),
      },
    },
  ]);

  if (products.length > 0) {
    return products[0];
  } else {
    return null;
  }
};

interface GetAllStaffReturn {
  _id: Types.ObjectId;
  fullname: string;
  tag: string;
  staff: Types.ObjectId;
}

const getAllStaff = async ({
  shop,
  productId,
}: FilterQuery<IProductModel>): Promise<Array<GetAllStaffReturn>> => {
  return await Product.aggregate([
    {
      $match: {
        productId,
        shop,
        active: true,
      },
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
    { $match: { active: true } },
    {
      $project: {
        shop: 0,
        email: 0,
        active: 0,
        phone: 0,
        __v: 0,
      },
    },
  ]);
};

interface AddStaff {
  id: string;
  shop: string;
  staff: string;
  tag: string;
}

const addStaff = async ({ id, shop, staff, tag }: AddStaff) => {
  // check staff already exist
  const product = await Product.findOne({
    _id: new mongoose.Types.ObjectId(id),
    shop,
    staff: { $elemMatch: { staff, tag } },
  });

  if (!product) {
    return await Product.findByIdAndUpdate(
      {
        shop,
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        $push: {
          staff: { staff, tag },
        },
        active: true,
      },
      {
        new: true,
      }
    );
  }
  return product;
};

export default {
  findOne,
  findByIdAndUpdate,
  getProductWithSelectedStaffId,
  getAllStaff,
  addStaff,
};
