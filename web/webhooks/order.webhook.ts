import { IBookingModel } from "@models/booking.model";
import ProductModel from "@models/product.model";
import productService from "@services/product.service.js";
import mongoose from "mongoose";
import { Order } from "./order.types.js";

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

  const models = lineItems.map((lineItem) => {
    const date = lineItem.properties.find((p) => p.name === "Date")?.value;
    const hour = lineItem.properties.find((p) => p.name === "Hour")?.value;
    const staff = lineItem.properties.find((p) => p.name === "Staff")?.value;
    if (date && hour && staff) {
      const staffId = JSON.parse(staff).staff;
      const hours = parseInt(hour.slice(0, 2));
      const minutes = parseInt(hour.slice(3));
      const completeDate = new Date(date);
      completeDate.setHours(hours, minutes);
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

  console.log({
    shop: models[0].shop,
    productId: models.map((p) => p.productId),
  });
  const products = await ProductModel.find({
    shop: models[0].shop,
    productId: models.map((p) => p.productId),
  });

  console.log("products", products);
  return models;
};
