import { beginningOfDay, closeOfDay } from "@helpers/date";
import { IScheduleModel, ScheduleModel } from "@jamalsoueidan/bsb.bsb-pkg";
import StaffService from "@services/staff.service";
import { parseISO, setMilliseconds, setSeconds } from "date-fns";
import mongoose, { Types } from "mongoose";

export interface CreateProps extends ScheduleCreateBody {
  shop: string;
}

const create = async ({
  staff,
  shop,
  schedules,
}: CreateProps): Promise<IScheduleModel | IScheduleModel[]> => {
  const exists = await StaffService.findOne(
    new mongoose.Types.ObjectId(staff),
    { shop }
  );

  if (exists) {
    const resetSecMil = (value) => {
      return setSeconds(setMilliseconds(parseISO(value), 0), 0).toISOString();
    };

    if (Array.isArray(schedules)) {
      const groupId = new Date().getTime();
      return ScheduleModel.insertMany(
        schedules.map((b) => {
          return {
            groupId: groupId.toString(),
            staff,
            start: resetSecMil(b.start),
            end: resetSecMil(b.end),
            shop,
            tag: b.tag,
          };
        })
      );
    } else {
      return ScheduleModel.create({
        staff,
        shop,
        start: resetSecMil(schedules.start),
        end: resetSecMil(schedules.end),
        tag: schedules.tag,
      });
    }
  }
};

const find = (document) => {
  const conditions = {
    ...(document.staff && { staff: document.staff }),
    ...(document.groupId && { groupId: document.groupId }),
    ...(document.start &&
      document.end && {
        $where: `this.start.toJSON().slice(0, 10) == "${document.start}" && this.end.toJSON().slice(0, 10) == "${document.end}"`,
      }),
  };

  return ScheduleModel.find(conditions);
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

interface GetByDateRangeProps {
  shop: string;
  staff: string;
  start: string;
  end: string;
}

const getByDateRange = async ({
  shop,
  staff,
  start,
  end,
}: GetByDateRangeProps) => {
  return await ScheduleModel.find({
    staff: new mongoose.Types.ObjectId(staff),
    start: {
      $gte: beginningOfDay(start),
    },
    end: {
      $lt: closeOfDay(end),
    },
    shop,
  });
};

export interface GetByStaffAndTagReturn extends Omit<IScheduleModel, "staff"> {
  staff: {
    _id: string;
    fullname: string;
  };
}

interface GetByStaffAndTagProps {
  tag: string[];
  staff: Types.ObjectId[];
  start: string;
  end: string;
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
        tag: {
          $in: tag,
        },
        staff: {
          $in: staff,
        },
        start: {
          $gte: beginningOfDay(start),
        },
        end: {
          $lt: closeOfDay(end),
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
  getByStaffAndTag,
  getByDateRange,
};
