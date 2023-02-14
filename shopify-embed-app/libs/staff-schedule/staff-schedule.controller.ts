import {
  ControllerProps,
  ScheduleServiceCreate,
  ScheduleServiceCreateGroup,
  ScheduleServiceCreateGroupProps,
  ScheduleServiceCreateProps,
  ScheduleServiceDestroy,
  ScheduleServiceDestroyGroup,
  ScheduleServiceDestroyGroupProps,
  ScheduleServiceDestroyProps,
  ScheduleServiceGetAll,
  ScheduleServiceGetAllProps,
  ScheduleServiceUpdate,
  ScheduleServiceUpdateGroup,
  ScheduleServiceUpdateGroupBodyProps,
  ScheduleServiceUpdateGroupQueryProps,
  ScheduleServiceUpdateProps,
  StaffServiceFindOne,
} from "@jamalsoueidan/pkg.bsb";

export const get = ({ query }: ControllerProps<ScheduleServiceGetAllProps>) => {
  const { shop, staff, start, end } = query;
  return ScheduleServiceGetAll({ shop, staff, start, end });
};

export const create = ({
  query,
  body,
}: ControllerProps<
  ScheduleServiceCreateProps["query"],
  ScheduleServiceCreateProps["body"]
>) => ScheduleServiceCreate(query, body);

export const update = async ({
  query,
  body,
}: ControllerProps<
  ScheduleServiceUpdateProps["query"],
  ScheduleServiceUpdateProps["body"]
>) => {
  const { shop, staff } = query;

  const exists = await StaffServiceFindOne({ _id: staff, shop });
  if (exists) {
    return ScheduleServiceUpdate(query, body);
  }
};

export const destroy = ({
  query,
}: ControllerProps<ScheduleServiceDestroyProps>) => {
  const { shop, staff, schedule } = query;
  console.log("delete", query);
  return ScheduleServiceDestroy({
    schedule,
    staff,
    shop,
  });
};

export const createGroup = ({
  query,
  body,
}: ControllerProps<
  ScheduleServiceCreateGroupProps["query"],
  ScheduleServiceCreateGroupProps["body"]
>) => ScheduleServiceCreateGroup(query, body);

export const updateGroup = async ({
  query,
  body,
}: ControllerProps<
  ScheduleServiceUpdateGroupQueryProps,
  ScheduleServiceUpdateGroupBodyProps
>) => ScheduleServiceUpdateGroup(query, body);

export const destroyGroup = async ({
  query,
}: ControllerProps<ScheduleServiceDestroyGroupProps>) =>
  ScheduleServiceDestroyGroup(query);
