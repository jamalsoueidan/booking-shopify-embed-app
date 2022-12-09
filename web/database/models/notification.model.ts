import mongoose from "mongoose";

export interface INotificationModel {
  orderId: number;
  lineItemId?: number;
  message: string;
  receiver: string;
  scheduled: Date;
  status?: boolean;
  createdAt: Date;
  updatedAt: Date;
  shop: string;
}

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
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

NotificationSchema.index({ createdAt: 1 });

export default mongoose.model<INotificationModel>(
  "notification",
  NotificationSchema,
  "Notification"
);
