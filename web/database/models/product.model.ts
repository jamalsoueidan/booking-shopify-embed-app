import mongoose, { Document, Schema } from "mongoose";

export interface IProductModel extends Omit<Product, "_id">, Document {}

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
