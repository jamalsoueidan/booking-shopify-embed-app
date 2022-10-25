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
  staff: [
    {
      staff: {
        type: Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
      },
      tag: String,
    },
  ],
});

export const Model = mongoose.model("product", ProductSchema, "Product");

export const findOne = async (_id, document) => {
  return await Model.findOne({ _id, ...document });
};

export const findByIdAndUpdate = async (staffId, document) => {
  return await Model.findByIdAndUpdate(staffId, document, {
    returnOriginal: false,
  });
};
