interface Customer {
  _id: string;
  customerId: number;
  firstName: string;
  lastName: string;
  fullname: string;
  email: string;
  phone: string;
  shop: string;
}

interface CustomerQuery
  extends Pick<Customer, "customerId" | "firstName" | "lastName"> {}
