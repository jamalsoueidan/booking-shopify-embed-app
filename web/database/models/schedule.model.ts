import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

// https://tomanagle.medium.com/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
export interface IScheduleModel {
  staff: Types.ObjectId;
  groupId: string;
  start: Date;
  end: Date;
  available: boolean;
  tag: string;
}

const ScheduleSchema = new Schema({
  staff: { type: Schema.Types.ObjectId, ref: "Staff", index: true },
  groupId: String,
  start: {
    type: Date,
    required: true,
    index: true,
  },
  end: {
    type: Date,
    required: true,
    index: true,
  },
  available: {
    type: Boolean,
    default: true,
    index: true,
  },
  tag: {
    type: String,
    required: true,
    index: true,
  },
});

export default mongoose.model<IScheduleModel>(
  "schedule",
  ScheduleSchema,
  "Schedule"
);
