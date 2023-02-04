import { IProductModel, ProductModel } from "@jamalsoueidan/bsb.bsb-pkg";
import mongoose from "mongoose";

export interface GetProductReturn extends IProductModel {}

export interface GetProductProps {
  shop: string;
  productId: number;
  staff?: string;
}

const getProduct = async ({
  shop,
  productId,
  staff,
}: GetProductProps): Promise<GetProductReturn> => {
  if (!staff) {
    return ProductModel.findOne({
      shop,
      productId,
      active: true,
    });
  }

  const products = await ProductModel.aggregate([
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
    const product = products[0];
    return {
      ...product,
      staff: [product.staff],
    };
  } else {
    return null;
  }
};

// get all staff from product for widget
const getStaff = async ({
  shop,
  productId,
}: Partial<IProductModel>): Promise<Array<WidgetStaff>> => {
  return await ProductModel.aggregate([
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

export default {
  getProduct,
  getStaff,
};
