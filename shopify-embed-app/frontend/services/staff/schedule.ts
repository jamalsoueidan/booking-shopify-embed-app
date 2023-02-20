import { useFetch } from "@hooks/use-fetch";
import { ScheduleServiceDestroyGroupProps } from "@jamalsoueidan/pkg.bsb";
import {
  ApiResponse,
  Schedule,
  ScheduleServiceCreateGroupBodyProps,
  ScheduleServiceCreateGroupQueryProps,
  ScheduleServiceCreateProps,
  ScheduleServiceCreateQueryProps,
  ScheduleServiceDestroyProps,
  ScheduleServiceGetAllProps,
  ScheduleServiceUpdateBodyProps,
  ScheduleServiceUpdateGroupBodyProps,
  ScheduleServiceUpdateGroupQueryProps,
  ScheduleServiceUpdateQueryProps,
} from "@jamalsoueidan/pkg.bsb-types";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";

export const useStaffSchedule = ({
  staff,
  start,
  end,
}: ScheduleServiceGetAllProps) => {
  const { get } = useFetch();
  const { data } = useQuery<ApiResponse<Array<Schedule>>>({
    enabled: !!start && !!end,
    queryFn: () =>
      get(
        `/api/admin/schedules?start=${start.toJSON()}&end=${end.toJSON()}&staff=${staff}`,
      ),
    queryKey: ["staff", staff, "schedules", start?.toJSON(), end?.toJSON()],
  });

  return { data: data?.payload || [] };
};

export const useStaffScheduleCreate = ({
  staff,
}: ScheduleServiceCreateQueryProps) => {
  const [isCreating, setIsCreating] = useState<boolean>();
  const { post, mutate } = useFetch();
  const create = useCallback(
    async (body: ScheduleServiceCreateProps["body"]) => {
      setIsCreating(true);
      await post(`/api/admin/schedules?staff=${staff}`, body);
      await mutate(["staff", staff]);
      setIsCreating(false);
    },
    [mutate, post, staff],
  );

  return {
    create,
    isCreating,
  };
};

export const useStaffScheduleDestroy = ({
  staff,
  schedule,
}: ScheduleServiceDestroyProps) => {
  const [isDestroying, setIsDestroying] = useState<boolean>();
  const fetch = useFetch();
  const destroy = useCallback(async () => {
    setIsDestroying(true);
    await fetch.destroy(`/api/admin/schedules/${schedule}?staff=${staff}`);
    await fetch.mutate(["staff", staff]);
    setIsDestroying(false);
  }, [fetch, staff, schedule]);

  return {
    destroy,
    isDestroying,
  };
};

export const useStaffScheduleUpdate = ({
  staff,
  schedule,
}: ScheduleServiceUpdateQueryProps) => {
  const [isUpdating, setIsUpdating] = useState<boolean>();
  const { put, mutate } = useFetch();
  const update = useCallback(
    async (body: ScheduleServiceUpdateBodyProps) => {
      setIsUpdating(true);
      await put(`/api/admin/schedules/${schedule}?staff=${staff}`, body);
      await mutate(["staff", staff]);
      setIsUpdating(false);
    },
    [put, staff, schedule, mutate],
  );

  return {
    isUpdating,
    update,
  };
};

export const useStaffScheduleDestroyGroup = ({
  staff,
  groupId,
}: ScheduleServiceDestroyGroupProps) => {
  const [isDestroying, setIsDestroying] = useState<boolean>();
  const fetch = useFetch();
  const destroyGroup = useCallback(async () => {
    setIsDestroying(true);
    await fetch.destroy(`/api/admin/schedules/group/${groupId}?staff=${staff}`);
    await fetch.mutate(["staff", staff]);
    setIsDestroying(false);
  }, [fetch, staff, groupId]);

  return {
    destroyGroup,
    isDestroying,
  };
};

export const useStaffScheduleCreateGroup = ({
  staff,
}: ScheduleServiceCreateGroupQueryProps) => {
  const [isCreating, setIsCreating] = useState<boolean>();
  const { post, mutate } = useFetch();
  const createGroup = useCallback(
    async (body: ScheduleServiceCreateGroupBodyProps) => {
      setIsCreating(true);
      await post(`/api/admin/schedules/group?staff=${staff}`, body);
      await mutate(["staff", staff]);
      setIsCreating(false);
    },
    [mutate, post, staff],
  );

  return {
    createGroup,
    isCreating,
  };
};

export const useStaffScheduleUpdateGroup = ({
  staff,
  groupId,
}: ScheduleServiceUpdateGroupQueryProps) => {
  const [isUpdating, setIsUpdating] = useState<boolean>();
  const { put, mutate } = useFetch();
  const updateGroup = useCallback(
    async (body: ScheduleServiceUpdateGroupBodyProps) => {
      setIsUpdating(true);
      await put(`/api/admin/schedules/group/${groupId}?staff=${staff}`, body);
      await mutate(["staff", staff]);
      setIsUpdating(false);
    },
    [put, staff, groupId, mutate],
  );

  return {
    isUpdating,
    updateGroup,
  };
};
