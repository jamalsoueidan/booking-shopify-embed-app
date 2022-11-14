import CartModel, { ICartModel } from "@models/cart.model";
import { endOfDay, startOfDay } from "date-fns";

export interface GetCartsByStaffReturn extends ICartModel {}

export interface GetCartsByStaffProps extends Omit<ICartModel, "createdAt"> {}

const getCartsByStaff = async ({
  shop,
  staff,
  start,
  end,
}: GetCartsByStaffProps): Promise<Array<GetCartsByStaffReturn>> => {
  return await CartModel.aggregate([
    {
      $match: {
        shop,
        staff,
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
  ]);
};

export interface GetCartsByStaffierProps
  extends Omit<ICartModel, "createdAt" | "staff"> {
  staffier: string[];
}

const getCartsByStaffier = async ({
  shop,
  staffier,
  start,
  end,
}: GetCartsByStaffierProps): Promise<Array<GetCartsByStaffReturn>> => {
  return await CartModel.aggregate([
    {
      $match: {
        shop,
        staff: {
          $in: staffier,
        },
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
  ]);
};

export default { getCartsByStaff, getCartsByStaffier };
