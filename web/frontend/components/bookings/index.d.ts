interface BookingModalChildProps {
  info: Info.Data;
}

declare module Info {
  export interface Staff {
    _id: string;
    shop: string;
    fullname: string;
    email: string;
    phone: string;
    active: boolean;
    __v: number;
  }

  export interface Customer {
    _id: string;
    customerId: number;
    shop: string;
    __v: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: any;
  }

  export interface Staff2 {
    staff: string;
    tag: string;
    _id: string;
  }

  export interface Product {
    _id: string;
    productId: number;
    active: boolean;
    buffertime: number;
    collectionId: number;
    duration: number;
    shop: string;
    staff: Staff2[];
    title: string;
  }

  export interface Data {
    _id: string;
    productId: number;
    orderId: number;
    lineItemId: number;
    lineItemTotal: number;
    customerId: number;
    staff: Staff;
    shop: string;
    anyStaff: boolean;
    cancelled: boolean;
    __v: number;
    customer: Customer;
    product: Product;
    start: string;
    end: string;
  }
}
