import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IStaffModel {
  shop: string;
  fullname: string;
  email: string;
  phone: string;
  avatar: string;
  position: string;
  active: boolean;
}

const StaffSchema = new Schema({
  shop: {
    type: String,
    required: true,
    index: true,
  },
  fullname: { type: String, required: true },
  email: {
    type: String,
    unique: true,
  },
  phone: { type: String, required: true },
  avatar: { type: String, required: true },
  position: { type: String, required: true },
  active: { type: Boolean, default: true },
});

export default mongoose.model<IStaffModel>("staff", StaffSchema, "Staff");
