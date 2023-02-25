import {
  ApiResponse,
  Staff,
  StaffBodyCreate,
  StaffBodyUpdate,
} from "@jamalsoueidan/pkg.bsb-types";
import { useFetch } from "@jamalsoueidan/pkg.bsf";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const useStaff = () => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<Array<Staff>>>(
    ["staff"],
    () => get({ url: "/staff" }),
    { suspense: true },
  );

  return { data: data?.payload };
};

interface UseStaffGetProps {
  userId: string;
}

export const useStaffGet = ({ userId }: UseStaffGetProps) => {
  const { get } = useFetch();

  const { data } = useQuery(["staff", userId], () =>
    get<ApiResponse<Staff>>({ url: `/staff/${userId}` }),
  );

  return {
    data: data?.payload,
  };
};

type UseStaffCreateFetch = (
  body: StaffBodyCreate,
) => Promise<ApiResponse<Staff>>;

export const useStaffCreate = () => {
  const { post, mutate } = useFetch();

  const create: UseStaffCreateFetch = useCallback(
    async (body) => {
      const response: ApiResponse<Staff> = await post({
        body,
        url: "/staff",
      });
      await mutate(["staff"]);
      return response;
    },
    [post, mutate],
  );

  return {
    create,
  };
};

interface UseStaffUpdateProps {
  userId: string;
}

type UseStaffUpdateFetch = (
  body: StaffBodyUpdate,
) => Promise<ApiResponse<Staff>>;

export const useStaffUpdate = ({ userId }: UseStaffUpdateProps) => {
  const { put, mutate } = useFetch();

  const update: UseStaffUpdateFetch = useCallback(
    async (body) => {
      const response: ApiResponse<Staff> = await put({
        body,
        url: `/staff/${userId}`,
      });
      await mutate(["staff"]);
      return response;
    },
    [put, userId, mutate],
  );

  return {
    update,
  };
};
