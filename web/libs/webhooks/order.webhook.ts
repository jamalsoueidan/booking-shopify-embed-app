import BookingModel, { IBookingModel } from "@models/booking.model";
import ProductModel, { IProductModel } from "@models/product.model";
import { addMinutes } from "date-fns";
import mongoose from "mongoose";
import { Order } from "./order.types.js";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const create = async (body: Order): Promise<Array<IBookingModel>> => {
  const filter = (lineItem) => {
    return lineItem.properties.find((property) => {
      return (
        property.name === "staff" ||
        property.name === "date" ||
        property.name === "hour"
      );
    });
  };

  const lineItems = body.line_items.filter(filter);

  let models = lineItems.map((lineItem) => {
    const startHour = lineItem.properties.find(
      (p) => p.name === "startHour"
    )?.value;
    const staff = lineItem.properties.find((p) => p.name === "staff")?.value;
    if (startHour && staff) {
      const staffId = JSON.parse(staff).staff;
      const anyStaff = JSON.parse(staff).anyStaff;
      const completeDate = new Date(startHour);

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
