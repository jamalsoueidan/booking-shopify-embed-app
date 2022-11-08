import mongoose, { Types } from "mongoose";

export interface IBookingModel {
  productId: number;
  orderId: number;
  staff: Types.ObjectId;
  start: Date;
  end: Date;
  shop: string;
  anyStaff?: boolean;
}

const BookingSchema = new mongoose.Schema({
  productId: Number,
  orderId: Number,
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  start: Date,
  end: Date,
  shop: String,
  anyStaff: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IBookingModel>(
  "booking",
  BookingSchema,
  "Booking"
);
