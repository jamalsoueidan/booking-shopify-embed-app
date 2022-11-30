import { useStaff } from "./hooks/useStaff";

export const Bootup = ({ children }: any) => {
  const { data } = useStaff();

  if (data?.length === 0) {
    return <></>;
  }

  return children;
};
