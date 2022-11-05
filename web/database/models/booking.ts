import { endOfDay, startOfDay } from "date-fns";
import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

export interface BookingModel {
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

export interface GetBookingsByProductReturn
  extends Pick<BookingModel, "start" | "end"> {
  staff: string;
}

export interface GetBookingsByProductProps
  extends Omit<BookingModel, "orderId" | "staff"> {}

export const getBookingsByProduct = async ({
  shop,
  productId,
  start,
  end,
}: GetBookingsByProductProps): Promise<Array<GetBookingsByProductReturn>> => {
  return await Model.aggregate([
    {
      $match: {
        shop,
        productId: "gid://shopify/Product/" + productId,
        $or: [
          {
            start: {
              $gte: startOfDay(start),
            },
          },
          {
            end: {
              $gte: endOfDay(start),
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
              $lt: startOfDay(end),
            },
          },
          {
            end: {
              $lt: endOfDay(end),
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

export interface GetBookingsByProductAndStaffReturn
  extends GetBookingsByProductReturn {}
export interface GetBookingsByProductAndStaffProps
  extends Omit<BookingModel, "orderId"> {}

export const getBookingsByProductAndStaff = async ({
  shop,
  productId,
  start,
  end,
  staff,
}: GetBookingsByProductAndStaffProps): Promise<
  Array<GetBookingsByProductAndStaffReturn>
> => {
  return await Model.aggregate([
    {
      $match: {
        shop,
        productId: "gid://shopify/Product/" + productId,
        staff: staff,
        $or: [
          {
            start: {
              $gte: startOfDay(start),
            },
          },
          {
            end: {
              $gte: endOfDay(start),
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
              $lt: endOfDay(end),
            },
          },
          {
            end: {
              $lt: endOfDay(end),
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
