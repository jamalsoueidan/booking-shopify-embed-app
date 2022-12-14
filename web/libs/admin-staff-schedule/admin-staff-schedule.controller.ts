import ScheduleModel from "@models/schedule.model";
import ScheduleService from "@services/schedule.service";
import StaffService from "@services/staff.service";
import {
  addHours,
  getHours,
  getMinutes,
  isAfter,
  isBefore,
  parseISO,
  setMinutes,
  subHours,
} from "date-fns";

export enum ControllerMethods {
  get = "get",
  create = "create",
  update = "update",
  destroy = "destroy",
  updateGroup = "updateGroup",
  destroyGroup = "destroyGroup",
}

interface GetQuery extends ScheduleQuery {
  shop: string;
}

interface GetProps {
  query: GetQuery;
}

const get = async ({ query }: GetProps) => {
  const { shop, staff, start, end } = query;
  return await ScheduleService.getByDateRange({ shop, staff, start, end });
};

interface CreateQuery {
  shop: string;
  staff: string;
}

interface CreateProps {
  query: CreateQuery;
  body: ScheduleOrSchedules;
}

const create = async ({ query, body }: CreateProps) => {
  const { shop, staff } = query;

  return ScheduleService.create({ shop, staff, schedules: body });
};

interface UpdateQuery extends ScheduleUpdateOrDestroyQuery {
  shop: string;
}
interface UpdateBody {
  body: ScheduleBody;
}

interface UpdateProps {
  query: UpdateQuery;
  body: UpdateBody;
}

const update = async ({ query, body }: UpdateProps) => {
  const { shop, staff, schedule } = query;

  const exists = await StaffService.findOne(staff, { shop });
  if (exists) {
    return await ScheduleService.findByIdAndUpdate(schedule, {
      groupId: null,
      ...body,
    });
  }
};

interface DestroyQuery extends ScheduleUpdateOrDestroyQuery {
  shop: string;
}

interface DestroyProps {
  query: DestroyQuery;
}

const destroy = ({ query }: DestroyProps) => {
  const { shop, staff, schedule } = query;
  return ScheduleService.remove({ schedule, shop });
};

interface UpdateGroupQuery extends ScheduleUpdateOrDestroyQuery {
  shop: string;
  groupId: string;
}

interface UpdateGroupBody extends ScheduleBody {}

interface UpdateGroupProps {
  query: UpdateGroupQuery;
  body: UpdateGroupBody;
}

const updateGroup = async ({ query, body }: UpdateGroupProps) => {
  const { staff, schedule, groupId, shop } = query;

  const documents = await ScheduleService.find({
    _id: schedule,
    staff,
    groupId,
  });

  if (documents.length > 0) {
    const bulk = documents.map((d) => {
      const startDateTime = parseISO(body.start);
      const endDateTime = parseISO(body.end);

      let start = new Date(d.start.setHours(getHours(startDateTime)));
      let end = new Date(d.end.setHours(getHours(endDateTime)));

      // startDateTime is before 30 oct
      if (
        isBefore(startDateTime, new Date(d.start.getFullYear(), 9, 30)) &&
        isAfter(start, new Date(d.start.getFullYear(), 9, 30)) // 9 is for october
      ) {
        start = addHours(start, 1);
        end = addHours(end, 1);
      }
      // startDateTime is after 30 oct, and current is before subs
      else if (
        isAfter(startDateTime, new Date(d.start.getFullYear(), 9, 30)) && // 9 is for october
        isBefore(start, new Date(d.start.getFullYear(), 9, 30))
      ) {
        start = subHours(start, 1);
        end = subHours(end, 1);
      }
      // startDateTime is before 27 march, and current is after
      else if (
        isBefore(startDateTime, new Date(d.start.getFullYear(), 2, 27)) &&
        isAfter(start, new Date(d.start.getFullYear(), 2, 27)) // 2 is for march
      ) {
        start = subHours(start, 1);
        end = subHours(end, 1);
      }
      // startDateTime is after 27 march, and current is before
      else if (
        isAfter(startDateTime, new Date(d.start.getFullYear(), 2, 27)) &&
        isBefore(start, new Date(d.start.getFullYear(), 2, 27))
        // 2 is for march
      ) {
        start = addHours(start, 1);
        end = addHours(end, 1);
      }

      start = setMinutes(start, getMinutes(startDateTime));
      end = setMinutes(end, getMinutes(endDateTime));

      return {
        updateOne: {
          filter: { _id: d._id, shop },
          update: {
            $set: {
              start,
              end,
            },
          },
        },
      };
    });

    return await ScheduleModel.bulkWrite(bulk);
  } else {
    throw "Groupid doesn't exist";
  }
};

interface DestroyGroupQuery extends ScheduleUpdateOrDestroyQuery {
  shop: string;
  groupId: string;
}

interface DestroyGroupProps {
  query: DestroyGroupQuery;
}

const destroyGroup = async ({ query }: DestroyGroupProps) => {
  const { shop, staff, schedule, groupId } = query;

  const documents = await ScheduleModel.countDocuments({
    _id: schedule,
    staff,
    groupId,
    shop,
  });

  if (documents > 0) {
    return await ScheduleModel.deleteMany({ groupId, shop });
  } else {
    throw "Groupid doesn't exist";
  }
};

export default { get, destroy, create, update, updateGroup, destroyGroup };
