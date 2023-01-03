import smsdkApi from "@libs/smsdk/smsdk.api";
import BookingModel from "@models/booking.model";
import {
  default as CustomerModel,
  default as customerModel,
} from "@models/customer.model";
import NotificationModel from "@models/notification.model";
import StaffModel from "@models/staff.model";
import { subDays, subMinutes } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import mongoose from "mongoose";
import notificationTemplateService from "./notification-template.service";

interface NoMesageSendLastMinutesProps {
  shop: string;
  orderId: number;
  lineItemId: number;
  receiver: string;
}

const noMesageSendLastMinutes = async ({
  shop,
  orderId,
  lineItemId,
  receiver,
}: NoMesageSendLastMinutesProps) => {
  const totalSend = await NotificationModel.find({
    shop,
    orderId,
    lineItemId,
    receiver,
    updatedAt: {
      $gte: subMinutes(new Date(), 15),
    },
  }).count();

  return totalSend === 0;
};

interface GetProps extends NotificationQuery {
  shop: string;
}

const get = ({ shop, orderId, lineItemId }: GetProps) => {
  return NotificationModel.find({
    shop,
    orderId,
    lineItemId: { $in: [lineItemId, -1] },
  }).sort({ createdAt: 1 });
};

interface SendCustomProps extends NotificationQuery, NotificationBody {
  shop: string;
}

const sendCustom = async (query: SendCustomProps) => {
  const { shop, orderId, lineItemId, message, to } = query;

  const messageSend = await noMesageSendLastMinutes({
    shop,
    orderId: orderId,
    lineItemId: lineItemId,
    receiver: to.replace("+", ""),
  });

  if (!messageSend) {
    throw new Error("after_fifteen_minutes_send_message");
  }

  //TODO: 15 minutes must pass between each message.
  const booking = await BookingModel.findOne({
    shop,
    orderId,
    lineItemId,
  }).lean();

  if (booking) {
    const { phone } =
      to === "customer"
        ? await CustomerModel.findOne({
            customerId: booking.customerId,
          }).lean()
        : await StaffModel.findOne({
            staffId: booking.staff,
          }).lean();

    return send({
      shop,
      orderId,
      lineItemId,
      message,
      template: "cusom",
      receiver: phone,
      isStaff: to === "staff",
    });
  }

  throw new Error("not_found");
};

interface ResendProps {
  shop: string;
  id: string;
}

const resend = async ({ shop, id }: ResendProps) => {
  const notification = await NotificationModel.findOne({
    shop,
    _id: new mongoose.Types.ObjectId(id),
  });

  if (notification) {
    const noMessage = await noMesageSendLastMinutes({
      shop,
      orderId: notification.orderId,
      lineItemId: notification.lineItemId,
      receiver: notification.receiver.replace("+", ""),
    });

    if (noMessage) {
      notification.updatedAt = new Date();
      await notification.save();

      /*const template = notification.template;
      const notificationTemplate =
        await notificationTemplateService.getNotificationTemplate({
          type: template,
          shop,
        });

      let message = notification.message;
      if (notificationTemplate) {
        const booking = bookingModel.findOne({booking})
        message = notificationTemplateService.replace(
          notificationTemplate,
          {

          }
        );
      }*/

      return send(notification);
    }
  }

  throw new Error("after_fifteen_minutes_send_message");
};

interface SendProps {
  orderId: number;
  lineItemId?: number;
  receiver: string;
  message: string;
  template: string;
  scheduled?: Date;
  shop: string;
  isStaff: boolean;
}

const send = async ({
  orderId,
  lineItemId,
  shop,
  receiver,
  message,
  template,
  scheduled,
  isStaff,
}: SendProps) => {
  //clear out all old schedules messages before sending new one.

  const notification = new NotificationModel({
    orderId,
    lineItemId,
    message,
    template,
    receiver,
    scheduled,
    shop,
    isStaff,
  });

  const response = await smsdkApi.send({
    receiver,
    message,
    scheduled,
  });

  notification.status = response.status;
  notification.batchId = response.result.batchId;

  return notification.save();
};

interface SendBookingConfirmationCustomerProps {
  booking: Omit<Booking, "_id">;
  shop: string;
}

const sendBookingConfirmationCustomer = async ({
  booking,
  shop,
}: SendBookingConfirmationCustomerProps) => {
  const customer = await customerModel.findOne({ _id: booking.customerId });
  if (!customer.phone) {
    return;
  }

  const template = "BOOKING_CONFIRMATION";
  const notificationTemplate =
    await notificationTemplateService.getNotificationTemplate({
      type: template,
      shop,
    });

  const message = notificationTemplateService.replace(notificationTemplate, {
    booking,
    receiver: customer,
  });

  send({
    orderId: booking.orderId,
    shop,
    receiver: customer.phone?.replace("+", ""),
    message,
    template,
    isStaff: false,
  });
};

interface SendBookingReminderCustomerProps {
  bookings: Omit<Booking, "_id">[];
  shop: string;
}

const sendBookingReminderCustomer = async ({
  bookings,
  shop,
}: SendBookingReminderCustomerProps) => {
  const receiver = await customerModel.findOne({ _id: bookings[0].customerId });
  if (!receiver.phone) {
    return;
  }

  const template = "BOOKING_REMINDER_CUSTOMER";
  const notificationTemplate =
    await notificationTemplateService.getNotificationTemplate({
      type: template,
      shop,
    });

  return bookings.forEach((booking) => {
    const message = notificationTemplateService.replace(notificationTemplate, {
      booking,
      receiver,
    });

    send({
      shop,
      orderId: booking.orderId,
      lineItemId: booking.lineItemId,
      receiver: receiver.phone?.replace("+", ""),
      message,
      template,
      scheduled: utcToZonedTime(
        subDays(booking.start, 1),
        notificationTemplate.timeZone
      ),
      isStaff: false,
    });
  });
};

interface SendBookingReminderStaffProps {
  bookings: Omit<Booking, "_id">[];
  shop: string;
}

const sendBookingReminderStaff = async ({
  bookings,
  shop,
}: SendBookingReminderStaffProps) => {
  const template = "BOOKING_REMINDER_STAFF";
  const notificationTemplate =
    await notificationTemplateService.getNotificationTemplate({
      type: template,
      shop,
    });

  return bookings.forEach(async (booking) => {
    const receiver = await StaffModel.findById(booking.staff);
    const message = notificationTemplateService.replace(notificationTemplate, {
      booking,
      receiver,
    });

    send({
      shop,
      orderId: booking.orderId,
      lineItemId: booking.lineItemId,
      receiver: receiver?.phone?.replace("+", ""),
      scheduled: utcToZonedTime(
        subDays(booking.start, 1),
        notificationTemplate.timeZone
      ),
      message,
      template,
      isStaff: true,
    });
  });
};

interface CancelProps {
  id: string;
  shop: string;
}

const cancel = async ({ id: _id, shop }: CancelProps) => {
  const notification = await NotificationModel.findOneAndUpdate(
    {
      _id,
      shop,
    },
    {
      status: "cancelled",
    },
    {
      new: true,
    }
  );

  if (notification.status !== "cancelled") {
    smsdkApi.cancel(notification.batchId);
  }

  return notification;
};

export default {
  sendBookingConfirmationCustomer,
  sendBookingReminderCustomer,
  sendBookingReminderStaff,
  get,
  sendCustom,
  resend,
  cancel,
};
