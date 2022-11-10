import BookingModel, { IBookingModel } from "@models/booking.model";
import ProductModel, { IProductModel } from "@models/product.model";
import { addMinutes } from "date-fns";
import mongoose from "mongoose";
import { Data, Order } from "./order.types.js";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const create = async (body: Order): Promise<Array<IBookingModel>> => {
  const filter = (lineItem) =>
    lineItem.properties.find((property) => property.name === "_data");

  const lineItems = body.line_items.filter(filter);

  let models = lineItems.map((lineItem) => {
    const _data = lineItem.properties.find((p) => p.name === "_data")?.value;
    if (_data) {
      const data: Data = JSON.parse(_data);
      const staffId = data.staff.staff;
      const anyStaff = data.staff.anyStaff;
      const completeDate = new Date(data.start);

      return {
        orderId: body.order_number,
        productId: lineItem.product_id,
        staff: new mongoose.Types.ObjectId(staffId),
        start: completeDate,
        end: new Date(),
        shop: body.shop,
        anyStaff,
      } as IBookingModel;
    }
  });

  const query = {
    shop: body.shop,
    productId: models.map((model) => model.productId).filter(onlyUnique),
  };

  const products = await ProductModel.find<IProductModel>(query);

  models = models.map((model) => {
    const product = products.find(
      (product) => product.productId === model.productId
    );
    return {
      ...model,
      end: addMinutes(model.start, product.duration),
    };
  });

  return await BookingModel.insertMany(models);
};

const cancel = async (body: Order) => {
  return await BookingModel.updateMany(
    { orderId: body.order_number },
    { cancelled: true }
  );
};

export default { create, cancel };
