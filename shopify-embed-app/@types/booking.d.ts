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
  fulfillmentStatus: FulfillmentStatus;
  title: string;
  timeZone: string;
  isEdit?: boolean;
  isSelfBooked?: boolean;
}

interface BookingAggreate extends Booking {
  customer: Customer;
  product: Product;
  staff: Staff;
  start: string;
  end: string;
}

interface BookingBodyUpdate extends Pick<Booking, "staff"> {
  start: string;
  end: string;
}

interface BookingBodyCreate
  extends Pick<Booking, "productId" | "customerId" | "staff"> {
  start: string;
  end: string;
}

interface BookingQuery
  extends Pick<Booking, "start" | "end">,
    Partial<Pick<Booking, "staff">> {}
