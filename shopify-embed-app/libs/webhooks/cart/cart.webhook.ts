import CartModel from "@models/cart.model";
import mongoose from "mongoose";

interface Staff {
  _id: string;
  fullname: string;
  anyAvailable: boolean;
}

interface Data {
  timeZone: string;
  start: string;
  end: string;
  staff: Staff;
}

interface CreateReturn {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedCount: number;
  matchedCount: number;
}

interface CreateProps {
  body: CartTypes.Data;
  shop: string;
}

export const modify = async ({ body, shop }: CreateProps) => {
  // TODO: Maybe compare lineItems and only remove those that needs to be removed!!!
  await CartModel.deleteMany({ cartId: body.id, shop });

  const lineItems = body.line_items;
  const models = [];

  for (const lineItem of lineItems) {
    const _data = lineItem.properties?._data;
    if (_data) {
      const data: Data = JSON.parse(_data.split("\\").join(""));
      const { start, end, staff } = data;

      //TODO: should we validate start, end with the availability?
      models.push({
        cartId: body.id,
        start,
        end,
        staff: new mongoose.Types.ObjectId(staff._id),
        shop,
      });
    }
  }

  return CartModel.insertMany(models);
};
