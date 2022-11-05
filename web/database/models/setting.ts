import mongoose from "mongoose";
const { Schema } = mongoose;

export enum SettingLanguage {
  en = "en",
  da = "da",
}
export interface SettingModel {
  shop: string;
  timeZone: string;
  language: SettingLanguage;
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
