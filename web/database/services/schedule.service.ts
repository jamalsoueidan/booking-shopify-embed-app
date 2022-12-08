import ScheduleModel, { IScheduleModel } from "@models/Schedule.model";
import StaffService from "@services/Staff.service";
import {
  endOfDay,
  parseISO,
  setMilliseconds,
  setSeconds,
  startOfDay,
} from "date-fns";
import mongoose, { FilterQuery, Types, UpdateQuery } from "mongoose";

export interface SchedulesProp {
  groupId?: string;
  staff?: string;
  start: string;
  end: string;
  tag: string;
}

export interface CreateProps {
  staff: string;
  shop: string;
  schedules: SchedulesProp[] | SchedulesProp;
}

const create = async ({ staff, shop, schedules }: CreateProps) => {
  if (
    await StaffService.findOne(new mongoose.Types.ObjectId(staff), { shop })
  ) {
    const resetSecMil = (value) => {
      return setSeconds(setMilliseconds(parseISO(value), 0), 0).toISOString();
    };

    if (Array.isArray(schedules)) {
      const groupId = new Date().getTime();
      return await ScheduleModel.insertMany(
        schedules.map((b: SchedulesProp) => {
          b.groupId = groupId.toString();
          b.staff = staff;
          b.start = resetSecMil(b.start);
          b.end = resetSecMil(b.end);
          return b;
        })
      );
    } else {
      return await ScheduleModel.create({
        ...schedules,
        staff,
        shop,
        start: resetSecMil(schedules.start),
        end: resetSecMil(schedules.end),
      });
    }
  }
};

const find = async (document) => {
  const conditions = {
    ...(document.staff && { staff: document.staff }),
    ...(document.groupId && { groupId: document.groupId }),
    ...(document.start &&
      document.end && {
        $where: `this.start.toJSON().slice(0, 10) == "${document.start}" && this.end.toJSON().slice(0, 10) == "${document.end}"`,
      }),
  };

  try {
    return await ScheduleModel.find(conditions);
  } catch (e) {
    throw e;
  }
};

const findOne = async (filter) => {
  return await ScheduleModel.findOne(filter);
};

const findByIdAndUpdate = async (scheduleId, document) => {
  return await ScheduleModel.findByIdAndUpdate(scheduleId, document, {
    returnOriginal: false,
  });
};

const remove = async ({ schedule, shop }) => {
  return await ScheduleModel.deleteOne({ _id: schedule, shop });
};

const insertMany = async (schedules: UpdateQuery<IScheduleModel>) => {
  return await ScheduleModel.insertMany(schedules);
};

const updateMany = async (
  filter: FilterQuery<IScheduleModel>,
  schedules: UpdateQuery<IScheduleModel>
) => {
  return await ScheduleModel.updateMany(filter, {
    $set: { ...schedules },
  });
};

interface GetByDateRangeProps {
  staff: string;
  start: string;
  end: string;
}

const getByDateRange = async ({ staff, start, end }: GetByDateRangeProps) => {
  return await ScheduleModel.aggregate([
    {
      $match: {
        staff: new mongoose.Types.ObjectId(staff),
        available: true,
        start: {
          $gte: new Date(`${start}T00:00:00.0Z`),
        },
        end: {
          $lt: new Date(`${end}T23:59:59.0Z`),
        },
      },
    },
  ]);
};

interface GetByStaffAndTagProps {
  tag: string;
  staff: Types.ObjectId;
  start: string;
  end: string;
}

export interface GetByStaffAndTagReturn extends Omit<IScheduleModel, "staff"> {
  staff: {
    _id: string;
    fullname: string;
  };
}

const getByStaffAndTag = async ({
  tag,
  staff,
  start,
  end,
}: GetByStaffAndTagProps): Promise<Array<GetByStaffAndTagReturn>> => {
  return await ScheduleModel.aggregate([
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
        "staff.position": 0,
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

const getByTag = async ({
  tag,
  staffier,
  start,
  end,
}: GetByTagProps): Promise<Array<GetByTagReturn>> => {
  return await ScheduleModel.aggregate([
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
        "staff.position": 0,
        "staff.__v": 0,
      },
    },
  ]);
};

export default {
  create,
  find,
  findOne,
  remove,
  findByIdAndUpdate,
  insertMany,
  updateMany,
  getByStaffAndTag,
  getByTag,
  getByDateRange,
};
