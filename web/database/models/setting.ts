import mongoose from "mongoose";
const { Schema } = mongoose;

export interface SettingModel extends Document {
  shop: string;
  timeZone: string;
  language: "en" | "da";
}

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
});

const Model = mongoose.model<SettingModel>("setting", SettingSchema, "Setting");

export default Model;
