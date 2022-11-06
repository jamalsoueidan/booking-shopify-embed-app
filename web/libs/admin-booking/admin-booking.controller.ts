import * as Booking from "../../database/models/booking";

export enum ControllerMethods {
  get = "get",
}

const get = async ({ query }) => {
  const { shop, start, end } = query;

  return await Booking.Model.aggregate([
    {
      $match: {
        shop,
        start: {
          $gte: new Date(`${start}T00:00:00.0Z`),
        },
        end: {
          $lt: new Date(`${end}T23:59:59.0Z`),
        },
      },
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
      $unwind: "$staff",
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
      $unwind: "$product",
    },
  ]);
};

export default { get };
