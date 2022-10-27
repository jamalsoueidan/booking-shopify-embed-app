import mongoose from "mongoose";
const { Schema } = mongoose;

const BookingSchema = new Schema({
  productId: String,
  orderId: String,
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  start: Date,
  end: Date,
  shop: String,
});

export const Model = mongoose.model("booking", BookingSchema, "Booking");

export const find = async (shop) => {
  return await Model.find({ shop });
};
