import { endOfDay, startOfDay } from "date-fns";
import mongoose, { Types } from "mongoose";
import BookingModel from "../models/booking.model";

const find = async (shop) => {
  return await BookingModel.find({ shop });
};

export interface GetBookingsByStaffProps
  extends Pick<BookingQuery, "start" | "end"> {
  shop: string;
  staff: Types.ObjectId | string[];
}

const getBookingsForWidget = ({
  shop,
  start,
  end,
  staff,
}: GetBookingsByStaffProps) => {
  return BookingModel.aggregate<BookingAggreate>([
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

interface GetBookingsProps extends BookingQuery {
  shop: string;
}

const getBookings = ({ shop, start, end, staff }: GetBookingsProps) => {
  return BookingModel.aggregate<BookingAggreate>([
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
  body: BookingBodyUpdate;
}

const update = async ({ filter, body }: UpdateProps) => {
  const booking = await BookingModel.findOne(filter);
  if (!booking) {
    throw "Not found";
  }
  booking.staff = body.staff;
  booking.start = body.start as any;
  booking.end = body.end as any;
  booking.isEdit = true;
  // TODO: Send notification to customer and staff about new changes to this booking, delete schedule from sms.dk
  return await booking.save();
};

interface GetByIdProps {
  id: string;
  shop: string;
}

const getById = async ({
  shop,
  id,
}: GetByIdProps): Promise<BookingAggreate | null> => {
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

  return bookings.length > 0 ? bookings[0] : null;
};

export default {
  find,
  getBookingsForWidget,
  getBookings,
  update,
  getById,
};
