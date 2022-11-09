import BookingModel, { IBookingModel } from "@models/booking.model";
import ProductModel, { IProductModel } from "@models/product.model";
import { addMinutes } from "date-fns";
import mongoose from "mongoose";
import { Order } from "./order.types.js";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export const createOrUpdate = async (body: Order) => {
  const filter = (lineItem) => {
    return lineItem.properties.find((property) => {
      return (
        property.name === "Staff" ||
        property.name === "Date" ||
        property.name === "Hour"
      );
    });
  };

  const lineItems = body.line_items.filter(filter);

  let models = lineItems.map((lineItem) => {
    const hour = lineItem.properties.find((p) => p.name === "Hour")?.value;
    const staff = lineItem.properties.find((p) => p.name === "Staff")?.value;
    if (hour && staff) {
      const staffId = JSON.parse(staff).staff;
      const completeDate = new Date(hour);

      return {
        orderId: body.order_number,
        productId: lineItem.product_id,
        staff: new mongoose.Types.ObjectId(staffId),
        start: completeDate,
        end: new Date(),
        shop: body.shop,
      } as IBookingModel;
    }
  });

  const query = {
    shop: models[0].shop,
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

  await BookingModel.insertMany(models);

  return models;
};
