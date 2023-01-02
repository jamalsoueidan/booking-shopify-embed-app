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
});

const NotificationTemplateModel = mongoose.model<INotificationTemplateModel>(
  "notificationtemplate",
  NotificationTemplateSchema,
  "NotificationTemplate"
);

NotificationTemplateModel.createCollection().then(async (collection) => {
  const count = await collection.countDocuments();
  if (count === 0) {
    collection.insertMany([
      {
        name: "BOOKING_CONFIRMATION",
        message: `Hej {fullname}, tak for din resevations, som indeholder {total} behandling(er)`,
        shop: "testeriphone.myshopify.com",
      },
      {
        name: "BOOKING_REMINDER_CUSTOMER",
        message: `Hej {fullname}, Husk din {title} behandling imorgen kl. {time}, Vi ser frem til at se dig!`,
        shop: "testeriphone.myshopify.com",
      },
      {
        name: "BOOKING_REMINDER_STAFF",
        message: `Hej {fullname}, Husk du har en kunde som skal lave {title} behandling imorgen kl. {time}`,
        shop: "testeriphone.myshopify.com",
      },
    ]);
  }
});

export default NotificationTemplateModel;
