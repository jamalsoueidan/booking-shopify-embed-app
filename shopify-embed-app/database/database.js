import { NotificationTemplateModel } from "@jamalsoueidan/bsb.bsb-pkg";
import mongoose from "mongoose";

export default async () => {
  try {
    mongoose.set("strictQuery", false);)
    await mongoose.connect(process.env.MONGODB_URI);
    NotificationTemplateModel.count();
    console.log("Connecting to MongoDB Atlas cluster...");
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
  }
};
