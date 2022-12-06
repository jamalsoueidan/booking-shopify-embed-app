import { endOfDay, startOfDay } from "date-fns";
import mongoose from "mongoose";
import Booking, { IBookingModel } from "../models/booking.model";

const find = async (shop) => {
  return await Booking.find({ shop });
};

export interface GetBookingsByProductReturn
  extends Pick<IBookingModel, "start" | "end"> {
  staff: string;
}

export interface GetBookingsByProductProps
  extends Omit<IBookingModel, "orderId" | "staff" | "customerId"> {}

const getBookingsByProduct = async ({
  shop,
  productId,
  start,
  end,
}: GetBookingsByProductProps): Promise<Array<GetBookingsByProductReturn>> => {
  return await Booking.aggregate([
    {
      $match: {
        shop,
        productId,
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
  extends Omit<IBookingModel, "orderId" | "productId" | "customerId"> {}

const getBookingsByProductAndStaff = async ({
  shop,
  start,
  end,
  staff,
}: GetBookingsByProductAndStaffProps): Promise<
  Array<GetBookingsByProductAndStaffReturn>
> => {
  return await Booking.aggregate([
    {
      $match: {
        shop,
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

interface GetBookingsProps {
  shop: string;
  start: string;
  end: string;
  staff: string;
}

const getBookings = async ({ shop, start, end, staff }: GetBookingsProps) => {
  return await Booking.aggregate([
    {
      $match: {
        shop,
        start: {
          $gte: new Date(`${start}T00:00:00.0Z`),
        },
        end: {
          $lt: new Date(`${end}T23:59:59.0Z`),
        },
        ...(staff && { staff: new mongoose.Types.ObjectId(staff) }),
      },
    },
    {
      $lookup: {
        from: "Customer",
        localField: "customerId",
        foreignField: "customerId",
        as: "customer",
      },
    },
    {
      $unwind: "$customer",
    },
    {
      $lookup: {
        from: "Staff",
        localField: "staff",
        foreignField: "_id",
        as: "staff",
      },
    },
    {
      $unwind: {
        path: "$staff",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "Product",
        localField: "productId",
        foreignField: "productId",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
};
export default {
  find,
  getBookingsByProduct,
  getBookingsByProductAndStaff,
  getBookings,
};
