import { beginningOfDay, closeOfDay } from "@helpers/date";
import { GetBookingsProps } from "@libs/booking/booking.types";
import productModel from "@models/product.model";
import mongoose, { Types } from "mongoose";
import BookingModel from "../models/booking.model";
import notificationService from "./notification.service";

interface CreateProps extends BookingBodyCreate {
  shop: string;
}

const create = async (body: CreateProps) => {
  const product = await productModel
    .findOne({ productId: body.productId })
    .lean();
  if (product) {
    const booking = await BookingModel.create({
      ...body,
      orderId: Date.now() + Math.floor(100000 + Math.random() * 900000),
      lineItemId: Date.now() + Math.floor(100000 + Math.random() * 900000),
      fulfillmentStatus: "booked",
      lineItemTotal: 1,
      title: product.title,
      isSelfBooked: true,
    });

    await notificationService.sendBookingConfirmationCustomer({
      booking,
      shop: body.shop,
    });

    await notificationService.sendBookingReminderStaff({
      bookings: [booking],
      shop: body.shop,
    });

    await notificationService.sendBookingReminderCustomer({
      bookings: [booking],
      shop: body.shop,
    });

    return booking;
  } else {
    throw new Error("no product found");
  }
};

const find = async (shop) => {
  return await BookingModel.find({ shop });
};

export interface GetBookingsByStaffProps
  extends Pick<BookingQuery, "start" | "end"> {
  shop: string;
  staff: Types.ObjectId[];
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
        staff: {
          $in: staff,
        },
        $or: [
          {
            start: {
              $gte: beginningOfDay(start),
            },
          },
          {
            end: {
              $gte: beginningOfDay(start),
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
              $lt: closeOfDay(end),
            },
          },
          {
            end: {
              $lt: closeOfDay(end),
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

const getBookings = ({ shop, start, end, staff }: GetBookingsProps) => {
  return BookingModel.aggregate<BookingAggreate>([
    {
      $match: {
        shop,
        start: {
          $gte: beginningOfDay(start),
        },
        end: {
          $lt: closeOfDay(end),
        },
        ...(staff && { staff: new mongoose.Types.ObjectId(staff) }),
      },
    },
    ...lookupCustomerStaffProduct,
  ]);
};

interface UpdateProps {
  filter: { _id: string; shop: string };
  body: BookingBodyUpdate;
}

const update = async ({ filter, body }: UpdateProps) => {
  const shop = filter.shop;
  const booking = await BookingModel.findOne(filter);
  if (!booking) {
    throw new Error("Not found");
  }
  booking.staff = body.staff;
  booking.start = new Date(body.start);
  booking.end = new Date(body.end);
  booking.isEdit = true;

  await notificationService.cancelAll({
    orderId: booking.orderId,
    lineItemId: booking.lineItemId,
    shop,
  });

  await notificationService.sendBookingUpdateCustomer({
    booking: booking,
    shop,
  });

  await notificationService.sendBookingReminderStaff({
    bookings: [booking],
    shop,
  });

  await notificationService.sendBookingReminderCustomer({
    bookings: [booking],
    shop,
  });

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
    ...lookupCustomerStaffProduct,
  ]);

  return bookings.length > 0 ? bookings[0] : null;
};

const lookupCustomerStaffProduct = [
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
];

export default {
  find,
  getBookingsForWidget,
  getBookings,
  update,
  getById,
  create,
};
