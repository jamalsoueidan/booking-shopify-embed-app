import mongoose from "mongoose";
const { Schema } = mongoose;

const BookingSchema = new Schema({
  productId: Number,
  staffId: Number,
  date: Date,
  shop: String,
});

const BookingModel = mongoose.model("booking", BookingSchema, "Bookings");

export const create = async (document) => {
  var newBooking = new BookingModel(document);
  newBooking.save((err, data) => {
    if (err) {
      console.log(error);
    } else {
      console.log(data);
    }
  });
};

export const update = async (document) => {
  var booking = BookingModel.findOne(
    { productId: document.productId },
    (err, data) => {
      if (err) {
        console.log("not found");
      } else {
        console.log("found", data);
      }
    }
  );
  return booking;
};

export const findOneAndUpdate = async (document) => {
  const booking = await BookingModel.findOneAndUpdate(
    { productId: document.productId },
    document,
    { new: true, upsert: true }
  );

  console.log("--------");
  console.log(document, booking);
  console.log("--------");
  return booking;
};
