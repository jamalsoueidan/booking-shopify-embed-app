import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

export interface BookingModel extends Document {
  productId: string;
  orderId: string;
  staff: Types.ObjectId;
  start: Date;
  end: Date;
  shop: string;
}

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

export const Model = mongoose.model<BookingModel>(
  "booking",
  BookingSchema,
  "Booking"
);

export const find = async (shop) => {
  return await Model.find({ shop });
};

export const getBookingsByProduct = async ({ shop, productId, start, end }) => {
  return await Model.aggregate([
    {
      $match: {
        shop,
        productId: "gid://shopify/Product/" + productId,
        $or: [
          {
            start: {
              $gte: new Date(`${start}T00:00:00.0Z`),
            },
          },
          {
            end: {
              $gte: new Date(`${start}T00:00:00.0Z`),
            },
          },
        ],
      },
    },
    {
      $match: {
        $or: [
          {
            start: {
              $lt: new Date(`${end}T00:00:00.0Z`),
            },
          },
          {
            end: {
              $lt: new Date(`${end}T00:00:00.0Z`),
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        shop: 0,
        productId: 0,
      },
    },
  ]);
};

export const getBookingsByProductAndStaff = async ({
  shop,
  productId,
  start,
  end,
  staffId,
}) => {
  console.log(new Date(`${start}T00:00:00.0Z`), new Date(`${end}T23:59:59.0Z`));
  return await Model.aggregate([
    {
      $match: {
        shop,
        productId: "gid://shopify/Product/" + productId,
        staff: new mongoose.Types.ObjectId(staffId),
        $or: [
          {
            start: {
              $gte: new Date(`${start}T00:00:00.0Z`),
            },
          },
          {
            end: {
              $gte: new Date(`${start}T00:00:00.0Z`),
            },
          },
        ],
      },
    },
    {
      $match: {
        $or: [
          {
            start: {
              $lt: new Date(`${end}T00:00:00.0Z`),
            },
          },
          {
            end: {
              $lt: new Date(`${end}T00:00:00.0Z`),
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        shop: 0,
        productId: 0,
      },
    },
  ]);
};
