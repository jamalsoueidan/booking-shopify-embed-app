import mongoose from "mongoose";

export interface ICustomerModel {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shop: string;
}

const CustomerSchema = new mongoose.Schema({
  customerId: { type: Number, required: true, index: true },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  shop: { type: String, index: true },
});

CustomerSchema.index(
  {
    customerId: 1,
    shop: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model<ICustomerModel>(
  "customer",
  CustomerSchema,
  "Customer"
);
