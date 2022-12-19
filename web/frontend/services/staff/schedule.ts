import { useCallback, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

interface MutateCache {
  mutate: (value: string) => void;
  staff: string;
  cache: Map<any, any>;
}

// https://github.com/vercel/swr/discussions/488
const mutateCache = ({ mutate, staff, cache }: MutateCache) => {
  const pattern = new RegExp(`\/api\/admin\/staff\/${staff}/schedules[^  ]+`);
  cache.forEach((_, key) => {
    if (pattern.test(key)) {
      mutate(key);
    }
  });
};

export const useStaffSchedule = ({ staff, start, end }: ScheduleQuery) => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<ApiResponse<Array<Schedule>>>(
    start &&
      end &&
      `/api/admin/staff/${staff}/schedules?start=${start}&end=${end}`,
    (url) => fetch(url).then((r: Response) => r.json())
  );
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
  const { mutate, cache } = useSWRConfig();
  const fetch = useAuthenticatedFetch();
  const create: UseStaffScheduleCreateFunction = useCallback(async (body) => {
    setIsCreating(true);
    await fetch(`/api/admin/staff/${staff}/schedules`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    mutateCache({ mutate, cache: cache as any, staff });
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
  const fetch = useAuthenticatedFetch();
  const { mutate, cache } = useSWRConfig();
  const destroy: UseStaffScheduleDestroyFetch = useCallback(
    async (body) => {
      setIsDestroying(true);
      await fetch(
        `/api/admin/staff/${staff}/schedules/${schedule}${
          body.groupId ? '/group/' + body.groupId : ''
        }`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      mutateCache({ mutate, cache: cache as any, staff });
      setIsDestroying(false);
    },
    [setIsDestroying]
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
  const { mutate, cache } = useSWRConfig();
  const fetch = useAuthenticatedFetch();
  const update: UseStaffScheduleUpdateFetch = useCallback(
    async (body) => {
      setIsUpdating(true);
      await fetch(
        `/api/admin/staff/${staff}/schedules/${schedule}${
          body.groupId ? '/group/' + body.groupId : ''
        }`,
        {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      mutateCache({ mutate, cache: cache as any, staff });
      setIsUpdating(false);
    },
    [setIsUpdating]
  );

  return {
    update,
    isUpdating,
  };
};
