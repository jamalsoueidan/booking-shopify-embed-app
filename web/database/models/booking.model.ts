import mongoose, { Types } from "mongoose";

export interface IBookingModel {
  productId: number;
  orderId: number;
  staff: Types.ObjectId;
  start: Date;
  end: Date;
  shop: string;
  anyStaff?: boolean;
  cancelled?: boolean;
}

const BookingSchema = new mongoose.Schema({
  productId: Number,
  orderId: Number,
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
  anyStaff: {
    type: Boolean,
    default: false,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IBookingModel>(
  "booking",
  BookingSchema,
  "Booking"
);
