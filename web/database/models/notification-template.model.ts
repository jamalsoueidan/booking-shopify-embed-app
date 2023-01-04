import mongoose, { Document } from "mongoose";

export interface INotificationTemplateModel
  extends Omit<NotificationTemplate, "_id">,
    Document {}

const NotificationTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: String,
  senderName: String,
  shop: {
    type: String,
    required: true,
    index: true,
  },
  language: {
    type: String,
    required: true,
    default: "da-DK",
  },
});

const NotificationTemplateModel = mongoose.model<INotificationTemplateModel>(
  "notificationtemplate",
  NotificationTemplateSchema,
  "NotificationTemplate"
);

NotificationTemplateModel.createCollection().then(async (collection) => {
  const count = await collection.countDocuments();
  if (count === 0) {
    const models = [
      "testeriphone.myshopify.com",
      "bysistersdk.myshopify.com",
    ].map((shop) => {
      return [
        {
          name: "BOOKING_UPDATE",
          message: `Hej {fullname}, din behandlingstid er opdatere til d. {date}`,
          shop,
          language: "da-DK",
        },
        {
          name: "BOOKING_CONFIRMATION",
          message: `Hej {fullname}, Tak for din reservation, som indeholder {total} behandling(er)`,
          shop,
          language: "da-DK",
        },
        {
          name: "BOOKING_REMINDER_CUSTOMER",
          message: `Hej {fullname}, Husk din {title} behandling {time}, Vi ser frem til at se dig!`,
          shop,
          language: "da-DK",
        },
        {
          name: "BOOKING_REMINDER_STAFF",
          message: `Hej {fullname}, Husk du har en kunde som skal lave {title} behandling, {time}`,
          shop,
          language: "da-DK",
        },
        {
          name: "BOOKING_UPDATE",
          message: `Hey {fullname}, your booking time have changed to {date}`,
          shop,
          language: "en-US",
        },
        {
          name: "BOOKING_CONFIRMATION",
          message: `hey {fullname}, thank you for your order, you have booked {total} treatments`,
          shop,
          language: "en-US",
        },
        {
          name: "BOOKING_REMINDER_CUSTOMER",
          message: `hey {fullname}, remember your {title} treatment {time}, we look forward to see you!`,
          shop,
          language: "en-US",
        },
        {
          name: "BOOKING_REMINDER_STAFF",
          message: `hey {fullname}, remember your customer needs to do {title} treatment, {time}`,
          shop,
          language: "en-US",
        },
      ];
    });

    collection.insertMany(models.flat());
  }
});

export default NotificationTemplateModel;
