import mongoose, { FilterQuery, Schema, Types } from "mongoose";

// https://tomanagle.medium.com/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
export interface ProductModel {
  shop: string;
  collectionId: string;
  productId: string;
  title: string;
  staff: [
    {
      _id: Types.ObjectId;
      staff: string;
      tag: string;
    }
  ];
  duration: number;
  buffertime: number;
  active: boolean;
}

const ProductSchema = new Schema({
  shop: {
    type: String,
    required: true,
    index: true,
  },
  collectionId: {
    type: String,
    required: true,
    index: true,
  },
  productId: {
    type: String,
    required: true,
    index: true,
  },
  title: String,
  staff: [
    {
      staff: {
        type: Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
      },
      tag: String,
    },
  ],
  duration: {
    type: Number,
    default: 60,
  },
  buffertime: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

export const Model = mongoose.model<ProductModel>(
  "product",
  ProductSchema,
  "Product"
);

export const findOne = async (document) => {
  return await Model.findOne(document);
};

export const findByIdAndUpdate = async (_id, document) => {
  return await Model.findByIdAndUpdate(_id, document, {
    returnOriginal: false,
  });
};

export interface GetProductWithSelectedStaffReturn
  extends Omit<ProductModel, "staff"> {
  staff: {
    tag: string;
    staff: Types.ObjectId;
  };
}

export interface GetProductWithSelectedStaffProps
  extends Pick<ProductModel, "shop" | "productId"> {
  staff: Types.ObjectId;
}

export const getProductWithSelectedStaffId = async ({
  shop,
  productId,
  staff,
}: GetProductWithSelectedStaffProps): Promise<GetProductWithSelectedStaffReturn> => {
  const products = await Model.aggregate([
    {
      $match: {
        shop,
        productId: "gid://shopify/Product/" + productId,
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

export const getAllStaff = async ({
  shop,
  productId,
}: FilterQuery<ProductModel>) => {
  return await Model.aggregate([
    {
      $match: {
        productId: "gid://shopify/Product/" + productId,
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
