import mongoose, { Document } from "mongoose";

export interface ICollectionModel extends Omit<Collection, "_id">, Document {}

const CollectionSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
    index: true,
  },
  title: String,
  collectionId: {
    type: Number,
    required: true,
    index: true,
  },
});

export default mongoose.model<ICollectionModel>(
  "collection",
  CollectionSchema,
  "Collection"
);
