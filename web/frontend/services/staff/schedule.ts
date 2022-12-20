import { useFetch } from '@hooks';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';

export const useStaffSchedule = ({ staff, start, end }: ScheduleQuery) => {
  const { get } = useFetch();
  const { data } = useQuery<ApiResponse<Array<Schedule>>>({
    queryKey: ['staff', staff, 'schedules', start, end],
    queryFn: () =>
      get(`/api/admin/staff/${staff}/schedules?start=${start}&end=${end}`),
    enabled: start !== undefined && end !== undefined,
  });

  return { data: data?.payload || [] };
};

interface UseStaffScheduleCreateProps {
  staff: string;
}

type UseStaffScheduleCreateFunction = (body: ScheduleOrSchedules) => void;

export const useStaffScheduleCreate = ({
  staff,
}: UseStaffScheduleCreateProps) => {
  const [isCreating, setIsCreating] = useState<boolean>();
  const { post, mutate } = useFetch();
  const create: UseStaffScheduleCreateFunction = useCallback(async (body) => {
    setIsCreating(true);
    await post(`/api/admin/staff/${staff}/schedules`, body);
    mutate(['staff', staff]);
    setIsCreating(false);
  }, []);

  return {
    isCreating,
    create,
  };
};

interface UseStaffScheduleDestroyFetchProps extends Pick<Schedule, 'groupId'> {}

type UseStaffScheduleDestroyFetch = (
  body: UseStaffScheduleDestroyFetchProps
) => void;

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
          body.groupId ? '/group/' + body.groupId : ''
        }`
      );
      fetch.mutate(['staff', staff]);
      setIsDestroying(false);
    },
    [setIsDestroying, fetch]
  );

  return {
    destroy,
    isDestroying,
  };
};

type UseStaffScheduleUpdateFetch = (body: ScheduleBody) => void;

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
          body.groupId ? '/group/' + body.groupId : ''
        }`,
        body
      );
      mutate(['staff', staff]);
      setIsUpdating(false);
    },
    [setIsUpdating, mutate, put]
  );

  return {
    update,
    isUpdating,
  };
};
