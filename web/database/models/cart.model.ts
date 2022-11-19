import mongoose, { Types } from "mongoose";

export interface ICartModel {
  cartId?: string;
  staff: Types.ObjectId;
  start: Date;
  end: Date;
  shop: string;
  createdAt: Date;
}

const CartSchema = new mongoose.Schema({
  cartId: {
    type: String,
    required: true,
    index: true,
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  start: {
    type: Date,
    required: true,
    index: true,
  },
  end: {
    type: Date,
    required: true,
    index: true,
  },
  shop: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    expires: "15m",
    default: Date.now,
  },
});

export default mongoose.model<ICartModel>("cart", CartSchema, "Cart");
