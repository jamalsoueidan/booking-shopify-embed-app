import mongoose from "mongoose";
const { Schema } = mongoose;

const StaffSchema = new Schema({
  shop: String,
  fullname: { type: String, required: true },
  email: {
    type: String,
    unique: true,
  },
  phone: { type: String, required: true },
  active: { type: Boolean, default: true },
});

const StaffModel = mongoose.model("staff", StaffSchema, "Staff");

export const create = async (document) => {
  try {
    const newStaff = new StaffModel(document);
    return await newStaff.save();
  } catch (e) {
    throw e;
  }
};

export const find = async () => {
  return await StaffModel.find();
};

export const findById = async (staffId) => {
  return await StaffModel.findById(staffId);
};

export const findByIdAndUpdate = async (staffId, document) => {
  return await StaffModel.findByIdAndUpdate(staffId, document, {
    returnOriginal: false,
  });
};
