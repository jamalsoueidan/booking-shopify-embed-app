import mongoose, { Types, Document, Schema } from "mongoose";

interface ProductStaff {
  staff: Types.ObjectId;
  tag: string;
}
export interface IProductModel
  extends Omit<Product<ProductStaff>, "_id">,
    Document {}

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
    index: true,
  },
  imageUrl: String,
  hidden: {
    type: Boolean,
    default: false,
    index: true,
  },
});

export default mongoose.model<IProductModel>(
  "product",
  ProductSchema,
  "Product"
);
