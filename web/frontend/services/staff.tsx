import { useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";

export const addNewSchedule = () => {
  const fetch = useAuthenticatedFetch();
  return useCallback(async (id, body) => {
    return await fetch(`/api/admin/staff/${id}/schedules`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  }, []);
};
