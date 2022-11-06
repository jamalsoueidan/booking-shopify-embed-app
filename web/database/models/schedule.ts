import { endOfDay, setMilliseconds, setSeconds, startOfDay } from "date-fns";
import mongoose, { FilterQuery, Types, UpdateQuery } from "mongoose";
import * as Staff from "./staff";
const { Schema } = mongoose;

// https://tomanagle.medium.com/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
export interface ScheduleModel {
  staff: Types.ObjectId;
  groupId: string;
  start: Date;
  end: Date;
  available: boolean;
  tag: string;
}

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

export const Model = mongoose.model<ScheduleModel>(
  "schedule",
  ScheduleSchema,
  "Schedule"
);

interface SchedulesProp {
  groupId?: string;
  staff?: string;
  start: Date;
  end: Date;
  tag: string;
}
interface CreateProps {
  staff: string;
  shop: string;
  schedules: SchedulesProp[] | SchedulesProp;
}

export const create = async ({ staff, shop, schedules }: CreateProps) => {
  if (await Staff.findOne(new mongoose.Types.ObjectId(staff), { shop })) {
    if (Array.isArray(schedules)) {
      const groupId = new Date().getTime();
      return await Model.insertMany(
        schedules.map((b: SchedulesProp) => {
          b.groupId = groupId.toString();
          b.staff = staff;
          b.start = setSeconds(setMilliseconds(b.start, 0), 0);
          b.end = setSeconds(setMilliseconds(b.end, 0), 0);
          return b;
        })
      );
    } else {
      return await Model.create({
        ...schedules,
        staff,
        shop,
        start: setSeconds(setMilliseconds(schedules.start, 0), 0),
        end: setSeconds(setMilliseconds(schedules.end, 0), 0),
      });
    }
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

export const insertMany = async (schedules: UpdateQuery<ScheduleModel>) => {
  return await Model.insertMany(schedules);
};

export const updateMany = async (
  filter: FilterQuery<ScheduleModel>,
  schedules: UpdateQuery<ScheduleModel>
) => {
  return await Model.updateMany(filter, {
    $set: { ...schedules },
  });
};

interface GetByStaffAndTagProps {
  tag: string;
  staff: Types.ObjectId;
  start: string;
  end: string;
}

export interface GetByStaffAndTagReturn extends Omit<ScheduleModel, "staff"> {
  staff: {
    _id: string;
    fullname: string;
  };
}

export const getByStaffAndTag = async ({
  tag,
  staff,
  start,
  end,
}: GetByStaffAndTagProps): Promise<Array<GetByStaffAndTagReturn>> => {
  return await Model.aggregate([
    {
      $match: {
        tag: tag,
        staff: staff,
        available: true,
        start: {
          $gte: new Date(`${start}T00:00:00.0Z`),
        },
        end: {
          $lt: new Date(`${end}T23:59:59.0Z`),
        },
      },
    },
    {
      $lookup: {
        from: "Staff",
        localField: "staff",
        foreignField: "_id",
        as: "staff",
      },
    },
    {
      $unwind: {
        path: "$staff",
      },
    },
    {
      $match: {
        "staff.active": true,
      },
    },
    {
      $project: {
        "staff.email": 0,
        "staff.active": 0,
        "staff.shop": 0,
        "staff.phone": 0,
        "staff.__v": 0,
      },
    },
  ]);
};

interface GetByTagProps {
  tag: string[];
  staffier: string[];
  start: Date;
  end: Date;
}

export interface GetByTagReturn extends GetByStaffAndTagReturn {}

export const getByTag = async ({
  tag,
  staffier,
  start,
  end,
}: GetByTagProps): Promise<Array<GetByTagReturn>> => {
  return await Model.aggregate([
    {
      $match: {
        tag: {
          $in: tag,
        },
        staff: {
          $in: staffier,
        },
        available: true,
        start: {
          $gte: startOfDay(start),
        },
        end: {
          $lt: endOfDay(end),
        },
      },
    },
    {
      $lookup: {
        from: "Staff",
        localField: "staff",
        foreignField: "_id",
        as: "staff",
      },
    },
    {
      $unwind: {
        path: "$staff",
      },
    },
    {
      $match: {
        "staff.active": true,
      },
    },
    {
      $project: {
        "staff.email": 0,
        "staff.active": 0,
        "staff.shop": 0,
        "staff.phone": 0,
        "staff.__v": 0,
      },
    },
  ]);
};
