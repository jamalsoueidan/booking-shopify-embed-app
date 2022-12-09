import mongoose, { Types } from "mongoose";

export interface IBookingModel {
  productId: number;
  orderId: number;
  lineItemId: number;
  lineItemTotal: number;
  customerId: number;
  staff: Types.ObjectId;
  start: Date;
  end: Date;
  shop: string;
  anyAvailable?: boolean;
  fulfillmentStatus: string;
}

const BookingSchema = new mongoose.Schema({
  productId: Number,
  orderId: {
    type: Number,
    inded: true,
  },
  lineItemId: {
    type: Number,
    inded: true,
  },
  lineItemTotal: Number,
  customerId: Number,
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
  anyAvailable: {
    type: Boolean,
    default: false,
  },
  fulfillmentStatus: {
    type: String,
    default: null,
  },
});

export default mongoose.model<IBookingModel>(
  "booking",
  BookingSchema,
  "Booking"
);
