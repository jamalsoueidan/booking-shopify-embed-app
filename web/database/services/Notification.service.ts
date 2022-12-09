var request = require("request");
import BookingModel, { IBookingModel } from "@models/booking.model";
import CustomerModel, { ICustomerModel } from "@models/customer.model";
import NotificationModel from "@models/notification.model";
import { format, isBefore, subDays, subMinutes } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import mongoose from "mongoose";

interface GetProps {
  shop: string;
  orderId: number;
  lineItemId: number;
}

const get = ({ shop, orderId, lineItemId }: GetProps) => {
  return NotificationModel.find({
    shop,
    orderId,
    lineItemId: { $in: [lineItemId, -1] },
  }).sort({ createdAt: 1 });
};

interface SendCustomProps extends Omit<SendProps, "receiver"> {
  shop: string;
}

const sendCustom = async (query: SendCustomProps) => {
  const { shop, orderId, lineItemId, message } = query;

  //TODO: 15 minutes must pass between each message.
  const booking = await BookingModel.findOne({
    shop,
    orderId,
    lineItemId,
  }).lean();

  if (booking) {
    const customer = await CustomerModel.findOne({
      customerId: booking.customerId,
    }).lean();
    if (customer) {
      return send({
        shop,
        orderId,
        lineItemId,
        message,
        receiver: customer.phone,
      });
    }
  }

  throw "Not found";
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

  const checkDate = subMinutes(new Date(), 15);

  if (isBefore(notification.updatedAt, checkDate)) {
    notification.updatedAt = new Date();
    await notification.save();
    return send(notification);
  } else {
    throw "You can't send again within 15min";
  }
};

interface SendProps {
  orderId: number;
  lineItemId?: number;
  receiver: string;
  message: string;
  scheduled?: Date;
  shop: string;
}

const send = async ({
  orderId,
  lineItemId,
  shop,
  receiver,
  message,
  scheduled,
}: SendProps) => {
  const notification = new NotificationModel({
    orderId,
    lineItemId,
    message,
    receiver,
    scheduled,
    shop,
  });
  return notification.save();
  request.post(
    {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer 4dcc09f3-68e2-11ed-8524-005056010a37",
      },
      url: "https://api.sms.dk/v1/sms/send",
      formData: {
        receiver,
        message,
        senderName: "SMSDKDemo",
        scheduled,
      },
    },
    function (error, response, body) {}
  );
};

interface SendBookingConfirmation {
  customer: ICustomerModel;
  boughtProductTitles: string[];
  shop: string;
  orderId: number;
}

const sendBookingConfirmation = ({
  customer,
  boughtProductTitles,
  shop,
  orderId,
}: SendBookingConfirmation) => {
  if (!customer.phone) {
    return;
  }

  send({
    orderId,
    shop,
    receiver: customer.phone.replace("+", ""),
    message: `Hej ${
      customer.firstName
    }, tak for din reservation af ${boughtProductTitles.join(
      ", "
    )} behandling(er) :-)`,
  });
};

interface SendReminder {
  customer: ICustomerModel;
  bookings: IBookingModel[];
  shop: string;
}

const sendReminder = ({ customer, bookings, shop }: SendReminder) => {
  if (!customer.phone) {
    return;
  }

  // TODO: use timezone from settings
  bookings.forEach((booking) => {
    send({
      shop,
      orderId: booking.orderId,
      lineItemId: booking.lineItemId,
      receiver: customer.phone.replace("+", ""),
      message: `Hej ${
        customer.firstName
      }, Husk din xxx behandling imorgen kl. ${format(
        utcToZonedTime(new Date(booking.start), "Europe/Paris"),
        "HH:mm"
      )}. Vi ser frem til at se dig!`,
      scheduled: utcToZonedTime(subDays(booking.start, 1), "Europe/Paris"),
    });
  });
};

export default {
  sendBookingConfirmation,
  sendReminder,
  get,
  sendCustom,
  resend,
};
