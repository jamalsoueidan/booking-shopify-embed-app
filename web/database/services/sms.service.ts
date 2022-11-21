import { utcToZonedTime } from "date-fns-tz";
import { IBookingModel } from "@models/booking.model";
import { ICustomerModel } from "@models/customer.model";
import { IProductModel } from "@models/product.model";
import { format, subDays } from "date-fns";
var request = require("request");

interface Send {
  receiver: string;
  message: string;
  scheduled?: string;
}

const send = ({ receiver, message, scheduled }: Send) => {
  console.log({ receiver, message, scheduled });
  return;
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
}

const sendBookingConfirmation = ({
  customer,
  boughtProductTitles,
}: SendBookingConfirmation) => {
  send({
    receiver: customer.phone.replace("+", ""),
    message: `Hej ${
      customer.firstName
    }, tak for din reservation af ${boughtProductTitles.join(
      ", "
    )} behandliner, vi ser frem til at tag godt imod dig!`,
  });
};

interface SendReminder {
  customer: ICustomerModel;
  bookings: IBookingModel[];
}

const sendReminder = ({ customer, bookings }: SendReminder) => {
  bookings.forEach((booking) => {
    send({
      receiver: customer.phone.replace("+", ""),
      message: `Hej ${
        customer.firstName
      }, Husk din xxx behandling imorgen kl. ${format(
        utcToZonedTime(new Date(booking.start), "Europe/Paris"),
        "HH:mm"
      )}. Vi ser frem til at se dig!`,
      scheduled: utcToZonedTime(
        subDays(booking.start, 1),
        "Europe/Paris"
      ).toJSON(),
    });
  });
};

export default { sendBookingConfirmation, sendReminder };
