import mongoose from "mongoose";
const { Schema } = mongoose;

export enum ISettingLanguage {
  en = "en",
  da = "da",
}
export interface ISettingModel {
  shop: string;
  timeZone: string;
  language: ISettingLanguage;
  status: boolean;
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
