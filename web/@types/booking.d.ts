interface Booking {
  _id: string;
  productId: number;
  orderId: number;
  lineItemId: number;
  lineItemTotal: number;
  customerId: number;
  staff: string;
  start: Date;
  end: Date;
  shop: string;
  anyAvailable?: boolean;
  fulfillmentStatus: string;
  title: string;
  timeZone: string;
  isEdit?: boolean;
}

interface BookingAggreate extends Booking {
  customer: Customer;
  product: Product;
  staff: Staff;
}

interface BookingBodyUpdate extends Pick<Booking, "staff" | "isEdit"> {
  start: string;
  end: string;
}

interface BookingQuery
  extends Pick<Booking, "start" | "end">,
    Partial<Pick<Booking, "staff">> {}
