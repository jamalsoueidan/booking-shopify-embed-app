import { endOfDay, startOfDay } from "date-fns";
import mongoose, { ObjectId, Types } from "mongoose";
import BookingModel, { IBookingModel } from "../models/booking.model";

const find = async (shop) => {
  return await BookingModel.find({ shop });
};

export interface GetBookingsByStaffReturn
  extends Pick<IBookingModel, "start" | "end"> {
  staff: string;
}
export interface GetBookingsByStaffProps
  extends Pick<IBookingModel, "shop" | "start" | "end"> {
  staff: Types.ObjectId | string[];
}

const getBookingsByStaff = async ({
  shop,
  start,
  end,
  staff,
}: GetBookingsByStaffProps): Promise<Array<GetBookingsByStaffReturn>> => {
  return await BookingModel.aggregate([
    {
      $match: {
        shop,
        staff: Array.isArray(staff)
          ? {
              $in: staff,
            }
          : staff,
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
  return await BookingModel.aggregate([
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

interface UpdateProps {
  filter: { _id: string; shop: string };
  body: Partial<IBookingModel>;
}

const update = async ({ filter, body }: UpdateProps) => {
  const booking = await BookingModel.findOne(filter);
  if (!booking) {
    throw "Not found";
  }
  booking.staff = body.staff;
  booking.start = body.start;
  booking.end = body.end;
  booking.isEdit = true;
  return await booking.save();
};

interface GetByIdProps {
  id: string;
  shop: string;
}

const getById = async ({ shop, id }: GetByIdProps) => {
  const bookings = await BookingModel.aggregate([
    {
      $match: {
        shop,
        _id: new mongoose.Types.ObjectId(id),
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

  return bookings[0];
};

export default {
  find,
  getBookingsByStaff,
  getBookings,
  update,
  getById,
};
