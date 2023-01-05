import mongoose, { Document } from "mongoose";

export interface IScheduleModel extends Omit<Schedule, "_id">, Document {}

const ScheduleSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", index: true },
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
  tag: {
    type: String,
    required: true,
    index: true,
  },
  shop: {
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
