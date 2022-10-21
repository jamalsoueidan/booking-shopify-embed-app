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

export const find = async (shop) => {
  return await StaffModel.find({ shop });
};

export const findOne = async (_id, document) => {
  return await StaffModel.findOne({ _id, ...document });
};

export const findByIdAndUpdate = async (staffId, document) => {
  return await StaffModel.findByIdAndUpdate(staffId, document, {
    returnOriginal: false,
  });
};
