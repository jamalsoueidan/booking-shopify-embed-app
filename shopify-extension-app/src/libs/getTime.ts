export const getTime = ({ start, end }: { start: string; end: string }) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const value = `${startDate.getHours()}:${
    startDate.getMinutes() < 10 ? "0" : ""
  }${startDate.getMinutes()} - ${endDate.getHours()}:${
    endDate.getMinutes() < 10 ? "0" : ""
  }${endDate.getMinutes()}`;
  return value;
};
