import mongoose, { Types } from "mongoose";

export interface ICustomerModel {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const CustomerSchema = new mongoose.Schema({
  customerId: { type: Number, required: true, index: true },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
});

export default mongoose.model<ICustomerModel>(
  "customer",
  CustomerSchema,
  "Customer"
);
