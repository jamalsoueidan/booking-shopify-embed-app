interface Notification {
  _id: string;
  orderId: number;
  lineItemId?: number;
  message: string;
  receiver: string;
  scheduled: Date;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
  isStaff: boolean;
  batchId: string;
  template: string;
  shop: string;
}

interface NotificationQuery {
  orderId: number;
  lineItemId: number;
}

interface NotificationBody {
  to: "customer" | "staff";
  message: string;
}
