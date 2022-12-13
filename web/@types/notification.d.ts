interface Notification {
  _id: string;
  orderId: number;
  lineItemId?: number;
  message: string;
  receiver: string;
  scheduled: Date;
  status?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isStaff: boolean;
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
