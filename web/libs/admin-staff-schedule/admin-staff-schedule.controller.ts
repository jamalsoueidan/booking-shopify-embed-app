import ScheduleModel from "@models/schedule.model";
import ScheduleService from "@services/schedule.service";
import StaffService from "@services/staff.service";
import {
  addHours,
  getHours,
  isAfter,
  isBefore,
  parseISO,
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

const get = async ({ query }) => {
  const { shop, staff } = query;
  if (await StaffService.findOne(staff, { shop })) {
    return await ScheduleService.find({ staff });
  }
};

const create = async ({ query, body }) => {
  const { shop, staff } = query;

  return ScheduleService.create({ shop, staff, schedules: body });
};

const update = async ({ query, body }) => {
  const { shop, staff, schedule } = query;

  if (await StaffService.findOne(staff, { shop })) {
    return await ScheduleService.findByIdAndUpdate(schedule, {
      groupId: null,
      ...body,
    });
  }
};

const destroy = async ({ query }) => {
  const { shop, staff, schedule } = query;

  if (await StaffService.findOne(staff, { shop })) {
    return await ScheduleService.remove(schedule);
  }
};

const updateGroup = async ({ query, body }) => {
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

const destroyGroup = async ({ query }) => {
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
