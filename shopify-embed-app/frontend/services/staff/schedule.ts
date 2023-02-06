import { useFetch } from "@hooks/use-fetch";
import { ApiResponse, Schedule, ScheduleBodyUpdate, ScheduleBodyUpdateOrCreate, ScheduleGetQuery, ScheduleUpdateOrDestroyQuery } from "@jamalsoueidan/bsb.types";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";

export const useStaffSchedule = ({ staff, start, end }: ScheduleGetQuery) => {
  const { get } = useFetch();
  const { data } = useQuery<ApiResponse<Array<Schedule>>>({
    enabled: !!start && !!end,
    queryFn: () =>
      get(`/api/admin/staff/${staff}/schedules?start=${start}&end=${end}`),
    queryKey: ["staff", staff, "schedules", start, end],
  });

  return { data: data?.payload || [] };
};

interface UseStaffScheduleCreateProps {
  staff: string;
}

type UseStaffScheduleCreateFunction = (
  body: ScheduleBodyUpdateOrCreate,
) => void;

export const useStaffScheduleCreate = ({
  staff,
}: UseStaffScheduleCreateProps) => {
  const [isCreating, setIsCreating] = useState<boolean>();
  const { post, mutate } = useFetch();
  const create: UseStaffScheduleCreateFunction = useCallback(
    async (body) => {
      setIsCreating(true);
      await post(`/api/admin/staff/${staff}/schedules`, body);
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

type UseStaffScheduleDestroyFetch = (body: Pick<Schedule, "groupId">) => void;

export const useStaffScheduleDestroy = ({
  staff,
  schedule,
}: ScheduleUpdateOrDestroyQuery) => {
  const [isDestroying, setIsDestroying] = useState<boolean>();
  const fetch = useFetch();
  const destroy: UseStaffScheduleDestroyFetch = useCallback(
    async (body) => {
      setIsDestroying(true);
      await fetch.destroy(
        `/api/admin/staff/${staff}/schedules/${schedule}${
          body.groupId ? "/group/" + body.groupId : ""
        }`,
      );
      await fetch.mutate(["staff", staff]);
      setIsDestroying(false);
    },
    [fetch, staff, schedule],
  );

  return {
    destroy,
    isDestroying,
  };
};

type UseStaffScheduleUpdateFetch = (body: ScheduleBodyUpdate) => void;

export const useStaffScheduleUpdate = ({
  staff,
  schedule,
}: ScheduleUpdateOrDestroyQuery) => {
  const [isUpdating, setIsUpdating] = useState<boolean>();
  const { put, mutate } = useFetch();
  const update: UseStaffScheduleUpdateFetch = useCallback(
    async (body) => {
      setIsUpdating(true);
      await put(
        `/api/admin/staff/${staff}/schedules/${schedule}${
          body.groupId ? "/group/" + body.groupId : ""
        }`,
        body,
      );
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
