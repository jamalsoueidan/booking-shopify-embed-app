import BookingModel, { IBookingModel } from "@models/Booking.model";
import ProductModel, { IProductModel } from "@models/Product.model";
import CustomerService from "@services/Customer.service";
import NotificationService from "@services/Notification.service";
import { addMinutes } from "date-fns";
import mongoose from "mongoose";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

interface ModifyProps {
  body: OrderTypes.Order;
  shop: string;
  sendBooking?: boolean;
}

const modify = async ({
  body,
  shop,
  sendBooking,
}: ModifyProps): Promise<any> => {
  const orderId = body.id;
  const filter = (lineItem) =>
    lineItem.properties.find((property) => property.name === "_data");

  const lineItems = body.line_items.filter(filter);

  const boughtProductTitles = [];

  let models: IBookingModel[] = lineItems.map((lineItem) => {
    const _data = lineItem.properties.find((p) => p.name === "_data")?.value;
    if (_data) {
      const data: OrderTypes.Data = JSON.parse(_data);
      const staffId = data.staff._id;
      const anyAvailable = data.staff.anyAvailable;
      const completeDate = new Date(data.start);

      boughtProductTitles.push(lineItem.title);

      return {
        orderId,
        lineItemId: lineItem.id,
        lineItemTotal: lineItems.length,
        productId: lineItem.product_id,
        staff: new mongoose.Types.ObjectId(staffId),
        start: completeDate,
        end: new Date(data.end),
        shop,
        anyAvailable,
        fulfillmentStatus: lineItem.fulfillment_status,
        customerId: body.customer.id,
      };
    }
  });

  /*const query = {
    shop,
    productId: models.map((model) => model.productId).filter(onlyUnique),
  };

  const products = await ProductModel.find<IProductModel>(query);

  models = models.map((model) => {
    const product = products.find(
      (product) => product.productId === model.productId
    );
    // TODO: validate time?
    return {
      ...model,
      end: addMinutes(model.start, product.duration),
    };
  });*/

  const customer = await CustomerService.findCustomerAndUpdate({
    shop,
    customerId: body.customer.id,
    customerGraphqlApiId: body.customer.admin_graphql_api_id,
  });

  //if (sendBooking) {
  NotificationService.sendBookingConfirmation({
    customer,
    boughtProductTitles,
    shop,
    orderId,
  });
  NotificationService.sendReminder({ customer, bookings: models, shop });
  //}

  const bulkWrite = models.map((m) => ({
    updateOne: {
      filter: {
        orderId: m.orderId,
        lineItemId: m.lineItemId,
        productId: m.productId,
      },
      update: {
        $set: m,
      },
      upsert: true,
    },
  }));

  return await BookingModel.bulkWrite(bulkWrite);
};

interface CreateProps {
  body: OrderTypes.Order;
  shop: string;
}

const create = async ({ body, shop }: CreateProps) =>
  await modify({ body, shop, sendBooking: true });

interface UpdateProps {
  body: OrderTypes.Order;
  shop: string;
}

const update = async ({ body, shop }: UpdateProps) =>
  await modify({ body, shop });

interface CancelProps {
  body: OrderTypes.Order;
  shop: string;
}

const cancel = async ({ body, shop }: CancelProps) => {
  return await BookingModel.updateMany(
    { orderId: body.id, shop },
    { cancelled: true }
  );
};

export default { create, update, cancel };
