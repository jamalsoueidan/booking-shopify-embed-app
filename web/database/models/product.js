import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema({
  shop: {
    type: String,
    required: true,
    index: true,
  },
  collectionId: {
    type: String,
    required: true,
    index: true,
  },
  productId: {
    type: String,
    required: true,
    index: true,
  },
  title: String,
});

export const Model = mongoose.model("product", ProductSchema, "Product");

export const create = async (document) => {
  try {
    const newStaff = new Model(document);
    return await newStaff.save();
  } catch (e) {
    throw e;
  }
};

export const findOrCreate = async (document) => {
  return await Model.findOrCreate(document);
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
