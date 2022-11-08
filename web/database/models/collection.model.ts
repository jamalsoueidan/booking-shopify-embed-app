import mongoose from "mongoose";
const { Schema } = mongoose;

export interface ICollectionModel {
  shop: string;
  title: string;
  collectionId: number;
}

const CollectionSchema = new Schema({
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
