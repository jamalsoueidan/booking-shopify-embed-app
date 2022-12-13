import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface ISettingModel extends Omit<Setting, "_id">, Document {}

const SettingSchema = new Schema({
  shop: {
    type: String,
    required: true,
    index: true,
  },
  timeZone: {
    type: String,
    default: "Europe/Brussels",
  },
  language: {
    type: String,
    default: "en",
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model<ISettingModel>(
  "setting",
  SettingSchema,
  "Setting"
);
