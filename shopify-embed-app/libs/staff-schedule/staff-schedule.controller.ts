import {
  ControllerProps,
  ScheduleModel,
  ScheduleServiceCreate,
  ScheduleServiceDestroy,
  ScheduleServiceFindByIdAndUpdate,
  ScheduleServiceGetByDateRange,
  ScheduleServiceUpdateGroup,
  StaffServiceFindOne,
} from "@jamalsoueidan/bsb.bsb-pkg";

export const get = ({ query }: ControllerProps<ScheduleQuery>) => {
  const { shop, staff, start, end } = query;
  return ScheduleServiceGetByDateRange({ shop, staff, start, end });
};

interface CreateQuery {
  staff: string;
}

export const create = ({
  query,
  body,
}: ControllerProps<CreateQuery, ScheduleOrSchedules>) => {
  const { shop, staff } = query;

  return ScheduleServiceCreate({ shop, staff, schedules: body });
};

export const update = async ({
  query,
  body,
}: ControllerProps<ScheduleUpdateOrDestroyQuery, ScheduleBody>) => {
  const { shop, staff, schedule } = query;

  const exists = await StaffServiceFindOne({ _id: staff, shop });
  if (exists) {
    return ScheduleServiceFindByIdAndUpdate(schedule, {
      groupId: null,
      ...body,
    });
  }
};

export const destroy = ({
  query,
}: ControllerProps<ScheduleUpdateOrDestroyQuery>) => {
  const { shop, staff, schedule } = query;
  return ScheduleServiceDestroy({
    schedule,
    staff,
    shop,
  });
};

interface UpdateGroupQuery extends ScheduleUpdateOrDestroyQuery {
  groupId: string;
}

export const updateGroup = async ({
  query,
  body,
}: ControllerProps<UpdateGroupQuery, ScheduleBody>) => {
  const { schedule, groupId, staff, shop } = query;

  ScheduleServiceUpdateGroup({
    filter: {
      schedule,
      groupId,
      staff,
      shop,
    },
    body,
  });
};

interface DestroyGroupQuery extends ScheduleUpdateOrDestroyQuery {
  groupId: string;
}

export const destroyGroup = async ({
  query,
}: ControllerProps<DestroyGroupQuery>) => {
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
    throw new Error("Groupid doesn't exist");
  }
};
