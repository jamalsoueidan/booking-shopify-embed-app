import mongoose from "mongoose";
const { Schema } = mongoose;

export interface CollectionModel extends Document {
  shop: string;
  title: string;
  collectionId: string;
}

const CollectionSchema = new Schema({
  shop: {
    type: String,
    required: true,
    index: true,
  },
  title: String,
  collectionId: {
    type: String,
    required: true,
    index: true,
  },
});

export const Model = mongoose.model(
  "collection",
  CollectionSchema,
  "Collection"
);

export const findAll = async () => {
  return await Model.aggregate([
    {
      $lookup: {
        from: "Product",
        localField: "collectionId",
        foreignField: "collectionId",
        as: "products",
      },
    },
  ]);
};

export const findOne = async (documents) => {
  return await Model.findOne(documents);
};
