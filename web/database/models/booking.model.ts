import mongoose, { Types } from "mongoose";

export interface IBookingModel {
  productId: string;
  orderId: string;
  staff: Types.ObjectId;
  start: Date;
  end: Date;
  shop: string;
}

const BookingSchema = new mongoose.Schema({
  productId: String,
  orderId: String,
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  start: Date,
  end: Date,
  shop: String,
});

export default mongoose.model<IBookingModel>(
  "booking",
  BookingSchema,
  "Booking"
);
