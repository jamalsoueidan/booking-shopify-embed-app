import BookingModel, { IBookingModel } from "@models/booking.model";
import CustomerService from "@services/customer.service";
import NotificationService from "@services/notification.service";
import mongoose from "mongoose";

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

  let models: Omit<Booking, "_id">[] = lineItems.map((lineItem) => {
    const _data = lineItem.properties.find((p) => p.name === "_data")?.value;
    if (_data) {
      const data: OrderTypes.Data = JSON.parse(_data);
      const staffId = data.staff._id;
      const anyAvailable = data.staff.anyAvailable;

      return {
        orderId,
        lineItemId: lineItem.id,
        lineItemTotal: lineItems.length,
        productId: lineItem.product_id,
        staff: staffId,
        start: data.start,
        end: data.end,
        shop,
        anyAvailable,
        fulfillmentStatus: lineItem.fulfillment_status,
        customerId: body.customer.id,
        title: lineItem.title,
        timeZone: data.timeZone,
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

  if (sendBooking) {
    NotificationService.sendBookingConfirmationCustomer({
      receiver: customer,
      bookings: models,
      shop,
    });
    NotificationService.sendReminderCustomer({
      receiver: customer,
      bookings: models,
      shop,
    });

    NotificationService.sendReminderStaff({
      receiver: customer,
      bookings: models,
      shop,
    });
  }

  const bulkWrite = models.map((m) => ({
    updateOne: {
      filter: {
        orderId: m.orderId,
        lineItemId: m.lineItemId,
        productId: m.productId,
        isEdit: false,
      },
      update: {
        $set: m,
      },
      upsert: true,
    },
  }));

  BookingModel.bulkWrite(bulkWrite);
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
  await modify({ body, shop, sendBooking: true });

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
