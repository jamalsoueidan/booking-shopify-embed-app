import mongoose, { Schema, Types } from "mongoose";

// https://tomanagle.medium.com/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
export interface IProductModel {
  shop: string;
  collectionId: number;
  productId: number;
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
    type: Number,
    required: true,
    index: true,
  },
  productId: {
    type: Number,
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

export default mongoose.model<IProductModel>(
  "product",
  ProductSchema,
  "Product"
);
