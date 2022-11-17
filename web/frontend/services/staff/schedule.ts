import { useCallback, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

interface UseStaffScheduleListProps {
  userId: string;
}

interface UseStaffScheduleListReturn {
  data: Schedule[];
}

const useStaffScheduleList = ({
  userId,
}: UseStaffScheduleListProps): UseStaffScheduleListReturn => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<SchedulesApi>(
    `/api/admin/staff/${userId}/schedules`,
    (apiURL: string) => fetch(apiURL)
  );
  return { data: data?.payload };
};

interface UseStaffScheduleCreateProps {
  userId: string;
}

interface UseStaffScheduleCreateReturn {
  isCreating: boolean;
  create: (body: any) => void;
}

const useStaffScheduleCreate = ({
  userId,
}: UseStaffScheduleCreateProps): UseStaffScheduleCreateReturn => {
  const [isCreating, setIsCreating] = useState<boolean>();
  const { mutate } = useSWRConfig();
  const fetch = useAuthenticatedFetch();
  const create = useCallback(async (body: any) => {
    setIsCreating(true);
    await fetch(`/api/admin/staff/${userId}/schedules`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    await mutate(`/api/admin/staff/${userId}/schedules`);
    setIsCreating(false);
  }, []);
  return {
    isCreating,
    create,
  };
};

interface UseStaffScheduleDestroyProps {
  userId: string;
  scheduleId: string;
}

interface UseStaffScheduleDestroyFetchProps extends Pick<Schedule, 'groupId'> {}

interface UseStaffScheduleDestroyReturn {
  destroy: (body: UseStaffScheduleDestroyFetchProps) => void;
  isDestroying: boolean;
}

const useStaffScheduleDestroy = ({
  userId,
  scheduleId,
}: UseStaffScheduleDestroyProps): UseStaffScheduleDestroyReturn => {
  const [isDestroying, setIsDestroying] = useState<boolean>();
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();
  const destroy = useCallback(
    async (body: UseStaffScheduleUpdateFetchProps) => {
      setIsDestroying(true);
      await fetch(
        `/api/admin/staff/${userId}/schedules/${scheduleId}${
          body.groupId ? '/group/' + body.groupId : ''
        }`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      await mutate(`/api/admin/staff/${userId}/schedules`);
      setIsDestroying(false);
    },
    [setIsDestroying]
  );

  return {
    destroy,
    isDestroying,
  };
};

interface UseStaffScheduleUpdateProps {
  userId: string;
  scheduleId: string;
}

interface UseStaffScheduleUpdateFetchProps
  extends Omit<Schedule, '_id' | 'staff'> {}

interface UseStaffScheduleUpdateReturn {
  update: (body: UseStaffScheduleUpdateFetchProps) => void;
  isUpdating: boolean;
}

const useStaffScheduleUpdate = ({
  userId,
  scheduleId,
}: UseStaffScheduleUpdateProps): UseStaffScheduleUpdateReturn => {
  const [isUpdating, setIsUpdating] = useState<boolean>();
  const { mutate } = useSWRConfig();
  const fetch = useAuthenticatedFetch();
  const update = useCallback(
    async (body: UseStaffScheduleUpdateFetchProps) => {
      setIsUpdating(true);
      await fetch(
        `/api/admin/staff/${userId}/schedules/${scheduleId}${
          body.groupId ? '/group/' + body.groupId : ''
        }`,
        {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      await mutate(`/api/admin/staff/${userId}/schedules`);
      setIsUpdating(false);
    },
    [setIsUpdating]
  );

  return {
    update,
    isUpdating,
  };
};

export {
  useStaffScheduleList,
  useStaffScheduleCreate,
  useStaffScheduleDestroy,
  useStaffScheduleUpdate,
};
