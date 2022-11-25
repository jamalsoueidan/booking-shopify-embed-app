import widgetController from "@libs/widget/widget.controller";
import CartModel from "@models/cart.model";
import mongoose from "mongoose";

interface Staff {
  staff: string;
  fullname: string;
  anyStaff: boolean;
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

const modify = async ({ body, shop }: CreateProps) => {
  // TODO: Maybe compare lineItems and only remove those that needs to be removed!!!
  await CartModel.deleteMany({ cartId: body.id, shop });

  const lineItems = body.line_items;
  return Promise.all(
    lineItems.map(async (lineItem) => {
      const productId = lineItem.product_id.toString();
      const _data = lineItem.properties?._data;
      if (_data) {
        const data: Data = JSON.parse(_data.split("\\").join(""));
        const { timeZone, start, end, staff } = data;

        const response = await widgetController.availabilityDay({
          query: {
            staffId: staff.staff,
            date: start.substring(0, 10),
            productId,
            shop,
          },
        });

        const validateDate = !!response.find(
          (scheduleDate) =>
            scheduleDate.date === start.substring(0, 10) &&
            scheduleDate.hours.find(
              (hour) =>
                hour.start.toISOString() === start &&
                hour.end.toISOString() === end
            )
        );

        if (validateDate) {
          const update = {
            cartId: body.id,
            start,
            end,
            staff: new mongoose.Types.ObjectId(staff.staff),
            shop,
          };

          return await CartModel.updateOne(
            { cartId: body.id },
            { $set: update },
            { upsert: true }
          );
        }
      }
    })
  );
};

export default { modify };
