import {
  BookingModel,
  IBooking,
  NotificationServiceSendBookingConfirmationCustomer,
  NotificationServiceSendBookingReminderCustomer,
  NotificationServiceSendBookingReminderStaff,
} from "@jamalsoueidan/bsb.bsb-pkg";
import CustomerService from "@services/customer.service";
import mongoose from "mongoose";

interface ModifyProps {
  body: OrderTypes.Order;
  shop: string;
  sendBooking?: boolean;
}

export const modify = async ({
  body,
  shop,
  sendBooking,
}: ModifyProps): Promise<any> => {
  const orderId = body.id;
  const filter = (lineItem) =>
    lineItem.properties.find((property) => property.name === "_data");

  const lineItems = body.line_items.filter(filter);

  let models: IBooking[] = lineItems.map((lineItem) => {
    const _data = lineItem.properties.find((p) => p.name === "_data")?.value;
    if (_data) {
      const data: OrderTypes.Data = JSON.parse(_data);
      const staffId = data.staff._id;
      const anyAvailable = data.staff.anyAvailable || false;

      const refund = !!body.refunds?.find((r) =>
        r.refund_line_items.find((l) => l.line_item_id === lineItem.id),
      );

      //TODO: should we validate start, end with the availability?
      return {
        orderId,
        lineItemId: lineItem.id,
        lineItemTotal: lineItems.length,
        productId: lineItem.product_id,
        staff: new mongoose.Types.ObjectId(staffId),
        start: new Date(data.start),
        end: new Date(data.end),
        shop,
        anyAvailable,
        fulfillmentStatus: refund ? "refunded" : lineItem.fulfillment_status,
        customerId: body.customer.id,
        title: lineItem.title,
        timeZone: data.timeZone,
      };
    }
  });

  await CustomerService.findCustomerAndUpdate({
    shop,
    customerId: body.customer.id,
    customerGraphqlApiId: body.customer.admin_graphql_api_id,
  });

  if (sendBooking) {
    NotificationServiceSendBookingConfirmationCustomer({
      booking: models[0],
      shop,
    });

    NotificationServiceSendBookingReminderCustomer({
      bookings: models,
      shop,
    });

    NotificationServiceSendBookingReminderStaff({
      bookings: models,
      shop,
    });
  }

  const cancelled = models.every((m) => m.fulfillmentStatus === "refunded");
  if (cancelled) {
    return cancel({ body, shop });
  } else {
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
    return BookingModel.bulkWrite(bulkWrite);
  }
};

interface CreateProps {
  body: OrderTypes.Order;
  shop: string;
}

export const create = ({ body, shop }: CreateProps) => {
  return modify({ body, shop, sendBooking: true });
};

interface UpdateProps {
  body: OrderTypes.Order;
  shop: string;
}

export const update = ({ body, shop }: UpdateProps) => {
  return modify({ body, shop });
};

interface CancelProps {
  body: OrderTypes.Order;
  shop: string;
}

export const cancel = async ({ body, shop }: CancelProps) => {
  return await BookingModel.updateMany(
    { orderId: body.id, shop },
    { fulfillmentStatus: "cancelled" },
  );
};
