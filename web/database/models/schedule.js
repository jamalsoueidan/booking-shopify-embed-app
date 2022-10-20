import mongoose from "mongoose";
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
  staff: { type: Schema.Types.ObjectId, ref: "Staff" },
  start: Date,
  end: Date,
  tag: String,
});

export const ScheduleModel = mongoose.model(
  "schedule",
  ScheduleSchema,
  "Schedule"
);

export const create = async (document) => {
  try {
    const newStaff = new ScheduleModel(document);
    return await newStaff.save();
  } catch (e) {
    throw e;
  }
};

export const find = async (document) => {
  const conditions = {
    ...(document.staff && { staff: document.staff }),
    ...(document.start &&
      document.end && {
        $where:
          'this.start.toJSON().slice(0, 10) == "2022-10-20" && this.end.toJSON().slice(0, 10) == "2022-10-20"',
      }),
  };

  try {
    return await ScheduleModel.find(conditions);
  } catch (e) {
    throw e;
  }
};
