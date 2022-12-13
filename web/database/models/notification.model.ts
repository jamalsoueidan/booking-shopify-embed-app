import mongoose, { Document } from "mongoose";

export interface INotificationModel
  extends Omit<Notification, "_id">,
    Document {}

const NotificationSchema = new mongoose.Schema(
  {
    orderId: { type: Number, required: true, index: true },
    lineItemId: { type: Number, default: -1, index: true },
    message: String,
    receiver: String,
    scheduled: Date,
    status: String,
    shop: {
      type: String,
      required: true,
      index: true,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

NotificationSchema.index({ createdAt: 1 });

export default mongoose.model<INotificationModel>(
  "notification",
  NotificationSchema,
  "Notification"
);
