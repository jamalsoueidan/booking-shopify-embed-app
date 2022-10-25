import mongoose from "mongoose";
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
  staff: { type: Schema.Types.ObjectId, ref: "Staff" },
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
  },
  tag: {
    type: String,
    required: true,
    index: true,
  },
});

export const Model = mongoose.model("schedule", ScheduleSchema, "Schedule");

export const create = async (document) => {
  try {
    const newStaff = new Model(document);
    return await newStaff.save();
  } catch (e) {
    throw e;
  }
};

export const find = async (document) => {
  const conditions = {
    ...(document.staff && { staff: document.staff }),
    ...(document.groupId && { groupId: document.groupId }),
    ...(document.start &&
      document.end && {
        $where: `this.start.toJSON().slice(0, 10) == "${document.start}" && this.end.toJSON().slice(0, 10) == "${document.end}"`,
      }),
  };

  try {
    return await Model.find(conditions);
  } catch (e) {
    throw e;
  }
};

export const findOne = async (filter) => {
  return await Model.findOne(filter);
};

export const findByIdAndUpdate = async (scheduleId, document) => {
  return await Model.findByIdAndUpdate(scheduleId, document, {
    returnOriginal: false,
  });
};

export const remove = async (scheduleId) => {
  return await Model.deleteOne({ _id: scheduleId });
};

export const insertMany = async (schedules) => {
  return await Model.insertMany(schedules);
};

export const updateMany = async (filter, schedules) => {
  return await Model.updateMany(filter, {
    $set: { ...schedules },
  });
};
