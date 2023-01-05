import NotificationTemplateModel from "@models/notification-template.model";
import mongoose from "mongoose";

export default async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    NotificationTemplateModel.count();
    console.log("Connecting to MongoDB Atlas cluster...");
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
  }
};
