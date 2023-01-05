import CartModel, { ICartModel } from "@models/cart.model";
import { Types } from "mongoose";

export interface GetCartsByStaffReturn {
  start: Date;
  end: Date;
  staff: string;
}

export interface GetCartsByStaffierProps
  extends Omit<ICartModel, "createdAt" | "staff"> {
  staff: Types.ObjectId[];
}

const getCartsByStaff = async ({
  shop,
  staff,
  start,
  end,
}: GetCartsByStaffierProps): Promise<Array<GetCartsByStaffReturn>> => {
  return await CartModel.aggregate([
    {
      $match: {
        shop,
        staff: {
          $in: staff,
        },
        $or: [
          {
            start: {
              $gte: start,
            },
          },
          {
            end: {
              $gte: start,
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
              $lt: end,
            },
          },
          {
            end: {
              $lt: end,
            },
          },
        ],
      },
    },
  ]);
};

export default { getCartsByStaff };
