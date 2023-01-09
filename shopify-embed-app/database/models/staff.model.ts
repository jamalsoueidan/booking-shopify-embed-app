import mongoose, { Document } from "mongoose";
const { Schema } = mongoose;

export interface IStaffModel extends Omit<Staff, "_id">, Document {}

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
  postal: {
    type: Number,
    required: true,
    index: true,
  },
  address: String,
  phone: { type: String, required: true },
  avatar: { type: String, required: true },
  position: { type: String, required: true },
  active: { type: Boolean, default: true },
  group: {
    type: String,
    index: true,
    default: "all", //should be changed later to null, nobody can see each other till they are part of group
  },
});

export default mongoose.model<IStaffModel>("staff", StaffSchema, "Staff");
