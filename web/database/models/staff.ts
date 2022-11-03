import mongoose from "mongoose";
const { Schema } = mongoose;

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
  active: { type: Boolean, default: true },
});

export const Model = mongoose.model("staff", StaffSchema, "Staff");

export const create = async (document) => {
  try {
    const newStaff = new Model(document);
    return await newStaff.save();
  } catch (e) {
    throw e;
  }
};

export const find = async (shop) => {
  return await Model.find({ shop });
};

export const findOne = async (_id, document) => {
  return await Model.findOne({ _id, ...document });
};

export const findByIdAndUpdate = async (staffId, document) => {
  return await Model.findByIdAndUpdate(staffId, document, {
    returnOriginal: false,
  });
};
