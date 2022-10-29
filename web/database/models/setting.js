import mongoose from "mongoose";
const { Schema } = mongoose;

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

const Model = mongoose.model("setting", SettingSchema, "Setting");

export default Model;
