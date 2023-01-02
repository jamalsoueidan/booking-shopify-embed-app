import smsdkApi from "@libs/smsdk/smsdk.api";
import BookingModel from "@models/booking.model";
import CustomerModel, { ICustomerModel } from "@models/customer.model";
import NotificationTemplateModel from "@models/notification-template.model";
import NotificationModel from "@models/notification.model";
import settingModels from "@models/setting.models";
import {
  IStaffModel,
  default as StaffModel,
  default as staffModel,
} from "@models/staff.model";
import { format, subDays, subMinutes } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import mongoose from "mongoose";

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
  scheduled,
  isStaff,
}: SendProps) => {
  const notification = new NotificationModel({
    orderId,
    lineItemId,
    message,
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

interface SendBookingConfirmation {
  receiver: ICustomerModel | IStaffModel;
  bookings: Omit<Booking, "_id">[];
  shop: string;
}

const sendBookingConfirmationCustomer = async ({
  receiver,
  bookings,
  shop,
}: SendBookingConfirmation) => {
  const template = await NotificationTemplateModel.findOne({
    shop,
    name: "BOOKING_CONFIRMATION",
  });

  let message = template.message;
  message = message
    .replace(/{fullname}/g, receiver.fullname)
    .replace(/{length}/g, bookings.length.toString());

  send({
    orderId: bookings[0].orderId,
    shop,
    receiver: receiver.phone?.replace("+", ""),
    message,
    isStaff: false,
  });
};

interface SendReminder {
  receiver: ICustomerModel | IStaffModel;
  bookings: Omit<Booking, "_id">[];
  shop: string;
}

const sendBookingReminderCustomer = async ({
  receiver,
  bookings,
  shop,
}: SendReminder) => {
  if (!receiver.phone) {
    return;
  }

  const setting = await settingModels.findOne({ shop });
  const template = await NotificationTemplateModel.findOne({
    shop,
    name: "BOOKING_REMINDER_CUSTOMER",
  });

  return bookings.forEach((booking) => {
    let message = template.message;
    message = message
      .replace(/{fullname}/g, receiver.fullname)
      .replace(
        /{time}/g,
        format(
          utcToZonedTime(new Date(booking.start), setting.timeZone),
          "HH:mm"
        )
      )
      .replace(/{title}/g, booking.title);

    send({
      shop,
      orderId: booking.orderId,
      lineItemId: booking.lineItemId,
      receiver: receiver.phone?.replace("+", ""),
      message,
      scheduled: utcToZonedTime(subDays(booking.start, 1), "Europe/Paris"),
      isStaff: false,
    });
  });
};

const sendBookingReminderStaff = async ({ bookings, shop }: SendReminder) => {
  const setting = await settingModels.findOne({ shop });
  const template = await NotificationTemplateModel.findOne({
    shop,
    name: "BOOKING_REMINDER_STAFF",
  });

  return bookings.forEach(async (booking) => {
    const staff = await staffModel.findById(booking.staff);

    let message = template.message;
    message = message
      .replace(/{fullname}/g, staff.fullname)
      .replace(
        /{time}/g,
        format(
          utcToZonedTime(new Date(booking.start), setting.timeZone),
          "HH:mm"
        )
      );

    send({
      shop,
      orderId: booking.orderId,
      lineItemId: booking.lineItemId,
      receiver: staff?.phone?.replace("+", ""),
      message,
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
