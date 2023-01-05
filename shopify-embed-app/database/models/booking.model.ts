import mongoose, { Document } from "mongoose";

export interface IBookingModel extends Omit<Booking, "_id">, Document {}

const BookingSchema = new mongoose.Schema({
  productId: Number,
  orderId: {
    type: Number,
    index: true,
  },
  lineItemId: {
    type: Number,
    unqiue: true,
    index: true,
  },
  lineItemTotal: {
    type: Number,
    default: 1,
  },
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
  timeZone: String,
  isEdit: {
    type: Boolean,
    default: false,
  },
  isSelfBooked: {
    type: Boolean,
    default: false,
  },
  title: String,
});

export default mongoose.model<IBookingModel>(
  "booking",
  BookingSchema,
  "Booking"
);
